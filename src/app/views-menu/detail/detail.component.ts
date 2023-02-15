import { isPlatformBrowser, Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { HomeService } from 'src/app/services/home/home.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { PromotionsService } from 'src/app/services/promotions/promotions.service';
import { WholesaleService } from 'src/app/services/wholesale/wholesale.service';
import { CartWholesaleService } from 'src/app/services/cartWholesale/cart-wholesale.service';
import { DomSanitizer, Title, Meta } from '@angular/platform-browser';
import { StoresService } from 'src/app/services/stores/stores.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail-component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {

  @ViewChild('top') top: ElementRef;
  @ViewChild('tooltipContent') tooltipContent: ElementRef;
  @ViewChild('tooltip') tooltip: ElementRef;
  category:string = ''
  product: any = {};
  sku:string
  id_store_current:string = ''
  numero = 1;
  selectedColor: string = '';
  selectedSize: any = {};
  default_photo:any[] =  [ {url: 'https://puu.sh/ImNRs/0ab1b352dc.png'} ] 
  current_product : any = {}
  objectKeys = Object.keys;
  cantidad:number = 1
  promoActive:boolean = false
  public productsPromo: any = [];
  public promotionProduct: any = false;
  cart:any[] = []
  public salePrice: number = 0;
  currentState:string = 'initial'
  url:string= ''
  isAuth: boolean = false
  verCatalogo: boolean = false
  private subscriptions: Array<Subscription> = [];
  images:any[] = []
  loading:boolean = false
  varPropiedades:any[] = []
  varSelect:any[] = []
  statusTooltip:boolean = true
  imageActive:number = 0
  disabled:number = 0
  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cd : ChangeDetectorRef,
    private alerts: AlertsService,
    private promoService: PromotionsService,
    private cartService: CartService,
    private spinner: NgxSpinnerService,
    private location: Location,
    private router: Router,
    private wholesale: WholesaleService,
    private translate: TranslateService,
    private auth: AuthService,
    private cartWholesale: CartWholesaleService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformID,
    private stores: StoresService,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.spinner.show()
    this.subscriptions.push(
      router.events.subscribe((val) => val instanceof NavigationEnd && this.getAll())
    )
  }



  ngOnDestroy(){
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    this.productsService.setCategory('')
    this.metaService.removeTag("property='og:image'")
    this.metaService.removeTag("property='og:description'")
    this.metaService.removeTag("property='og:title'")
    this.metaService.removeTag("name='description'")
    this.titleService.setTitle('Flexy')
  }

  getAll(){
    this.loading = true
    this.images = []
    this.cantidad = 1
    this.checkAuth()
    this.getCart()
    this.checkCtg()
    this.getIdStore()
    this.spinner.hide()
  }

  getIdStore(){
    this.subscriptions.push(
      this.stores.getStoreId()
      .subscribe(async id => {
        if(id !== null && id !== "null"){
          this.id_store_current = id
          this.getid()
          this.getProduct()
        }
      })
    )
  }

  checkAuth(){
    this.auth.isAuthenticated() ? (this.isAuth = true) : (this.isAuth = false)
  }

  checkCtg(){
    this.subscriptions.push(
      this.wholesale.getVerCatalogo().
      subscribe(value => value ? this.verCatalogo = true : this.verCatalogo = false )
    )
  }

  ngOnInit(){
    
  }

  getCategory(){
    this.subscriptions.push(
      this.productsService.getCategory()
    .subscribe( (ctg:string) => ctg !== '' ? (this.category = ctg) : ( this.category = this.product.categories[0].category.slug ) )
    )
  }

  getid(){
    this.sku = this.route.snapshot.paramMap.get('id')
    
    this.subscriptions.push(
      this.route.params.subscribe(params =>  {
        if(params['code'] !== undefined){
          if(isPlatformBrowser(this.platformID)){
            localStorage.setItem('user_reference', params['code']);
          }
        }
      })
    )
  }

  // getPromo(){
  //   this.promoService.getPromotion()
  //   .subscribe((promotion: any) => {
  //     this.promotionProduct = promotion;
  //     if (promotion && this.promotionProduct != false && (this.promotionProduct.type == '004' || this.promotionProduct.type == '002')) {
  //         this.promoService.isProductInPromotion(this.id_store_current, this.sku).then((res2) => {

  //         if (res2.state == "success") {


  //           if (res2.data.length != 0) {
  //             this.promoActive = true;
  //             this.productsPromo = res2.data;
  //             console.log(this.productsPromo)
  //           } else {

  //             this.promoActive = false;
  //           }
  //         } else {
  //           this.promoActive = false;
  //         }
  //         this.getProduct()

  //       }).catch((error) => {
  //         this.promoActive = false;
  //       });
  //     }
  //   });
    
  // }

  getProduct(){
    this.productsService.getDetailProductProperties(this.id_store_current, this.sku)
    .then(res => {
      this.product = res.data.variants

      let titleSeo = this.product[0].name
      // let seoDesc = ''
      // this.product[0].info_options.map(info => {
      //   info.name === 'title' && (titleSeo = info.value)
      //   info.name === 'desc' && (seoDesc = info.value)
      // })
      this.titleService.setTitle(`${titleSeo} | Flexy`)
      // this.metaService.updateTag({ name: 'description', content: seoDesc })
      // this.metaService.updateTag({ property: 'og:title', content: titleSeo })
      if(res.data.images.length > 0 && this.product.length > 1){
        res.data.images.map(img => {
          this.images.push(img)
        })
      }

      this.product.map(product => {
        // console.warn(product, 'producto para images')
        
         if(product.images.length > 0){
            product.images.map(img => {
              this.images.push(img)
            })
          // this.images.push(product.images[0])
         }
      })
      

      
      // console.warn(this.images)
      //this.product = data en backoffice
      let variantes = []
      let perm = []
    let idx = null
      this.product.map(item => {
       if(item.status == 'active'){
         //recorro las variants_options para armar un objeto separandolas por el name, y juntando los values
         item.variants_options.map((val, index)=> {
          // console.warn(variantes[index].includes(val.name))
          let existe =  variantes.filter(item => item.name == val.name)
          if(existe.length > 0){
          idx = variantes.findIndex(item => item.name == val.name )
          // console.warn(variantes[idx].values,val.value)
          if(!variantes[idx].values.includes(val.value)){
              variantes[idx].values.push(val.value)
          }
          }
          else{
            variantes.push({
              category:'variant',
              name:val.name,
              type:'string',
              values:[val.value]
            })
          }
        })
        perm.push({
          images: item.images.length > 0 ? item.images[0].url : [] ,
          stock: item.stock,
          price: item.price,
          name: item.name,
          description:item.description,
          sale_price: 0,
          sku: item.product_sku,
          stock_infinity: item.stock_infinity,
          status: item.status == 'active' ? true : false
        })
       }
      }) //fin map data
      let temporal = []
      variantes.map(dato => {
        temporal.push(dato.values) 
      })//fin map variantes
      this.varPropiedades=variantes
     this.varPropiedades.map(item =>{
       this.varSelect[item.name] = item.values[0]
      })
      
     this.varSelect['sku'] = this.obtenerSku(this.varSelect)
      // console.warn(this.varPropiedades)

      this.product = this.product.filter(v => v.price > 0)
      !this.product && (this.product = this.product[0].price)

      // const idxVar = this.product.findIndex(v => v.stock > 0)
      this.selectedSize = this.product.find(v => v.stock > 0)
      !this.selectedSize && (this.selectedSize = this.product[0])
      if(this.product.length > 1){
        this.current_product = this.product.filter(item => item.product_sku.toLowerCase() == this.varSelect['sku'])[0]
      }else{
        this.current_product = this.product[0]
      }
     
      if(isPlatformBrowser(this.platformID)){
        window.scrollTo(0, 0);
      }

      this.moveImage()
      this.loading = false

    })
    .catch(err => console.log(err))
  }

  getCart(){
    this.subscriptions.push(
      !this.isAuth ? this.cartService.getCart().subscribe(cart => this.cart = cart ) : this.cartWholesale.getCart().subscribe(cart => this.cart = cart )
    )
  }



  // async setVariation(variation: any, index: number){
  //   console.warn('set Variation',variation,index)
  //   this.current_product = variation;
  //   this.current_product.description = (variation.description != undefined && variation.description != null) ? variation.description : variation.name;
  //   this.current_product.price = variation.price;
  //   this.current_product.image = (variation.images[index] != undefined) ? variation.images[index].url : 'https://puu.sh/ImNRs/0ab1b352dc.png';
  //   this.current_product.product = `${variation.product}`;
  //   this.current_product.product_sku = `${variation.product_sku}`;
  //   let imageOg = this.current_product.image === '' ? this.default_photo : this.current_product.image
  //   this.metaService.updateTag({ property: 'og:image', content: imageOg })
  //   this.cd.detectChanges()
  //   console.log(' => prod actual',this.current_product)
  // }


  async checkpromos(){
    if (this.promotionProduct && this.promotionProduct != false && this.promotionProduct.type == '004') {

      if (await this.revisarPromo4Core()) {
        this.salePrice = 0;

        for (var i = 0; i < this.productsPromo.length; i++) {
          if (this.productsPromo[i].cod == this.current_product.cod) {
            this.salePrice = this.productsPromo[i].sale_price;
          }
        }
      }

    }else if(this.promotionProduct && this.promotionProduct != false && this.promotionProduct.type == '002'){
      if (await this.revisarPromo2Core()) {

        this.salePrice = 0;
        for (var i = 0; i < this.productsPromo.length; i++) {
          if (this.productsPromo[i].cod == this.current_product.cod) {
            this.salePrice = this.productsPromo[i].sale_price;
            this.cd.detectChanges()
          }
        }
      }
    }
  }

 


  selected(variation,value){
    this.disabled = 0
    this.varSelect[variation.name] = value
    this.varSelect['sku'] = this.obtenerSku(this.varSelect)
    this.current_product = this.product.filter(item => item.product_sku.toLowerCase() == this.varSelect['sku'].toLowerCase())
    if(this.current_product[0].status == 'inactive'){
      this.disabled = 1
      // this.alerts.alertError(this.translate.instant('alerts.noStock'))
    }
    if(this.current_product[0].stock == 0){
      this.disabled = 2
    }
    // console.warn(this.current_product[0])
    this.current_product = this.current_product[0]
    this.moveImage()
   
  }


  moveImage(){
    if(this.current_product.images.length > 0){
      this.imageActive = this.images.findIndex(item => item.product_sku == this.current_product.images[0].product_sku) 
    }
  }

  obtenerSku(varSel){
    let sku_perm = ''
    sku_perm = this.product[0].product + '-' //sky products

    this.varPropiedades.map((item, index) =>{
    
      if(this.varPropiedades.length -1 == index){
      sku_perm += varSel[item.name]
      }
      else{
      sku_perm += varSel[item.name] + '-'
      }
      
    })

    return sku_perm.toLowerCase()
  } 
  add(){
    if( this.cantidad >= this.current_product.stock ){
      this.alerts.alertError(this.translate.instant('alerts.noStock'))
      return
    }
    this.cantidad=this.cantidad+1
  }

  less(){
    this.cantidad === 1 ? this.cantidad = 1 : this.cantidad = this.cantidad-1
  }


  // revisar las promos

  async revisarPromo2Core() {
    let productPromo = 0;


    for (var i = 0; i < this.cart.length; i++) {
      let producto_en_promo = 0;
      let __cart = this.cart[i];
      let cantidad = await this.promoService.isProductInPromotion(this.id_store_current, this.cart[i].product.sku).then((res2) => {

        if (res2.state == "success") {

          if (res2.data.length != 0) {
            let productos_promos = res2.data;
            for (var j = 0; j < productos_promos.length; j++) {
              if (__cart.variation.cod == productos_promos[j].cod) {

                return __cart.variation.quantity;
              }
            }
          }
        }
      }).catch((error) => {
        return false;
      });
      if (cantidad != undefined)
        productPromo += Number(cantidad);

    }


    return true;



  }

  async revisarPromo4Core() {
    let productPromo = 0;
    let cntProducts = 5;


    for (var i = 0; i < this.cart.length; i++) {
      let producto_en_promo = 0;
      let __cart = this.cart[i];
      let cantidad = await this.promoService.isProductInPromotion(this.id_store_current, this.cart[i].product.sku).then((res2) => {

        if (res2.state == "success") {

          if (res2.data.length != 0) {
            let productos_promos = res2.data;
            for (var j = 0; j < productos_promos.length; j++) {
              if (__cart.variation.cod == productos_promos[j].cod) {

                return __cart.variation.quantity;
              }
            }
          }
        }
      }).catch((error) => {
        return false;
      });
      if (cantidad != undefined)
        productPromo += Number(cantidad);

    }

    if (productPromo >= cntProducts) {
      return true;
    } else {
      return false;
    }


  }

  async revisarPromo4() {
    this.spinner.show()
    this.revisarPromo4Core();
    this.spinner.hide()
  }

  async addItemTocart() {
    if (this.current_product.stock == 0) {
      this.alerts.alertError(this.translate.instant('alerts.noStock'))
      return;
    }
    this.addToCart()
  }

  async addToCart() {
    let exist = false;
    for (var i = 0; i < this.cart.length; i++) {
      if (this.cart[i].variation.product_sku == this.current_product.product_sku) {
        if ((this.cart[i].variation.quantity + 1) <= this.current_product.stock) {
          exist = true;
          this.cartService.addItemTocart(this.product, this.current_product, this.cantidad);
          this.alerts.alertToastCenter(this.translate.instant('checkout.productoAdd'))
        } else {
          this.alerts.alertError(this.translate.instant('alerts.cantidadExcede'))
        }
        return;
      }
    }
    if (!exist) {
      this.cartService.addItemTocart(this.current_product, this.current_product, this.cantidad);
      this.alerts.alertToastCenter(this.translate.instant('checkout.productoAdd'))
    }
  }

  processHTML(html:any){
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }


  back(){
    this.location.back()
  }

  showTooltip(e) {
    let tooltipContent = this.tooltipContent.nativeElement;
    if(this.statusTooltip){
      const coord = tooltipContent.getBoundingClientRect();
      var x = e.clientX - coord.left;
      var y = e.clientY - coord.top;
      if (x > 70 && x < (coord.width-70) && y > 50 && y < (coord.height-50)) {
        this.tooltip.nativeElement.style.left=x+'px';
        this.tooltip.nativeElement.style.top=y-40+'px';
        this.tooltip.nativeElement.style.display='flex';
      } else this.tooltip.nativeElement.style.display='none';
    }else{
      //this.tooltip.nativeElement.style.display='none'
      return
    }
    
    //console.log("x: ", x, "y:", y, "Px: ", e.pageX, "Py:", e.pageY,"coord.left", coord.left, "coord.top:", coord.top, "coord.whidth:", coord.width);
  }

  getEvent(tooltip){
    this.statusTooltip = tooltip
  }
  
}

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartWholesaleService } from 'src/app/services/cartWholesale/cart-wholesale.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { PromotionsService } from 'src/app/services/promotions/promotions.service';
import { ShareService } from 'src/app/services/share/share.service';
import { StoresService } from 'src/app/services/stores/stores.service';
import { ModalComponent } from 'src/app/shared/modal/modal/modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css']
})
export class CartModalComponent implements OnInit, OnDestroy {

  @ViewChild('modalComponent') modal:
  | ModalComponent<CartModalComponent>
  | undefined;

  checkout:boolean = false
  carrito:boolean = true
  objectKeys = Object.keys

  public cart: any[] = [];
  indiceFoto: number = 0;
  TotalCart: number = 0;
  url: string = '';
  public id_store_current = "";
  default_photo: string = "https://puu.sh/ImNRs/0ab1b352dc.png";
  public sales_price_products = [];
  promotionInfo: any = [];
  public promoActive: any = false;
  public promotionActive: any = false;
  isAuth:boolean = false
  detail:any = {}
  infoVar:any[] = []

  currentChange:string='0'
  changeVar:boolean = false
  varPropiedades:any[] = []
  varSelected:any[] = []
  currentProduct:any[] = []
  current:any[] = []
  itemTemporal:any[] = []
  constructor(
    @Inject(PLATFORM_ID) private platformID,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private PromotionsServices: PromotionsService,
    private spinner: NgxSpinnerService,
    private cartService: CartService,
    private translate: TranslateService,
    private alerts: AlertsService,
    private cartWholesale: CartWholesaleService,
    private auth: AuthService,
    private stores: StoresService,
    private productService: ProductsService
    ) {
    this.getId()
    this.checkAuth()
    this.listenClose()
    this.getInfoCompraNormal()
    this.getInfoCompraWholesale()
  }

  getId(){
    this.stores.getStoreId()
    .subscribe(async id => {
      if(id !== null && id !== "null"){
        this.id_store_current = id
      }
    })
  }

  ngOnDestroy(){
    this.cartWholesale.setCloseCart(false)
    this.cartService.setCloseCart(false)
  }

  listenClose(){
    this.cartWholesale.getCloseCart().subscribe(( (value:boolean) => {
      value && this.close()
      this.cartWholesale.setInfoCompra({})
    }))
    this.cartService.getCloseCart().subscribe(( (value:boolean) => {
      value && this.close()
      this.cartService.setInfoCompra({})
    } ))
  }

  checkAuth(){
    this.check()
  }

  check(){
    this.checkCartNormal()
  }

  checkCartNormal(){
    this.cartService.getCart()
    .subscribe((cart: any) => {
      this.cart = cart;
      this.cart.map(item =>{
        let arr = []

        if(item.product.variants_options !== undefined){
          item.product.variants_options.map(val => {
            arr.push({name:val.name, value:val.value})
          })
          if(this.infoVar.length < this.cart.length ){
            this.infoVar.push(arr);
          }
       
        }
        else{
          if(item.product.variants != undefined && item.product.variants.length > 1){
          item.variation.variants_options.map((vari) => {
            arr.push({name:vari.name, value:vari.value})
          })
            if(this.infoVar.length < this.cart.length ){
              this.infoVar.push(arr);
            }
          }
          else{
            this.infoVar.push([])
          }
        }

        })
        // console.warn(this.infoVar)
        let tmp = []
        let tmp2 = []
        this.infoVar.map(val => {

          val.map(item =>{
            let obj = {name:item.name, value:item.value}
            tmp.push(obj)
          })
          tmp2.push(tmp)
        })
        
      this.actualizarTotal();
    });
  }

  checkCartWholesale(){

    this.cartWholesale.getCart()
    .subscribe((cart: any) => {

      this.cart = cart;
      this.cart.map(item =>{
        this.cart.map(item =>{
          if(item.product.variants_options !== undefined){
            let arr = []
            item.product.variants_options.map(val => {
              arr.push({name:val.name, value:val.value})
            })
            if(this.infoVar.length < this.cart.length ){
              this.infoVar.push(arr);
            }
          
          }
          else{
            this.infoVar.push([])
          }
        })
      })
      this.actualizarTotal();
    });
  }

  ngOnInit() {
    this.sales_price_products = Array.from(Array(this.cart.length), (_, i) => 0);

    if (this.promotionInfo && this.promotionInfo != false && (this.promotionInfo.type == '004'||this.promotionInfo.type == '002' ||this.promotionInfo.type == '005')) {
      for (var i = 0; i < this.cart.length; i++) {
        let __cart = this.cart[i];
        let __it = i;
        this.PromotionsServices.isProductInPromotion(this.id_store_current, this.cart[i].product.sku).then((res2) => {

          if (res2.state == "success") {

            if (res2.data.length != 0) {
              let productos_promos = res2.data;
              this.sales_price_products[__it] = 0;
              for (var j = 0; j < productos_promos.length; j++) {
                if (__cart.variation.cod == productos_promos[j].cod) {

                  this.sales_price_products[__it] = productos_promos[j].sale_price;
                }
              }
            }


          } else {
            this.promoActive = false;
          }
        }).catch((error) => {
          this.promoActive = false;
        });
      }

    }


  }

  setVariation(product: any, variation: any, index: number) {


    let current_product: any = Object.assign({}, variation);
    current_product.description = (variation.description != undefined && variation.description != null) ? variation.description : null;
    current_product.price = variation.price;
    current_product.image = (product.images[index] != undefined) ? product.images[index].url : 'https://i.imgur.com/6NZFWx5.png';

    current_product.cod = `${variation.cod}`;
    current_product.sku = `${variation.sku}`;


    return current_product;
  }

  addCantidad(product) {
    if(product.variation.quantity >= product.variation.stock){
      this.alerts.alertError(this.translate.instant('alerts.noStock'))
      return 
    }
    product.variation.quantity = product.variation.quantity + 1
    this.isAuth ? this.cartWholesale.updateCart(this.cart) : this.cartService.updateCart(this.cart)
    this.actualizarTotal()
  }

  changeVariati(vari){     
    this.currentChange = vari.product.product_sku 
    this.productService.getDetailProductProperties(vari.product.id_store,vari.product.product).then((res)=>{
      this.currentProduct=res.data
      // console.warn(res.data)
      this.GetVarPropiedades(res.data.variants)
    }).catch((err)=>{
      console.log(err)
    })
  }

  GetVarPropiedades(prod){
    let variantes = []
    let idx = null

    prod.map(item => {
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
   })
   this.varPropiedades = variantes
  }

  selected(variation,value,prod){
    console.clear()
    
    prod.variants_options.map(item => {
      this.varSelected[item.name] = item.value
    })
    this.varSelected[variation.name] = value
    this.varSelected['sku'] = this.obtenerSku(  this.varSelected)

    this.itemTemporal[variation.name] = value
    this.itemTemporal['sku'] = this.varSelected['sku']

    this.cart = this.cart.map((item,idx) =>{
      if(item.product.product_sku == this.currentChange){
        let quantity = item.variation.quantity
        item.variation = this.currentProduct['variants'].filter(val => val.product_sku.toLowerCase() ==   this.varSelected['sku'].toLowerCase())[0]
        item.variation.quantity = quantity
        item.product = item.variation
        let arr = []
        this.infoVar = this.infoVar.map((val,ind) => {
          if(idx == ind){
            item.variation.variants_options.map(val2 => {
              arr.push({name:val2.name, value:val2.value})
            })
           val = arr
          }
          return val
        });
   
      }
    return item
    })
    if(variation.stock == 0){
      this.alerts.alertError(this.translate.instant('alerts.noStock'))
    }
    this.cartService.updateCart(this.cart);
    this.actualizarTotal();

  }
  ver(data){
    console.log('ver',data)
  }

  obtenerSku(varSel){
    let sku_perm = ''
    sku_perm = this.currentProduct['product'] + '-' //sky products

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


  changeVariation(index, idx) {

    this.cart[index].variation.cod = this.cart[index].product.variations[idx].cod;

    this.cart[index].variation.sku = this.cart[index].product.variations[idx].sku;
    this.cart[index].variation.price = this.cart[index].product.variations[idx].price;

    this.cartService.updateCart(this.cart);
    this.actualizarTotal();
    // if (this.promotionInfo && this.promotionInfo != false && (this.promotionInfo.type == '004')) {
    //   setTimeout(() => {
    //     this.revisarPromo4();
    //   }, 150);
    // }
    // if (this.promotionInfo && this.promotionInfo != false && (this.promotionInfo.type == '002')) {
    //   setTimeout(() => {
    //     this.revisarPromo2Core();
    //   }, 150);
    // }
    // if (this.promotionInfo && this.promotionInfo != false && (this.promotionInfo.type == '005')) {
    //   setTimeout(() => {
    //     this.revisarPromo5Core();
    //   }, 150);
    // }
  }
  
  removeCantidad(index) {
    this.cart[index].variation.quantity--;
    if (this.cart[index].variation.quantity == 0) {
      this.removeItem(index);
    }
    this.isAuth ? this.cartWholesale.updateCart(this.cart) : this.cartService.updateCart(this.cart);
  
    this.actualizarTotal();
  }

  removeItem(index) {
    this.cart.splice(index, 1);
    this.isAuth ? this.cartWholesale.updateCart(this.cart) : this.cartService.updateCart(this.cart);
    this.actualizarTotal();
  }

  actualizarTotal() {
    if (this.cart.length > 0) {
      this.TotalCart = this.cart.map((item, index) => {
        let valor = 0;
        valor = item.variation.sale_price != 0 ? item.variation.quantity * item.variation.sale_price : item.variation.quantity * item.variation.price;
        return valor;
      }).reduce((x, y) => x + y);
    } else {
      this.TotalCart = 0;
    }
  }

  irACheckout() {
    if (this.TotalCart > 0) {
      for (var i = 0; i < this.cart.length; i++) {
        for (var j = 0; j < this.cart[i].product.variations.length; j++) {

          if (this.cart[i].variation.cod == this.cart[i].product.variations[j].cod) {

            if (this.cart[i].product.variations[j].stock == 0 || (this.cart[i].variation.quantity > this.cart[i].product.variations[j].stock)) {

              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: this.translate.instant('alerts.seleccionarTamano')
              });
              return;
            }
          }
        }
      }
      this.router.navigateByUrl(`/${this.id_store_current}/checkout`);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: this.translate.instant('alerts.carritovacio')
      })
    }

  }

  irAHome() {
    this.router.navigateByUrl(`/${this.id_store_current}`);
  }

  async revisarPromo4() {
    this.spinner.show();
    this.revisarPromo4Core();
    this.spinner.hide();

  }

  async revisarPromo5Core() {
    this.sales_price_products = Array.from(Array(this.cart.length), (_, i) => 0);
    let productPromo = 0; // Cantidad de productos de la promocion.
    let cntProducts = 0;
    let products_promo=[];
    for (var i = 0; i < this.cart.length; i++) {
      let producto_en_promo = 0;
      let __cart = this.cart[i];
      let __it = i;
      let cantidad = await this.PromotionsServices.isProductInPromotion(this.id_store_current, this.cart[i].product.sku).then((res2) => {

        if (res2.state == "success") {

          if (res2.data.length != 0) {
            let productos_promos = res2.data;
            for (var j = 0; j < productos_promos.length; j++) {
              this.sales_price_products[__it] = 0;
              if (__cart.variation.cod == productos_promos[j].cod) {

                for (var c = 0; c < __cart.variation.quantity; c++) {
                products_promo.push({position:__it,product:__cart.variation,price:__cart.variation.price});
                }
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
    products_promo=products_promo.sort(this.menorPrice);
    var freeProducts = Math.floor(products_promo.length / 3);
    for (var c = 0; c < freeProducts; c++) {
      this.sales_price_products[products_promo[c].position]-=products_promo[c].price;
      }
    if (freeProducts>0) {
      this.promotionActive = true;
    } else {
      this.promotionActive = false;
    }
    this.actualizarTotal();
  }

  async revisarPromo4Core() {


    let productPromo = 0;
    let cntProducts = 5;

    for (var i = 0; i < this.cart.length; i++) {
      let producto_en_promo = 0;
      let __cart = this.cart[i];
      let __it = i;
      let cantidad = await this.PromotionsServices.isProductInPromotion(this.id_store_current, this.cart[i].product.sku).then((res2) => {

        if (res2.state == "success") {

          if (res2.data.length != 0) {
            let productos_promos = res2.data;
            for (var j = 0; j < productos_promos.length; j++) {
              this.sales_price_products[__it] = 0;
              if (__cart.variation.cod == productos_promos[j].cod) {
                this.sales_price_products[__it] = productos_promos[j].sale_price;
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
      this.promotionActive = true;
    } else {
      this.promotionActive = false;
    }
    this.actualizarTotal();
  }

  async revisarPromo2Core() {

    let productPromo = 0;

    for (var i = 0; i < this.cart.length; i++) {
      let producto_en_promo = 0;
      let __cart = this.cart[i];
      let __it = i;

      let cantidad = await this.PromotionsServices.isProductInPromotion(this.id_store_current, this.cart[i].product.sku).then((res2) => {

        if (res2.state == "success") {

          if (res2.data.length != 0) {
            let productos_promos = res2.data;
            for (var j = 0; j < productos_promos.length; j++) {
              this.sales_price_products[__it] = 0;
              if (__cart.variation.cod == productos_promos[j].cod) {
                this.sales_price_products[__it] = productos_promos[j].sale_price;
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
      this.promotionActive = true;
      this.actualizarTotal();

    }

  }

  menorPrice( a, b ) {
    if ( a.price  < b.price ){
      return -1;
    }
    if ( a.price >  b.price ){
      return 1;
    }
    return 0;
  }

  async close(showPopUp?:boolean): Promise<void> {
    await this.modal?.close(showPopUp);
  }

  getInfoCompraWholesale(){
    this.cartWholesale.getDataCompra()
    .subscribe( compra => {
      if(Object.keys(compra).length > 0){
        this.detail = compra
        this.checkout = false
      }
    })
  }

  getInfoCompraNormal(){
    this.cartService.getDataCompra()
    .subscribe( compra => {
      if(Object.keys(compra).length > 0){
        this.detail = compra
        this.checkout = false
      }
    })
  }

  getEvent($event){
    $event && this.close(true)
  }

}

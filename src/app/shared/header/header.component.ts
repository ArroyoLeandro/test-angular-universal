import { ChangeDetectorRef, Component, Inject, Input, OnInit, HostListener, ElementRef, ViewChild, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CartModalComponent } from 'src/app/components/cartModal/cart-modal/cart-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartWholesaleService } from 'src/app/services/cartWholesale/cart-wholesale.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ShareService } from 'src/app/services/share/share.service';
import { StoresService } from 'src/app/services/stores/stores.service';
import { WholesaleService } from 'src/app/services/wholesale/wholesale.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';

import { ToggleClassService } from '../../services/toggle/toggle-class.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  //@ViewChild('siDesbordaContent') siDesbordaContent: ElementRef;
  phoneNumber: number | any
  api_whatsapp:string = 'https://api.whatsapp.com/send?'
  msg:string = '¡Hola! Quisiera conversar con una asesora'
  id_store_current : string = ''
  categories:any[] = []
  cartCount = 0
  isAuth:boolean = false
  slug:string = ''
  logo:string = ''
  private debounceTimer?: NodeJS.Timeout
  searchTerm:string = ''
  text:string = ''
  list:any[] = []
  default_photo: string = "https://puu.sh/ImNRs/0ab1b352dc.png";
  show:boolean = false
  searchReady:boolean = false
  //header variable
  headerType:string = ''
  menuAbierto:boolean = false
  //saber si desborda el contenedor
  //desborda:boolean
  isMobile:boolean=false
  showCtgs:boolean=false

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformID,
    private modalService: ModalService<CartModalComponent>,
    private categoryService: CategoriesService,
    private cartService: CartService,
    private auth: AuthService,
    public router: Router,
    private cartWholesale: CartWholesaleService,
    private wholesale: WholesaleService,
    private shareservice: ShareService,
    private productService: ProductsService,
    private stores: StoresService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    public toggleService: ToggleClassService
    ) { 
      router.events.subscribe((val) => val instanceof NavigationEnd && this.checkAuth());
  }
  
  ngOnInit(): void {
    this.mostrarMenu()
  }

  mostrarMenu(){
    //mido el contenedor
    let widthContent = document.documentElement.clientWidth;
    if (widthContent <= 640) {
      this.isMobile = true
      this.toggleService.comprimida = true
    }
    else {
      this.isMobile = false
      this.toggleService.comprimida = false
    }
    
  }

  setVerctg(){
    this.wholesale.setVerCatalogo(false)
  }

  toggleCtg(category){
    // category.show = !category.show
    this.categories.map(catg => {
      category.id === catg.id ? (catg.show = !catg.show) : (catg.show = false)
    })
  }
  
  getConfigStore(){
    this.stores.getAllConfig()
    .subscribe((config:any[]) => {
      config.map(({name, value}) => {
        name === 'header-text' && (this.text = value)
        name === 'header' && (this.headerType = value)
      })
    })
  }

  checkAuth(){
      if(isPlatformBrowser(this.platformID)){
        this.getConfigStore()
      }
      this.getId()
      this.getLogo()
      this.checkSlug()      
  }

  getLogo(){
    this.stores.getLogo()
    .subscribe(logo => this.logo = logo)
  }

  getId(){
    this.stores.getStoreId()
    .subscribe(async id => {
      if(id !== null && id !== "null"){
        this.id_store_current = id
        await this.getCtg()
        this.getItemsCart()
      }
    })
  }


  checkSlug(){
    this.shareservice.getSlug().subscribe( (slug:string) =>  {
      this.router.url.includes('cart') && this.getShare(slug)
    })
  }

  getShare(slug:string){
    // console.log(slug)
    this.shareservice.getShareByUserSlug(slug)
    .then(res => {
      this.isAuth && this.logout()
      let data = JSON.parse(res.data.json)
      let dataTransform = JSON.parse(data)
      let products:any[] = dataTransform.products
      this.cartService.clear()
      if(isPlatformBrowser(this.platformID)){
        localStorage.setItem('user_reference', res.data.id_user)
        localStorage.setItem('id_share', slug)
      }
      products.forEach(item => {
        this.cartService.addItemTocart(item.product.variations[0], item.product.variations[0], item.cantidad)
        // this.cartService.addItemTocart(item.product item.product.variations[0], item.cantidad)
      })
      this.open()
    })
    .catch(err => {
      console.log(err)
    })
  }

  getCtg():Promise<any>{
    return new Promise( (resolve,reject) => {
      this.categoryService.getList(this.id_store_current)
      .then(res => {
        resolve( this.filterCategories2(res.data) )
      })
      .catch(err => {
        reject(err)
      })
    })
  }

  getItemsCart(){
    !this.isAuth ? this.cartService.getCartCount().subscribe(cart => this.cartCount = cart ) : this.cartWholesale.getCartCount().subscribe(cart => this.cartCount = cart )
  }

  async open(): Promise<void> {
    const {CartModalComponent} = await import(
      '../../components/cartModal/cart-modal/cart-modal.component'
    );

    await this.modalService.open(CartModalComponent);
    this.modalService.nameComponent.next('CartModalComponent')
  }

  abrirMenu() {
  this.menuAbierto = !this.menuAbierto
  //this.cambiarTabindex();
  }

  hideMenu(){
    this.menuAbierto = false
  }

  logout(){
    this.auth.doLogout()
  } 

  async checkProducts(ctgs:any[]){
    this.categories = ctgs
    // let ctgProducts:any[]  = []
    // let slugsCat = ctgs.map(c => c.slug)
    // let products:any[] = []
    // const response = slugsCat.map( async slug =>  {
    //   return await this.productService.getListCategory(this.id_store_current, slug, 1, this.isAuth).then(res => res.data.data)
    // })
    // await Promise.all(response).then((promise:any[]) => promise.map(p => products.push(...p)))
    // products.forEach(p => p.categories.map(c => !(ctgProducts.includes(c.category.slug)) && ctgProducts.push(c.category.slug)))
  }


  redirectCtg(slug:string, ctg, sub:boolean){
    !sub && this.router.navigate([`/${this.id_store_current}/${slug}`])
    sub && this.router.navigate([`/${this.id_store_current}/${ctg.slug}/${slug}`])
    // status ? this.router.navigate([`/home/wholesales/${slug}`]) : this.router.navigate([`/home/${slug}`])
  }
  // '/home/wholesales/{{category.slug}}' : '/home/{{category.slug}}'
    
  redirectwholesale(){
    this.document.location.href = 'http://oopsiepoopsiewholesale.com';
  }

  contactWhatsapp(){
      this.stores.AddClick(this.id_store_current, 'visit')
      .then(res => {
      if (typeof res.data === 'string' || res.data instanceof String){
        this.phoneNumber = res.data
        let url = `${this.api_whatsapp}phone=+${this.phoneNumber}&text=${this.msg}`
        let link = document.createElement("a")
        link.href = url
        link.target = "_blank"
        link.dispatchEvent(new MouseEvent("click"))
      }else{
        Swal.fire({icon: 'error',title: 'Oops...',text: 'Actualmente no hay asesoras disponibles'})
      }
      })
      .catch(err => {
        console.log(err)
      })
  }

  search(){
    this.searchReady = false
    this.productService.searchQuery.next(false)
    if(this.debounceTimer) clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => {
      this.searchProducts()
    }, 1000)
  }

  searchProducts(){
    if(this.searchTerm !== ''){
      this.spinner.show()
      this.productService.searchProducts(1, this.searchTerm, this.id_store_current)
      .then(res => {
        // console.log(res.data.data)
        this.list = res.data.data
        this.searchReady = true
        this.productService.searchQuery.next(true)
        this.productService.query.next(this.searchTerm)
        this.productService.products.next(res.data.data)
        this.spinner.hide()
      })
      .catch(err => {
        console.log(err)
        this.spinner.hide()
      })
    }else{
      this.productService.query.next('')
      this.productService.products.next([])
    }
  }

  processHTML(html:any){
   return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  filterCategories2(categories:any[]){
    //sumo los caracteres de las categorias *6.5 que sería el ancho de letra
    let caracteres = categories.map(cat => cat.name.length*6.5)
    let suma = 0
    //let widthContent = this.siDesbordaContent.nativeElement.clientWidth;
    let widthContent = document.documentElement.clientWidth;
    caracteres.forEach (function(numero){
      suma += numero;
    })
    //this.clearRepeat()

    if (suma > widthContent || widthContent <= 480) {
      this.headerType = '2'
      this.showCategories(categories)
    }
    else {
      this.headerType = '1'
      this.showCategories(categories)
    }
    
  }

  showCategories(categories:any[]){
    this.categories = []
      let hasSub = categories.some(ctg => ctg.sub_categories.length > 0)  
      if(hasSub){
        categories.map(ctg => {
          if(ctg.sub_categories.length > 0){
            let idSubs = ctg.sub_categories.map(sub => sub.id)
            categories.map(cat => !idSubs.includes(cat.id) && (this.categories.push(cat)))
          }
        })
      }else{
        this.categories = categories
      }
    this.categories.map(ctg => ctg.show = false)
    this.clearRepeat()
    //console.log('header '+this.headerType, 'totalCategories '+this.categories)
  }
  showCategories2(categories:any[]){
    let totalCategories = []
    categories.map(category => {
      if(category.sub_categories.length === 0){
        totalCategories.push(category)
      }else{
        category.sub_categories.map(sub => {
          sub.slug = `${category.slug}/${sub.slug}`
          totalCategories.push(sub)
        })
      }
    })
    this.categories = totalCategories
  }
  clearRepeat(){
    this.categories =  this.categories.reduce((unique, o) => {
      if(!unique.some(obj => obj.id === o.id)) {
        unique.push(o);
      }
      return unique;
    },[])
  }

  
  @HostListener('window:resize', ['$event'])
  onResize($event) {
    this.getCtg();
  }

/*
  filterCategories(categories:any[]){
    if(this.headerType === '1' || this.headerType === ''){
      this.categories = []
      let hasSub = categories.some(ctg => ctg.sub_categories.length > 0)  
      if(hasSub){
        categories.map(ctg => {
          if(ctg.sub_categories.length > 0){
            let idSubs = ctg.sub_categories.map(sub => sub.id)
            categories.map(cat => !idSubs.includes(cat.id) && (this.categories.push(cat)))
          }
        })
      }else{
        this.categories = categories
      }    
    }else{
      this.categories = categories
    }
    this.categories.map(ctg => ctg.show = false)
    this.clearRepeat()
    setTimeout(() => {
      if(this.headerType === '2') this.controlarDesbordamiento();  
    }, 2000);
  }

  clearRepeat(){
    this.categories =  this.categories.reduce((unique, o) => {
      if(!unique.some(obj => obj.id === o.id)) {
        unique.push(o);
      }
      return unique;
    },[])
  }

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    if(this.headerType === '2') this.controlarDesbordamiento();
  }
  @HostListener("wheel", ["$event"])
  public onScroll(event: WheelEvent) {
    if(this.headerType === '2' && this.desborda == true) {this.siDesbordaContent.nativeElement.scrollLeft += event.deltaY;
    event.preventDefault();}
    else return;
  }

  controlarDesbordamiento() {
    let widthTotal = this.siDesbordaContent.nativeElement.scrollWidth;
    let widthContent = this.siDesbordaContent.nativeElement.clientWidth;
    if(widthTotal > widthContent){
      this.desborda=true;
    } else {this.desborda=false;}
  }
  */
}


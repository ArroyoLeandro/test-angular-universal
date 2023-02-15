import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/product.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeService } from 'src/app/services/home/home.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ShareService } from 'src/app/services/share/share.service';
import { WholesaleService } from 'src/app/services/wholesale/wholesale.service';
import { StoresService } from 'src/app/services/stores/stores.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('top') top: ElementRef

  products:any[] = []
  banners:any = {
    header: [],
    middle:[],
    end:[],
    lastSection: []
  }
  imgs:any[] = []
  texts:any = {}
  photo: string
  id_store: string
  objectKeys = Object.keys;
  url:string= 'assets/images/header-solo.jpg'
  isAuth:boolean = false
  verCatalogo: boolean = false
  private subscriptions: Array<Subscription> = [];
  constructor(
    private homeService: HomeService,
    private productservice: ProductsService,
    private auth: AuthService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private wholesale: WholesaleService,
    private activatedRoute: ActivatedRoute,
    private shareservice: ShareService,
    private stores: StoresService,
    @Inject(PLATFORM_ID) private platformID,
    ) { 
      this.subscriptions.push(
        router.events.subscribe((val) => val instanceof NavigationEnd && this.getAll())
      )
    }


    ngOnDestroy(){
      this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
      // this.wholesale.setVerCatalogo(false)
    }
    
   getAll(){  
    // if(isPlatformBrowser(this.platformID)){
      this.checkRoute()
      this.getId()
      this.checkAuth()
      this.checkCtg()
    // }
   }


   getId(){
    this.stores.getStoreId()
    .subscribe(async id => {
      if(id !== null && id !== "null"){
        this.id_store = id
        this.getHome()
      }
    })
  }

   checkRoute(){
    let slug:string = this.activatedRoute.snapshot.paramMap.get('id')
    this.shareservice.setSlug(slug)
  }


   checkCtg(){
    this.subscriptions.push(
      this.wholesale.getVerCatalogo().
      subscribe(value => value ? this.verCatalogo = true : this.verCatalogo = false )
    )
  }

  ngOnInit(): void {
  }

  getProducts(){
    this.spinner.show()
    this.productservice.getProductsWholesale()
    .then(res => {
      this.products = res.data.data
      // console.log(this.products)
      this.getHomeToGetBanners()
      this.spinner.hide()
    })
    .catch(err => {
      console.log(err)
      this.spinner.hide()
    })
  }

  getHomeToGetBanners(){
    this.homeService.getHome(this.id_store)
    .then(res => {
      let { imagenes, sliders } = JSON.parse(res.data.home)
      // this.sliders = sliders
      // this.homeService.setImage(this.sliders[0])
      // localStorage.setItem('banners', JSON.stringify(this.sliders[0]))
      this.imgs = imagenes
      if(isPlatformBrowser(this.platformID)){
        window.scrollTo(0, 0);
      }
    })
  }

  checkAuth(){
    this.auth.isAuthenticated() && (this.isAuth = true)
  }

  getHome(){
    this.spinner.show()
    this.homeService.getHome(this.id_store)
    .then(res => {
      // console.log(JSON.parse(res.data.home))
      if(JSON.parse(res.data.home)){
        let { productos, slidersHeader, slidersMiddle, slidersEnd, lastSection, texto1, texto2, texto3, texto4, texto5, texto6, texto7, texto8, texto9, texto10 } = JSON.parse(res.data.home)
        this.products = productos
        // console.log(this.products);
        
        this.banners = {
          header: slidersHeader,
          middle: slidersMiddle,
          end: slidersEnd,
          lastSection: lastSection ? lastSection : []
        }
        if(isPlatformBrowser(this.platformID)){
          localStorage.setItem('banners', JSON.stringify(this.banners.header))
        }
        this.homeService.setImage(this.banners.header)
        // this.imgs = imagenes
        this.texts = { texto1, texto2, texto3, texto4, texto5, texto6, texto7, texto8, texto9, texto10 }
        if(isPlatformBrowser(this.platformID)){
          window.scrollTo(0, 0);
        }
      }

      this.spinner.hide()
    })
  }



  // addSliders(sliders:any[]){
  //   sliders.map((slider:any[]) => {
  //     slider.map( sl => this.sliders.push(sl) )
  //   })
  // }


}

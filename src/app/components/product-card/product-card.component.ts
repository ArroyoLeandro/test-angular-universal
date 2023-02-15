import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Subscription } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { PromotionsService } from 'src/app/services/promotions/promotions.service';
import { StoresService } from 'src/app/services/stores/stores.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product:any = {}
  @Input() category:string = ''
  @Input() catalogo: boolean = false
  default_image : string = "https://puu.sh/ImNRs/0ab1b352dc.png";
  id_store_current : string
  promoActive: boolean = false
  isAuth: boolean = false
  public promotionInfo : any = [];

  @ViewChild(SwiperDirective, { static: false }) directiveRef?: SwiperDirective;
  // default
  public swiperDefaultConfig: SwiperConfigInterface = {};
  // config swiper
  public swiperAutoplayConfig: SwiperConfigInterface = {
    spaceBetween: 10,
    slidesPerView: 1,
    centeredSlides: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

      // FIN puntos responsive
  };
  variation:any = {}
  private subscriptions: Array<Subscription> = [];
  cart:any[] = []
  constructor(
    private stores: StoresService,
    private cartService: CartService,
    private PromotionsServices: PromotionsService,
    private productService: ProductsService,
    private auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private alerts: AlertsService,
    private translate: TranslateService
  ) {
    this.checkAuth()
    this.getId()
  }

  ngOnInit(): void {
    this.getPromos()
    this.getCart()
    this.product.variants.length > 0 && ( this.variation = ( this.product.variants.find(v => v.stock > 0) ? this.product.variants.find(v => v.stock > 0) : this.product.variants[0] ) )  
    // console.warn(this.product,'producto',this.variation)
    // this.product.images = [{url:'https://http2.mlstatic.com/D_NQ_NP_979362-MLA31015424549_062019-O.jpg'}] //test si muestra la imagen general
  }

  ngOnDestroy(){
    this.variation = {}
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
  
  getCart(){
    this.subscriptions.push(
     this.cartService.getCart().subscribe(cart => this.cart = cart )
    )
  }

  getId(){
    this.stores.getStoreId()
    .subscribe(id => id !== null && id !== "null" ? this.id_store_current = id : null )
  }

  checkAuth(){
    this.auth.isAuthenticated() && (this.isAuth = true)
  }

  getPromos(){
    let _this = this;
    this.PromotionsServices.getPromotion().subscribe((promotion : any) => {
    this.PromotionsServices.getPromotion()
      if(promotion){
        this.promotionInfo = promotion;
        if(this.promotionInfo&&this.promotionInfo!=false && (this.promotionInfo.type=='004' || this.promotionInfo.type=='002' || this.promotionInfo.type=='005' )){
          this.PromotionsServices.isProductInPromotion(this.id_store_current,this.product.sku).then((res2) => {
            if (res2.state == "success") {
                if(res2.data.length!=0){
                  _this.promoActive=  true;
                    }else{
                      _this.promoActive=  false;
                    }
                  }else{
                    _this.promoActive=  false;
                }
          }).catch((error) => {
            _this.promoActive=  false;
            });
       }
      }

    });
  }

  redirect(sku:string) {
    this.category !== '' && this.productService.setCategory(this.category)
    this.router.navigate([`/${this.id_store_current}/product/${sku}`])
    // !this.isAuth ? this.router.navigate([`/home/product/${sku}`]) : this.router.navigate([`/home/wholesales/product/${sku}`])
  }

  async getDetail(){
    this.spinner.show()
    try {
      let {data: prod} = await this.productService.getProductBySku(this.product.sku, this.id_store_current, false)
      this.cartService.addItemTocart(prod, 1)
      this.alerts.alertToastCenter(this.translate.instant('checkout.productoAdd'))
      this.spinner.hide()
    } catch (error) {
      this.spinner.hide()
      this.alerts.alertError('Ha ocurrido un error, intente nuevamente')
    }
  }

  addToCart(){
    this.variation['image'] = this.variation.images.length > 0 ? this.variation.images[0].url : ''
    // console.log(this.variation,'variacion');
    if(this.variation.stock === 0) return this.alerts.alertError(this.translate.instant('alerts.noStock')) 
    else this.addItemTocart()
  }

  async addItemTocart() {
    let exist = false;

    for (var i = 0; i < this.cart.length; i++) {
      if (this.cart[i].variation.product_sku == this.variation.product_sku) {
        if ((this.cart[i].variation.quantity + 1) <= this.variation.stock) {
          exist = true;
          this.cartService.addItemTocart(this.product, this.variation, 1);
          this.alerts.alertToastCenter(this.translate.instant('checkout.productoAdd'))
        } else {
          this.alerts.alertError(this.translate.instant('alerts.cantidadExcede'))
        }
        return;
      }
    }
    if (!exist) {
      this.cartService.addItemTocart(this.product, this.variation, 1);
      this.alerts.alertToastCenter(this.translate.instant('checkout.productoAdd'))
    }
  }


}

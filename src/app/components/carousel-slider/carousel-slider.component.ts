import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { PromotionsService } from 'src/app/services/promotions/promotions.service';
import { StoresService } from 'src/app/services/stores/stores.service';

@Component({
  selector: 'app-carousel-slider',
  templateUrl: './carousel-slider.component.html',
  styleUrls: ['./carousel-slider.component.scss']
})
export class CarouselSliderComponent implements OnInit {

  @Input() products: any[] = []
  id_store_current:string = ''
  promoActive: boolean = false
  public promotionInfo : any = [];
  @ViewChild(SwiperDirective, { static: false }) directiveRef?: SwiperDirective;

  // default
  public swiperDefaultConfig: SwiperConfigInterface = {};
  // coverflow effect
  public swiperAutoplayConfig: SwiperConfigInterface = {
    spaceBetween: 30,
    centeredSlides: true,
    slidesPerView: 3,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    // puntos responsive
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      480: {
        slidesPerView: 1,
        spaceBetween: 0,
      }
      },
      // FIN puntos responsive
  };

  public swiperThumbsConfig: SwiperConfigInterface = {
    spaceBetween: 30,
    centeredSlides: true,
    slideToClickedSlide: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
      swiper: {
        el: '.gallery-thumbs',
        slidesPerView: 5,
      },
      multipleActiveThumbs: true
    },
  };

  default_image : string = "https://puu.sh/ImNRs/0ab1b352dc.png";
  

  constructor(
    private stores: StoresService,
    private spinner: NgxSpinnerService,
    private cartService: CartService,
    private PromotionsServices: PromotionsService,
    private productService: ProductsService,
    private alerts: AlertsService
    ) { this.getId() }

  ngOnInit(): void {
    this.getPromos()
  }

  getId(){
    this.stores.getStoreId()
    .subscribe(id => id !== null && id !== "null" ? this.id_store_current = id : null )
  }


  async getPromos(){
    this.products.forEach(async product => {
      this.PromotionsServices.getPromotion().subscribe((promotion : any) => {
      this.PromotionsServices.getPromotion()
      if(promotion){
        this.promotionInfo = promotion;
        if(this.promotionInfo&&this.promotionInfo!=false && (this.promotionInfo.type=='004' || this.promotionInfo.type=='002' || this.promotionInfo.type=='005' )){
          this.PromotionsServices.isProductInPromotion(this.id_store_current,product.sku).then((res2) => {
            if (res2.state == "success") {
                if(res2.data.length!=0){
                  product.promoActive = true;
                    }else{
                      product.promoActive = false;
                    }
                  }else{
                    product.promoActive = false;
                }
          }).catch((error) => {
              product.promoActive = false;
            });
       }
      }
    });
    })
  }

}

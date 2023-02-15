import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Subscription } from 'rxjs';
import { StoresService } from 'src/app/services/stores/stores.service';
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() images:any[] = []
  @Input() index:number= 0
  showTooltip:boolean = true
  @Output() emitTooltip: EventEmitter<boolean> = new EventEmitter(true)
  @ViewChild(SwiperDirective, { static: false }) directiveRef?: SwiperDirective;
  @ViewChildren('imageDbClick') imageDbClick: QueryList<HTMLElement>

  // default
  public swiperDefaultConfig: SwiperConfigInterface = {};
  // coverflow effect
  public swiperAutoplayConfig: SwiperConfigInterface = {
    spaceBetween: 0,
    centeredSlides: true,
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: true,
    // },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    zoom: {
      maxRatio: 3,
      containerClass: 'swiper-zoom-container',
    }
  };
  public swiperThumbsConfig: SwiperConfigInterface = {
    spaceBetween: 30,
    centeredSlides: true,
    slideToClickedSlide: true,
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: false,
    // },
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
    zoom: {
      maxRatio: 3,
    }
  };
  
  home:boolean = false
  id_store_current:string = ''
  private subscriptions: Array<Subscription> = [];

  constructor(
    private router: Router,
    private stores: StoresService
  ) {
    this.getId()
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
  ngOnChanges(){
  }

  getId(){
    this.subscriptions.push(
      this.stores.getStoreId()
      .subscribe(async id => {
        if(id !== null && id !== "null"){
          this.id_store_current = id
        }
      })
    )
  }

  ngOnInit(): void {
    !this.router.url.includes('product') ? ( this.home = true ) : ( this.home = false )
  }

  redirect(url:string){
    this.router.navigate([`/${this.id_store_current}/product/${url}`])
  }

  ngAfterViewInit(){
    this.imageDbClick.map((item:any) => {
      item.nativeElement.addEventListener('dblclick', (e) => {
        this.showTooltip = !this.showTooltip
        this.emitTooltip.emit(this.showTooltip)
      })
    })
  }

}

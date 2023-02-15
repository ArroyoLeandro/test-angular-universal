import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel/carousel.component';
import { CarouselModule as Carousel } from 'ngx-owl-carousel-o';
import { BannerComponent } from './banner/banner.component';
import { OlControlComponent } from './ol-maps/ol-control/ol-control.component';
import { OlMapComponent } from './ol-maps/ol-map/ol-map.component';
import { OlMapMarkerComponent } from './ol-maps/ol-map-marker/ol-map-marker.component';
import { SlidersComponent } from './sliders/sliders.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { RouterModule } from '@angular/router';
import { SwiperModule } from "ngx-swiper-wrapper";
import { CartModalModule } from './cartModal/cart-modal.module';
import { CartModalComponent } from './cartModal/cart-modal/cart-modal.component';
import { CheckoutsModule } from './checkouts/checkouts.module';
import { CarouselSliderComponent } from './carousel-slider/carousel-slider.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import { TranslateModule } from '@ngx-translate/core';
import { TwopackComponent } from './twopack/twopack.component';
import { PurchaseDetailComponent } from './purchase-detail/purchase-detail.component';
import { PipesModule } from '../pipes/pipes.module';

registerLocaleData(localeEn, 'en')
registerLocaleData(localeEs, 'es');
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    CarouselComponent,
    BannerComponent,
    OlControlComponent,
    OlMapComponent,
    OlMapMarkerComponent,
    SlidersComponent,
    ProductCardComponent,
    CarouselSliderComponent,
    CalendarComponent,
    TwopackComponent,
  ],
  exports: [
    CarouselComponent,
    BannerComponent,
    OlControlComponent,
    OlMapComponent,
    OlMapMarkerComponent,
    SlidersComponent,
    ProductCardComponent,
    CartModalComponent,
    CarouselSliderComponent,
    CalendarComponent,
    TwopackComponent,
  ],
  imports: [
    Carousel,
    CommonModule,
    RouterModule,
    SwiperModule,
    CartModalModule,
    CheckoutsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    TranslateModule,
    PipesModule
  ]
})
export class ComponentsModule { }

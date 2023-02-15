import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule, LOCATION_INITIALIZED } from "@angular/common";
import { SharedModule } from "./shared/shared.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ViewsComponent } from './views-menu/views/views.component';
import { ViewsNomenuComponent } from './views-nomenu/views-nomenu/views-nomenu.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { InterceptorsService } from './services/interceptors/interceptors.service';
import { IMaskModule } from 'angular-imask';
import { PopUpInformationModule } from './shared/pop-up-information/pop-up-information.module';




export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ViewsComponent,
    ViewsNomenuComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    CommonModule,
    SharedModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    NgxSpinnerModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    IMaskModule,
    PopUpInformationModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorsService,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

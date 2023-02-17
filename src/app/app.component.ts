import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from "@angular/common";
import { defaultIfEmpty } from 'rxjs/operators';
import {Product} from './interfaces/product.model'
import { HomeService } from './services/home/home.service';
import { Subscription } from 'rxjs';
import {TranslateService} from "@ngx-translate/core";
import { isEmpty } from 'rxjs/operators'; 
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Flexy';
  spinner:string = ''
  private subscriptions: Array<Subscription> = [];

  constructor(
    private homeService: HomeService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformID,
    ){
    translate.setDefaultLang('es');
    translate.use('es');
    this.getConfig()
  }


  getConfig(){
    if(isPlatformBrowser(this.platformID)){
      this.subscriptions.push(
        this.homeService.getConfGeneralObs$().subscribe(config =>  {
          config.map(({name, value}) => {
            name === 'spinner' && (this.spinner = value)
          })
        })
      )
    }

  }
}

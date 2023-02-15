import { Pipe, PipeTransform, Inject, PLATFORM_ID } from '@angular/core';
import { StoresService } from '../services/stores/stores.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
@Pipe({
  name: 'currencyPersonalized'
})
export class CurrencyPersonalizedPipe implements PipeTransform {
  currency:string = ''
  constructor(
    @Inject(PLATFORM_ID) private platformID,
    private stores: StoresService,

  ){
    if(isPlatformBrowser(this.platformID)){
      this.getConfigStore()
    }
  }

  getConfigStore(){
    this.stores.getAllConfig()
    .subscribe((config:any[]) => config.map(({name, value}) => name === 'simbol-currency' && (this.currency = value)))
   }

  transform(value: string | number): string {
    if(value){
      let price = Number(value.toString().match(/^\d+(?:\.\d{0,2})?/));
      return `${this.currency} ${price}`;
    }
    return ''
  }

}

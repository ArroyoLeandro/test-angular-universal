import { isPlatformBrowser } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {

  private promotion: any = new BehaviorSubject([]);


  constructor(
    private httpService : HttpService,
    @Inject(PLATFORM_ID) private platformID,
  ) { }

  getPromotions(store_id: string) : Promise<any> {
    return this.httpService.get(`promotions/${store_id}`)
  }


  getListProducts(store_id: string,page: number = 1,search:any  ="") : Promise<any> {
    let params : HttpParams = new HttpParams()
    .append('search', String(search))
    .append('page', String(page));

    return this.httpService.get2(`promotions/${store_id}/getListProducts`,params)

  }

  
  isProductInPromotion(store_id: string,sku:string) : Promise<any> {
    return this.httpService.get(`promotions/${store_id}/${sku}`)
  }

  isListProductsPromotions(store_id: string,list:any) : Promise<any> {
    return this.httpService.post(`promotions/${store_id}`, {products:list});
  }

  getListProductsStock(store_id: string,page: number = 1,search:any  ="") : Promise<any> {
    let params : HttpParams = new HttpParams()
    .append('search', String(search))
    .append('page', String(page));

    return this.httpService.get2(`promotions/${store_id}/getProductWithStockList`,params)

  }


  loadPromotion(id_store:string){    
    this.getPromotions(id_store)
      .then((response) => {
        if (response.state == "success") {
         if(response.data.length==0)
          {
            this.setPromotion(JSON.stringify(null));
          }else{
            this.setPromotion(JSON.stringify(response.data));
          }
        } else {
          this.setPromotion(JSON.stringify(null));
        }
      }).catch(err => this.setPromotion(JSON.stringify(null)))
  
  }

  setPromotion(promo :any){
    if(isPlatformBrowser(this.platformID)){
      localStorage.setItem('promocion', promo);
    }
    this.promotion.next(JSON.parse(promo));
  }

  getPromotion():Observable<any>{
    return this.promotion;
  }

  clear() {
    this.setPromotion([]);
  }

}

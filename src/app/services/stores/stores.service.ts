import { isPlatformBrowser } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { PromotionsService } from '../promotions/promotions.service';

@Injectable({
  providedIn: 'root'
})
export class StoresService {
  private id_store : BehaviorSubject<string> = new BehaviorSubject("null");
  private logo : BehaviorSubject<string> = new BehaviorSubject("");
  private store : BehaviorSubject<any> = new BehaviorSubject([]);
  private configStore : BehaviorSubject<any[]> = new BehaviorSubject([]);


  constructor(
    private httpService: HttpService,
    private router: Router,
    private promotionService: PromotionsService,
    @Inject(PLATFORM_ID) private platformID,
    ) { }

  getList() : Promise<any> {
    return this.httpService.get(`stores/list`)
  }

  AddClick(id: string,type:string) : Promise<any> {
    return this.httpService.post(`stores/${id}/click`, {type: type});
  }

  checkStore(id: string ) : Promise<any> {
    return this.httpService.get2(`stores/${id}/detail`);
  }

  loadstore(id_store:string){
    this.checkStore(id_store).then((response: any) => this.setStoreId( !response ? null : response.data ) );
  }

  setStoreId(data:any){
    if( data == null ){
      this.router.navigateByUrl("/");
      this.store.next([]);
      this.id_store.next("null");
    }else{
      if(isPlatformBrowser(this.platformID)){
        localStorage.setItem('store', JSON.stringify(data));
        localStorage.setItem('id',data.id);
      }
      this.store.next(data);
      this.id_store.next(data.id);
      this.logo.next(data.logo)
      this.promotionService.loadPromotion(data.id)
      this.getConf(data.id)
    }
  }

  getStoreId(): Observable<any>{
    return this.id_store
  }

  getLogo():Observable<string>{
    return this.logo
  }

  getStore(): Observable<any>{
    return this.store
  }

  getAllConfig(){
    let config 
      if(isPlatformBrowser(this.platformID)){
        config = JSON.parse(localStorage.getItem('config'))
      }
      this.configStore.next(config)
      return this.configStore
  }

  getConf(id_store:string){
    let params : HttpParams = new HttpParams()
    .append('id_store', String(id_store))
    this.httpService.get('configurations/forstore', params)
    .then(res => {
      if(isPlatformBrowser(this.platformID)){
        localStorage.setItem('config', JSON.stringify(res.data))
      }
      this.configStore.next(res.data)
    })
  }

}

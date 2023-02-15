import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  constructor(private httpService: HttpService) { }

  makeOrder(order: object | any) : Promise<any> {
    return this.httpService.post('orders', order);
  }

  makeOrderWholesale(order: object) : Promise<any> {
    return this.httpService.post('wholesales/orders', order);
  }

  addCustomer(id_store: string, customer: object) : Promise<any> {
    return this.httpService.post(`orders/${id_store}/addCustomer`, customer);
  }

  getCost(id_store: string, data: object) : Promise<any> {
    return this.httpService.post(`orders/cost`, data);
  }

  getCustomer(id_store: string, customer: any) : Promise<any> {
    return this.httpService.post(`orders/${id_store}/getCustomer`, customer);
  }

  getInfoCEP(cep: string ) : Promise<any> {
    let params : HttpParams = new HttpParams()
    .append('cep', String(cep));
    return this.httpService.get(`home/verify`,params);
  }

  getSeller(id:string,id_store:string){
   return this.httpService.get(`home/getSeller/${id_store}/${id}`);
  }

  getmethodspayment(){
    return this.httpService.get(`payments/list`)
  }

  getListPersonalized(id_store): Promise<any>{
    let params : HttpParams = new HttpParams()
    .append('id_store', String(id_store));
    return this.httpService.get('deliveries/listpersonalized', params)
  }

}

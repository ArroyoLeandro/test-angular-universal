import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private service: BehaviorSubject<any> = new BehaviorSubject({})
  private staff: BehaviorSubject<any> = new BehaviorSubject([])
  private staff_selected: BehaviorSubject<any> = new BehaviorSubject('')
  private changeStep: BehaviorSubject<any> = new BehaviorSubject(true)
  private dateSelected: BehaviorSubject<any> = new BehaviorSubject('')
  private id_customer: BehaviorSubject<any> = new BehaviorSubject('')
  private categoryselected: BehaviorSubject<any> = new BehaviorSubject({})
  private datacustomer: BehaviorSubject<any> = new BehaviorSubject({})
  private hourselected: BehaviorSubject<any> = new BehaviorSubject({})

  constructor(private httpService: HttpService) { }

  sethour(data){ this.hourselected.next(data) }
  gethour(){ return this.hourselected }

  setcategoryselected(data){ this.categoryselected.next(data) }

  getcategoryselected(){ return this.categoryselected }

  setdatacustomer(data:object){ this.datacustomer.next(data) }

  getdatacustomer(): Observable<any> { return this.datacustomer }

  setidcustomer(id:string){ this.id_customer.next(id) }

  getidcustomer(){ return this.id_customer }

  setStep(step:boolean){ this.changeStep.next(step) }

  getStep(){ return this.changeStep }

  setStaffSelected(id_staff:string) { this.staff_selected.next(id_staff) }
  
  getStaffSelected() { return this.staff_selected }

  setStaff(staff){ this.staff.next(staff)  }

  getStaff(){ return this.staff  }

  setService(service){  this.service.next(service)  }

  setDay(day:string) { this.dateSelected.next(day) }

  getDay(): Observable<any>{ return this.dateSelected }


  getService(): Observable<any>{ return this.service }

  getStores(){
    return this.httpService.get("stores/list")
  }

  getDetail(store:string){
    return this.httpService.get(`stores/${store}/detail`)
  }

  getCategory(id_store:string){
    return this.httpService.get(`services/${id_store}/list`)
  }

  getDetailCategorie(id_store:string, id_ctg:string){
    return this.httpService.get(`services/${id_store}/detail/${id_ctg}`)
  }

  listDays(id_store:string, day:string, id_staff:string, id_service:string){
    let params : HttpParams = new HttpParams()
    .append('id_service', String(id_service))
    .append('id_staff', String(id_staff))
    .append('day', String(day));

    return this.httpService.get(`shiftreservations/schedules/${id_store}`, params)
  }

  createCustomer(id_store:string,dataCustomer:object){
    return this.httpService.post(`shiftreservations/addCustomer/${id_store}`, dataCustomer)
  }

  makeReservation(data){
    return this.httpService.post('shiftreservations', data)
  }

}

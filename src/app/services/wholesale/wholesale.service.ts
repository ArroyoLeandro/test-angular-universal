import { Injectable, Inject, PLATFORM_ID, } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http/http.service';

import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class WholesaleService {
  deliveryAddresses: BehaviorSubject<any[]> = new BehaviorSubject([])
  personalAddresses: BehaviorSubject<any[]> = new BehaviorSubject([])
  setAddress: BehaviorSubject<any> = new BehaviorSubject({})
  addressEdited: BehaviorSubject<any> = new BehaviorSubject({})
  type: BehaviorSubject<String> = new BehaviorSubject('')

  verCatalogo: BehaviorSubject<boolean> = new BehaviorSubject(false)
  constructor(
    private httpservice: HttpService,
    @Inject(PLATFORM_ID) private platformID,
  ) { }

  setType(type:string){
    this.type.next(type)
  }

  setAddressToEdit(address:object){
    this.setAddress.next(address)
  }

  getAddressToEdit(): Observable<any>{
    return this.setAddress
  }

  setAddressEdited(address){
    this.addressEdited.next(address)
  }

  getAddressEdited(): Observable<any>{
    return this.addressEdited
  }

  getType(){
    return this.type
  }

  setDeliveryAddresses(addresses, clear:boolean){
    clear ? 
    this.deliveryAddresses.next(addresses) : 
    this.deliveryAddresses.next([...this.deliveryAddresses.value, ...addresses])
  }

  setPersonalAddresses(addresses, clear:boolean){
    clear ? 
    this.personalAddresses.next(addresses) : 
    this.personalAddresses.next([...this.personalAddresses.value, ...addresses])
  }

  getDeliveryAddresses(){
    return this.deliveryAddresses
  }

  getPersonalAddresses(){
    return this.personalAddresses
  }

  setVerCatalogo(value){
    
    if(isPlatformBrowser(this.platformID)){
      localStorage.setItem('verCatalogo', value)
    }
    this.verCatalogo.next(value)
  }

  getVerCatalogo(){
    if(isPlatformBrowser(this.platformID)){
      let value =  localStorage.getItem('verCatalogo')
      this.verCatalogo.next(JSON.parse(value))
    }
    return this.verCatalogo
  }

  login(data:object){
    return this.httpservice.loginPostWithoutToken('wholesales/authenticate', data)
  }

  register(data:object){
    return this.httpservice.post('wholesales/register', data)
  }

  setPassword(data:object){
    return this.httpservice.post('setPassword', data)
  }
  
  recoverPassword(data:object){
    return this.httpservice.post('recover', data)
  }

  changePassword(data:object){
    return this.httpservice.post('changePassword', data)
  }

  addCustomer(data:object){
    return this.httpservice.post('wholesales/addCustomer', data)
  }

  getCustomer(data?:object){
    return this.httpservice.post('wholesales/getCustomer', data)
  }

  getOrders(){
    return this.httpservice.get('wholesales/my-orders')
  }

}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
import { StoresService } from 'src/app/services/stores/stores.service';

@Component({
  selector: 'app-step06',
  templateUrl: './step06.component.html',
})
export class Step06Component implements OnInit {
  @Output() status: EventEmitter<any> = new EventEmitter()

  id_store_current:string
  dateSelected: string = ''
  service:any = {}
  category:any = {}
  store:any = {}
  customer:any = {}
  hoursSelected:any = {}
  id_staff: string = ''
  id_customer:string = ''
  objectKeys = Object.keys

  constructor(
    private reservas: ReservaService,
    private stores: StoresService) { this.getId() }

  ngOnInit(): void {
    this.getstore()
    this.getcategoryselected()
    this.getService()
    this.getDaySelected()
    this.gethours()
    this.getdatacustomer()
    this.getidstaff()
    this.getidcustomer()
  }

  getId(){
    this.stores.getStoreId()
    .subscribe(async id => {
      if(id !== null && id !== "null"){
        this.id_store_current = id
      }
    })
  }

  getcategoryselected(){
    this.reservas.getcategoryselected().subscribe(ctg => this.category = ctg )
  }

  getstore(){
    this.stores.getStore().subscribe(store => this.store = store )
  }

  getService(){
    this.reservas.getService().subscribe(service =>  this.service = service )
  }

  getDaySelected(){
    this.reservas.getDay().subscribe(date => this.dateSelected = date )
  }
  
  getdatacustomer(){
    this.reservas.getdatacustomer().subscribe(customer => this.customer = customer )
  }

  getidcustomer(){
    this.reservas.getidcustomer().subscribe(customer => this.id_customer = customer )
  }

  getidstaff(){
    this.reservas.getStaffSelected().subscribe(staff => this.id_staff = staff)
  }

  gethours(){
    this.reservas.gethour().subscribe(hours =>this.hoursSelected = hours)
  }

  changeStep(){
    this.status.emit({step05: true, direction: 'forward'})
  }

  changeStepBack(){
    this.status.emit({step06: true, direction: 'back'})
  }

}

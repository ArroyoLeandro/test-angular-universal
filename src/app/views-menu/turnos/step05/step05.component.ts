import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
import { StoresService } from 'src/app/services/stores/stores.service';

@Component({
  selector: 'app-step05',
  templateUrl: './step05.component.html',
})
export class Step05Component implements OnInit {
  
  @Output() status: EventEmitter<any> = new EventEmitter()
  
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
    private stores: StoresService,
    private spiner: NgxSpinnerService,
    private alerts: AlertsService,
    private translate: TranslateService
  ) { }

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

  makeReservation(){
    this.spiner.show()
    let data = {
      id_store: this.store.id,
      id_service: this.service.id,
      id_staff: this.id_staff,
      id_customer: this.id_customer,
      day: this.dateSelected,
      start: this.hoursSelected.start,
      end: this.hoursSelected.end,
      id_service_category: this.category.id
    }
    this.reservas.makeReservation(data)
    .then(res => {
      this.changeStep()
      this.spiner.hide()
    })
    .catch(err => {
      this.alerts.alertError(this.translate.instant('alerts.salioMal'))
      this.spiner.hide()
    })
  }

  changeStepBack(){
    this.status.emit({step05: true, direction: 'back'})
  }

}

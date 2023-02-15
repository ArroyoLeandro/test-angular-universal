import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
import { StoresService } from 'src/app/services/stores/stores.service';

@Component({
  selector: 'app-step04',
  templateUrl: './step04.component.html',
})
export class Step04Component implements OnInit {
  @Output() status: EventEmitter<any> = new EventEmitter()
  Customer: FormGroup
  service:any = {}
  id_store_current:string = ''
  objectKeys = Object.keys
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private reservas: ReservaService,
    private alerts: AlertsService,
    private storeService: StoresService,
    private translate: TranslateService
  ) { 
      this.getstoreid()  
      this.createForm()
      this.getService()
  }

  ngOnInit(): void {
   
  }

  getstoreid(){
    this.storeService.getStoreId().subscribe(id => id !== null && id !== "null" ? this.id_store_current = id : null )
  }

  getService(){
    this.reservas.getService().subscribe(service => this.service = service)
  }

  createForm(){
    this.Customer = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$')]],
    })
  }

  get email(){
    return this.Customer.get('email').invalid && this.Customer.get('email').touched
  }

  get phone(){
    return this.Customer.get('phone').invalid &&  this.Customer.get('phone').touched
  }

  saveCustomer(){
    this.Customer.valid ? this.sendCustomer() : this.alerts.alertError(this.translate.instant('alerts.camposRequeridos'))
  }

  sendCustomer(){
    let customer = {
      customer: this.Customer.value
    }
    this.spinner.show()
    this.reservas.createCustomer(this.id_store_current, customer)
    .then(res => {
        this.reservas.setidcustomer(res.data.id)
        this.reservas.setdatacustomer(this.Customer.value)
        this.changeStep()
        this.spinner.hide()
    })
    .catch(err => {
      this.alerts.alertError(this.translate.instant('alerts.salioMal'))
      this.spinner.hide()
      })

  }

  changeStep(){
    this.status.emit({step04: true, direction: 'forward'})
  }
  
  changeStepBack(){
    this.status.emit({step04: true, direction: 'back'})
  }

}

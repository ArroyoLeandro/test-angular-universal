import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { GeoService } from 'src/app/services/geo/geo.service';
import { WholesaleService } from 'src/app/services/wholesale/wholesale.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Input } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
    `
      input[type=number]::-webkit-inner-spin-button, 
      input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
      }
      .formRegistro {
        max-height: 0;
      }
    `
  ],
  animations: [
    trigger('changeState', [
    state ('false', style({'max-height': '1000px', 'visibility': 'visible'})),
    state ('true', style({'max-height': '0', 'visibility': 'hidden'})),
    transition('true=>false', [animate('0.3s ease-in')]),
    transition('false=>true', [animate('0.3s ease-out')])
    ])
  ]
})
export class RegisterComponent implements OnInit {
  id_store_current:string = 'oopsie'
  @Output() emitir: EventEmitter<any> = new EventEmitter()
  error:boolean = false
  registerForm: FormGroup
  states:any[] = []
  @Input() currentState;
  constructor
  (
    private fb: FormBuilder, 
    private wholesale: WholesaleService,
    private alerts: AlertsService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private geoservice: GeoService,
    private cd: ChangeDetectorRef,
  ) {
      this.registerForm = this.fb.group({
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required]],
        company: ['', Validators.required],
        street: ['', Validators.required],
        country: ['US'],
        cpf: [''],
        zip_code: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern('^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$')]],
        state: ['', Validators.required],
        accept: [false],
        city: ['', Validators.required]
      })
  }

  get email(){
    return this.registerForm.get('email').invalid && this.registerForm.get('email').touched
  }
  
  get onlyNumbers(){
    return this.registerForm.get('phone').invalid && this.registerForm.get('phone').touched
  }

  get terms(){
    return this.registerForm.get('accept').value
  }

  ngOnInit(): void {
    this.getGeo()
  }

  getGeo(){
    let datageo = {
      alpha_2:'US',
      id_store: this.id_store_current
    }
    this.geoservice.getState(this.id_store_current, datageo)
    .then(res => {
      this.states = this.filterStates(res.data[0].provincies)
      this.cd.detectChanges()
    })
  }

  
  filterStates(data:any[]){
    data = data.map(prov => prov)
    return data
  }

  send(){
    this.registerForm.valid  ? this.doRegister() : this.alerts.alertError(this.translate.instant('alerts.camposRequeridos'))
  }

  doRegister(){
    if(!this.terms){
      this.alerts.alertError(this.translate.instant('validaciones.tyc'))
      return
    }
    this.spinner.show()
    this.wholesale.register(this.registerForm.value)
    .then(res => {
      this.emitir.emit(true)
      this.spinner.hide()
    })
    .catch(err => {
      err.data === 'unique.email' && this.alerts.alertError(this.translate.instant('alerts.correoExiste'))
      this.spinner.hide()
    })
  }
  
}

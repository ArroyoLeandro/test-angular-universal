import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { GeoService } from 'src/app/services/geo/geo.service';
import { WholesaleService } from 'src/app/services/wholesale/wholesale.service';
import { ModalComponent } from 'src/app/shared/modal/modal/modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-address',
  templateUrl: './modal-address.component.html',
  styles: [
    `
      input[type=number]::-webkit-inner-spin-button, 
      input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
      }
    `
  ]
})
export class ModalAddressComponent implements OnInit, OnDestroy {
  id_store_current:string = 'oopsie'
  states:any[] = []
  addressForm:any = {
    street: '',
    number: '',
    complement: '',
    zip_code: 0,
    coords: {
      lat: 0,
      lng: 0
    },
    city: '',
    state: 'Florida',
    country: 'US',
    district: '',
    neighborhood:'',
    house_number: '',
  }
  edit:boolean = false
  listErrors:any[] = []
  @ViewChild('modalComponent') modal:
  | ModalComponent<ModalAddressComponent>
  | undefined;
  type:string = ''
  private subscriptions: Array<Subscription> = [];
  constructor(
    private wholesale: WholesaleService,
    private alerts: AlertsService,
    private spinner: NgxSpinnerService,
    private geoservice: GeoService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService
  ) { this.getType(); this.getAddress() }

  ngOnInit(): void {
    this.getGeo()
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    this.edit = false
    this.wholesale.setAddressToEdit({})
    this.wholesale.setAddressEdited({})
  }

  getAddress(){
    this.subscriptions.push(
      this.wholesale.getAddressToEdit()
      .subscribe(address =>  {
        if(Object.keys(address).length > 0){
          this.edit = true
          this.addressForm = {
            id: address.id,
            street: address.street !== null ? address.street : '',
            number: address.number !== null ? address.number : '',
            complement: address.complement !== null ? address.complement : '',
            zip_code: address.zip_code !== null ? address.zip_code : '',
            coords: address.coords !== null ? address.coords : this.addressForm.coords,
            city: address.city !== null ? address.city : '',
            state: address.state !== null ? address.state : '',
            country: address.country !== null ? address.country : '',
            district: address.district !== null ? address.district : '',
            neighborhood: address.neighborhood !== null ? address.neighborhood : '',
            house_number: address.house_number !== null ? address.house_number : '',
          }
        }
      })
    )
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

  getType(){
    this.subscriptions.push(
      this.wholesale.getType()
      .subscribe( (type:string) => type !== '' && (this.type = type) )
    )
  }

  readErrors(){
    this.listErrors = []
    Object.entries(this.addressForm).map((value, key) => {
      if(value[1] === '' ){
        this.listErrors.push({ msg: `${this.capitalizeFirstLetter(value[0])} ${this.translate.instant('validaciones.req')}` })
      }
    })
    return this.listErrors
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  send(){
    let errors = this.readErrors()
    if(errors.length > 0){
      let errorText = ''
      errors.forEach(({msg}) => errorText = `${errorText} <br> ${msg}` )
      Swal.fire(this.translate.instant('validaciones.check'), errorText, 'error')
      return 
    }
    this.edit ? this.update() : this.save()
    this.close()
  }

  update(){
    this.wholesale.setAddressEdited(this.addressForm)
  }

  save(){
    this.type === 'personal' ? this.wholesale.setPersonalAddresses([this.addressForm], false) : this.wholesale.setDeliveryAddresses([this.addressForm], false)
  }

  async close(): Promise<void> {
    await this.modal?.close();
  }

}

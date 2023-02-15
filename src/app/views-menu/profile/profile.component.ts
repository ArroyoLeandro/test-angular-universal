import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { CartModalComponent } from 'src/app/components/cartModal/cart-modal/cart-modal.component';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { CartWholesaleService } from 'src/app/services/cartWholesale/cart-wholesale.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { WholesaleService } from 'src/app/services/wholesale/wholesale.service';
import { ModalAddressComponent } from './modalAddress/modal-address.component';
import { ModalPasswordComponent } from './modalPassword/modal-password.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
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
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('inputName') inputName: ElementRef
  disabled:boolean = true
  dataCustomer:FormGroup
  id_store_current: string = 'oopsie'
  myOrders:any[] = []
  mostrarCompra = false;
  orderActive
  default_photo : string = "https://puu.sh/ImNRs/0ab1b352dc.png";
  typeAddress:string = ''
  editing:boolean = false
  private subscriptions: Array<Subscription> = [];

  constructor(
    private modalService: ModalService<ModalPasswordComponent>,
    private wholesaleservice: WholesaleService,
    private formBuilder: FormBuilder,
    private modalAddress: ModalService<ModalAddressComponent>,
    private spinner: NgxSpinnerService,
    private alerts: AlertsService,
    private cartWholesale: CartWholesaleService,
    private cartModal: ModalService<CartModalComponent>,
    private translate: TranslateService
  ) {
    this.dataCustomer = this.formBuilder.group({
      name: [''],
      lastname: [''],
      email: [''],
      phone: [''],
      identity: [''],
      identity_type: [''],
      cpf: [''],
      delivery_addresses: [],
      addresses: []
    })
    this.listenAddressesDelivery()
    this.listenPersonalAddress()
    this.getAddress()
  }

  ngOnInit(): void {
    this.getDataCustomer()
    this.getOrders()
  }

  editingData(){
    this.editing = !this.editing
    this.editing && this.inputName.nativeElement.focus()
  }

  getAddress(){
    this.subscriptions.push(
      this.wholesaleservice.getAddressEdited()
      .subscribe(address =>  {
        if(Object.keys(address).length > 0){
          if(this.typeAddress === 'personal'){
            let newaddress = this.personalAddresses.map(direccion => direccion.id === address.id ? address : direccion)
            this.dataCustomer.patchValue({addresses: newaddress})
          }else{
            let newaddress = this.deliveryAddresses.map(direccion => direccion.id === address.id ? address : direccion)
            this.dataCustomer.patchValue({delivery_addresses: newaddress})
          }
        }
      })
    )
  }

  editAddress(i, address, type:string){
    this.typeAddress = type
    this.wholesaleservice.setAddressToEdit(address)
    this.openAddress(type)
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    this.wholesaleservice.setPersonalAddresses([], true)
    this.wholesaleservice.setDeliveryAddresses([], true)
  }

  repetir(order){
    order.products.map( prod => this.cartWholesale.addItemTocart(prod.product, prod.quantity) )
    this.openCart()
  }

  async openCart(): Promise<void> {
    const {CartModalComponent} = await import(
      'src/app/components/cartModal/cart-modal/cart-modal.component'
    );

    await this.cartModal.open(CartModalComponent);
  }

  getOrders(){
    this.spinner.show()
    this.wholesaleservice.getOrders().then(res => {
      this.myOrders = res.data.data
      this.spinner.hide()
    })
    .catch(err => {
      console.log(err)
      this.spinner.hide()
    })
  }

  listenAddressesDelivery(){
    this.subscriptions.push(
      this.wholesaleservice.getDeliveryAddresses()
      .subscribe( (delivery_addresses:any[]) => this.dataCustomer.patchValue({delivery_addresses}) )
    )
  }

  listenPersonalAddress(){
    this.subscriptions.push(
      this.wholesaleservice.getPersonalAddresses()
      .subscribe( (addresses:any[]) => this.dataCustomer.patchValue({addresses}) )
    )
  }

  get deliveryAddresses(){
    return this.dataCustomer.get('delivery_addresses').value
  }

  get personalAddresses(){
    return this.dataCustomer.get('addresses').value
  }

  deleteAddress(idx:number){
    this.deliveryAddresses.splice(idx,1)
  }

  deletePersonalAddress(idx:number){
    this.personalAddresses.splice(idx,1)
  }

  getDataCustomer(){
    let data = {
      id_store: 'oopsie'
    }
    this.wholesaleservice.getCustomer(data)
    .then(res => {
      if(res.data.name !== null || res.data.name !== "null" || res.data.name){
        this.dataCustomer.patchValue({
          name: res.data.name,
          lastname: res.data.lastname,
          phone: res.data.phone,
          email: res.data.email,
          identity: res.data.identity,
          cpf: res.data.cpf,
          identity_type: res.data.identity_type,
          delivery_addresses: res.data.delivery_addresses,
          addresses: res.data.addresses
        })
        this.wholesaleservice.setDeliveryAddresses(res.data.delivery_addresses, false)
        this.wholesaleservice.setPersonalAddresses(res.data.addresses, false)

      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  save(){
    let data = {
      id_store: this.id_store_current,
      customer: {
        ...this.dataCustomer.value
      },

    }
    this.wholesaleservice.addCustomer(data)
    .then(res => {
      this.alerts.alertTopRight(this.translate.instant('alerts.datosGuardados'))
      this.spinner.hide()
    })
    .catch(err => {
      console.log(err)
      this.spinner.hide()
    })
    this.spinner.show()
  }

  async open(): Promise<void> {
    const {ModalPasswordComponent} = await import(
      './modalPassword/modal-password.component'
    );

    await this.modalService.open(ModalPasswordComponent);
  }

  async openAddress(type:string): Promise<void> {
    const {ModalAddressComponent} = await import(
      './modalAddress/modal-address.component'
    );
    this.wholesaleservice.setType(type)
    await this.modalAddress.open(ModalAddressComponent);
  }

  toggleAccordian(event, index) {
    var element = event.target;
    element.classList.toggle("active");
    if(this.myOrders[index].isActive) {
      this.myOrders[index].isActive = false;
    } else {
      this.myOrders[index].isActive = true;
    }
    var panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

}

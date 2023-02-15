import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { GeoService } from 'src/app/services/geo/geo.service';
import { PromotionsService } from 'src/app/services/promotions/promotions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout05',
  templateUrl: './checkout05.component.html',
  styleUrls: ['./checkout05.component.scss']
})
export class Checkout05Component implements OnInit {

  @Input() id_store_current:string ="";
  @Input() promotionInfo:any =[];

  public step: number = 1;
  public minValDelivery= 899 ;
  public modalThanks: boolean = false;

  public mountGift = 0;

  public showProductListPromotion: boolean = true;
  public modalGiftType: number = 0;
  public modalGift: boolean = false;
  public modalType1Opcion: string = "1";
  public temporalSelect: any = [-1, -1];
  public temporalIndex: number = -1;
  public Promo1: number = 0;
  public Promo2: number = 0;
  products_promo:any[] = []
  public listPromo1: any = [];
  public listPromo2: any = [];
  provincias: any[] = [];
  ciudades: any[] = [];

  public confirmFlete: boolean = false;
  public numberCard: any = "";
  public modoEntrega: any = "1";
  public validCard: boolean = false;
  public insertedCard: any = "";
  public cardList: any = ['visa', 'master', 'diners', 'american', 'discover', 'hipercard', 'elo', 'jcb'];
  public cart: any[] = [];
  public cart_temporal: any[] = [];
  public obsequios:any[] = [];
  public cartTotal: any;
  public envio: number = 0;

  public cardMonth: string = '12';
  public cardYear: string = '2021';
  public tyc:boolean = false;
  public years: any[] = [];
  public months: any[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  public quotas: any[] = [];
  public estados: string[] = ['AC', 'AL', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
  public orderForm: any = {
    id_store: '',
    customer: {
      name: '',
      lastname: '',
      email: '',
      phone: '',
      cpf: '',
    },
    payment: {
      id_payment: 'lukacol',
      installments: 1
    },
    products: [
      { product: '', variation: { sku: '', cod: '', quantity: 0 } }
    ]
  };
  public deliveryAddress: any = {
    type: '',
    street: '',
    number: '-',
    complement: '-',
    zip_code: '',
    city: '',
    state: '',
    country: 'COL',
    district: '-',
    cep: '0000',
    endereco: '',
    neighborhood: ''
  }

  public store:any = {}

  objectKeys = Object.keys

  default_photo : string = "https://puu.sh/ImNRs/0ab1b352dc.png";
  constructor
  (
    @Inject(PLATFORM_ID) private platformID,
    private cartService: CartService,
    private promos: PromotionsService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private checkoutService: CheckoutService,
    private alerts: AlertsService,
    private geoservice: GeoService,
    private translate: TranslateService
  ) { 
  
  }

  ngOnInit(): void {
    this.getCart()
    this.getTotalCart()
    this.getStore()
    this.revisarPromo5Core()
    this.getGeo()
  }


  getGeo(){
    let datageo = {
      alpha_2:'CO',
      id_store: this.id_store_current
    }
    this.geoservice.getState(this.id_store_current, datageo)
    .then(res => {
      this.provincias= res.data[0].provincies;
      this.ciudades = res.data[0].provincies[0].cities;
      this.deliveryAddress.state= res.data[0].provincies[0].iso_code;
      this.deliveryAddress.city= res.data[0].provincies[0].cities[0].code;
    })
  }

  changeState(value){
    let cities = this.provincias.filter( prov => prov.iso_code === value )
    this.ciudades = cities[0].cities
  }

  getCart(){
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart
      this.cart_temporal = cart
    })
  }

  getTotalCart(){
    // this.cartService.getCartTotal().subscribe(total => {
    //   this.cartTotal = total
    //   let aux = Math.floor(this.cartTotal / 100)
    //   if(aux <= 1) aux = 1
    //   if(aux >= 10) aux = 10
    //   for (let i = 1; i <= aux ; i++) { this.quotas.push(i) }
    //   let currentYear = new Date().getFullYear() + 20
    //   for( let i = currentYear - 20; i <= currentYear ; i++ ){ this.years.push(String(i)) }
    // })
  }

  getStore(){
    if(isPlatformBrowser(this.platformID)){
      this.store = JSON.parse(localStorage.getItem('store'))
    }
    if(Object.keys(this.store).length > 0) this.modoEntrega = this.store.has_delivery ? '1' : (this.store.pickup ? '2' : '0');
  }

  async revisarPromo5Core() {
    let productPromo = 0; 
    let products_promo=[];
    for (var i = 0; i < this.cart_temporal.length; i++) {
      let __cart = this.cart_temporal[i];
      let __it = i;
      let cantidad = await this.promos.isProductInPromotion(this.id_store_current, this.cart_temporal[i].product.sku).then((res2) => {

        if (res2.state == "success") {

          if (res2.data.length != 0) {
            let productos_promos = res2.data;
            for (var j = 0; j < productos_promos.length; j++) {
              if (__cart.variation.cod == productos_promos[j].cod) {

                for (var c = 0; c < __cart.variation.quantity; c++) {
                products_promo.push({position:__it,product:__cart,price:__cart.variation.price});
                }
                return __cart.variation.quantity;
              }

            }
          }
        }
      }).catch((error) => {
        return false;
      });
      if (cantidad != undefined)
        productPromo += Number(cantidad);

    }
    this.obsequios=[];
    products_promo=products_promo.sort(this.menorPrice);
    var freeProducts = Math.floor(products_promo.length / 3);
    for (var c = 0; c < freeProducts; c++) {
      this.cart_temporal[products_promo[c].position].variation.quantity -=1;
      this.obsequios.push(products_promo[c].product);
      this.cartTotal-=products_promo[c].price;
      }
      this.cart_temporal=this.cart_temporal.filter( x => x.variation.quantity>0);
      this.spinner.hide();

  }

  menorPrice(a,b){
    if ( a.price  < b.price ) return -1;
    if (  a.price >  b.price  ) return 1;
    return 0;
  }


  checkMail(){
    let auxForm = { email: this.orderForm.customer.email };
    this.spinner.show();
    this.checkoutService.getCustomer(this.id_store_current, auxForm)
    .then((response) => {
        this.orderForm.customer.name = response.data.name;
        this.orderForm.customer.lastname = response.data.lastname;
        this.orderForm.customer.cpf = response.data.cpf;
        this.orderForm.customer.phone = response.data.phone;
        this.spinner.hide();
    }).catch((error) => {
        this.spinner.hide();
    });
  }

  changeStep(stepval) {
    this.step = stepval;
  }

  goToDeliveryData(){
    if(this.validatePersonalData()){
      let auxForm = { customer: this.orderForm.customer };
      this.checkoutService.addCustomer(this.id_store_current, auxForm)
      .then(res => this.step = 2)
      .catch(err => this.alerts.alertError(this.translate.instant('alerts.chequearDatos')) )
    }
    return
  }

  goToPaymentData(){

    if(this.validateDeliveryData()){
      const provincia = this.provincias.find(element => element.iso_code === this.deliveryAddress.state )
      const ciudad = this.ciudades.find( element => element.code === this.deliveryAddress.city );
      this.alerts.confirmAddress(provincia.state, ciudad.name,this.deliveryAddress.street, this.deliveryAddress.destinatario)
      .then(result => {
        if(result.isConfirmed){
          this.orderForm.id_store = this.id_store_current
          this.orderForm.customer.id_delivery = 'coordinadora'
          this.orderForm.customer.deliveryAddress = this.deliveryAddress
          let sendProducts:any[] = []
          this.cart.forEach(cart => {
            sendProducts.push( { product: cart.product.sku, variation: { product_sku: cart.variation.product_sku, quantity: cart.variation.quantity } } )
          })
          if(isPlatformBrowser(this.platformID)){
            if(!(localStorage.getItem('user_reference') == null)){
               this.orderForm.id_seller=localStorage.getItem('user_reference');
            }
          }
          this.orderForm.products = sendProducts;
          this.spinner.show()
          this.getCost(sendProducts)
        }
      })


    }
    return
  }

  goToPaymentDataPick(){
    if(this.validatePersonalData()){
      let auxForm = { customer: this.orderForm.customer };
      this.checkoutService.addCustomer(this.id_store_current, auxForm)
      .then(res => {
        this.step = 3
        this.spinner.show()
        this.makeOrder()
      }).catch(err => {
        this.alerts.alertError(this.translate.instant('alerts.chequearDatos'))
      })
    }
  }

  getCost(sendProducts){
        this.checkoutService.getCost(this.id_store_current, { id_store: this.id_store_current, id_delivery: 'coordinadora', address: this.deliveryAddress, cost: this.cartTotal,products: sendProducts})
        .then((response2) => {
          if (response2.state == "success") {
            this.envio = response2.data;
            this.step = 3;
            this.confirmFlete = true;
            this.spinner.show();
            this.makeOrder();
          } else {
            this.spinner.hide();
            let message: any = {
              icon: '',
              title: '',
              text: ''
            };

            if (response2.data.code == 303) {
              message = {
                icon: 'warning',
                title: 'Oops...',
                text: this.translate.instant('alerts.noentregasdireccion')
              };
            }
            else if (response2.data.code == 314) {
              message = {
                icon: 'warning',
                title: 'Oops...',
                text: this.translate.instant('alerts.pagorechazado')
              };
            }
            else {
              message = {
                icon: 'error',
                title: 'Oops...',
                text: this.translate.instant('alerts.datosDireccion')
              };
            }

            Swal.fire(message);
          }
        }).catch((error) => {
          this.spinner.hide();
          this.alerts.alertError(this.translate.instant('alerts.datosDireccion'))
        });
  }

  makeOrder(){

    this.orderForm.id_store = this.id_store_current;
    if (!this.orderForm.id_store) return false
    this.orderForm.payment.id_payment = 'lukacol';
    let sendProducts: any[] = [];
    this.cart.forEach(c => sendProducts.push({ product: c.product.sku, variation: { product_sku: c.variation.product_sku, quantity: c.variation.quantity } }) )
  
    if(isPlatformBrowser(this.platformID)){
      if(!(localStorage.getItem('user_reference') == null)){
         this.orderForm.id_seller=localStorage.getItem('user_reference');
      }
    }

    this.orderForm.products = sendProducts;
    let order = this.orderForm;

    this.checkoutService.makeOrder(order)
    .then((response) => {
      if (response.state == "success") {
        if(isPlatformBrowser(this.platformID)){
          var link = document.createElement('a');
        }
        link.href = response.data;
        link.target="_self";
        link.dispatchEvent(new MouseEvent('click'));
      } else {
        this.spinner.hide();
        if (response.data.code >= 300 && response.data.code <= 304) {
          this.alerts.alertError(this.translate.instant('alerts.noStock'))
        }
      }
    }).catch((error) => {
      this.spinner.hide();
      this.alerts.alertError(this.translate.instant('alerts.contactarAsesor'))
    });

  }


  private async validateDeliveryData() {
    if (this.deliveryAddress.endereco != '') {
      if (this.deliveryAddress.number == '') {
        return false;
      }

      if (this.deliveryAddress.complement == '') {
        return false;
      }

      if (this.deliveryAddress.neighborhood == '') {
        return false;
      }

      if (this.deliveryAddress.city == '') {
        return false;
      }

      if (this.deliveryAddress.state == '') {
        return false;
      }

      if (this.deliveryAddress.cep == '') {
        return false;
      }
      return true;
    }
  }

  private validatePersonalData(): boolean {

    if (!this.orderForm.customer.name) {
      this.alerts.alertError(this.translate.instant('validaciones.nombreObligatorio'));
      return false;
    }

    if (!this.orderForm.customer.lastname) {
      this.alerts.alertError(this.translate.instant('validaciones.apellidosObligatorios'));
      return false;
    }

    if (!this.tyc) {
      this.alerts.alertError(this.translate.instant('validaciones.tyc'));
      return false;
    }


    if (!this.orderForm.customer.email) {
      return false;
    } else if (!this.validateEmail(this.orderForm.customer.email)) {
      this.alerts.alertError(this.translate.instant('validaciones.emailValido'));
      return false;
    }

    if (!this.orderForm.customer.cpf) {
      this.alerts.alertError(this.translate.instant('validaciones.nitObligatorio'));
      return false;
    }

    if (!this.orderForm.customer.phone) {
      this.alerts.alertError(this.translate.instant('validaciones.tlfObligatorio'));
      return false;
    }

    return true;
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


}

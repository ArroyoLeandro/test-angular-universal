import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartWholesaleService } from 'src/app/services/cartWholesale/cart-wholesale.service';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { GeoService } from 'src/app/services/geo/geo.service';
import { PromotionsService } from 'src/app/services/promotions/promotions.service';
import { WholesaleService } from 'src/app/services/wholesale/wholesale.service';
import { ModalComponent } from 'src/app/shared/modal/modal/modal.component';
import Swal from 'sweetalert2';
import { CartModalComponent } from '../../cartModal/cart-modal/cart-modal.component';
import * as cardValidator from 'card-validator';
import { StoresService } from 'src/app/services/stores/stores.service';
import { FilesService } from 'src/app/services/files/files.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalService } from 'src/app/services/modal/modal.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-checkout00',
  templateUrl: './checkout00.component.html',
  styleUrls: ['./checkout00.component.scss'],
})
export class Checkout00Component implements OnInit, OnDestroy {
  @Output() emitCloseModal: EventEmitter<boolean> = new EventEmitter(false);
  public cuidades = [
    'CHORRERA',
    'ARRAIJN',
    'PANAA PACIFICO',
    'PENONOME',
    'CHITE',
    'COSA VERDE',
    'DAVID',
    'SANTIAO',
    'CHANGUINOA (UNO EXPRES)',
    'FRONTERA (UNO EXPRES)',
    'PTO ARMUELLES (UO EXPRESS)',
    'BUGABA (UNO EXPRES)',
    'BOQUETE (UNO EXPRES)',
    'VOLCAN (UNO EXPRES)',
    'AGUADULCE (UNO EXPRES)',
    'PEDASI (UNO EXPRES)',
    'TORTI (UNO EXPRES)',
    'LAS TABLAS (UO EXPRESS)',
    'GORGONA (UNO EXPRES)',
    'EL CHORRILLO',
    'BALBOA',
    'ALBROK',
    'CALIDONA',
    'L CANGREJO',
    'OBARRIO',
    'PUNA PAITILLA',
    '12 DE OCTUBE',
    'RIO ABAJO',
    'CHANIS ',
    'COSA DEL ESE',
    'ALTOS DE PANAA',
    'SAN MIGUELITO',
    'VILLA LUCRE',
    'COLINAS DE CERO VIENTO',
    'CIUDAD DEL SABR',
    'CLAYTON',
    'AMADR',
    'COROZL',
    'BELA VISTA',
    'PUNTA PACIFICA',
    'HATO PINTADO',
    'CARDENAS',
    'LLANS DE CURUNU',
    'LOS RIOS',
    'CASCO VIEJO',
    'LA CRESTA',
    'LA LOCERIA',
    'EDISON PARK',
    'LOS ANGELES',
    'EL CARMEN',
    'LA ALAMEDA',
    'VILLA DE LS FUENTE',
    'LAS MERCES',
    'EL DORADO',
    'CARRASQUILLA',
    'VISA HERMOSA',
    'ALTOS DEL GOF',
    'COCO DEL MR',
    'BOCA LA CAA',
    'ANCON',
    'ALTOS DEL GOF',
    'LA PORQUERIZA',
    'DORADO SPRING',
    'CONDADO DEL RY',
    'CAMPO LIMBERGH',
    'CIUDAD RADIAL',
    'BRISAS DEL GOF ',
    'ALTAMIRA',
    'BRISS DEL PACIFIO',
    'LAS ACACIAS',
    'VERSALLES',
    'PARQE REAL',
    'LA RIVIERA',
    'MAÑANITAS',
    'TOCUMN HASTA ESTACIN HOSPITAL DEL ESTE',
    'PUEBLO NUEVO',
    'SAN ANTONIO',
    'SAN FRANCISCO',
    'CERRO VIENTO',
    'EL CRISOL',
    'SANTA MARÍA',
    'LLANO BONITO',
    'PANAMA VIEJO',
    'PEDREGAL',
  ];

  @ViewChild('inputFile') public inputFile: ElementRef<HTMLElement>;

  cardForm: any = {
    name: '',
    cvv: '',
    cardNumber: '',
    maxLength: 16,
    maxCvvLength: 3,
    validationRes: null,
    imask: { mask: '000000' },
    expirationDate: '',
  };
  isPdf: boolean = false;
  @ViewChild('modalComponent') modal:
    | ModalComponent<CartModalComponent>
    | undefined;

  @Input() id_store_current: string = '';
  @Input() promotionInfo: any = [];

  public step: number = 1;
  public minValDelivery = 899;
  public modalThanks: boolean = false;

  public mountGift = 0;

  public showProductListPromotion: boolean = true;
  public modalGiftType: number = 0;
  public modalGift: boolean = false;
  public modalType1Opcion: string = '1';
  public temporalSelect: any = [-1, -1];
  public temporalIndex: number = -1;
  public Promo1: number = 0;
  public Promo2: number = 0;
  products_promo: any[] = [];
  public listPromo1: any = [];
  public listPromo2: any = [];
  provincias: any[] = [];
  ciudades: any[] = [];
  public confirmFlete: boolean = false;
  public numberCard: any = '';
  public modoEntrega: any = '1';
  public validCard: boolean = false;
  public insertedCard: any = '';
  public cardList: any = [
    'visa',
    'master',
    'diners',
    'american',
    'discover',
    'hipercard',
    'elo',
    'jcb',
  ];
  public cart: any[] = [];
  public cart_temporal: any[] = [];
  public obsequios: any[] = [];
  public cartTotal: any;
  public envio: number = 0;
  public cardMonth: string = '12';
  public cardYear: string = '2021';
  public tyc: boolean = false;
  public years: any[] = [];
  public months: any[] = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  public quotas: any[] = [];
  public estados: string[] = [
    'AC',
    'AL',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ];
  public orderForm: any = {
    id_store: '',
    id_customer: '',
    customer: {
      name: '',
      lastname: '',
      email: '',
      phone_ws: '',
      phone_order: '',
      cpf: '',
      company: '-',
    },
    payment: {
      id_payment: 'stripe',
      installments: 1,
    },
    products: [{ product: '', variation: { sku: '', cod: '', quantity: 0 } }],
  };
  public deliveryAddress: any = {
    type: '',
    street: '',
    number: '-',
    complement: '-',
    zip_code: '',
    city: '-',
    state: '0',
    country: 'PAN',
    district: '-',
    cep: '0000',
    endereco: '',
    neighborhood: '',
    destinatario: '',
  };
  listAddresses: any[] = [];
  chooseAddress: boolean = false;
  id_address: string = '';
  public store = null
  metodos_payment: any[] = [];
  methodPayment: string = '';
  objectKeys = Object.keys;
  default_photo: string = 'https://puu.sh/ImNRs/0ab1b352dc.png';
  isAuth: boolean = false;
  showMethods: boolean = false;
  states: any[] = [];
  url_comprobante: string | any = '';
  ref: string = '';
  existsCustomer: boolean = false;
  listPersonalized: any[] = [];
  id_personalized: number;
  private subscriptions: Array<Subscription> = [];
  dataPayment: any = {};
  constructor(
    @Inject(PLATFORM_ID) private platformID,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private geoservice: GeoService,
    private spinner: NgxSpinnerService,
    private alerts: AlertsService,
    private translate: TranslateService,
    private auth: AuthService,
    private cartWholesale: CartWholesaleService,
    private wholesaleservice: WholesaleService,
    private cd: ChangeDetectorRef,
    private stores: StoresService,
    private fileService: FilesService,
    private sanitizer: DomSanitizer,
    private modalService: ModalService<any>
  ) {}

  async open(type: string): Promise<void> {
    this.emitCloseModal.emit(true);
    this.modalService.setType(type);
    // this.cartService.showPopUp(true)
    if(isPlatformBrowser(this.platformID)){
      this.store = JSON.parse(localStorage.getItem('store'));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
    this.modalService.setCerrar(false);
  }

  validate() {
    this.cardForm.validationRes = cardValidator.number(
      this.cardForm.cardNumber
    );
    if (this.cardForm.validationRes.card) {
      this.cardForm.maxLength =
        this.cardForm.validationRes.card?.lengths?.pop() +
        this.cardForm.validationRes.card?.gaps.length;
      this.cardForm.maxCvvLength = this.cardForm.validationRes.card?.code.size;
      let maskArray = new Array(this.cardForm.maxLength).fill('0');
      this.cardForm.validationRes.card?.gaps.reverse().forEach((gap) => {
        maskArray.splice(gap, 0, ' ');
      });
      this.cardForm.imask = { mask: maskArray.join('') };
    } else {
      this.cardForm.maxLength = 16;
    }
  }

  changeStates(method: string, custom?) {
    !custom &&
      (this.dataPayment = this.metodos_payment.find(
        (metodo) => String(metodo.model) == String(method)
      ));
    custom &&
      (this.dataPayment = this.metodos_payment.find(
        (metodo) => String(metodo.name) == String(custom)
      ));
    // console.log(this.dataPayment);
    this.methodPayment = method;
    this.modoEntrega == 1 && this.getCost();
    if (method === 'stripe') {
      this.changeStep(5);
      this.showMethods = false;
    }
  }

  ngOnInit(): void {
    this.modalService.setCerrar(false);

    this.checkCartNormal();
    this.getPaymentMethods();
    // this.getGeo();
    this.getListPersonalized();
    // console.log('0')
  
  }

  getDataPayments() {}

  getListPersonalized() {
    this.checkoutService
      .getListPersonalized(this.id_store_current)
      .then((res) => {
        this.listPersonalized = res.data;
        this.listPersonalized = this.listPersonalized.filter(
          (item) => this.cartTotal >= item.min_cost
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getPaymentMethods() {
    this.subscriptions.push(
      this.stores.getStore().subscribe(({ payments }) => {
        this.metodos_payment = payments;
        // console.log(this.metodos_payment);
      })
    );
  }

  getDataCustomer() {
    let data = {
      id_store: this.id_store_current,
    };
    this.wholesaleservice
      .getCustomer(data)
      .then((res) => {
        console.log('getCustomer res:',res)
        this.orderForm.customer.email = res.data.email;
        this.orderForm.customer.name = res.data.name;
        this.orderForm.customer.lastname = res.data.lastname;
        this.orderForm.customer.cpf = res.data.cpf;
        this.orderForm.customer.phone_ws = res.data.phone;
        this.listAddresses = [
          ...res.data.addresses,
          ...res.data.delivery_addresses,
        ];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  checkAuth() {
    this.check();
    this.isAuth && this.getDataCustomer();
  }

  check() {
    this.checkCartNormal();
  }

  checkCartNormal() {
    this.cartService.getCart().subscribe((cart: any) => {
      this.cart = cart;
      this.getTotalCart();
    });
  }

  checkCartWholesale() {
    this.cartWholesale.getCart().subscribe((cart: any) => {
      this.cart = cart;
      this.getTotalCartWholesale();
    });
  }

  getGeo() {
    let datageo = {
      alpha_2: 'PA',
      id_store: this.id_store_current,
    };
    this.geoservice.getState(this.id_store_current, datageo).then((res) => {
      this.states = this.filterStates(res.data[0].provincies);
      this.cd.detectChanges();
    });
  }

  filterStates(data: any[]) {
    data = data.map((prov) => prov);
    return data;
  }

  changeState(value) {
    let cities = this.provincias.filter((prov) => prov.iso_code === value);
    this.ciudades = cities[0].cities;
  }

  getTotalCart() {
    this.cartTotal = this.cartService.getCartTotal();
    let aux = Math.floor(this.cartTotal / 100);
    if (aux <= 1) aux = 1;
    if (aux >= 10) aux = 10;
    for (let i = 1; i <= aux; i++) {
      this.quotas.push(i);
    }
    let currentYear = new Date().getFullYear() + 20;
    for (let i = currentYear - 20; i <= currentYear; i++) {
      this.years.push(String(i));
    }
  }

  getTotalCartWholesale() {
    this.cartTotal = this.cartWholesale.getCartTotal();
    let aux = Math.floor(this.cartTotal / 100);
    if (aux <= 1) aux = 1;
    if (aux >= 10) aux = 10;
    for (let i = 1; i <= aux; i++) {
      this.quotas.push(i);
    }
    let currentYear = new Date().getFullYear() + 20;
    for (let i = currentYear - 20; i <= currentYear; i++) {
      this.years.push(String(i));
    }
  }

  // change step
  changeStep(stepval) {
    this.step = stepval;
    this.step == 1 && (this.methodPayment = '');
  }

  // check email
  checkMail() {
    this.modalService.setCerrar(true);
    let auxForm = { email: this.orderForm.customer.email };
    this.spinner.show();
    this.checkoutService
      .getCustomer(this.id_store_current, auxForm)
      .then((response) => {
        // console.log('resdata',response.data)
        
        if (response.data.length !== 0) {
          this.existsCustomer = true;
          this.orderForm.customer.name = response.data.name;
          this.orderForm.customer.lastname = response.data.lastname;
          this.orderForm.customer.cpf = response.data.cpf;
          this.orderForm.customer.phone_ws = response.data.phones[0].phone;
          this.orderForm.customer.company = '-';
          this.orderForm.id_customer = response.data.id;
        }
        this.spinner.hide();
      })
      .catch((error) => {
        this.spinner.hide();
      });
  }

  // validaciones
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

  private validatePersonalData(check?: boolean): boolean {
    if (!this.orderForm.customer.name) {
      this.alerts.alertError(
        this.translate.instant('validaciones.nombreObligatorio')
      );
      return false;
    }

    if (!this.orderForm.customer.lastname) {
      this.alerts.alertError(
        this.translate.instant('validaciones.apellidosObligatorios')
      );
      return false;
    }

    if (!this.tyc) {
      this.alerts.alertError(this.translate.instant('validaciones.tyc'));
      return false;
    }

    if (!this.orderForm.customer.email) {
      return false;
    } else if (!this.validateEmail(this.orderForm.customer.email)) {
      this.alerts.alertError(
        this.translate.instant('validaciones.emailValido')
      );
      return false;
    }

    // if (!this.orderForm.customer.cpf) {
    //   this.alerts.alertError(
    //     this.translate.instant("validaciones.nitObligatorio")
    //   );
    //   return false;
    // }

    if (!this.orderForm.customer.phone_ws) {
      this.alerts.alertError(
        this.translate.instant('validaciones.tlfObligatorio')
      );
      return false;
    }
    if (check) {
      this.showMethods = true;
      this.step = 4;
    }
    return true;
  }

  validateEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // proceso de pagos
  goToDeliveryData() {
    if (this.validatePersonalData()) {
      let auxForm = { customer: this.orderForm.customer };
      this.checkoutService
        .addCustomer(this.id_store_current, auxForm)
        .then((res) => (this.step = 2))
        .catch((err) =>
          this.alerts.alertError(this.translate.instant('alerts.chequearDatos'))
        );
    }
    return;
  }

  goToPaymentDataPick() {
    if (this.validatePersonalData()) {
      let auxForm = { customer: this.orderForm.customer };
      this.checkoutService
        .addCustomer(this.id_store_current, auxForm)
        .then((res) => {
          this.step = 3;
          this.spinner.show();

          this.makeOrder();
        })
        .catch((err) => {
          this.alerts.alertError(
            this.translate.instant('alerts.chequearDatos')
          );
        });
    }
  }

  goToListDelivery() {
    if (this.validatePersonalData()) {
      this.chooseAddress = true;
      this.step = 3;
    }
    return;
  }

  makeOrder(dataProducts?: any) {
    if (
      this.methodPayment === 'custompayment' &&
      this.dataPayment.voucher_required &&
      !this.url_comprobante
    ) {
      return this.alerts.alertError('Debe ingresar un comprobante');
    }

    dataProducts && (dataProducts.delivery_price = this.envio);
    let customer: any = {};
    let data: any = {};
    if (!dataProducts) {
      let id_share = ''
      if(isPlatformBrowser(this.platformID)){
       id_share = localStorage.getItem('id_share');
      }
      id_share !== null && (data.id_share = id_share);
      let user_reference = ''
      if(isPlatformBrowser(this.platformID)){
        user_reference = localStorage.getItem('user_reference');
      }
      user_reference !== null && (data.id_seller = user_reference);
      this.orderForm.id_store = this.id_store_current;
      let products: any[] = [];
      this.cart.map((product) => {
        products.push({
          product: product.variation.product_sku,
          quantity: product.variation.quantity,
        });
      });
      data.id_store = this.id_store_current;
      data.customer = this.orderForm.customer;
      //aca cambia
      this.orderForm.customer.phone_order = this.orderForm.customer.phone_ws
      //igual otra vez
      this.existsCustomer && (data.id_customer = this.orderForm.id_customer);
      if (this.modoEntrega == 1) {
        data.id_delivery = this.listPersonalized.length === 0 ? 'own' : 'personalized';
        data.delivery_price = this.envio;
      }
      data.id_payment = this.methodPayment;
      if (
        this.methodPayment === 'transfer' ||
        this.methodPayment === 'custompayment'
      ) {
        data.id_payment_custom = this.dataPayment.id_number;
        data.payment_response = {
          url: this.url_comprobante,
          information: this.ref,
        };
      }
      this.modoEntrega == 1 && (data.delivery_addresses = this.deliveryAddress);
      data.products = products;
      this.listPersonalized.length > 0 &&
        this.modoEntrega == 1 &&
        (data.id_personalized = this.id_personalized);
      this.listPersonalized.length > 0 &&
        this.modoEntrega == 1 &&
        (data.id_delivery_personalized = this.id_personalized);
      // data.id_payment =  this.isAuth ? this.methodPayment : 'stripe'
      if (!this.checkDataCreditCard(data.id_payment))
        return this.alerts.alertError(
          this.translate.instant('formStripe.error')
        );
      if (this.methodPayment === 'stripe' || data.id_payment === 'stripe') {
        data.payment = {
          type: 'CreditCard',
          installments: 1,
          card: {
            cardNumber: this.cardForm.cardNumber.trim(),
            holder: this.cardForm.name,
            expirationDate: this.cardForm.expirationDate,
            securityCode: this.cardForm.cvv,
            brand: this.cardForm.validationRes.card.niceType,
          },
        };
      }
    }
    if (this.isAuth) {
      this.modalService.setCerrar(false);
      this.spinner.show();
      this.checkoutService
        .makeOrderWholesale(
          Object.keys(dataProducts).length > 0 ? dataProducts : data
        )
        .then((response) => {
          this.cartWholesale.setInfoCompra(
            Object.keys(dataProducts).length > 0 ? dataProducts : data
          );
          this.cartWholesale.clear();
          this.alerts.alertTopRight(
            this.translate.instant('checkout.exitoCompra')
          );
          this.spinner.hide();
        })
        .catch((error) => {
          this.spinner.hide();
          this.alerts.alertError(
            this.translate.instant('alerts.contactarAsesor')
          );
        });
    } else {
      this.spinner.show();
      this.checkoutService
        .makeOrder(data)
        .then((response) => {
          this.cartService.setInfoCompra(data);
          this.cartService.clear();
          this.alerts.alertTopRight(
            this.translate.instant('checkout.exitoCompra')
          );
          this.spinner.hide();
        })
        .catch((error) => {
          error.data === 303 &&
            this.alerts.alertError('Producto no disponible');
          this.spinner.hide();
        });
    }
  }

  checkDataCreditCard(method?: string): Boolean {
    if (this.methodPayment === 'stripe' || method === 'stripe') {
      if (
        this.cardForm.cardNumber.trim() === '' ||
        this.cardForm.cardNumber.trim() === '' ||
        this.cardForm.name.trim() === '' ||
        this.cardForm.expirationDate.trim() === '' ||
        this.cardForm.cvv.trim() === ''
      ) {
        return false;
      }
      return true;
    } else {
      return true;
    }
  }

  goToPaymentData() {
    let products: any[] = [];
    this.cart.map((product) => {
      products.push({
        product: product.variation.product_sku,
        quantity: product.variation.quantity,
      });
    });
    if (this.validateDeliveryData()) {
      let data: any = {};
      let id_share = null
      let user_reference = null
      if(isPlatformBrowser(this.platformID)){
        id_share = localStorage.getItem('id_share');
        user_reference = localStorage.getItem('user_reference');
      }
      id_share !== null && (data.id_share = id_share);
      user_reference !== null && (data.id_seller = user_reference);
      this.orderForm.id_store = this.id_store_current;
      data.id_store = this.id_store_current;
      this.existsCustomer && (data.id_customer = this.orderForm.id_customer);
      data.customer = this.orderForm.customer;
      data.id_delivery =
        this.listPersonalized.length === 0 ? 'own' : 'personalized';
      data.payment_response.process = {
        method: this.methodPayment,
        brand: null,
        dateTime: this.transformDate(),
        authorizationCode: null,
        cardNumber: null,
        file: this.url_comprobante,
        ref: this.ref,
        reasonDescription: 'Description',
        uuid: new Date().valueOf(),
      };
      this.isAuth && this.chooseAddress
        ? (data.id_address = this.id_address)
        : (data.addresses = this.deliveryAddress);
      !this.isAuth && (data.delivery_addresses = this.deliveryAddress);
      data.products = products;
      data.id_payment = this.isAuth ? this.methodPayment : 'stripe';
      if (!this.checkDataCreditCard(data.id_payment))
        return this.alerts.alertError(
          this.translate.instant('formStripe.error')
        );
      if (this.methodPayment === 'stripe' || data.id_payment === 'stripe') {
        data.payment = {
          type: 'CreditCard',
          installments: 1,
          card: {
            cardNumber: this.cardForm.cardNumber.trim(),
            holder: this.cardForm.name,
            expirationDate: this.cardForm.expirationDate,
            securityCode: this.cardForm.cvv,
            brand: this.cardForm.validationRes.card.niceType,
          },
        };
      }
      this.makeOrder(data);
    }
    return;
  }

  checkAddress(address) {
    !address.district && (address.district = '-');
    !address.cep && (address.cep = '0000');
    !address.number && (address.number = '-');
    this.deliveryAddress = address;
  }

  getCost() {
    this.spinner.show();
    !this.deliveryAddress.number ? 40024 : this.deliveryAddress.number;
    // console.log(this.deliveryAddress);
    let products: any[] = [];
    this.cart.map((product) => {
      products.push({
        product: product.variation.product_sku,
        quantity: product.variation.quantity,
      });
    });
    let cost: any = {
      id_store: this.id_store_current,
      id_delivery: this.listPersonalized.length === 0 ? 'own' : 'personalized',
      address: this.deliveryAddress,
      cost: this.cartTotal,
      products: products,
    };
    if (this.listPersonalized.length > 0) {
      cost = {
        ...cost,
        id_personalized: this.id_personalized,
      };
    }
    this.checkoutService
      .getCost(this.id_store_current, cost)
      .then((response2) => {
        if (response2.state == 'success') {
          this.envio = response2.data.data === 0 ? 0 : Number(response2.data);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          let message: any = {
            icon: '',
            title: '',
            text: '',
          };

          if (response2.data.code == 303) {
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.noentregasdireccion'),
            };
          } else if (response2.data.code == 314) {
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.pagorechazado'),
            };
          } else {
            message = {
              icon: 'error',
              title: 'Oops...',
              text: this.translate.instant('alerts.datosDireccion'),
            };
          }

          Swal.fire(message);
        }
      })
      .catch((error) => {
        this.spinner.hide();
        this.alerts.alertError(this.translate.instant('alerts.datosDireccion'));
      });
  }

  // manejo del comprobante

  handleImg(event) {
    this.fileService.handleImg(event).then((res: string) => {
      if (res !== undefined) {
        this.url_comprobante = res;
        if (this.url_comprobante.includes('pdf')) {
          this.isPdf = true;
          this.url_comprobante =
            this.sanitizer.bypassSecurityTrustResourceUrl(res);
        } else {
          this.isPdf = false;
        }
      }
    });
  }

  simulateClick() {
    let el: HTMLElement = this.inputFile.nativeElement;
    el.click();
  }

  // fin manejo comprobante

  transformDate(): String {
    let date_ob = new Date();

    // adjust 0 before single digit date
    let date = ('0' + date_ob.getDate()).slice(-2);

    // current month
    let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return (
      year +
      '-' +
      month +
      '-' +
      date +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    );
  }
}

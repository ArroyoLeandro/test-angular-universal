import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BrazilPipe } from 'src/app/pipes/brazil.pipe';
import { CartService } from 'src/app/services/cart/cart.service';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { GeoService } from 'src/app/services/geo/geo.service';
import { PromotionsService } from 'src/app/services/promotions/promotions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout04',
  templateUrl: './checkout04.component.html',
  styleUrls: ['./checkout04.component.scss']
})
export class Checkout04Component implements OnInit {

  public step: any = 1;
  public modalThanks: boolean = false;
  /********************** LOGIC PROMO */
  public mountGift=0;
  @Input() id_store_current:string ="";
  @Input() promotionInfo:any =[];
  public showProductListPromotion: boolean = true;
  public modalGiftType: number = 0;
  public modalGift: boolean = false;
  public modalType1Opcion: string = "1";
  public temporalSelect: any = [-1, -1];
  public temporalIndex: number = -1;
  public Promo1: number = 0;
  public Promo2: number = 0;
  public listPromo1: any = [];
  public listPromo2: any = [];
  public provincias: any = [];
  public ciudades: any = [];
  public tyc:boolean = false;
  public sales_price_products:any =[];
  public promotionActive:any = false;
  /******************************* */
  public confirmFlete: boolean = false;
  public numberCard: any = "";
  public modoEntrega: any = "1";
  public validCard: boolean = false;
  public insertedCard: any = "";
  public cardList: any = ['visa', 'master', 'diners', 'american', 'discover', 'hipercard', 'elo', 'jcb'];
  public cart: any;
  public cartTotal: any;
  public envio: number = 0;

  public cardMonth: string = '12';
  public cardYear: string = '2021';

  public years: any[] = [];
  public months: any[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  public quotas: any[] = [];

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

  public store

  constructor(
    @Inject(PLATFORM_ID) private platformID,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private GeoService: GeoService,
    private PromotionsServices: PromotionsService,
    private BrazilPipePipe: BrazilPipe,
    private spinner: NgxSpinnerService,
    private router: Router,
    private translate: TranslateService
  ) {
    if(isPlatformBrowser(this.platformID)){
      this.store = JSON.parse(localStorage.getItem("store"));
    }
    this.spinner.hide();
    this.cartService.getCart()
      .subscribe((cart: any) => {
        this.cart = cart;
      });


    // this.cartService.getCartTotal()
    //   .subscribe((cartTotal: any) => {
    //     this.cartTotal = cartTotal;
    //     let aux = Math.floor(this.cartTotal / 100);

    //     if (aux <= 1) {
    //       aux = 1;
    //     }
    //     else if (aux >= 10) {
    //       aux = 10;
    //     }

    //     this.quotas = [];
    //     for (let i = 1; i <= aux; ++i) {
    //       this.quotas.push(i);
    //     }
    //   });

    let currentYear = new Date().getFullYear()
    for (let i = currentYear; i <= (currentYear + 20); ++i) {
      this.years.push(String(i));
    }

    if(isPlatformBrowser(this.platformID)){
      this.store = JSON.parse(localStorage.getItem('store'));
    }
    if (this.store) {
      this.modoEntrega = this.store.has_delivery ? '1' : (this.store.pickup ? '2' : '0');
    }

  }

  ngOnInit(): void {

    this.GeoService.getState(this.id_store_current,{alpha_2:'CO', id_store: this.id_store_current})
    .then((response) => {
        this.provincias=response.data[0].provincies;
        this.ciudades =response.data[0].provincies[0].cities;
        this.deliveryAddress.state=response.data[0].provincies[0].iso_code;
        this.deliveryAddress.city=response.data[0].provincies[0].cities[0].code;

    });
    this.sales_price_products= Array.from(Array(this.cart.length), (_, i) =>0);
    setTimeout(() => {
      this.revisarPromo4();
    }, 100);
  }
  changeState(value){
    for(var i=0;i<this.provincias.length;i++){
      if(value==this.provincias[i].iso_code ){
        this.ciudades=this.provincias[i].cities;
      }
    }
  }

  goToDeliveryData(): void {
    if (this.validatePersonalData()) {
      let auxForm = { customer: this.orderForm.customer };
      this.checkoutService.addCustomer(this.id_store_current, auxForm)
        .then((response) => {
          this.step = 2;
        }).catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: this.translate.instant('alerts.chequearDatos')
          })
        });

    }
    return;
  }

  goToPaymentDataPick() {
    if (this.validatePersonalData()) {
      let auxForm = { customer: this.orderForm.customer };
      this.checkoutService.addCustomer(this.id_store_current, auxForm)
        .then((response) => {
          this.step = 3;
          this.spinner.show();
          this.makeOrder();
        }).catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: this.translate.instant('alerts.chequearDatos')
          })
        });
    }
    return;
  }

  goToPaymentData() {
    if (this.validateDeliveryData()) {
      let _this=this;


      const provincia = this.provincias.find( element => element.iso_code === _this.deliveryAddress.state );

      const ciudad = this.ciudades.find( element => element.code === _this.deliveryAddress.city );


      Swal.fire({
        title: this.translate.instant('alerts.confirmarDireccion'),
        html: provincia.state+" - "+ciudad.name +"<br>"+this.deliveryAddress.street+"<br>"+this.deliveryAddress.destinatario,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ffcad4',
        cancelButtonColor: '#00000096',
        cancelButtonText:this.translate.instant('buttons.cancelar'),
        confirmButtonText: this.translate.instant('buttons.aceptar')
      }).then((result) => {
        if (result.isConfirmed) {
          _this.orderForm.id_store = this.id_store_current;
          _this.orderForm.customer.id_delivery = 'coordinadora';
          _this.orderForm.customer.deliveryAddress = _this.deliveryAddress;
          let sendProducts: any[] = [];
          _this.cart.forEach(c => {
           sendProducts.push({ product: c.product.sku, variation: { product_sku: c.variation.product_sku, quantity: c.variation.quantity } });

          });
          if(isPlatformBrowser(this.platformID)){
            if(!(localStorage.getItem('user_reference') == null)){
              _this.orderForm.id_seller=localStorage.getItem('user_reference');
            }
          }
          _this.orderForm.products = sendProducts;
          _this.spinner.show();
          _this.checkoutService.getCost(this.id_store_current, { id_store: this.id_store_current, id_delivery: 'coordinadora', address: _this.deliveryAddress, cost: _this.cartTotal,products: sendProducts})
            .then((response2) => {

              if (response2.state == "success") {
                _this.envio = response2.data;
                _this.step = 3;
                _this.confirmFlete = true;
                _this.spinner.show();
                _this.makeOrder();
              } else {
                _this.spinner.hide();
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
              _this.spinner.hide();
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: this.translate.instant('alerts.datosDireccion')
              })
            });
        }
      })

    }
    return;
  }

  validateNumberCard() {
    this.validCard = false;

    this.insertedCard = "";
    let internalNumber = this.orderForm.payment.card.cardNumber.replace(/[\W_]+/g, '');
    var cards = {
      visa: /^4[0-9]{12}(?:[0-9]{3})/,
      master: /^5[1-5][0-9]{14}/,
      diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
      american: /^3[47][0-9]{13}/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}/,
      hipercard: /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
      elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}/
    };
    //4551 1010 8454 5095
    for (var flag in cards) {
      if (cards[flag].test(internalNumber)) {

        this.insertedCard = flag.toString();
        this.validCard = true;
        this.orderForm.payment.card.brand = this.insertedCard;

      }
    }

  }



  promoElegida() {

    for (let i = 0; i < this.listPromo2.length; ++i) {
      if (this.listPromo2[i][2] == -1)
        return false;
    }
    for (let i = 0; i < this.listPromo1.length; ++i) {
      if (this.listPromo1[i][2] == -1)
        return false;
    }
    return true;
  }

  makeOrder(): any {

    this.orderForm.id_store = this.id_store_current;
    if (!this.orderForm.id_store) {
      return false;
    }

    //este el id_payment de braspag ajustarlo a que lo busque dinamico del api
    this.orderForm.payment.id_payment = 'lukacol';
    let sendProducts: any[] = [];
    this.cart.forEach(c => {
  sendProducts.push({ product: c.product.sku, variation: { product_sku: c.variation.product_sku, quantity: c.variation.quantity } });

       });
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
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: this.translate.instant('alerts.noStock')
            })
          }
        }
      }).catch((error) => {
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: this.translate.instant('alerts.contactarAsesor')
        })
      });
  }

  private validatePersonalData(): boolean {

    if (!this.orderForm.customer.name) {
      this.alertFail(this.translate.instant('validaciones.nombreObligatorio'));
      return false;
    }

    if (!this.orderForm.customer.lastname) {
      this.alertFail(this.translate.instant('validaciones.apellidosObligatorios'));
      return false;
    }

    if (!this.tyc) {
      this.alertFail(this.translate.instant('validaciones.tyc'));
      return false;
    }


    if (!this.orderForm.customer.email) {
      return false;
    } else if (!this.validateEmail(this.orderForm.customer.email)) {
      this.alertFail(this.translate.instant('validaciones.emailValido'));
      return false;
    }

    if (!this.orderForm.customer.cpf) {
      this.alertFail(this.translate.instant('validaciones.nitObligatorio'));
      return false;
    }

    if (!this.orderForm.customer.phone) {
      this.alertFail(this.translate.instant('validaciones.tlfObligatorio'));
      return false;
    }

    return true;
  }


  alertFail(message: string = "Ocurrio un problema, verificar los datos", title: string = "Oops...",) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message
    })
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  private  validateDeliveryData() {


      if (this.deliveryAddress.street == '') {
        this.alertFail(this.translate.instant('validaciones.direccionObligatorio'));
        return false;
      }


      return true;

  }

  private validateCardData(): boolean {
    if (!this.orderForm.payment.type) {
      return false;
    }

    if (!this.orderForm.payment.card.cardNumber) {
      return false;
    }

    if (!this.orderForm.payment.card.securityCode) {
      return false;
    }

    this.orderForm.payment.card.expirationDate = `${this.cardMonth}/${this.cardYear}`
    if (!this.orderForm.payment.card.expirationDate) {
      return false;
    }

    if (!this.orderForm.payment.card.brand) {
      return false;
    }

    if (!this.orderForm.payment.card.holder) {
      return false;
    }

    return true;
  }

  changeStep(stepval) {
    this.step = stepval;
  }

  irAHome() {
    this.modalThanks = false;
    this.router.navigateByUrl(`/${this.id_store_current}`);
  }

  checaCPF(CPF) {
    if (CPF.length != 11 || CPF == "00000000000" || CPF == "11111111111" ||
      CPF == "22222222222" || CPF == "33333333333" || CPF == "44444444444" ||
      CPF == "55555555555" || CPF == "66666666666" || CPF == "77777777777" ||
      CPF == "88888888888" || CPF == "99999999999" || CPF == "01234567890")
      return false;

    var soma = 0;
    for (var i = 0; i < 9; i++)
      soma += parseInt(CPF.charAt(i)) * (10 - i);

    var resto = 11 - (soma % 11);
    if (resto == 10 || resto == 11)
      resto = 0;
    if (resto != parseInt(CPF.charAt(9)))
      return false;

    soma = 0;

    for (var i = 0; i < 10; i++)
      soma += parseInt(CPF.charAt(i)) * (11 - i);

    resto = 11 - (soma % 11);

    if (resto == 10 || resto == 11)
      resto = 0;

    if (resto != parseInt(CPF.charAt(10)))
      return false;

    return true;
  }

  cc_format(value) {
    var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    var matches = v.match(/\d{4,16}/g);
    var match = matches && matches[0] || ''
    var parts = []
    for (var i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  onCheck() {
    this.orderForm.payment.card.cardNumber = this.cc_format(this.orderForm.payment.card.cardNumber);
  }

  checkDigit(event) {
    var code = (event.which) ? event.which : event.keyCode;

    if ((code < 48 || code > 57) && (code > 31)) {
      return false;
    }

    return true;
  }

  abrirPromo(type, idx) {
    if (type == 1) {
      this.showProductListPromotion = false;
      this.modalType1Opcion = "1";
    }
    this.temporalSelect = [-1, -1];
    this.modalGiftType = type;
    this.temporalIndex = idx;
    this.modalGift = true;
  }

  AdicionarObsequio() {

    if (this.modalGiftType == 2) {
      if (this.temporalSelect[0] == -1) {
        this.modalGift = false;
        return;
      }
      this.listPromo2[this.temporalIndex] = [
        `${this.promotionInfo.products[this.temporalSelect[0]].name} + Porta Joya`,
        this.promotionInfo.products[this.temporalSelect[0]].sku,
        this.promotionInfo.products[this.temporalSelect[0]].variations[this.temporalSelect[1]].code,
        this.promotionInfo.products[this.temporalSelect[0]].images[0].url,
        this.promotionInfo.products[this.temporalSelect[0]], "2"
      ];

    } else {
      if (this.modalType1Opcion == "1") {
        this.listPromo1[this.temporalIndex] = [
          `Porta Joyas`,
          "U",
          "U",
          "/assets/imgs/portajoias.png",
          this.promotionInfo.products[this.temporalSelect[0]], "1"
        ];

      } else {
        if (this.temporalSelect[0] == -1) {
          this.modalGift = false;
          return;
        }
        this.listPromo1[this.temporalIndex] = [
          `${this.promotionInfo.products[this.temporalSelect[0]].name}`,
          this.promotionInfo.products[this.temporalSelect[0]].sku,
          this.promotionInfo.products[this.temporalSelect[0]].variations[this.temporalSelect[1]].code,
          this.promotionInfo.products[this.temporalSelect[0]].images[0].url,
          this.promotionInfo.products[this.temporalSelect[0]], "1"
        ];
      }

    }
    this.modalGift = false;
  }

  showIfStock(variation) {
    for (let i = 0; i < variation.length; ++i) {
      if (variation[i].stock > 0) return true;
    }
    return false;
  }

  showProductList() {
    return this.modalType1Opcion == "2" || this.modalGiftType == 2;
  }

  selectBracelete(index, variation) {
    this.temporalSelect = [index, variation];
  }

  async revisarPromo4(){
    let productPromo=0;
    let cntProducts=5;
    this.spinner.show();
    for(var i=0;i<this.cart.length;i++){
      let producto_en_promo=0;
      let __cart = this.cart[i];
      let __it = i;
      let cantidad = await this.PromotionsServices.isProductInPromotion(this.id_store_current,this.cart[i].product.sku).then((res2) => {

        if (res2.state == "success") {

            if(res2.data.length!=0){
                   let productos_promos = res2.data;
                   for(var j=0;j<productos_promos.length;j++){
                    this.sales_price_products[__it]=0;
                      if(__cart.variation.cod == productos_promos[j].cod ){
                        this.sales_price_products[__it]=productos_promos[j].sale_price;
                        return __cart.variation.quantity;
                      }

                    }
                }
              }
      }).catch((error) => {
        return false;
        });
          if(cantidad != undefined)
        productPromo+=Number(cantidad);

  }
  if(productPromo>=cntProducts){
   this.promotionActive=true;
  }else{
    this.promotionActive=false;
  }
  this.actualizarTotal();
  this.spinner.hide();

  }
  actualizarTotal(){
    if(this.cart.length > 0){
      this.cartTotal =this.cart.map( (item,index) =>{
        let valor=0;

        if(this.promotionInfo!=false && (this.promotionInfo.type=='004') && this.promotionActive && this.sales_price_products[index]>0){
            valor = item.variation.quantity * this.sales_price_products[index];
        }else{
          valor = item.variation.quantity * item.variation.price;
        }
        return valor;

    }).reduce((x, y) => x + y);
  }else{
    this.cartTotal=0;
  }

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

}

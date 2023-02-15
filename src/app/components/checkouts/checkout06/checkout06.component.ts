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
import { StoresService } from 'src/app/services/stores/stores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout06',
  templateUrl: './checkout06.component.html',
  styleUrls: ['./checkout06.component.scss']
})
export class Checkout06Component implements OnInit {

  public step: any = 1;
  public minValDelivery=899;
  public modalThanks: boolean = false;
  /********************** LOGIC PROMO */
  public listFinish=false;
  public pageActualList:number=1;
  public pageSearch :number=1;
  public searchQuery :string = "";
  public productsPromo : any = [];
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

  @Input() id_store_current:string ="";
  @Input() promotionInfo:any =[];

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
  public cant_1: number =719000;
  public cardMonth: string = '12';
  public cardYear: string = '2021';

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
      id_payment: 'luka',
      type: 'CreditCard',
      card: {
        cardNumber: '',
        holder: '',
        expirationDate: '',
        securityCode: '',
        brand: ''
      },
      installments: 1
    },
    products: [
      { product: '', variation: { sku: '', cod: '', quantity: 0 } }
    ],
    promotions: [
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
    private PromotionsServices: PromotionsService,
    private spinner: NgxSpinnerService,
    private GeoService:GeoService,
    private StoresService: StoresService,
    private BrazilPipePipe: BrazilPipe,
    private router: Router,
    private translate: TranslateService
  ) {
    if(isPlatformBrowser(this.platformID)){
      this.store = JSON.parse(localStorage.getItem("store"));
    }

    this.StoresService.getStoreId()
    .subscribe((id : any) => {
   if(id!="null" && id!=null)    {
    this.searchQuery= "";
    this.id_store_current=id;
    this.traerPromociones();
   }
    });
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
    if (!(this.promotionInfo == null)) {

      let resto = this.cartTotal % this.cant_1;

      this.Promo1 = (this.cartTotal - resto) / this.cant_1;
      for (let i = 1; i <= this.Promo1; ++i) {
        this.listPromo1.push(['Escoja 01 bracelete de regalo', 'SKU', '-1', "https://admincolombia.asesoraspandora.com/assets/img/logo_share.jpg"]);
      }

    }
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

    let _this=this;

    if (this.validateDeliveryData()) {

      const provincia = this.provincias.find( element => element.iso_code === _this.deliveryAddress.state );

      const ciudad = this.ciudades.find( element => element.code === _this.deliveryAddress.city );


      Swal.fire({
        title: this.translate.instant('alerts.confirmarDireccion'),
        html: provincia.state+" - "+ciudad.name +"<br>"+this.deliveryAddress.street+"<br>"+this.deliveryAddress.destinatario,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ffcad4',
        cancelButtonColor: '#00000096',
        cancelButtonText: this.translate.instant('buttons.cancelar'),
        confirmButtonText: this.translate.instant('buttons.aceptar'),
      }).then((result) => {
        if (result.isConfirmed) {
      this.orderForm.id_store = this.id_store_current;
      this.orderForm.customer.id_delivery = 'coordinadora';
      this.orderForm.customer.deliveryAddress = this.deliveryAddress;
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
      this.spinner.show();
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

                switch(response2.data.code){
                  case 301:
                    message = {
                      icon: 'warning',
                      title: 'Oops...',
                      text: this.translate.instant('alerts.productosInvalidos'),
                    };
                    break;

                  case 302:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.noStock'),
                  };
                  break;

                  case 303:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.prodNoDisponibles'),
                  };
                  break;

                  case 304:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.promoNo'),
                  };
                  break;

                  case 305:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.prodPromos'),
                  };
                  break;

                  case 306:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.clienteInvalido'),
                  };
                  break;

                  case 307:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.entregaClienteInvalida'),
                  };
                  break;

                  case 308:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.vendedorInvalido'),
                  };
                  break;

                  case 309:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.clienteTiendaInvalido'),
                  };
                  break;

                  case 310:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.creacionPedidoFail'),
                  };
                  break;

                  case 311:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.entregaInvalida'),
                  };
                  break;

                  case 312:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.distanciaEntregaInvalida'),
                  };
                  break;

                  case 313:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.respuestaEntregaInvalida'),
                  };
                  break;

                  case 314:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.respuestaEnvioFallida'),
                  };
                  break;

                  case 315:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.pagoFallido'),
                  };
                  break;

                  case 316:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.pagoFallido'),
                  };
                  break;

                  case 317:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.pagorechazado'),
                  };
                  break;


                  case 318:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.noDestino'),
                  };
                  break;

                  case 319:
                  message = {
                    icon: 'warning',
                    title: 'Oops...',
                    text: this.translate.instant('alerts.ciudadInvalida'),
                  };
                  break;

                  default:
                    message = {
                      icon: 'warning',
                      title: 'Oops...',
                      text: this.translate.instant('alerts.contactarAsesor'),
                    };
                }

                Swal.fire(message);
          }
        }).catch((response) => {
          this.spinner.hide();
          let message: any = {
            icon: '',
            title: '',
            text: ''
          };

          switch(response.data.code){
            case 301:
              message = {
                icon: 'warning',
                title: 'Oops...',
                text: this.translate.instant('alerts.productosInvalidos'),
              };
              break;

            case 302:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.noStock'),
            };
            break;

            case 303:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.prodNoDisponibles'),
            };
            break;

            case 304:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.promoNo'),
            };
            break;

            case 305:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.prodPromos'),
            };
            break;

            case 306:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.clienteInvalido'),
            };
            break;

            case 307:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.entregaClienteInvalida'),
            };
            break;

            case 308:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.vendedorInvalido'),
            };
            break;

            case 309:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.clienteTiendaInvalido'),
            };
            break;

            case 310:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.creacionPedidoFail'),
            };
            break;

            case 311:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.entregaInvalida'),
            };
            break;

            case 312:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.distanciaEntregaInvalida'),
            };
            break;

            case 313:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.respuestaEntregaInvalida'),
            };
            break;

            case 314:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.respuestaEnvioFallida'),
            };
            break;

            case 315:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.pagoFallido'),
            };
            break;

            case 316:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.pagoFallido'),
            };
            break;

            case 317:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.pagorechazado'),
            };
            break;


            case 318:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.noDestino'),
            };
            break;

            case 319:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.ciudadInvalida'),
            };
            break;

            default:
              message = {
                icon: 'warning',
                title: 'Oops...',
                text: this.translate.instant('alerts.contactarAsesor'),
              };
          }

          Swal.fire(message);
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

  promotionActive() {
    return this.Promo1 > 0;
  }

  promoElegida() {


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
    this.orderForm.payment.id_payment = 'luka';
    let sendProducts: any[] = [];
    this.cart.forEach(c => {
      sendProducts.push({ product: c.product.sku, variation: { product_sku: c.variation.product_sku, quantity: c.variation.quantity } });

     });
     let sendProductsPromo : any[]=[];
     this.listPromo1.forEach(c => {
       if(c[2]!=-1)
             sendProductsPromo.push({ product: c[1], variation: { product_sku: c[1], quantity: 1 } });


      });

      if(isPlatformBrowser(this.platformID)){
        if(!(localStorage.getItem('user_reference') == null)){
          this.orderForm.id_seller=localStorage.getItem('user_reference');
       }
      }
     this.orderForm.products = sendProducts;
     this.orderForm.promotions =sendProductsPromo;
  
    this.checkoutService.makeOrder(this.orderForm)
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
              text: this.translate.instant('alerts.noStock'),
            })
          }
        }
      }).catch((response) => {
        this.spinner.hide();
        let message: any = {
          icon: '',
          title: '',
          text: ''
        };
        this.step = 1;
        switch(response.data.error.response.code){
          case 301:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.productosInvalidos'),
            };
            break;

          case 302:
            var productos = "";
            response.data.error.response.data.forEach(c => {
             productos +="<li>"+c.name+"</li>";
           });
           productos = "<ul style='text-align: left;'>"+productos+"</lu>";
           message ={
             icon: 'warning',
             title: 'Oops...',
             html: this.translate.instant('alerts.noStockProductos')+productos
           };

          break;

          case 303:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.prodNoDisponibles')
          };
          break;

          case 304:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.promoNo')
          };
          break;

          case 305:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.prodPromos')
          };
          break;

          case 306:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.clienteInvalido')
          };
          break;

          case 307:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.entregaClienteInvalida')
          };
          break;

          case 308:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.vendedorInvalido')
          };
          break;

          case 309:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.clienteTiendaInvalido')
          };
          break;

          case 310:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.creacionPedidoFail')
          };
          break;

          case 311:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.entregaInvalida')
          };
          break;

          case 312:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.distanciaEntregaInvalida')
          };
          break;

          case 313:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.respuestaEntregaInvalida')
          };
          break;

          case 314:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.respuestaEnvioFallida')
          };
          break;

          case 315:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.pagoFallido')
          };
          break;

          case 316:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.pagoFallido')
          };
          break;

          case 317:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.pagorechazado')
          };
          break;


          case 318:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.noDestino')
          };
          break;

          case 319:
          message = {
            icon: 'warning',
            title: 'Oops...',
            text: this.translate.instant('alerts.ciudadInvalida')
          };
          break;

          case 322: // STOCK PROMOTIO
          var productos = "";
          response.data.error.response.data.forEach(c => {
           productos +="<li>"+c.name+"</li>";
         });
         productos = "<ul style='text-align: left;'>"+productos+"</lu>";
         message ={
           icon: 'warning',
           title: 'Oops...',
           html: this.translate.instant('alerts.noExistenciaProdPromos')+productos
         };
         break;

          default:
            message = {
              icon: 'warning',
              title: 'Oops...',
              text: this.translate.instant('alerts.contactarAsesor')
            };
        }

        Swal.fire(message);
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
  getCEP() {
    this.spinner.show();

    this.checkoutService.getInfoCEP(this.deliveryAddress.cep)
      .then((response) => {
        if(response!=null){
            this.deliveryAddress = {
          type: '',
          street: response.data.logradouro,
          number: '',
          complement: '',
          zip_code: '',
          city: response.data.localidade,
          state: response.data.uf,
          country: 'BRA',
          district: response.data.bairro,
          cep: response.data.cep,
          endereco: response.data.logradouro,
          neighborhood: ''
        };
        }

        this.spinner.hide();
      }).catch((error) => {
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: this.translate.instant('alerts.cepInvalido')
        })
      });
  }

  alertFail(message: string = "Ocurrio un problema, verifique los datos", title: string = "Oops...",) {
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
        this.listPromo1[this.temporalIndex] = [
          `${this.productsPromo[this.temporalSelect[0]].name}`,
          this.productsPromo[this.temporalSelect[0]].variations[this.temporalSelect[1]].product_sku,
          this.productsPromo[this.temporalSelect[0]].variations[this.temporalSelect[1]].cod,
          this.productsPromo[this.temporalSelect[0]].images[0].url,
          this.productsPromo[this.temporalSelect[0]], "1"
        ];


    }
    this.modalGift = false;
  }
  cerrarModalBrazalete(){

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

  revisarCapacidad(){

  }

  selectBracelete(index, variation) {
    this.temporalSelect = [index, variation];
  }

  closegift(){
    this.modalGift=false;
  }
  traerPromociones() {
    this.productsPromo = [];
    let _this = this;
    this.spinner.show();
    this.PromotionsServices.getListProductsStock(this.id_store_current,this.pageSearch,this.searchQuery)
    .then(respuesta =>{

      this.productsPromo = respuesta.data.data;
      if(respuesta.data.current_page == respuesta.data.last_page){

        this.listFinish=true;

     }else{
      _this.pageActualList= _this.pageSearch;
     }
      this.spinner.hide();
    }).catch((error) => {
      this.spinner.hide();
    });
  }
  findNextPromo(){

    if(!this.listFinish && this.pageSearch==this.pageActualList)
    {
      let _this = this;
      this.spinner.show();

      this.pageSearch = this.pageActualList+1;
      this.PromotionsServices.getListProductsStock(this.id_store_current,this.pageSearch,this.searchQuery)
      .then(rest =>{

        this.productsPromo=this.productsPromo.concat(rest.data.data);
        if(rest.data.current_page == rest.data.last_page){

           this.listFinish=true;

        }else{
          _this.pageActualList= _this.pageSearch;
        }
        this.spinner.hide();
      }).catch((error) => {
        this.spinner.hide();
      });

    }

    }
    scrollTablet(event: any) {

      if(isPlatformBrowser(this.platformID)){
        if (
          ((window.innerHeight+  window.pageYOffset) / document.body.scrollHeight) > 0.7
          ) {
            this.findNextPromo();
        }
      }

    }
    searchUpdate(event:any){
      this.traerPromociones();

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

     candSelect(productIdx:any,variationIdx:any){
      if(this.productsPromo[productIdx].variations[variationIdx].stock == 0){
        return false;
      }
      var cantidad_product = 0;
      for (let i = 0; i < this.listPromo1.length; ++i) {
        if(this.listPromo1[i][1]==this.productsPromo[productIdx].variations[variationIdx].product_sku){
          cantidad_product++;
        }

      }
      for (let i = 0; i < this.listPromo2.length; ++i) {
        if(this.listPromo2[i][1]==this.productsPromo[productIdx].variations[variationIdx].product_sku){
          cantidad_product++;
        }
      }

      if(cantidad_product < this.productsPromo[productIdx].variations[variationIdx].stock){
        return true;
      }
      return false;
 }
}

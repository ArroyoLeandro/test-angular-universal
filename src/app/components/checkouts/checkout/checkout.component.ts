import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartWholesaleService } from 'src/app/services/cartWholesale/cart-wholesale.service';
import { PromotionsService } from 'src/app/services/promotions/promotions.service';
import { StoresService } from 'src/app/services/stores/stores.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @Output() emitCloseModal: EventEmitter<boolean> = new EventEmitter(false)
  public promotionInfo:any = {};
  public id_store_current = "";
  public cart = [];
  objectKeys = Object.keys;
  isAuth: boolean = false
  constructor
  (
    private promos: PromotionsService,
    private cartService: CartService,
    private stores: StoresService,
    private router: Router,
    private cartWholesale: CartWholesaleService,
    private auth: AuthService

  ) {  this.getId()  }

  getEvent($event){
    this.emitCloseModal.emit($event)
  }

  ngOnInit(): void {
   
  }

  getId(){
    this.stores.getStoreId()
    .subscribe(async id => {
      if(id !== null && id !== "null"){
        this.id_store_current = id
      }
    })
  }

  checkAuth(){
    this.auth.isAuthenticated() ? (this.isAuth = true) : (this.isAuth = false)
    this.check()
  }

  check(){
    this.isAuth ? this.checkCartWholesale() : this.checkCartNormal()
  }
 
 
  checkCartNormal(){
    this.cartService.getCart()
    .subscribe((cart: any) => {
      this.cart = cart;
    });
  }

  checkCartWholesale(){
    this.cartWholesale.getCart()
    .subscribe((cart: any) => {
      this.cart = cart;
    });
  }

}

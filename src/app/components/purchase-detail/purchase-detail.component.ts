import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartWholesaleService } from 'src/app/services/cartWholesale/cart-wholesale.service';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styles: [
  ]
})
export class PurchaseDetailComponent implements OnInit {
  isAuth:boolean = false
  constructor(
    private cartWholesale: CartWholesaleService,
    private cart: CartService,
    private auth: AuthService
  ) { }

  checkAuth(){
    this.auth.isAuthenticated() ? (this.isAuth = true) : (this.isAuth = false)
  }

  ngOnInit(): void {
  }

  close(){
    this.isAuth ? this.cartWholesale.setCloseCart(true) : this.cart.setCloseCart(true)
  }

}

import { Injectable,  Inject, PLATFORM_ID, } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartWholesaleService {
  closeCart: BehaviorSubject<boolean> = new BehaviorSubject(false)
  private cartWholesale : BehaviorSubject<any> = new BehaviorSubject([]);
  private cartCountWholesale : BehaviorSubject<Number> = new BehaviorSubject(0);
  private cartTotalWholesale : BehaviorSubject<Number> = new BehaviorSubject(0);
  private detailCompra : BehaviorSubject<any> = new BehaviorSubject({});
  constructor(
    @Inject(PLATFORM_ID) private platformID,

  ) { this.loadCart() }

  
  setCloseCart(value){
    this.closeCart.next(value)
  }

  getCloseCart(){
    return this.closeCart
  }

  private loadCart()
  {
    let cart
    if(isPlatformBrowser(this.platformID)){
      cart = JSON.parse(localStorage.getItem("cartWholesale"))
    }
    let cartCount = 0.;
    let cartTotal = 0.;

    if( cart == null )
    {
      cart=[];
      cartCount = 0;
      cartTotal = 0;
    }else{
      cart.forEach(c => {
        cartCount += c.quantity;
        cartTotal += (c.quantity * c.product.wholesale_price);
      });
    }

    this.setCart(cart);
    this.cartCountWholesale.next(cartCount);
    this.cartTotalWholesale.next(cartTotal);
  }

  addItemTocart(product : any, quantity : number = 1)
  { 
      let cart
      if(isPlatformBrowser(this.platformID)){
        cart = JSON.parse(localStorage.getItem("cartWholesale"))
      }
      let cartCount = 0;
      let cartTotal = 0;
      if( cart == null )
      {
        cart=[];
        let ItemCart = {
            product: product,
            quantity
        };
        cart.push(ItemCart);
        cartCount = quantity;
        cartTotal = 0;
      }else{
        let find = false;
        cart.map( (item) =>{
            if((item.product.sku == product.sku)){
              item.quantity+=quantity;
              find = true;
            }
            return item;
        });

        if(!find)
        {
          let ItemCart = {
            product: product,
            quantity
          };
          cart.push(ItemCart);
        }

        cart.forEach(c => {
          cartCount += c.quantity;
          cartTotal += c.quantity * c.product.wholesale_price;
        });
      }

      if(isPlatformBrowser(this.platformID)){
        localStorage.setItem("cartWholesale",JSON.stringify(cart));
      }
      this.cartCountWholesale.next(cartCount);
      this.cartTotalWholesale.next(cartTotal);
      this.setCart(cart);
  }

  updateCart(cart : any)
  {
    let cartCount = 0;
    let cartTotal = 0;

    if( cart == null  )
    {
      cart=[];
      cartCount = 0;
      cartTotal = 0;
    }else{
      cart.forEach(c => {
        cartCount += c.quantity;
        cartTotal += c.quantity * c.product.wholesale_price;
      });
    }

    this.setCart(cart);
    this.cartCountWholesale.next(cartCount);
    this.cartTotalWholesale.next(cartTotal);
  }

  getCart() : Observable<any> {
    return this.cartWholesale
  }

  getCartCount() : Observable<any> {
    return this.cartCountWholesale
  }
  
  getCartTotal()  {
    return this.cartTotalWholesale.value
  }

  setCart(cart: any) : void {    
    if(isPlatformBrowser(this.platformID)){
      localStorage.setItem("cartWholesale",JSON.stringify(cart));
    }
    this.cartWholesale.next(cart);
  }

  clear() {
    this.setCart([]);
    this.cartCountWholesale.next(0);
    this.cartTotalWholesale.next(0);
    
    if(isPlatformBrowser(this.platformID)){
      localStorage.removeItem('user_reference')
    }
  }

  setInfoCompra(datainfo:any){
    this.detailCompra.next(datainfo)
  }

  getDataCompra(){
    return this.detailCompra
  }

}

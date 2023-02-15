import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class CartService {
  closeCart: BehaviorSubject<boolean> = new BehaviorSubject(false)
  private cart : BehaviorSubject<any> = new BehaviorSubject([]);
  private cartCount : BehaviorSubject<Number> = new BehaviorSubject(0);
  private cartTotal : BehaviorSubject<Number> = new BehaviorSubject(0);
  private detailCompra : BehaviorSubject<any> = new BehaviorSubject({});
  private finishPurchase : BehaviorSubject<boolean> = new BehaviorSubject(false);
  private closeModal : BehaviorSubject<boolean> = new BehaviorSubject(false);
  private show : BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  constructor(
    @Inject(PLATFORM_ID) private platformID,

  ) { 
    this.checkCart()
    this.loadCart()
   }

  showPopUp(value){
    this.show.next(value)
  }

  getShow(){
    return this.show
  }

  setCloseCart(value){
    this.closeCart.next(value)
  }

  getCloseCart(){
    return this.closeCart
  }

  setCloseModal(value:boolean){
    this.closeModal.next(value)
  }

  getCloseModal(): Observable<boolean>{
    return this.closeModal
  }

  setFinish(value:boolean){
    this.finishPurchase.next(value)
  }

  getStatusPurchase(): Observable<boolean>{
    return this.finishPurchase
  }

  checkCart(){
    if(isPlatformBrowser(this.platformID)){
      let cart = JSON.parse(localStorage.getItem("cart"));
      if(cart && cart.length > 0){
        let _this = this
        cart.forEach(function (element){
          if(!element.variation){
            _this.clear()
            return 
          }
        })
      }
    }

  }

  private loadCart()
  {
      let cart
      if(isPlatformBrowser(this.platformID)){
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      let cartCount = 0.;
      let cartTotal = 0.;
  
      if(cart==null)
      {
        cart=[];
        cartCount = 0;
        cartTotal = 0;
      }else{
        cart.forEach(c => {
          cartCount += c.variation.quantity;
          cartTotal += (c.variation.quantity * c.variation.price);
        });
      }
  
      this.setCart(cart);
      this.cartCount.next(cartCount);
      this.cartTotal.next(cartTotal);
    
  }

  addItemTocart(product : any, variation: any, quantity : number = 1)
  {     
   let cart
    if(isPlatformBrowser(this.platformID)){
      cart = JSON.parse(localStorage.getItem("cart"));
    }
      let cartCount = 0;
      let cartTotal = 0;
      if(cart==null)
      {
        cart=[];
        variation.quantity = quantity;
          let ItemCart = {
            product: product,
            variation: variation
          };
        cart.push(ItemCart);
        cartCount = quantity;
        cartTotal = 0;
      }else{
        let find = false;
        cart.map( (item) =>{
            // console.warn('item Product y product',item.product, product,'========',item.variation,variation);
            //  if((item.product.product == product.product) && (item.variation.info_options.length == 0 || (item.variation.info_options[0].id_product == variation.info_options[0].id_product))){ 
          if((item.product.id == product.id) && (item.variation.product_sku == variation.product_sku)){ //ORIGINAL
            item.variation.quantity+=quantity;
            find = true;
           }
            return item;
        });

        if(!find)
        { 
          
          variation.quantity = quantity;
          let ItemCart = {
            product: product,
            variation: variation
          };
        cart.push(ItemCart);
        }

        cart.forEach(c => {
          cartCount += c.variation.quantity;
          cartTotal += c.variation.quantity * c.variation.price;
        });
      }

      if(isPlatformBrowser(this.platformID)){
        localStorage.setItem("cart",JSON.stringify(cart));
      }
      this.cartCount.next(cartCount);
      this.cartTotal.next(cartTotal);
      this.setCart(cart);
  }
  
  updateCart(cart : any)
  {
    let cartCount = 0;
    let cartTotal = 0;

    if(cart==null)
    {
      cart=[];
      cartCount = 0;
      cartTotal = 0;
    }else{
      cart.forEach(c => {
        cartCount += c.variation.quantity;
        cartTotal += c.variation.quantity * c.variation.price;
      });
    }

    this.setCart(cart);
    this.cartCount.next(cartCount);
    this.cartTotal.next(cartTotal);
  }

  getCart() : Observable<any> {
    return this.cart
  }

  getCartCount() : Observable<any> {
    return this.cartCount
  }

  getCartTotal() : Number {
    return this.cartTotal.value
  }

  setCart(cart: any) : void {
    if(isPlatformBrowser(this.platformID)){
      localStorage.setItem("cart",JSON.stringify(cart));
    }
    return this.cart.next(cart);
  }

  clear() {
      this.setCart([]);
      this.cartCount.next(0);
      this.cartTotal.next(0);
      if(isPlatformBrowser(this.platformID)){
        localStorage.removeItem('user_reference')
        localStorage.removeItem('id_share')
      }


  }

  setInfoCompra(datainfo:any){
    this.detailCompra.next(datainfo)
  }

  getDataCompra(){
    return this.detailCompra
  }

}

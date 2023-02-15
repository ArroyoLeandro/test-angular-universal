import { isPlatformBrowser } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from 'src/app/interfaces/product.model';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  category: BehaviorSubject<String> = new BehaviorSubject('')
  query: BehaviorSubject<string> = new BehaviorSubject('')
  searchQuery: BehaviorSubject<boolean> = new BehaviorSubject(false)
  products: BehaviorSubject<any[]> = new BehaviorSubject([])
  constructor(
    private http: HttpService,
    @Inject(PLATFORM_ID) private platformID,
    ) { }


  setCategory(category:string){
    if(isPlatformBrowser(this.platformID)){
      localStorage.setItem('categorySelected', category)
    }
    this.category.next(category)
  }

  getCategory(): Observable<String>{
    let ctg = ''
    if(isPlatformBrowser(this.platformID)){
      ctg = localStorage.getItem('categorySelected') || ''
    }
    this.category.next(ctg)
    return this.category
  }

  getProductsWholesale(){
    return this.http.get(`wholesales/products/list/${environment.CLIENT}`)
  }

  getProductBySku(sku: string, id_store : string, wholesale:boolean) : Promise<any> {
    if(wholesale){
      let params : HttpParams = new HttpParams()
      .append('ws', 'true')
      .append('r', 'false')
      return this.http.get(`products/${sku}/detail/${id_store}`, params)
    }else{
      let params : HttpParams = new HttpParams()
      .append('ws', 'false')
      .append('r', 'true')
      return this.http.get(`products/${sku}/detail/${id_store}`, params)
    }
  }

  getDetailProductProperties(id_store:string, id_product:string){
    let params : HttpParams = new HttpParams()
    .append('id_store', String(id_store))
    .append('product_sku', String(id_product))
    .append('product', String(id_product))
    return this.http.get('properties/getproduct', params)
  }

  getListCategory(id_tienda: string, category:string, page:number = 1, isWholesale:boolean = false, sub:boolean, subCatg?:string) : Promise<any> {
    if(!sub){
      let params : HttpParams = new HttpParams()
      .append('page', String(page))
      .append('ws', 'false')
      .append('r', 'true')
      return this.http.get2(`products/listCategories/${id_tienda}/${category}`, params);
    }else{
      // console.log(subCatg)
      let params : HttpParams = new HttpParams()
      .append('page', String(page))
      .append('ws', 'false')
      .append('r', 'true')
      return this.http.get2(`products/listCategories/${id_tienda}/${category}/${subCatg}`, params);
    }
    // if(isWholesale){
    //   let params : HttpParams = new HttpParams()
    //   .append('page', String(page))
    //   .append('ws', 'true')
    //   .append('r', 'false')
  
    //   return this.http.get2(`products/listCategories/${id_tienda}/${category}`, params);
    // }else{
    //   let params : HttpParams = new HttpParams()
    //   .append('page', String(page))
    //   .append('ws', 'false')
    //   .append('r', 'true')
    //   return this.http.get2(`products/listCategories/${id_tienda}/${category}`, params);
    // }
  }

  searchProducts(page, search:string, id_store:string): Promise<any>{
    let params : HttpParams = new HttpParams()
    .append('search', String(search))
    .append('page', String(page))
    .append('status', 'active')
    .append('id_store', id_store);
    return this.http.get('properties/searchfilter', params)
  }
  // config tamaño de reduccion para productos y banners
}

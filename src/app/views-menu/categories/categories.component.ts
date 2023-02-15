import { Component, OnInit, PLATFORM_ID, Inject, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DOCUMENT, isPlatformBrowser,isPlatformServer } from '@angular/common';
import { StoresService } from 'src/app/services/stores/stores.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PromotionsService } from 'src/app/services/promotions/promotions.service';
import { HomeService } from 'src/app/services/home/home.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

import { CategoriesService } from 'src/app/services/categories/categories.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styles: [
  ]
})
export class CategoriesComponent implements OnInit, OnDestroy {

  category_slug:string
  sub_category_slug:string
  id_store_current:string = ''
  products:any[] = []
  load_products: boolean = false
  pageSearch:number = 1
  pageActualList = 1
  ListFinish:boolean = false
  categorySearch:string
  subCategorySearch:string
  url:string = ''
  isAuth:boolean = false
  subCat:boolean = false
  currentCategory:any = {}
  private subscriptions: Array<Subscription> = [];
  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private promos: PromotionsService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformID,
    private spinner: NgxSpinnerService,
    private homeservice: HomeService,
    private auth: AuthService,
    private stores: StoresService,
    private categoryService: CategoriesService,

  ) {
    this.subscriptions.push(
      router.events.subscribe((val) => val instanceof NavigationEnd && this.getId())
    )
  }

  ngOnInit(){
    // console.log('categories')
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());

  }

  getId(){
    this.subCat = false
    this.pageActualList = 1
    this.pageSearch = 1
    this.subscriptions.push(
      this.stores.getStoreId()
      .subscribe(async id => {
        if(id !== null && id !== "null"){
          this.id_store_current = id
          this.getIdCtg()
          this.getCtg()
        }
      })
    )
  }
  
  checkAuth(){
    this.auth.isAuthenticated() ? (this.isAuth = true) : (this.isAuth = false)  
    this.getImageBanenr()
  }

  getImageBanenr(){
    this.subscriptions.push(
      this.homeservice.getImage()
      .subscribe(img => console.log(img) )
    )
  }
  getCtg():Promise<any>{
    return new Promise( (resolve,reject) => {
      this.categoryService.getList(this.id_store_current)
      .then(res => {
        resolve( this.setCtg(res.data) )
      })
      .catch(err => {
        reject(err)
      })
    })
  }


  setCtg(response){
    this.currentCategory = response.find(item => item.slug == this.categorySearch)
  }


  
  

 
  getIdCtg(){
    // this.checkAuth()
    if(!this.route.snapshot.paramMap.get('sub_category')){
      this.category_slug = this.route.snapshot.paramMap.get('category')
      this.categorySearch = this.category_slug
      this.category_slug = this.category_slug.replace("-"," ")
      this.category_slug === 'promotion' ? this.getPromos() : this.traerProductos()
    }else{
      this.subCat = true
      this.category_slug = this.route.snapshot.paramMap.get('category')
      let sub_category = this.route.snapshot.paramMap.get('sub_category')
      // console.log(sub_category)
      this.categorySearch = this.category_slug
      this.subCategorySearch = sub_category

      this.category_slug = this.category_slug.replace("-"," ")
      this.sub_category_slug = this.subCategorySearch.replace("-"," ")
      this.category_slug === 'promotion' ? this.getPromos() : this.traerProductos()
    }

  }

  traerProductos(){
    if(!this.subCat){
      this.spinner.show()
      this.productService.getListCategory(this.id_store_current, this.categorySearch, this.pageSearch, this.isAuth, this.subCat)
      .then(res => {
        this.products = res.data.data.data
        // console.log(res.data.data,'product')
        if(res.data.data.current_page == res.data.data.last_page)  this.ListFinish = true
        else this.pageActualList = this.pageSearch
        this.spinner.hide()
      })
      .catch(err => {
        this.spinner.hide()
      })
    }else{
      this.spinner.show()
      this.productService.getListCategory(this.id_store_current, this.categorySearch, this.pageSearch, this.isAuth, this.subCat, this.subCategorySearch)
      .then(res => {
        this.products = res.data.data.data
        // console.log(res.data.data,'product')
        if(res.data.data.current_page == res.data.data.last_page)  this.ListFinish = true
        else this.pageActualList = this.pageSearch
        this.spinner.hide()
      })
      .catch(err => {
        this.spinner.hide()
      })
    }

  }


  getPromos(){
    this.spinner.show()
    this.promos.getListProducts(this.id_store_current, this.pageSearch)
    .then(res => {
      this.products = res.data.data
      if(res.data.current_page == res.data.last_page)  this.ListFinish = true
      else this.pageActualList = this.pageSearch
      this.spinner.hide()
    })
    .catch(err => {
      this.spinner.hide()
    })
  }


  // listen scroll
  @HostListener('window:scroll', ['$event'])
  onScroll($event){
    let scrollHeight = document.body.scrollHeight;
    let pageHeight = (window.innerHeight + window.pageYOffset) / scrollHeight
    let top = 0.7
    if(isPlatformBrowser(this.platformID)){
      if( pageHeight > top  ) this.category_slug === 'promotion' ? this.findNextPromo() : this.findNext()
    }
  }

  findNext(){

    if(!this.ListFinish && this.pageSearch==this.pageActualList)
    {
      let _this = this;
      this.spinner.show();
      this.pageSearch = this.pageActualList+1;
      if(!this.subCat){
        this.productService.getListCategory(this.id_store_current,this.categorySearch, this.pageSearch, this.isAuth, this.subCat)
        .then(res =>{
          this.products=this.products.concat(res.data.data.data);
          if(res.data.data.current_page == res.data.data.last_page){
  
             this.ListFinish=true;
  
          }else{
            _this.pageActualList= _this.pageSearch;
          }
          this.spinner.hide();
        }).catch((error) => {
          this.spinner.hide();
        });
      }else{
        this.productService.getListCategory(this.id_store_current,this.categorySearch, this.pageSearch, this.isAuth, this.subCat, this.subCategorySearch)
        .then(res =>{
          this.products=this.products.concat(res.data.data.data);
          if(res.data.data.current_page == res.data.data.last_page){
  
             this.ListFinish=true;
  
          }else{
            _this.pageActualList= _this.pageSearch;
          }
          this.spinner.hide();
        }).catch((error) => {
          this.spinner.hide();
        });
      }
    }

    }

  findNextPromo(){

    if(!this.ListFinish && this.pageSearch==this.pageActualList)
    {
      let _this = this;
      this.spinner.show();

      this.pageSearch = this.pageActualList+1;
      this.promos.getListProducts(this.id_store_current,this.pageSearch)
      .then(rest =>{

        this.products=this.products.concat(rest.data.data);
        if(rest.data.current_page == rest.data.last_page){

           this.ListFinish=true;

        }else{
          _this.pageActualList= _this.pageSearch;
        }
        this.spinner.hide();
      }).catch((error) => {
        this.spinner.hide();
      });

    }

    }

}

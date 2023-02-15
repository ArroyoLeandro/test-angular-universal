import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
import { StoresService } from 'src/app/services/stores/stores.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']

})
export class SearchPageComponent implements OnInit {
  @ViewChild('ref', {static: true}) ref: ElementRef;
  products:any[] = []

  id_store_current:string = ''
  private subscriptions: Array<Subscription> = [];
  private debounceTimer?: NodeJS.Timeout
  searchTerm:string = ''

  destroy = new Subject();
        
  destroy$ = this.destroy.asObservable();
  load:boolean = true
  actualPage:number = 1
  searchFinish:boolean = false
  constructor(
    private stores: StoresService,
    private productservice: ProductsService,
    private spinner: NgxSpinnerService
  ) { 
    this.listenVariableFinish()
    this.getId()
    this.listenProducts()
    this.listenQuery()
  }

  listenQuery(){
    this.subscriptions.push(
      this.productservice.query.subscribe((query:string) => this.searchTerm = query)
    )
  }

  listenVariableFinish(){
    this.subscriptions.push(
      this.productservice.searchQuery.subscribe(value => this.searchFinish = value)
    )
  }

  listenProducts(){
    this.subscriptions.push(
      this.productservice.products.subscribe(products => {
        if(products.length > 0){
          this.actualPage = this.actualPage + 1
          this.products = products
        }else{
          this.products = []
          this.actualPage = 1
        }
      })
    )
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.products = []
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
  
  getId(){
    this.subscriptions.push(
      this.stores.getStoreId()
      .subscribe(async id => {
        if(id !== null && id !== "null"){
          this.id_store_current = id
        }
      })
    )
  }

  search(){
    if(this.debounceTimer) clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => {
      this.spinner.show()
      this.searchProducts()
    }, 1000)
  }

  searchProducts(){
    this.load = false
    this.spinner.show()
    this.productservice.searchProducts(this.actualPage, this.searchTerm, this.id_store_current)
    .then(res => {
      this.actualPage = this.actualPage + 1
      this.products = [...this.products, ...res.data.data]
      this.spinner.hide()
      this.load = true
    })
    .catch(err => {
      console.log(err)
      this.spinner.hide()
    })
  }

  @HostListener('window:scroll', ['$event.target'])
  onScroll($event){
    let scrollHeight = document.body.scrollHeight;
    let pageHeight = (window.innerHeight + window.pageYOffset) / scrollHeight
    let top = 0.7
    if( pageHeight > top && this.load ){
      this.searchProducts()
    }
  }

}

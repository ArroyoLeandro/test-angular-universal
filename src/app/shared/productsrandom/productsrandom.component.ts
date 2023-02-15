import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HomeService } from 'src/app/services/home/home.service';
import { PromotionsService } from 'src/app/services/promotions/promotions.service';
import { StoresService } from 'src/app/services/stores/stores.service';

@Component({
  selector: 'app-productsrandom',
  templateUrl: './productsrandom.component.html',
  styleUrls: ['./productsrandom.component.css']
})
export class ProductsrandomComponent implements OnInit {
  @Input() nameproduct:string = ''
  @Input() sku:string = ''
  public promotionInfo : any = [];

  list:any[] = []
  default_image:string = "https://puu.sh/ImNRs/0ab1b352dc.png";
  id_store_current:string = ''
  id_store:string = ''
  constructor(
    private homeService: HomeService,
    private spinner: NgxSpinnerService,
    private PromotionsServices: PromotionsService,
    private stores: StoresService
  ) { this.getId() }

  ngOnInit(): void {
    this.gethome()
  }

  getId(){
    this.stores.getStoreId()
    .subscribe(async id => {
      if(id !== null && id !== "null"){
        this.id_store = id
      }
    })
  }

  gethome(){
    this.spinner.show()
    this.homeService.getHome(this.id_store).then(res => {
      let { productos } = JSON.parse(res.data.home)
      let separate = this.nameproduct.split(' ', 1)
      let random_products = productos.filter(product =>  {
        let name_separated = product.name.split(' ',1)
        if( name_separated[0] == separate[0] && product.sku !== this.sku ){
          return product
        }
      })
      this.list = random_products
      this.getPromos()
      this.spinner.hide()
    })
  }

  async getPromos(){
    this.list.forEach(async product => {
      this.PromotionsServices.getPromotion().subscribe((promotion : any) => {
      this.PromotionsServices.getPromotion()
      if(promotion){
        this.promotionInfo = promotion;
        if(this.promotionInfo&&this.promotionInfo!=false && (this.promotionInfo.type=='004' || this.promotionInfo.type=='002' || this.promotionInfo.type=='005' )){
          this.PromotionsServices.isProductInPromotion(this.id_store_current,product.sku).then((res2) => {
            if (res2.state == "success") {
                if(res2.data.length!=0){
                  product.promoActive = true;
                    }else{
                      product.promoActive = false;
                    }
                  }else{
                    product.promoActive = false;
                }
          }).catch((error) => {
              product.promoActive = false;
            });
       }
      }
    });
    })
  }

}

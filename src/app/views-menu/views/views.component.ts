import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { StoresService } from 'src/app/services/stores/stores.service';
import { PopUpInformationComponent } from 'src/app/shared/pop-up-information/pop-up-information.component';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.css']
})
export class ViewsComponent implements OnInit {

   id_store:string
  private subscriptions: Array<Subscription> = [];
  constructor( 
      private route: ActivatedRoute,
      private storesServices: StoresService,
      private cartService: CartService,
      private modalService: ModalService<PopUpInformationComponent>,
  ) {
    this.getId()
    this.listenPopUp()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  listenPopUp(){
    this.subscriptions.push(
      this.cartService.getShow()
      .subscribe(value => value && (this.open()))
    )
  }

  async open(): Promise<void> {
    const {PopUpInformationComponent} = await import(
      '../../shared/pop-up-information/pop-up-information.component'
    );

    await this.modalService.open(PopUpInformationComponent);
    this.modalService.nameComponent.next('PopUpInformationComponent')
  }


  
  ngOnInit(): void {
  }

  // loadStore(){
  //   this.storesServices.loadstore(this.route.snapshot.paramMap.get("id"));
  // }
  
  getId(){
    this.id_store = this.route.snapshot.paramMap.get('id')
    this.storesServices.loadstore(this.id_store)
  }


}

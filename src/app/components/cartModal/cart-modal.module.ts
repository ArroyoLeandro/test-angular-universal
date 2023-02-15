import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartModalComponent } from './cart-modal/cart-modal.component';
import { ModalModule } from 'src/app/shared/modal/modal.module';
import { RouterModule } from '@angular/router';
import { CheckoutsModule } from '../checkouts/checkouts.module';
import { TranslateModule } from '@ngx-translate/core';
import { PurchaseDetailComponent } from '../purchase-detail/purchase-detail.component';
import { PipesModule } from 'src/app/pipes/pipes.module';



@NgModule({
  declarations: [CartModalComponent, PurchaseDetailComponent],
  exports: [CartModalComponent, PurchaseDetailComponent],
  imports: [
    CommonModule,
    ModalModule,
    RouterModule,
    CheckoutsModule,
    TranslateModule,
    PipesModule
  ]
})
export class CartModalModule { }

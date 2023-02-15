import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PandoraWishComponent } from './pandora-wish/pandora-wish.component'
import { RouterModule } from '@angular/router';
import { NewslettersComponent } from './newsletters/newsletters.component';
import { ProductsrandomComponent } from './productsrandom/productsrandom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RecoverModalModule } from './login/recover-modal/recover-modal.module';
import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';
@NgModule({
  declarations: [
   FooterComponent,
   HeaderComponent,
   PandoraWishComponent,
   NewslettersComponent,
   ProductsrandomComponent,
   SidebarComponent
  ],
  exports: [
    FooterComponent,
    ProductsrandomComponent,
    HeaderComponent,
    PandoraWishComponent,
    NewslettersComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    RecoverModalModule,
    ComponentsModule,
    FormsModule,
    PipesModule
  ]
})
export class SharedModule { }

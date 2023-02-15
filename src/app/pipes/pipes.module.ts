import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrazilPipe } from './brazil.pipe';
import { CategoriesPipe } from './categories.pipe';
import { CategorySlugPipe } from './category-slug.pipe';
import { CurrencyPersonalizedPipe } from './currency-personalized.pipe';
import { DescVariantsPipe } from './desc-variants.pipe';



@NgModule({
  declarations: [ BrazilPipe, CategoriesPipe, CategorySlugPipe, CurrencyPersonalizedPipe, DescVariantsPipe  ],
  exports: [ BrazilPipe, CategoriesPipe, CategorySlugPipe, CurrencyPersonalizedPipe, DescVariantsPipe ],
  imports: [ CommonModule ],
  providers: [ BrazilPipe ]
})
export class PipesModule { }

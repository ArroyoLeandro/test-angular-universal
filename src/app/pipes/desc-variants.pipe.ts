import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descVariants'
})
export class DescVariantsPipe implements PipeTransform {

  transform(product:any): unknown {
    return ''
    //   return product.length == undefined && product.info_options.length === 0 
   //   ? '' 
   //   : (!product.info_options.find(prop => prop.name === "html_short_description") ? '' : product.info_options.find(prop => prop.name === "html_short_description").value) + '...' ;
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categorySlug'
})
export class CategorySlugPipe implements PipeTransform {

  transform(value: string): string {
    if(value && value.includes('-')){
      let finalValue:string = ''
      let newValue = value.split('-')
      newValue.map(item => finalValue = ` ${finalValue} ${item}` )
      finalValue = finalValue.trim()
      return finalValue
    }
    return value;
  }

}

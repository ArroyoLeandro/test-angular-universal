import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categories'
})
export class CategoriesPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    // console.log(value)
    let data = value.split('-')
    let word:string = ''
    data.forEach((words:string) => word = `${word} ${words}`)
    return word;
  }

}

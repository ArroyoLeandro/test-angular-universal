import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToggleClassService {

  public comprimida: boolean = false;

  constructor(){
    // document.documentElement.clientHeight <= 600 ? (this.comprimida = true) : ( this.comprimida = false )
  }

  public toggle(): void {

      this.comprimida = !this.comprimida;

  }

}

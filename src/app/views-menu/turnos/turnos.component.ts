import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
})
export class TurnosComponent implements OnInit {

  step01: boolean = true
  step02: boolean = false
  step03: boolean = false
  step04: boolean = false
  step05: boolean = false
  step06: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  getEvent(event){

    if(event.step01 && event.direction === 'forward' ){
      this.step01 = false
      this.step02 = true
    }

    if(event.step02 && event.direction === 'forward' ){
      this.step02 = false
      this.step03 = true
    }

    if(event.step02 && event.direction === 'back' ){
      this.step01 = true 
      this.step02 = false
    }

    if(event.step03 && event.direction === 'forward'){
      this.step04 = true
      this.step03 = false
    }

    if(event.step03 && event.direction === 'back'){
      this.step03 = false
      this.step02 = true
    }

    if(event.step04 && event.direction === 'forward'){
      this.step05 = true
      this.step04 = false
    }

    if(event.step04 && event.direction === 'back'){
      this.step04 = false
      this.step03 = true
    }

    if(event.step05 && event.direction === 'forward'){
      this.step06 = true
      this.step05 = false
    }

    if(event.step05 && event.direction === 'back'){
      this.step05 = false
      this.step04 = true
    }

    if(event.step06 && event.direction === 'back'){
         this.step06 = false
         this.step05 = true
    }



  }

}

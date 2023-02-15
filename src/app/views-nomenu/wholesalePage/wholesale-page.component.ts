import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WholesaleService } from 'src/app/services/wholesale/wholesale.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-wholesale-page',
  templateUrl: './wholesale-page.component.html',
  animations: [
    trigger('rotar', [
    state ('true', style({'transform': 'rotate(-90deg)'})),
    state ('false', style({'transform': 'rotate(90deg)'})),
    transition('false=>true', [animate('0.3s ease-in')]),
    transition('true=>false', [animate('0.3s ease-out')])
    ])
  ]
})
export class WholesalePageComponent implements OnInit {
  showPageThanks:boolean = false

  //mostrarForm:string = 'true';
  toggleForm: boolean = true;
   
  toState() {
    this.toggleForm = !this.toggleForm;
    //this.mostrarForm = this.toggleForm ? 'true':'false';
  }
  
  constructor(private wholesale: WholesaleService, private router: Router) { }

  ngOnInit(): void {
    this.setVerctg()
  }

  setVerctg(){
    this.wholesale.setVerCatalogo(false)
  }

  volver(){
    this.router.navigate(['/'])
    this.wholesale.setVerCatalogo(false)
  }

  ctg(){
    this.wholesale.setVerCatalogo(true)
    this.router.navigate(['/'])
  }

  getEvent(value:boolean){
    value ? this.showPageThanks = true : this.showPageThanks = false
  }

}

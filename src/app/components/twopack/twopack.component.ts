import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-twopack',
  templateUrl: './twopack.component.html',
  styles: [
  ]
})
export class TwopackComponent implements OnInit {
  @Input() product:any = {}
  @Input() catalogo: boolean = false
  category:string = 'boxes'
  default_image : string ="https://puu.sh/ImNRs/0ab1b352dc.png";
  constructor() { }

  ngOnInit(): void {
  }

}

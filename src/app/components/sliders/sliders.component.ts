import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.css']
})
export class SlidersComponent implements OnInit {

  @Input() sliders

  constructor() { }

  ngOnInit(): void {
  }

}

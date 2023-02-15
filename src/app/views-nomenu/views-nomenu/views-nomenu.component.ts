import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router"
@Component({
  selector: 'app-views-nomenu',
  templateUrl: './views-nomenu.component.html',
})
export class ViewsNomenuComponent implements OnInit {

  constructor(private router: Router) { }


  ngOnInit(): void {
    // this.router.navigate(['/tecnoweb'])
  }

}

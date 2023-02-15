import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeService } from 'src/app/services/home/home.service';

@Component({
  selector: 'app-pandora-wish',
  templateUrl: './pandora-wish.component.html',
  styleUrls: ['./pandora-wish.component.css']
})
export class PandoraWishComponent implements OnInit {
  @Input() height: number = 0
  images:any[] = []
  isAuth:boolean = false
  @Input() oneImg: boolean = false
  constructor(
    private homeservice: HomeService,
    private auth: AuthService,
    ) { }

  ngOnInit(): void {
    this.checkAuth()
  }
  
  checkAuth(){
    // this.auth.isAuthenticated() ? (this.isAuth = true) : (this.isAuth = false)  
    this.getImageBanner()
  }

  getImageBanner(){
    this.homeservice.getImage()
    .subscribe(img => this.images = img)
  }

}

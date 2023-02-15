import { Component, OnDestroy, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeService } from 'src/app/services/home/home.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})

export class AboutComponent implements OnInit, OnDestroy {
    url:string
    isAuth:boolean = false
    private subscriptions: Array<Subscription> = [];

    constructor(
      private homeservice: HomeService,
      private auth: AuthService,
    ) { this.checkAuth() }
  
    ngOnInit(): void {
    }

    checkAuth(){
      this.auth.isAuthenticated() ? (this.isAuth = true) : (this.isAuth = false)  
      this.getImageBanenr()
    }
    
    ngOnDestroy(){
      this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    getImageBanenr(){
      this.subscriptions.push(
        this.homeservice.getImage()
        .subscribe(img =>  this.url = img[1].url )
      )
    }
  
  }
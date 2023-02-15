import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: BehaviorSubject<String> = new BehaviorSubject('');

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformID,
    ) { }

  setToken(token:string){
    if(isPlatformBrowser(this.platformID)){
      localStorage.setItem('token', token)
    }
    this.token.next(token)
  }

  getToken(): Observable<any>{
    return this.token
  }

  isAuthenticated(): boolean{
    if(isPlatformBrowser(this.platformID)){
      const token = localStorage.getItem('token')
      token && this.token.next(token)
      return token ? true : false
    }

  }

  doLogout(){
      if(isPlatformBrowser(this.platformID)){
        localStorage.removeItem('verCatalogo')
        localStorage.removeItem('token')
      }
      window.location.href = '/'
      this.isAuthenticated()
  }

}

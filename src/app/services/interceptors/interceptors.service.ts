import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorsService implements HttpInterceptor {
  private token : ''
  constructor(private authService: AuthService) { this.getToken() }

  getToken(){
    this.authService.getToken()
    .subscribe(token => token !== '' && (this.token = token))
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.url.includes(".json") || req.url.includes("admin/files") ){
      return next.handle(req)
    }

    let headers: any = {'Content-Type': `application/json` }

    this.token && (headers.Authorization = `Bearer ${this.token}`)
  
    let request:any

    if(req.method.toLowerCase() === "post"){
      if(req.body instanceof FormData){
        request = req.clone({
          body: req.body.append("id_client", environment.CLIENT)
        })
      }else{
        request = req.clone({
          setHeaders: headers,
          params: req.params.set("id_client", environment.CLIENT)
        })
      }
    }
    else if(req.method.toLowerCase() === "get" || req.method.toLowerCase() === "put"){
      request = req.clone({
        setHeaders: headers,
        params: req.params.set("id_client", environment.CLIENT)
      })
    }

    return next.handle(request)
  }

}

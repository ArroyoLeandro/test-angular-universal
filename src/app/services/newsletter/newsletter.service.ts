import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  constructor(private httpservice: HttpService) { }


  saveEmail(data:object){
    return this.httpservice.post('newsletter', data)
  }

  contacForm(data:object){
    return this.httpservice.post('contact', data)
  }

}

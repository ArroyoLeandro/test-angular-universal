import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private slug : BehaviorSubject<string> = new BehaviorSubject('');
  constructor(private http: HttpService) { }

  setSlug(slug:string){
    this.slug.next(slug)
  }

  getSlug(){
    return this.slug
  }

  getShareByUserSlug(slug: string ) : Promise<any> {
    return this.http.get(`shares/${slug}/detail`);
  }

}

import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  constructor(private http: HttpService) { }

  getState(slug: string,parameters:any ) : Promise<any> {
    return this.http.get(`geo/list/${slug}`, parameters);
  }

}

import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpService) { }

  getList(id_store:string){
    return this.http.get(`categories/${id_store}/list`)
  }

  getMaterialsList() : Promise<any> {
    return this.http.get(`materials/list`)
  }

  getThemesList() : Promise<any> {
    return this.http.get(`themes/list`)
  }

}

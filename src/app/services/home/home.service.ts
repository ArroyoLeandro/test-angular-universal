import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  image: BehaviorSubject<any[]> = new BehaviorSubject([])
  configsGeneral: BehaviorSubject<any[]> = new BehaviorSubject([])
  constructor(
    private http: HttpService,
    @Inject(PLATFORM_ID) private platformID,
    
    ) { 
    this.getConf()
  }

  setImage(img){
    this.image.next(img)
  }

  getImage(){
    let img:any[] = []
    if(isPlatformBrowser(this.platformID)){
      img = JSON.parse(localStorage.getItem('banners')) || []
    }
    this.image.next(img)
    return this.image

  }

  getHome(id:string){
    return this.http.get(`home/getHome/${id}`)
  }

  getLanding(){
    return this.http.get('home/getHomeTwo')
  }

  getCatalogo(){
    return this.http.get(`home/getCatalogo?id_client=${environment.CLIENT}`)
  }

  getConfGeneralObs$(): Observable<any[]>{
    let config
    if(isPlatformBrowser(this.platformID)){
      config = JSON.parse(localStorage.getItem('configGeneral'))
    }
    this.configsGeneral.next(config)
    return this.configsGeneral
  }

  getConf(){
    if(isPlatformBrowser(this.platformID)){
      this.http.get('configurationsaround/get').then(res => {
        if(isPlatformBrowser(this.platformID)){
          localStorage.setItem('configGeneral', JSON.stringify(res.data))
        }
        this.configsGeneral.next(res.data)
      })
      .catch(err => {
        this.configsGeneral.next([])
      })
    }
  }

}

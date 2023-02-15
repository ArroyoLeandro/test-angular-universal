import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }
  get(url: string, params?: any) : Promise<any> {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      return this.http.get(`${environment.API_URL}${url}`, {params: params, headers: headers})
      .subscribe((response : any) => {
          resolve({data: response.response.data ? response.response.data : response.response, state: response.state});
        },(error) : any => {
          reject({data: error.response ? error.response : error.error.error, state: error.state ? error.state : error.error.state });
        });
    });
  }
  get2(url: string, params?: any) : Promise<any> {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      return this.http.get(`${environment.API_URL}${url}`, {params: params, headers: headers})
      .subscribe((response : any) => {
          resolve({data: response.response, state: response.state});
        },(error) : any => {
          reject({data: error.response, state: error.state });
        });
    });
  }

  post(url : string, params? : any) : Promise<any> {
    let headers = new HttpHeaders()
    .append('Content-Type', 'application/json');

    return new Promise((resolve, reject) => {
      return this.http.post(`${environment.API_URL}${url}`, JSON.stringify(params), {headers: headers})
      .subscribe((response : any) => {
          // console.log('response => ', response)
            resolve({data: response.response.data ? response.response.data : response.response, state: response.state});
          },(err) : any => {
            reject({data: err.data ? err.data : (err.error.error ? err.error.error : err.error.response.code), state: err.error.state});
        });
    });
  }

  getExternal(url : string, params? : any) : Promise<any> {
    let headers = new HttpHeaders()
    .append('Content-Type', 'application/json');

    return new Promise((resolve, reject) => {
      return this.http.get(`${url}`, {headers : headers, params: params})
      .subscribe((response : any) => {
          resolve({data: response.features});
        },(err) : any => {
          resolve({data: []});
        });
    });
  }

  loginPostWithoutToken(url: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http.post(`${environment.API_URL}${url}`, params)
        .subscribe((response: any) => {
          if (response.state == 'success') {
            resolve({ access_token: response });
          }
          else {
            reject({ msg: response.msg });
          }
        }, (err): any => {
          reject({ msg: err.error.error });
        });
    });
  }

  postFile(url: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {

      // let headers = new HttpHeaders()
      // .append('Authorization', `Bearer ${this.token}`);

      return this.http.post(`${environment.API_URL}${url}`, params, {params: params})
        .subscribe((response: any) => {
          if (response.state == 'success') {
            resolve({ data: response.response.data, msg: 'success' });
          }
          else {
            reject({ msg: response.msg });
          }
        }, (err): any => {
          reject({ msg: err.error.error });
        });
    });
  }

}

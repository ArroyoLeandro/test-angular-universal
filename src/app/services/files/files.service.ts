import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  file:any
  url:string = ''
  constructor(
    private spinner: NgxSpinnerService,
    private httpService: HttpService
  ) { }

  async handleImg(event): Promise<String> {
    let nameFile = event.target.files[0].name
    if (
      nameFile.includes("jpg") ||
      nameFile.includes("png") ||
      nameFile.includes("PNG") ||
      nameFile.includes("JPG") ||
      nameFile.includes("jpeg") ||
      nameFile.includes("JPEG") ||
      nameFile.includes("jfif") ||
      nameFile.includes("pdf")
    ){
      if (event.target.files && event.target.files[0]) {
        this.file = <File>event.target.files[0];
        // this.checkArray(<File>event.target.files[0]);
        this.spinner.show()
        try {
          let res = await this.upload()
          return res
        } catch (error) {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'Ha ocurrido un error'})
        }
      }
    }else{
      Swal.fire({icon: 'error', title: 'Oops...', text: 'Archivo no permitido'})
    }
  }

  async upload(): Promise<String> {
    // console.log(this.file)
    try {
      let response = this.file.name.includes('pdf') ? await this.uploadPdf(this.file) : await this.uploadFiles(this.file)
      this.spinner.hide()
      this.url = response.data
      return this.url
    } catch (error) {
      this.spinner.hide()
      Swal.fire({icon: 'error', title: 'Oops...', text: 'Ha ocurrido un error'})
      return this.url
    }
  }

  uploadFiles(data: any) : Promise<any> {
    const formData = new FormData();
    formData.append('file', data);
    return this.httpService.postFile(`admin/files`, formData)
  }

  uploadPdf(data:any): Promise<any> {
    const formData = new FormData();
    formData.append('file', data);
    return this.httpService.postFile(`admin/files/file2`, formData)
  }

}

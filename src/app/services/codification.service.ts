import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Codification } from 'app/shared/model/codification';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CodificationService {


  url_base = environment.url_api;

   headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});

  constructor(private http: HttpClient) { }


  getAllCodification() {
    return this.http.get(this.url_base + 'codifications')
  }

  getCodificationById(id: number) {
    return this.http.get(this.url_base + 'codifications/' + id)
  }

  getCodificationByNInventaire(n_inventaire: number) {
    return this.http.get(this.url_base + 'codifications/n_inventaire/' + n_inventaire)
  }

  createCodification(arg0: Codification) {
    return this.http.post(this.url_base + 'codification', arg0, {})
  }

  createsCodification(data: Codification[]) {
    return this.http.post(this.url_base + 'codifications', data, {})
  }

  updateCodification(id_codification: number, resul: Codification) {

    return this.http.request('put', this.url_base + 'codifications/' + id_codification, {
      body: resul,
      headers: this.headers
    })
  }


}

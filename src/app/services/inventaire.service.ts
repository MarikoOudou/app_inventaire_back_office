import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventaireService {



  url_base = environment.url_api;

  constructor(private http: HttpClient) { }

  getByPeriode(id_periode_inventaire:number) {
    return this.http.get(this.url_base + 'inventaires/' + id_periode_inventaire)
  }

  getById(id :number) {
    return this.http.get(this.url_base + 'inventaire/' + id)
  }

  getInventaireByCodificationAndPeriodeInventaire(id_codification :number, id_periode_inventaire :number ) {
    return this.http.get(this.url_base + 'inventaires/codification/' + id_codification + '/periodeinventaire/' + id_periode_inventaire)
  }


  createInventaire(data:any) {
    return this.http.post(this.url_base + 'inventaire', data)
  }

  updateInventaire (id: number, data: any) {
    return this.http.put(this.url_base + 'inventaire/' + id, data)
  }

  getAllInventaire () {
    return this.http.get(this.url_base + 'inventaires')
  }
}

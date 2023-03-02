import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PeriodeInventaire } from 'app/shared/model/periodeInventaire';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeriodeInventaireService {
  updatePeriodeInventaire(id_periode_inventaire: number, resul: PeriodeInventaire) {
    return this.http.put(this.url_base + 'periodeinentaire/' + id_periode_inventaire, resul, {})

  }

  url_base = environment.url_api;

  constructor(private http: HttpClient) { }

  getAllPeriodeInventaire() {
    return this.http.get(this.url_base + 'periodeinentaire')
  }

  getById(id: any) {
    return this.http.get(this.url_base + 'periodeinentaire/' + id)
  }

  createPeriodeInventaire(value: any) {
    return this.http.post(this.url_base + 'periodeinentaire', value, {})
  }

  update(value: any, id: number) {
    return this.http.put(this.url_base + 'periodeinentaire/' + id, value, {})
  }

  activeOrDiseable( id: number, value: any) {
    return this.http.patch(this.url_base + 'periodeinentaire/activeordiseable/' + id, value, {})
  }

}

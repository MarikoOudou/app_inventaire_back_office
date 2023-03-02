import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Users } from 'app/shared/model/users';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {



  url_base = environment.url_api;

  constructor(private http: HttpClient) { }

  getAllUser() {
    return this.http.get(this.url_base + 'users')
  }

  create(arg0: Users) {
    return this.http.post(this.url_base + 'users', arg0, {})
  }

  update(userId: number, resul: Users) {
    return this.http.put(this.url_base + 'users/' + userId, resul, {})
  }

}

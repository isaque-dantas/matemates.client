import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoginData, UserToSend} from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://127.0.0.1:8000/api/user'
  private tokenUrl = 'http://127.0.0.1:8000/api/token'

  constructor(private http: HttpClient) { }

  login(credentials: LoginData): Observable<any> {
    console.log('Logging in with:', credentials);
    return this.http.post(`${this.tokenUrl}`, credentials);
  }

  register(user: UserToSend): Observable<any> {
    console.log('Registering with:', user);
    return this.http.post(`${this.baseUrl}`, user);
  }
}

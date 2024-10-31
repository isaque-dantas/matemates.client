import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:8000/api/users'
  private tokenUrl = 'https://localhost:8000/api/token'

  constructor(private http: HttpClient) { }

  login(credentials: {email: string, password: string}): Observable<any> {
    console.log('Logging in with:', credentials);
    return this.http.post(`${this.tokenUrl}`, credentials);
  }

  register(user: {name: string, username: string, email: string, password: string}): Observable<any> {
    console.log('Registering with:', user);
    return this.http.post(`${this.baseUrl}`, user);
  }
}

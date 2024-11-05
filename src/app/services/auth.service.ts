import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {LoginData, UserToSend} from "../interfaces/user";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://127.0.0.1:8000/api/users'
  private tokenUrl = 'http://127.0.0.1:8000/api/token'

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: LoginData): Observable<any> {
    console.log('Logging in with:', credentials);
    return this.http.post<{access: string, refresh: string, userId: number}>(`${this.tokenUrl}`, credentials).pipe(
      tap(response => {
        if(response.access) {
          localStorage.setItem('access', response.access);

          const userId = this.getUserIdFromToken(response.access);
          if (userId) {
            localStorage.setItem('userId', userId.toString());
          }

          this.router.navigate(['']);
        }
      })
    );

  }

  private getUserIdFromToken(token: string): number | null {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.userId || null;
    } catch (error) {
      console.error('error decoding token:', error);
      return null;
    }
  }

  register(user: UserToSend): Observable<any> {
    console.log('Registering with:', user);
    return this.http.post(`${this.baseUrl}`, user);
  }

  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('userId');
    this.router.navigate(['login']);
  }

  isAuthenticated():boolean {
    return !!localStorage.getItem('access');
  }

  getToken(): string | null {
    if (!this.isAuthenticated()) {
      return null
    }

    return "Bearer " + localStorage.getItem('access');
  }
}

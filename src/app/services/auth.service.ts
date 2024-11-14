import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {LoginData, UserToSend} from "../interfaces/user";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://127.0.0.1:8000/api/users'
  private tokenUrl = 'http://127.0.0.1:8000/api/token'

  constructor(private http: HttpClient, private router: Router) {
  }

  login(credentials: LoginData): Observable<any> {
    console.log('Logging in with:', credentials);
    return this.http.post<{ access: string, refresh: string, userId: number }>(`${this.tokenUrl}`, credentials).pipe(
      tap(response => {
        if (response.access) {
          localStorage.setItem('access', response.access);
          this.router.navigate(['']);
        }
      })
    );

  }

  register(user: UserToSend): Observable<any> {
    console.log('Registering with:', user);
    return this.http.post(`${this.baseUrl}`, user);
  }

  logout() {
    localStorage.removeItem('access');
    this.router.navigate(['login']);
  }

  isAuthenticated(): boolean {
    return this.doesAccessTokenExist() && !this.isAccessTokenExpired()
  }

  isAccessTokenExpired(): boolean {
    if (!this.doesAccessTokenExist()) return false

    const token: string = localStorage.getItem('access')!
    const encodedTokenPayload = token.split('.')[1]
    const decodedTokenPayload = JSON.parse(atob(encodedTokenPayload))
    const exp = decodedTokenPayload.exp

    if (!exp) return false

    const expirationDate = new Date(exp * 1000).getTime()
    const currentDate = new Date().getTime()

    return currentDate >= expirationDate
  }

  doesAccessTokenExist() {
    return !!localStorage.getItem('access');
  }

  getToken(): string | null {
    if (!this.isAuthenticated()) {
      return null
    }

    return "Bearer " + localStorage.getItem('access');
  }
}

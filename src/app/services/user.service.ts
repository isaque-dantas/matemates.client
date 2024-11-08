import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://127.0.0.1:8000/api/users'

  constructor(private http: HttpClient) {}

  getUserData(token: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`);
    return this.http.get(`${this.baseUrl}`, {headers});
  }

  updateUser(token:string, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}`, userData, {
      headers: { Authorization: `bearer ${token}`}
    });
  };

  deleteUser(token: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}`).pipe(
      tap(() => console.log(`User deleted successfully`)),
      catchError(error => {
        console.error('error deleting user:', error);
        return throwError(error);
      })
    );
  }

  turnAdmin(data: {email: string}) {
    return this.http.post(`${this.baseUrl}/turn-admin`, data).pipe(
      tap(() => console.log(`User turn admin successfully`))
    )
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://127.0.0.1:8000/api/users'

  constructor(private http: HttpClient) {}

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}`).pipe(
      tap(() => console.log(`User ${userId} deleted successfully`)),
      catchError(error => {
        console.error('error deleting user:', error);
        return throwError(error);
      })
    );
  }
}

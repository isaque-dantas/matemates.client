import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {baseApiUrl} from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = `${baseApiUrl}/users`

  constructor(private http: HttpClient) {}

  getUserData(token: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`);
    return this.http.get(`${this.userUrl}`, {headers});
  }

  updateUser(token:string, userData: any): Observable<any> {
    return this.http.put(`${this.userUrl}`, userData, {
      headers: { Authorization: `bearer ${token}`}
    });
  };

  deleteUser(token: any): Observable<any> {
    return this.http.delete(`${this.userUrl}`).pipe(
      tap(() => console.log(`User deleted successfully`)),
      catchError(error => {
        console.error('error deleting user:', error);
        return throwError(error);
      })
    );
  }

  turnAdmin(data: {email: string}) {
    return this.http.post(`${this.userUrl}/turn-admin`, data).pipe(
      tap(() => console.log(`User turn admin successfully`))
    )
  }

  editProfileImage(profileImageBase64String: string) {
    return this.http.patch<{}>(`${this.userUrl}/profile_image`, {"profile_image_base64": profileImageBase64String})
  }

  getProfileImage(): Observable<Blob> {
    // @ts-ignore
    return this.http.get<Blob>(`${this.userUrl}/profile_image`, {responseType: "blob"})
  }
}

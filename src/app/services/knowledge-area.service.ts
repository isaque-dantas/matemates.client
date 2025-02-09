import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {KnowledgeArea, KnowledgeAreaToSend} from "../interfaces/knowledge-area";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class KnowledgeAreaService {
  baseUrl = "http://127.0.0.1:8000/api/knowledge_area"

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<KnowledgeArea[]>(this.baseUrl)
      .pipe(
        catchError(this.handleError)
      )
  }

  post(data: KnowledgeAreaToSend): Observable<KnowledgeArea> {
    return this.http.post(`${this.baseUrl}`, data) as Observable<KnowledgeArea>
  }

  delete(id: number): Observable<KnowledgeArea> {
    return this.http.delete(`${this.baseUrl}/${id}`) as Observable<KnowledgeArea>;
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError(() => new Error('TodoList not found'))
    }

    return throwError(() => new Error(`Error ${error.status}: ${error.statusText}`));
  }
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {KnowledgeArea} from "../interfaces/knowledge-area";
import {catchError, throwError} from "rxjs";
import {backendApiIp} from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class KnowledgeAreaService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<KnowledgeArea[]>(`http://${backendApiIp}:8000/api/knowledge_area`)
      .pipe(
        catchError(this.handleError)
      )
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError(() => new Error('TodoList not found'))
    }

    return throwError(() => new Error(`Error ${error.status}: ${error.statusText}`));
  }
}

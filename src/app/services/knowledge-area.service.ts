import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {KnowledgeArea} from "../interfaces/knowledge-area";
import {catchError, throwError} from "rxjs";
import {baseApiUrl} from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class KnowledgeAreaService {
  knowledgeAreaUrl = `${baseApiUrl}/knowledge_area`

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<KnowledgeArea[]>(this.knowledgeAreaUrl)
  }
}

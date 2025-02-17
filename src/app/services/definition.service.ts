import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DefinitionToSend} from "../interfaces/definition";

@Injectable({
  providedIn: 'root'
})
export class DefinitionService {
  private baseUrl = 'http://127.0.0.1:8000/api/definition'

  constructor(private http: HttpClient) { }

  put(definition: DefinitionToSend) {
    return this.http.put<{}>(`${this.baseUrl}/${definition.id}`, definition)
  }
}

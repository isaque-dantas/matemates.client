import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Definition, DefinitionToSend} from "../interfaces/definition";
import {baseApiUrl} from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class DefinitionService {
  private definitionUrl = `${baseApiUrl}/definition`

  constructor(private http: HttpClient) { }

  put(definition: DefinitionToSend) {
    return this.http.put<{}>(`${this.definitionUrl}/${definition.id}`, definition)
  }

  post(definition: DefinitionToSend) {
    return this.http.post<Definition>(this.definitionUrl, definition)
  }

  delete(id: number) {
    return this.http.delete<{}>(`${this.definitionUrl}/${id}`)
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DefinitionToSend} from "../interfaces/definition";
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
}

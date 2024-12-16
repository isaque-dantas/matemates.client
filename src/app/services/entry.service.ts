import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Entry} from "../interfaces/entry";
import {Definition} from "../interfaces/definition";

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private baseUrl = 'http://127.0.0.1:8000/api/entry'

  constructor(private http: HttpClient) {
  }

  get(id: number): Observable<Entry> {
    return this.http.get(`${this.baseUrl}/${id}`) as Observable<Entry>;
  }

  parseContent(entryData: Entry): string {
    const parsedTerms: string[] = entryData.terms.map(term => term.syllables.join("."))
    return parsedTerms.join(' ')
  }

  getKnowledgeAreasFromDefinitions(definitions: Definition[]): string[] {
    const knowledgeAreas: string[] = definitions.map(definition => definition.knowledge_area.content)
    return knowledgeAreas.filter(
      (value, index) => knowledgeAreas.indexOf(value) === index
    )
  }
}

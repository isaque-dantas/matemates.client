import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Entry, EntryToSend} from "../interfaces/entry";
import {Definition} from "../interfaces/definition";
import {Term} from "../interfaces/term";

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private baseUrl = 'http://127.0.0.1:8000/api/entry'

  constructor(private http: HttpClient) { }

  post(data: EntryToSend): Observable<Entry> {
    return this.http.post(`${this.baseUrl}`, data) as Observable<Entry>
  }

  get(id: number): Observable<Entry> {
    return this.http.get(`${this.baseUrl}/${id}`) as Observable<Entry>
  }

  getAll(): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.baseUrl}`)
  }

  search(searchQuery: string): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.baseUrl}?search_query=${searchQuery}`)
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`)
  }

  validate(id: number) {
    return this.http.patch(`${this.baseUrl}/${id}/validate`, {})
  }

  patchContent(id: number, content: string) {
    return this.http.patch(`${this.baseUrl}/${id}`, {content: content}) as Observable<{}>
  }

  parseContent(entryData: Entry): string {
    const parsedTerms: string[] = entryData.terms.map(term => term.syllables.join("."))
    return parsedTerms.join(' ')
  }

  parseEditableContent(entryData: Entry): string {
    const parsedTerms: string[] = entryData.terms.map((term) => {
      return (term.is_main_term ? "*" : "") + term.syllables.join(".") + (term.is_main_term ? "*" : "")
    })
    // console.log(parsedTerms)
    // console.log(parsedTerms.join(' '))
    return parsedTerms.join(' ')
  }

  getMainTermFromTerms(terms: Term[]): Term {
    return terms.filter((term) => term.is_main_term).at(0)!
  }

  getKnowledgeAreasContentsFromDefinitions(definitions: Definition[]): string[] {
    const knowledgeAreas: string[] = definitions.map(definition => definition.knowledge_area)
    return knowledgeAreas.filter(
      (value, index) => knowledgeAreas.indexOf(value) === index
    )
  }

  parseDefinitionsContents(definitions: Definition[]): string {
    return definitions.map((definition, index) => `${definition.content}`).join(" ")
  }
}

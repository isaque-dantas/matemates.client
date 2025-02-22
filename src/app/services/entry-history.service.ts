import { Injectable } from '@angular/core';
import { baseApiUrl } from '../app.config';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { EntryAccessHistory, EntryToAccess } from "../interfaces/entry-access-history";
import {EntryService} from "./entry.service";
import {Entry} from "../interfaces/entry";

@Injectable({
  providedIn: 'root'
})
export class EntryHistoryService {
  private historyUrl = `${baseApiUrl}/history`;
  private mostAccessedUrl = `${baseApiUrl}/history/most_accessed`;

  constructor(private http: HttpClient, private entryService: EntryService) { }

  getMostAccessedEntries(): Observable<EntryToAccess[]> {
    return this.http.get<EntryToAccess[]>(this.mostAccessedUrl);
  }

  getEntryDetails(entryId: number): Observable<Entry> {
    return this.entryService.get(entryId);
  }

  getUserAccessHistory(userId: number): Observable<EntryAccessHistory[]> {
    return this.http.get<EntryAccessHistory[]>(`${this.historyUrl}?user_id=${userId}`);
  }
}

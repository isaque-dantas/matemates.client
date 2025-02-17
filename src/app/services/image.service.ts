import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {KnowledgeArea} from "../interfaces/knowledge-area";
import {Question} from "../interfaces/question";
import {ImageToSend} from "../interfaces/image-to-send";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = 'http://127.0.0.1:8000/api/image'

  constructor(private http: HttpClient) { }

  get(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }

  getFile(id: number): Observable<Blob> {
    // @ts-ignore
    return this.http.get<Blob>(`${this.baseUrl}/${id}/blob_file`, {responseType: "blob"})
  }

  put(image: ImageToSend) {
    return this.http.put<{}>(`${this.baseUrl}/${image.id}`, image)
  }
}

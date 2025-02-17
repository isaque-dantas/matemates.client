import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {KnowledgeArea} from "../interfaces/knowledge-area";
import {Question} from "../interfaces/question";
import {ImageToSend} from "../interfaces/image-to-send";

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = 'http://127.0.0.1:8000/api/image'

  constructor(private http: HttpClient) { }

  get(id: number) {
    return this.http.get<any>(`http://127.0.0.1:8000/api/entry_image/${id}`)
  }

  put(image: ImageToSend) {
    return this.http.put<{}>(`${this.baseUrl}/${image.id}`, image)
  }
}

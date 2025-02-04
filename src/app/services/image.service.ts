import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {KnowledgeArea} from "../interfaces/knowledge-area";
import {backendApiIp} from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}

  get(id: number) {
    return this.http.get<any>(`http://${backendApiIp}:8000/api/entry_image/${id}`)
  }
}

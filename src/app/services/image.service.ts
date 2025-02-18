import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {KnowledgeArea} from "../interfaces/knowledge-area";
import {Question} from "../interfaces/question";
import {ImageToSend} from "../interfaces/image-to-send";
import {Observable} from "rxjs";
import {Image} from "../interfaces/image";
import {baseApiUrl} from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imageUrl = `${baseApiUrl}/image`

  constructor(private http: HttpClient) { }

  get(id: number) {
    return this.http.get<any>(`${this.imageUrl}/${id}`)
  }

  getFile(id: number): Observable<Blob> {
    // @ts-ignore
    return this.http.get<Blob>(`${this.imageUrl}/${id}/blob_file`, {responseType: "blob"})
  }

  getImageFiles(images: Image[]) {
    const imageFileList: string[] = []

    images.forEach((image: Image) => {
      this.getFile(image.id!).subscribe(
        (data: Blob) => imageFileList.push(URL.createObjectURL(data))
      )
    })

    return imageFileList
  }

  put(image: ImageToSend) {
    return this.http.put<{}>(`${this.imageUrl}/${image.id}`, image)
  }
}

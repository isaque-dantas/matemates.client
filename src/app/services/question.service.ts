import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Question} from "../interfaces/question";
import {baseApiUrl} from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questionUrl = `${baseApiUrl}/question`

  constructor(private http: HttpClient) { }

  put(question: Question) {
    return this.http.put<{}>(`${this.questionUrl}/${question.id}`, question)
  }
}

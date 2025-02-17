import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Question} from "../interfaces/question";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseUrl = 'http://127.0.0.1:8000/api/question'

  constructor(private http: HttpClient) { }

  put(question: Question) {
    return this.http.put<{}>(`${this.baseUrl}/${question.id}`, question)
  }
}

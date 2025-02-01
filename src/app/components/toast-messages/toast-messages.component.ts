import {Component} from '@angular/core';
import {Toast} from "../../interfaces/toast";
import {ToastService} from "../../services/toast.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-toast-messages',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './toast-messages.component.html',
  styleUrl: './toast-messages.component.css'
})
export class ToastMessagesComponent {
  toasts: Toast[] = []

  constructor(private toastService: ToastService) {
    this.toastService.subscribe(this.setToasts.bind(this))
    this.toastService.showToasts([
      {title: "foo", body: "foo foo foof o ofo o", type: "info", id: null},
      {title: "foo", body: "foo foo foof o ofo o", type: "warning", id: null},
      {title: "foo", body: "foo foo foof o ofo o", type: "warning", id: null},
      {title: "foo", body: "foo foo foof o ofo o", type: "warning", id: null},
      {title: "foo", body: "foo foo foof o ofo o", type: "warning", id: null},
      {title: "foo", body: "foo foo foof o ofo o", type: "warning", id: null},
      {title: "foo", body: "foo foo foof o ofo o", type: "warning", id: null},
      {title: "foo", body: "foo foo foof o ofo o", type: "warning", id: null},
      {title: "foo", body: "foo foo foof o ofo o", type: "warning", id: null},
      {title: "foo", body: "foo foo foof o ofo o", type: "error", id: null},
      {title: "foo", body: "foo foo foof o ofo o", type: "success", id: null},
    ])
  }

  setToasts(toasts: Toast[]) {
    this.toasts = toasts
  }

  hideToast(toastId: number) {
    console.log(toastId)
    console.log(this.toastService.toastsBeingShown)
    this.toastService.hideToasts([toastId])
  }
}

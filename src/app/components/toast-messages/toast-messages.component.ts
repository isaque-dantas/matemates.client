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
    this.toastService.showToasts(
      [
        {title: "Mensagem #1", body: "Corpo da mensagem 1, caro amogu!!!", id: 193029, type: "error"},
        {title: "Mensagem #2", body: "Corpo da mensagem 2, caro amogu!!!", id: 193029, type: "error"},
        {title: "Mensagem #3", body: "Corpo da mensagem 3, caro amogu!!!", id: 193029, type: "error"},
        {title: "Mensagem #4", body: "Corpo da mensagem 4, caro amogu!!!", id: 193029, type: "error"},
        {title: "Mensagem #5", body: "Corpo da mensagem 5, caro amogu!!!", id: 193029, type: "error"},
      ]
    )

    this.toastService.subscribe(this.setToasts.bind(this))
    this.toastService.emitToasts()
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

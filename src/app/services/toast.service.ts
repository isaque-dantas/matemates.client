import {EventEmitter, Injectable} from '@angular/core';
import {Toast} from "../interfaces/toast";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  get toastsBeingShown(): Toast[] {
    return this._toastsBeingShown;
  }

  set toastsBeingShown(value: Toast[]) {
    this._toastsBeingShown = value;
  }

  private _toastsBeingShown: Toast[] = []
  private maxToastId: number = 0

  toastsEmitter = new EventEmitter<Toast[]>()

  emitToasts() {
    this.toastsEmitter.emit(this._toastsBeingShown)
  }

  showToasts(toasts: Toast[]): Toast[] {
    toasts = toasts.map((toast: Toast) => {
      this.maxToastId++
      return {...toast, id: this.maxToastId}
    })

    this._toastsBeingShown = this._toastsBeingShown.concat(toasts)
    this.toastsEmitter.emit(this._toastsBeingShown)

    return toasts
  }

  hideToasts(toastsIds: number[]) {
    this._toastsBeingShown = this._toastsBeingShown.filter(toast => !toastsIds.includes(toast.id!))
    this.toastsEmitter.emit(this._toastsBeingShown)
  }

  subscribe(toastsHandler: (toasts: Toast[]) => void) {
    this.toastsEmitter.subscribe(toastsHandler)
  }

  unsubscribe() {
    this.toastsEmitter.unsubscribe()
  }
}

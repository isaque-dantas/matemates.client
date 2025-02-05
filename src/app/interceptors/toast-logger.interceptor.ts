import {HttpEventType, HttpInterceptorFn} from '@angular/common/http';
import {ToastService} from "../services/toast.service";
import {inject} from '@angular/core';
import {catchError, tap, throwError} from 'rxjs';

export const toastLoggerInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService)
  const getUrlPathWithoutIp = (path: string) => {
    const afterHttp = path.split("://")[1]
    return afterHttp.slice(afterHttp.indexOf("/"))
  }

  // console.log(req)

  const errorTranslator: { [key: number]: string } = {
    400: "Verifique se os dados estão no formato correto.",
    401: "Você não está logado; faça login e tente novamente.",
    403: "Você pode usar os recursos solicitados.",
    500: "Houve um erro na aplicação. Contate o administrador do sistema.",
  }

  return next(req).pipe(
    tap(event => {
      if (event.type === HttpEventType.Response) {
        toastService.showToasts([
          {
            title: `${req.method} ${getUrlPathWithoutIp(req.url)}`,
            body: `Operação bem-suscedida (${event.status})`,
            type: 'success',
            id: null
          }
        ])
      }
    }),
    catchError(error => {

      toastService.showToasts([
        {
          title: `${req.method} ${getUrlPathWithoutIp(req.url)}`,
          body: `Erro ${error.status}: ${errorTranslator[error.status] ?? error.message}`,
          type: 'error',
          id: null
        }
      ])

      return throwError(() => error)
    })
  )
}

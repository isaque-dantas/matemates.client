import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  console.log(authService.isAuthenticated())

  if (!authService.isAuthenticated()) {
    console.log("Not authenticated!!!")
    return next(req)
  }

  const newReq = req.clone({
    headers: req.headers.set('Authorization', authService.getToken()!),
  })

  return next(newReq);
};

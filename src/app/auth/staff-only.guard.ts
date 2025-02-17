import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {ToastService} from "../services/toast.service";

export const staffOnlyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService)
  const router = inject(Router);

  if (!authService.isAuthenticated()) return false

  if (authService.isLoggedUserStaff()) {
    return true;
  } else {
    toastService.showToasts([
      {
        title: "Permissão negada!",
        body: "Você não tem permissão para acessar essa página.",
        type: "error"
      }
    ])

    router.navigate(['']);

    return false;
  }
};

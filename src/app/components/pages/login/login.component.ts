import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {NgIf} from "@angular/common";
import {ToastService} from "../../../services/toast.service";
import {Toast} from "../../../interfaces/toast";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  loginFormToastsBeingShown: Toast[] = []

  constructor(private fb: FormBuilder, private authService: AuthService, private toastService: ToastService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(1)]],
      rememberMe: [false]
    })
  }

  ngOnInit(): void {
    const usernameField = this.loginForm.get('username')!
    const passwordField = this.loginForm.get('password')!

    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginForm.valid) return null

      this.subscribeToastsServiceInFormControl(usernameField as FormControl, "Username")
      this.subscribeToastsServiceInFormControl(passwordField as FormControl, "Senha")

      return null
    })
  }

  subscribeToastsServiceInFormControl(field: FormControl, fieldName: string) {
    if (field.valid) {
      this.toastService.hideToasts(
        this.loginFormToastsBeingShown
          .filter(toast => toast.title.includes(fieldName))
          .map(toast => toast.id!)
      )

      this.loginFormToastsBeingShown =
        this.loginFormToastsBeingShown
          .filter(toast => !toast.title.includes(fieldName))

      return null
    }

    if (!field.dirty) return null

    const messageErrors = Object.keys(field.errors as object).map((key) => this.errorToMessageError(key, field.errors as any))

    let toasts = messageErrors.map((errorMessage: string) => {
      return {title: `Erro em ${fieldName}`, body: errorMessage, type: "error"} as Toast
    })

    const toastsOfThisField = this.loginFormToastsBeingShown.filter(toast => toast.title.includes(fieldName))
    this.toastService.hideToasts(toastsOfThisField.map(toast => toast.id!))
    this.loginFormToastsBeingShown = this.loginFormToastsBeingShown.filter(toast => !toast.title.includes(fieldName))

    toasts = this.toastService.showToasts(toasts)
    this.loginFormToastsBeingShown.push(...toasts)

    console.log(toasts)
    console.log(this.loginFormToastsBeingShown)

    setTimeout(() => this.toastService.hideToasts(toasts.map(toast => toast.id!)), 5000);

    return null
  }

  errorToMessageError(errorKey: string, errors: {
    minlength?: { requiredLength: number, actualLength: number },
    required?: boolean
  }) {
    if (errorKey == "minlength") {
      const errorDetails = errors[errorKey]!
      return `O campo deveria ter pelo menos ${errorDetails.requiredLength} caracteres, mas tem somente ${errorDetails.actualLength}.`
    } else if (errorKey == "required") {
      return 'O campo é obrigatório.'
    } else {
      return 'Verifique se há erros no campo.'
    }

  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage = null

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.toastService.showToasts([
            {
              title: "Login",
              body: "Login realizado com sucesso!.",
              type: "success"
            }
          ])
        },
        error: (error) => {
          this.toastService.showToasts([
            {
              title: "Login",
              body: "Verifique seu login e/ou senha e tente novamente.",
              type: "error"
            }
          ])
        }
      });
    } else {
      this.errorMessage = 'Preencha os dados do formulário corretamente.'
    }
  }
}

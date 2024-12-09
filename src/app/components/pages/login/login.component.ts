import { Component, OnInit } from '@angular/core';
import {RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  showPasswordToast: false | undefined | boolean;
  showUserToast: false | undefined | boolean;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(1)] ],
      rememberMe: [false]
    })
  }

  ngOnInit(): void {
    this.loginForm.get('username')?.valueChanges.subscribe(() => {
      this.showUserToast = this.loginForm.get('username')?.invalid && this.loginForm.get('username')?.touched;
      if (this.showUserToast) {
        setTimeout(() => this.showUserToast = false, 5000);
      }
    });

    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      this.showPasswordToast = this.loginForm.get('password')?.invalid && this.loginForm.get('password')?.touched;
      if (this.showPasswordToast) {
        setTimeout(() => this.showPasswordToast = false, 5000);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage = null

      this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login successful', response)
      },
      error: (error) => {
        console.error('Login failed', error)
        this.errorMessage = 'Credenciais inválidas. Tente novamente';
      }
      });
    } else {
      this.errorMessage = 'Preencha os dados do formulário corretamente.'
    }
  }
}

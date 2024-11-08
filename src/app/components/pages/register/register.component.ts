import { Component, OnInit, OnDestroy } from '@angular/core';
import {RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  showPasswordToast: false | undefined | boolean;
  showUserToast: false | undefined | boolean;
  showEmailToast: false | undefined | boolean;
  showNameToast: false | undefined | boolean;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      rememberMe: [false]
    })
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (response) => {
          console.log('Registration successful', response)
        },
        (error) => {
          console.error('Registration failed', error)
        }
      )
    }
  }

  ngOnInit() {
    document.body.style.overflow = 'hidden';

    this.registerForm.get('username')?.valueChanges.subscribe(() => {
      this.showUserToast = this.registerForm.get('username')?.invalid && this.registerForm.get('username')?.touched;
      if (this.showUserToast) {
        setTimeout(() => this.showUserToast = false, 5000);
      }
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.showPasswordToast = this.registerForm.get('password')?.invalid && this.registerForm.get('password')?.touched;
      if (this.showPasswordToast) {
        setTimeout(() => this.showPasswordToast = false, 5000);
      }
    });

    this.registerForm.get('email')?.valueChanges.subscribe(() => {
      this.showEmailToast = this.registerForm.get('email')?.invalid && this.registerForm.get('email')?.touched;
      if (this.showEmailToast) {
        setTimeout(() => this.showEmailToast = false, 5000);
      }
    });

    this.registerForm.get('name')?.valueChanges.subscribe(() => {
      this.showNameToast = this.registerForm.get('name')?.invalid && this.registerForm.get('name')?.touched;
      if (this.showNameToast) {
        setTimeout(() => this.showNameToast = false, 5000);
      }
    });
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }
}

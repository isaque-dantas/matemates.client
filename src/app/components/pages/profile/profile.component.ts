import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {HeaderComponent} from "../../header/header.component";
import {MatIcon} from "@angular/material/icon";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    MatIcon,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  deleteForm: FormGroup;
  private destroy$ = new Subject<void>();
  private userId: number;
  errorMessage: string | null = null;

  constructor(public authService: AuthService,
              private router: Router,
              private userService: UserService,
              private fb: FormBuilder) {
    this.deleteForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.userId = Number(localStorage.getItem('userId')) || 0
  }

  confirmDeletion(): void {
    if (this.deleteForm.valid) {
      const { username, password } = this.deleteForm.value;
      this.authService.login({ username, password })
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            if (response.access) {
              this.deleteAccount();
              this.errorMessage = null;
            } else {
              this.errorMessage = 'Nome de usuário ou senha inválidos.';
            }
          },
          (error) => {
            console.error('Authentication failed:', error);
            this.errorMessage = 'Ocorreu um erro na autenticação. Tente novamente.'; // General error message
          }
        );
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.'; // Set error for invalid form
    }
  }

  private deleteAccount(): void {
    this.userService.deleteUser(this.userId).subscribe(
      () => {
        console.log('User deleted successfully');
        this.authService.logout();
        this.router.navigate(['login']);
      },
      error => {
        console.error('error deleting user:', error);
      }
    );
  }

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
    this.destroy$.next()
    this.destroy$.complete()
  }
}

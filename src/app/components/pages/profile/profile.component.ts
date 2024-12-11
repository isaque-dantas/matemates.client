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
  logMessage: string | null = null;
  userData: any;
  token: any;
  isEditable: boolean = false;
  userDataShow: FormGroup;
  turnAdminForm: FormGroup;

  constructor(public authService: AuthService,
              private router: Router,
              private userService: UserService,
              private fb: FormBuilder) {
    this.deleteForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.token = localStorage.getItem('access');

    this.userDataShow = this.fb.group({
      name: [
        {value: '', disabled: !this.isEditable},
        [Validators.required, Validators.minLength(3)]
      ],
      username: [
        {value: '', disabled: !this.isEditable},
        [Validators.required, Validators.minLength(3)]
      ],
      email: [
        {value: '', disabled: !this.isEditable},
        [Validators.required, Validators.email]
      ]
    });

    this.turnAdminForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
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
              this.logMessage = null;
            } else {
              this.logMessage = 'Nome de usuário ou senha inválidos.';
            }
          },
          (error) => {
            console.error('Authentication failed:', error);
            this.logMessage = 'Ocorreu um erro na autenticação. Tente novamente.'; // General error message
          }
        );
    } else {
      this.logMessage = 'Por favor, preencha todos os campos corretamente.'; // Set error for invalid form
    }
  }

  private deleteAccount(): void {
    this.userService.deleteUser(this.token).subscribe(
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
    this.userService.getUserData(this.token).subscribe(
      (data) => {
        this.userData = data;
        console.log('User Data:', this.userData);
        this.userDataShow.patchValue({
          name: this.userData.name,
          username: this.userData.username,
          email: this.userData.email
        })
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  toggleEdit() {
    this.isEditable = !this.isEditable;
    if (this.isEditable) {
      this.userDataShow.enable()
    } else {
      this.userDataShow.disable()
    }
  }

  saveChanges() {
    if (this.userDataShow.valid) {
      const updateData = this.userDataShow.value;
      this.userService.updateUser(this.token, updateData).subscribe(
        (response) => {
          console.log('User data update successfuly', response)
          this.toggleEdit()
        },
        (error) => {
          console.error('error updating data', error)
          this.logMessage = 'Erro interno, por favor, tente novamente.'
        }
      );
    } else {
      this.logMessage = '';

      if (this.userDataShow.get('name')?.hasError('required')) {
        this.logMessage = 'O nome é obrigatório'
      } else if (this.userDataShow.get('name')?.hasError('minlenght')) {
        this.logMessage = 'O nome precisa ter pelo menos 3 caracteres'
      }

      else if (this.userDataShow.get('email')?.hasError('required')) {
        this.logMessage = 'Um email é obrigatório'
      } else if (this.userDataShow.get('email')?.hasError('email')) {
        this.logMessage = 'Email inválido'
      }

      else if (this.userDataShow.get('username')?.hasError('required')) {
        this.logMessage = 'Um nome de usuário é obrigatório'
      } else if (this.userDataShow.get('username')?.hasError('minlenght')) {
        this.logMessage = 'O usuário precisa ter no mínimo 2 caracteres'
      }

      else if (this.userDataShow.get('password')?.hasError('required')) {
        this.logMessage = 'A senha é obrigatória'
      } else if (this.userDataShow.get('password')?.hasError('minlenght')) {
        this.logMessage = 'A senha precisa ter pelo menos 4 caracteres'
      }
    }
  }

  cancelEdit() {
    this.isEditable = !this.isEditable;
    this.userDataShow.disable()
    this.userDataShow.patchValue({
      name: this.userData.name,
      username: this.userData.username,
      email: this.userData.email
    })
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
    this.destroy$.next()
    this.destroy$.complete()
  }

  sendTurnAdminForm() {
    const data = this.turnAdminForm.value
    this.userService.turnAdmin(data).subscribe(
      (response) => {
        this.logMessage = `Convite foi enviado com sucesso para o email ${data.email}`
      }
    )
  }
}

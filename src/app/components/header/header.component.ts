import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLinkActive,
    NgForOf,
    RouterLink,
    MatButton,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  showElement: boolean = true;
  userData: any;
  token: any;
  navItems: any = [];

  constructor(public authService: AuthService, private router: Router, private userService: UserService) {
    this.router.events.subscribe(() => {
      const excludedRoutes = ['profile'];
      this.showElement = !excludedRoutes.includes(this.router.url);
    });
  }

  ngOnInit() {
    this.updateShowElement();
    this.router.events.subscribe(() => {
      this.updateShowElement();
    });

    this.userService.getUserData(this.token).subscribe(
      (data) => {
        this.userData = data;

        if (this.userData.is_staff) {
          this.navItems = [
            {'label': 'Início', 'link': ''},
            {'label': 'Criar', 'link': '/create_entry'},
            {'label': 'Sugerir Alteração', 'link': '/nae'},
          ]
        } else {
          this.navItems = [
            {'label': 'Início', 'link': ''},
            {'label': 'Sugerir Alteração', 'link': '/nae'},
          ]
        }

        console.log('User Data:', this.userData);
      }
    )
  }

  private updateShowElement() {
    const excludedRoutes = ['/profile'];
    this.showElement = !excludedRoutes.includes(this.router.url);
  }
}

import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {AuthService} from "../../services/auth.service";

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

  navItems = [
    {'label': 'Início', 'link': ''},
    {'label': 'Criar', 'link': 'create_entry'},
    {'label': 'Sugerir Alteração', 'link': 'report'},
  ]

  constructor(public authService: AuthService, private router: Router) {
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
  }

  private updateShowElement() {
    const excludedRoutes = ['/profile'];
    this.showElement = !excludedRoutes.includes(this.router.url);
  }
}

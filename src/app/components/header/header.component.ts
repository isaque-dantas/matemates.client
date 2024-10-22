import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {KeyValuePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLinkActive,
    NgForOf,
    RouterLink,
    KeyValuePipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  navItems = [
    {'label': 'Início', 'link': '/dashboard'},
    {'label': 'Dashboard', 'link': '/buscar'},
    {'label': 'Lorem', 'link': '/futureupdate'},
  ]
}

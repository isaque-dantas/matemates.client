import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {KeyValuePipe, NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLinkActive,
    NgForOf,
    RouterLink,
    KeyValuePipe,
    MatButton
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  navItems = [
    {'label': 'Início', 'link': ''},
    {'label': 'reportar', 'link': 'report'},
    {'label': 'Lorem', 'link':   'futureupdate'},
  ]
}

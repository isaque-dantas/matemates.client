import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {HeaderComponent} from "../../header/header.component";
import {MatIcon} from "@angular/material/icon";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    MatIcon
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {

  constructor(public authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }
}

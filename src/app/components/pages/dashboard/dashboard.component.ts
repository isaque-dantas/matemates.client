import {Component, signal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {HeaderComponent} from "../../header/header.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatIcon,
    NgForOf,
    HeaderComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  cardValues = [
    {'value': 'álgebra', 'qnt': 48},
    {'value': 'Geometria', 'qnt': 56},
    {'value': 'Lorem', 'qnt': 33},
    {'value': 'Lorem', 'qnt': 33},
    {'value': 'Lorem', 'qnt': 33},
    {'value': 'Lorem', 'qnt': 33},
    {'value': 'Lorem', 'qnt': 33},
    {'value': 'Lorem', 'qnt': 33},
    {'value': 'Lorem', 'qnt': 33}
  ]
}

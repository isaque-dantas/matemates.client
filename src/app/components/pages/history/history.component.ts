import { Component, OnInit } from '@angular/core';
import { EntryAccessHistory } from "../../../interfaces/entry-access-history";
import { EntryHistoryService } from "../../../services/entry-history.service";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { HeaderComponent } from "../../header/header.component";
import { Entry } from "../../../interfaces/entry";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    DatePipe,
    HeaderComponent,
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  userAccessHistory: EntryAccessHistory[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private entryHistoryService: EntryHistoryService) {}

  ngOnInit(): void {
    this.loadUserAccessHistory();
  }

  loadUserAccessHistory(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.loadEntryDetails();
  }

  loadEntryDetails(): void {
    this.entryHistoryService.getUserAccessHistory().subscribe({
      next: (data) => {
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user access history:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load user access history. Please try again later.';
      }
    })
  }
}

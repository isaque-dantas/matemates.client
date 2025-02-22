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
  entryDetails: { [key: number]: Entry } = {};
  isLoading: boolean = true;
  errorMessage: string | null = null;
  lastAccessedEntry: EntryAccessHistory | null = null;

  constructor(private entryHistoryService: EntryHistoryService) {}

  ngOnInit(): void {
    const userId = 1;
    this.loadUserAccessHistory(userId);
  }

  loadUserAccessHistory(userId: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.entryHistoryService.getUserAccessHistory(userId).subscribe({
      next: (data) => {
        const sortedHistory = data.sort((a, b) => {
          return new Date(b.access_moment).getTime() - new Date(a.access_moment).getTime();
        });

        this.userAccessHistory = sortedHistory.slice(0, 10);

        if (this.userAccessHistory.length > 0) {
          this.lastAccessedEntry = this.userAccessHistory[0];
          this.loadEntryDetails(this.lastAccessedEntry.entry_id);
        }

        this.loadEntryDetails();

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user access history:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load user access history. Please try again later.';
      }
    });
  }

  loadEntryDetails(entryId?: number): void {
    if (entryId) {
      this.entryHistoryService.getEntryDetails(entryId).subscribe({
        next: (details) => {
          this.entryDetails[entryId] = details;
          console.log('Entry details:', details);
        },
        error: (err) => {
          console.error('Failed to load entry details:', err);
        }
      });
    } else {
      this.userAccessHistory.forEach((history) => {
        this.entryHistoryService.getEntryDetails(history.entry_id).subscribe({
          next: (details) => {
            this.entryDetails[history.entry_id] = details;
            console.log('Entry details:', details);
          },
          error: (err) => {
            console.error('Failed to load entry details:', err);
          }
        });
      });
    }
  }
}

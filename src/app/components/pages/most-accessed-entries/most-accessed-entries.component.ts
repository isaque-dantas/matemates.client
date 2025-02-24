import { Component, OnInit } from '@angular/core';
import { EntryHistoryService } from "../../../services/entry-history.service";
import { EntryToAccess } from "../../../interfaces/entry-access-history";
import { Entry } from "../../../interfaces/entry";
import {NgForOf, NgIf} from "@angular/common";
import {HeaderComponent} from "../../header/header.component";
import {RouterLink} from "@angular/router";
import {EntriesCardsComponent} from "../../entries-cards/entries-cards.component";

@Component({
  imports: [NgIf, NgForOf, HeaderComponent, RouterLink, EntriesCardsComponent],
  standalone: true,
  selector: 'app-most-accessed-entries',
  templateUrl: './most-accessed-entries.component.html',
  styleUrls: ['./most-accessed-entries.component.css']
})
export class MostAccessedEntriesComponent implements OnInit {
  mostAccessedEntries: Entry[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private entryHistoryService: EntryHistoryService) {}

  ngOnInit(): void {
    this.loadMostAccessedEntries();
  }

  loadMostAccessedEntries(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.entryHistoryService.getMostAccessedEntries().subscribe({
      next: (data) => {
        this.mostAccessedEntries = data;
        console.log(this.mostAccessedEntries)
      },
      error: (err) => {
        console.error('Failed to load most accessed entries:', err);
        this.errorMessage = 'Failed to load most accessed entries. Please try again later.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}

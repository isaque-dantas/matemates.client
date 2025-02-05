import {Component} from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {EntriesCardsComponent} from "../entries-cards/entries-cards.component";
import {EntryService} from "../../services/entry.service";
import {ActivatedRoute} from "@angular/router";
import {Entry} from '../../interfaces/entry';
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-search-entries',
  standalone: true,
  imports: [
    HeaderComponent,
    EntriesCardsComponent,
    MatIcon,
    FormsModule
  ],
  templateUrl: './search-entries.component.html',
  styleUrl: './search-entries.component.css'
})
export class SearchEntriesComponent {
  entries: Entry[] = []
  searchQuery: string = ""
  isLoadingInProgress = false

  constructor(private entryService: EntryService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search_query']
      this.updateSearchQuery()
    });
  }

  updateSearchQuery(event: KeyboardEvent | undefined = undefined) {
    if (event && event.key !== "Enter") {
      return null
    }

    if (this.searchQuery) {
      this.isLoadingInProgress = true
      this.entryService.search(this.searchQuery).subscribe((data) => {
        this.entries = data
        this.isLoadingInProgress = false
      })
    } else {
      this.isLoadingInProgress = true
      this.entryService.getAll().subscribe((data) => {
        this.entries = data
        this.isLoadingInProgress = false
      })
    }

    return null
  }
}

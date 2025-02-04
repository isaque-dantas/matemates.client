import {Component} from '@angular/core';
import {Entry} from "../../interfaces/entry";
import {EntryService} from "../../services/entry.service";
import {HeaderComponent} from "../header/header.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-entries-cards',
  standalone: true,
  imports: [
    HeaderComponent
  ],
  templateUrl: './entries-cards.component.html',
  styleUrl: './entries-cards.component.css'
})
export class EntriesCardsComponent {
  entries?: Entry[]

  constructor(private entryService: EntryService, private route: ActivatedRoute) {
    this.route.params.subscribe(async (params) => {
      this.entryId = +params["id"];
    })

    this.entryService.getAll().subscribe((data) => {
      this.entries = data
    })

    this.router.
  }
}

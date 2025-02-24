import {afterNextRender, afterRender, Component, Input} from '@angular/core';
import {Entry} from "../../interfaces/entry";
import {EntryService} from "../../services/entry.service";
import {HeaderComponent} from "../header/header.component";
import {ActivatedRoute, Router, ParamMap, RouterLink} from "@angular/router";
import {Observable} from 'rxjs';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-entries-cards',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './entries-cards.component.html',
  styleUrl: './entries-cards.component.css'
})
export class EntriesCardsComponent {
  @Input() entries?: Entry[] = []
  @Input() isLoadingInProgress?: boolean
  knowledgeAreasData?: {contentOfFirstKnowledgeArea: string, thereAreMoreThanOne: boolean}[]

  constructor(protected entryService: EntryService) {
  }
  getFirstContentFromEntry(entry: Entry): string {
    return this.entryService.getKnowledgeAreasContentsFromDefinitions(entry.definitions)[0]
  }

  areThereManyDefinitionsInEntry(entry: Entry): boolean {
    return this.entryService.getKnowledgeAreasContentsFromDefinitions(entry.definitions).length > 1
  }

}

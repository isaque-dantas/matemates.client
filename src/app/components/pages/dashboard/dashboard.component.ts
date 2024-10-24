import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {HeaderComponent} from "../../header/header.component";
import {EntryService} from "../../../services/entry.service";
import {KnowledgeAreaService} from "../../../services/knowledge-area.service";
import {KnowledgeArea} from "../../../interfaces/knowledge-area";
import {CapitalizePipe} from "../../../pipes/capitalize.pipe";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIcon, NgForOf, HeaderComponent, CapitalizePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  knowledgeAreaCards?: { content: string, amountOfEntries: number }[];

  constructor(entryService: EntryService, knowledgeAreaService: KnowledgeAreaService) {
    knowledgeAreaService.getAll().subscribe(async (knowledgeAreas: KnowledgeArea[]) => {

      console.log(knowledgeAreas);

      this.knowledgeAreaCards = knowledgeAreas.map((area) => {
        const amountOfEntries = area.entries ? area.entries.length : 0
        return {content: area.content, amountOfEntries: amountOfEntries}
      })
    })
  }
}

import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HeaderComponent} from "../../header/header.component";
import {Entry} from "../../../interfaces/entry";
import {EntryService} from "../../../services/entry.service";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MdbCarouselModule} from "mdb-angular-ui-kit/carousel";

@Component({
  selector: 'app-entry-view',
  standalone: true,
  imports: [
    HeaderComponent,
    NgForOf,
    NgIf,
    MdbCarouselModule,
    NgOptimizedImage
  ],
  templateUrl: './entry-view.component.html',
  styleUrl: './entry-view.component.css'
})
export class EntryViewComponent {
  entryId: number = 10;
  entryData!: Entry
  parsedEntryContent!: string
  knowledgeAreas!: string[]

  constructor(private route: ActivatedRoute, private entryService: EntryService) {
    route.params.subscribe(async (params) => {
      this.entryId = +params["id"];
    })

    this.entryService.get(this.entryId).subscribe((entry: Entry) => {
      this.entryData = entry
      this.parsedEntryContent = this.entryService.parseContent(entry)
      this.knowledgeAreas = entryService.getKnowledgeAreasFromDefinitions(entry.definitions)

      const firstImage = document.querySelector(".carousel li.carousel-item")
      console.log(firstImage)
      if (firstImage) {
        firstImage.classList.add("active")
      }
    })

    document.addEventListener("DOMContentLoaded", () => {
      const firstImage = document.querySelector(".carousel li.carousel-item")
      console.log(firstImage)
      if (firstImage) {
        firstImage.classList.add("active")
      }
    })
  }

}

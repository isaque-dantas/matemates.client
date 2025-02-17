import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HeaderComponent} from "../../header/header.component";
import {Entry} from "../../../interfaces/entry";
import {EntryService} from "../../../services/entry.service";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "../../../services/toast.service";
import {Toast} from "../../../interfaces/toast";

@Component({
  selector: 'app-entry-view',
  standalone: true,
  imports: [
    HeaderComponent,
    NgForOf,
    NgIf,
    NgOptimizedImage,
    MatIcon
  ],
  templateUrl: './entry-view.component.html',
  styleUrl: './entry-view.component.css'
})
export class EntryViewComponent {
  entryId: number = 10;
  entryData!: Entry
  parsedEntryContent!: string
  knowledgeAreas!: string[]
  entryIsLoadedAlready = false

  constructor(private route: ActivatedRoute, private entryService: EntryService, private router: Router, private toastService: ToastService) {
    route.params.subscribe(async (params) => {
      this.entryId = +params["id"];
    })

    this.entryService.get(this.entryId).subscribe({
      next: (entry: Entry) => {
        console.log(entry)
        this.entryData = entry
        this.parsedEntryContent = this.entryService.parseContent(entry)
        this.knowledgeAreas = entryService.getKnowledgeAreasContentsFromDefinitions(entry.definitions)

        const firstImage = document.querySelector(".carousel li.carousel-item")
        console.log(firstImage)
        if (firstImage) {
          firstImage.classList.add("active")
        }

        this.entryIsLoadedAlready = true
      },
      error: (response: HttpErrorResponse) => {
        console.log(response)
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

  redirectToEdit(): void {
    this.router.navigate([`edit_entry/${this.entryId}`])
  }

  deleteEntry(): void {
    this.entryService.delete(this.entryId).subscribe()
  }

  validateEntry(): void {
    let toastToShow!: Toast

    if (this.entryData.is_validated) return;

    this.entryService.validate(this.entryId).subscribe({
      next: () => {
        toastToShow = {
          title: "Validar verbete",
          body: "Operação realizada com sucesso.",
          type: "success"
        }

        this.entryData.is_validated = true
      },

      error: (err: HttpErrorResponse) => {
        toastToShow = {
          title: "Validar verbete",
          body: `Ocorreu um erro (código ${err.status})`,
          type: "error"
        }
      },

      complete: () => {
        this.toastService.showToasts([toastToShow])
      }
    })
  }
}

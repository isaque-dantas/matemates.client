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
import {ImageService} from "../../../services/image.service";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-entry-view',
  standalone: true,
  imports: [
    HeaderComponent,
    NgForOf,
    NgIf,
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
  imageFileList: string[] = []
  genderList: string[] = []
  gramaticalCategoryList: string[] = []
  EntryEditting: boolean = false;

  constructor(private route: ActivatedRoute, private entryService: EntryService,
              private router: Router, private toastService: ToastService,
              private imageService: ImageService, private authService: AuthService,
              ) {
    route.params.subscribe(async (params) => {
      this.entryId = +params["id"];
    })

    this.entryService.get(this.entryId).subscribe({
      next: (entry: Entry) => {
        console.log('verbete:', entry)
        this.entryData = entry

        this.genderList = this.entryService.getGendersFromEntry(entry.terms)
        this.gramaticalCategoryList = this.entryService.getGrammaticalCategoriesFromEntry(entry.terms);

        console.log(this.gramaticalCategoryList);

        this.genderList = this.genderList.map(gender => {
          if (gender === 'M') {
            return 'masculino';
          } else if (gender === 'F') {
            return 'feminino';
          }
          return gender;
        });

        console.log(this.genderList)
        this.imageFileList = this.imageService.getImageFiles(entry.images)

        this.parsedEntryContent = this.entryService.parseContent(entry)
        this.knowledgeAreas = entryService.getKnowledgeAreasContentsFromDefinitions(entry.definitions)

        const firstImage = document.querySelector(".carousel li.carousel-item")
        console.log('imagem:', firstImage)
        if (firstImage) {
          firstImage.classList.add("active")
        }

        this.entryIsLoadedAlready = true
      },
      error: (response: HttpErrorResponse) => {
        if (response.status === 403) {
          this.toastService.showToasts([{
            title: "Erro de permissão",
            body: "Você não tem permissão para acessar esse verbete.",
            type: "error",
          }])
          this.router.navigate([''])
        } else if (response.status === 403) {
          this.toastService.showToasts([
            {
              title: "Erro de permissão",
              body: "Você não tem permissão para acessar este verbete.",
              type: "error"
            }
          ]);
          this.router.navigate(['']);
        } else {
          this.toastService.showToasts([
            {
              title: "Erro ao carregar verbete",
              body: "Ocorreu um erro ao carregar o verbete. Tente novamente mais tarde.",
              type: "error"
            }
          ]);
          this.router.navigate(['']);
        }
      }
    })

    document.addEventListener("DOMContentLoaded", () => {
      const firstImage = document.querySelector(".carousel li.carousel-item")
      console.log('imagem:', firstImage)
      if (firstImage) {
        firstImage.classList.add("active")
      }
    })
  }

  ngOnInit() {
    this.toggleEntryEdditing()
    this.authService.loggedUserDataChanged.subscribe(this.toggleEntryEdditing.bind(this))
  }

  formatSyllables(term: any): string {
    return term.syllables.join('.');
  }

  toggleEntryEdditing() {
    this.EntryEditting = this.authService.isLoggedUserStaff();
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

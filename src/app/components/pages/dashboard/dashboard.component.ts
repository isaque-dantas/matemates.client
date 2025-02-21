import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgForOf, NgIf} from "@angular/common";
import {HeaderComponent} from "../../header/header.component";
import {EntryService} from "../../../services/entry.service";
import {KnowledgeAreaService} from "../../../services/knowledge-area.service";
import {KnowledgeArea} from "../../../interfaces/knowledge-area";
import {CapitalizePipe} from "../../../pipes/capitalize.pipe";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormBuilder} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIcon, NgForOf, HeaderComponent, CapitalizePipe, ReactiveFormsModule, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  knowledgeAreaCards?: { id: number, content: string, amountOfEntries: number }[] = [];
  isStaff: boolean = false;
  KnowledgeAreaForm: FormGroup;
  KnowledgeAreaUpdateForm: FormGroup;
  allKnowledgeAreas: KnowledgeArea[] = [];
  contentResults: KnowledgeArea[] = [];
  knowledgeAreaId: number = 1;
  knowledgeAreaName: string | undefined;

  constructor(entryService: EntryService, private knowledgeAreaService: KnowledgeAreaService,
              private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.KnowledgeAreaForm = this.fb.group({
      content: ['', Validators.required]
    })

    this.KnowledgeAreaUpdateForm = this.fb.group({
      content: ['', Validators.required]
    })

    const saveId = localStorage.getItem('knowledgeAreaId')

    if (saveId) {
      this.knowledgeAreaId = +saveId
    }

    knowledgeAreaService.getAll().subscribe(async (knowledgeAreas: KnowledgeArea[]) => {
      console.log("Lista de áreas:", knowledgeAreas);
      console.log("ID que estou buscando:", this.knowledgeAreaId);

      const selectedArea = knowledgeAreas.find(area => area.id === this.knowledgeAreaId);
      console.log("Área encontrada:", selectedArea);

      this.knowledgeAreaCards = knowledgeAreas.map((area) => {
        const amountOfEntries = area.entries ? area.entries.length : 0
        return {id: area.id, content: area.content, amountOfEntries: amountOfEntries}
      })

      console.log(this.knowledgeAreaCards);
      this.allKnowledgeAreas = knowledgeAreas;
      this.contentResults = [...knowledgeAreas];
    })
  }

  searchContent() {
    const termContent = this.KnowledgeAreaForm.get('content')?.value.trim();
    if (!termContent) {
      this.contentResults = [...this.allKnowledgeAreas];
    } else {
      const regexContent = new RegExp(termContent, 'i');
      this.contentResults = this.allKnowledgeAreas.filter((item) =>
        regexContent.test(item.content)
      );
    }
  }

  saveKnowledgeAreaId(id: number) {
    this.knowledgeAreaId = id;

    console.log(this.knowledgeAreaId)
    const foundContent = this.knowledgeAreaCards?.find(area => area.id === this.knowledgeAreaId);
    this.knowledgeAreaName = foundContent?.content;
  }

  deleteKnowledgeArea(id: number) {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta área do conhecimento?");

    if (confirmDelete) {
      this.knowledgeAreaService.delete(id).subscribe({
        next: () => {
          this.knowledgeAreaCards = this.knowledgeAreaCards?.filter(card => card.id !== id);
          this.contentResults = this.contentResults.filter(card => card.id !== id);
        },
        error: (err) => {
          console.error('Erro ao excluir área do conhecimento:', err);
        }
      });
    }
  }

  ngOnInit() {
    this.isStaff = localStorage.getItem("loggedUserIsStaff") === 'true';
    console.log('is staff?', this.isStaff);
  }

  postKnowledgeArea() {
    console.log('tentando enviar forms...');
    if (this.KnowledgeAreaForm.invalid) {
      alert('formulário inválido!');
      console.log(this.KnowledgeAreaForm.get('content')!.errors)
    } else {
      this.knowledgeAreaService.post(this.KnowledgeAreaForm.value).subscribe({
        next: (res) => {
          console.log("Sucesso:", res)

          const newKnowledgeArea = {
            id: res.id,
            content: res.content,
            amountOfEntries: res.entries ? res.entries.length : 0
          };

          this.knowledgeAreaCards?.push(newKnowledgeArea);
          this.allKnowledgeAreas.push(res);
          this.contentResults.push(res);

        },
        error: (err) => console.error("erro:", err)
      });
      this.KnowledgeAreaForm.reset();
    }
  }

  updateKnowledgeArea() {
    this.knowledgeAreaService.put(this.knowledgeAreaId, this.KnowledgeAreaUpdateForm.value).subscribe({
      next: (res) => {
        console.log("Área do conhecimento atualizada:", res);

        if (this.knowledgeAreaCards) {
          const index = this.knowledgeAreaCards.findIndex(k => k.id === this.knowledgeAreaId);
          if (index !== -1) {
            this.knowledgeAreaCards[index] = {
              ...this.knowledgeAreaCards[index],
              content: this.KnowledgeAreaUpdateForm.value.content
            };
          }
        }
      },
      error: (err) => console.error("Erro ao atualizar:", err)
    });
  }


  searchEntries(event: KeyboardEvent) {
    console.log(event)
    console.log((event.target as HTMLInputElement).value)
    if (event.key == "Enter")
      this.router.navigate(
        ['/entries'],
        {
          queryParams: {search_query: (event.target as HTMLInputElement).value}
        }
      )
  }

  protected readonly localStorage = localStorage;
}

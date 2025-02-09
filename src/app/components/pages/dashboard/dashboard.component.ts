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
  knowledgeAreaCards?: { content: string, amountOfEntries: number }[];
  isStaff: boolean = false;
  KnowledgeAreaForm: FormGroup;
  allKnowledgeAreas: KnowledgeArea[] = [];
  contentResults: KnowledgeArea[] = [];
  subjectResults: KnowledgeArea[] = [];

  constructor(entryService: EntryService, private knowledgeAreaService: KnowledgeAreaService,
              private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.KnowledgeAreaForm = this.fb.group({
      content: ['', Validators.required],
      subject: ['', Validators.required],
    })

    knowledgeAreaService.getAll().subscribe(async (knowledgeAreas: KnowledgeArea[]) => {
      console.log(knowledgeAreas);

      this.knowledgeAreaCards = knowledgeAreas.map((area) => {
        const amountOfEntries = area.entries ? area.entries.length : 0
        return {content: area.content, amountOfEntries: amountOfEntries}
      })

      this.allKnowledgeAreas = knowledgeAreas;
      this.contentResults = [...knowledgeAreas];
      this.subjectResults = [...knowledgeAreas];
    })
  }

  searchContent() {
    const termContent = this.KnowledgeAreaForm.get('content')?.value.trim();
    if (!termContent) {
      this.contentResults = [...this.allKnowledgeAreas];  // Reseta os resultados se o campo estiver vazio
    } else {
      const regexContent = new RegExp(termContent, 'i');
      this.contentResults = this.allKnowledgeAreas.filter((item) =>
        regexContent.test(item.content)
      );
    }
  }

  searchSubject() {
    const termSubject = this.KnowledgeAreaForm.get('subject')?.value.trim();
    if (!termSubject) {
      this.subjectResults = [...this.allKnowledgeAreas];  // Reseta os resultados se o campo estiver vazio
    } else {
      const regexSubject = new RegExp(termSubject, 'i');
      this.subjectResults = this.allKnowledgeAreas.filter((item) =>
        regexSubject.test(item.subject)
      );
    }
  }

  ngOnInit() {
    this.isStaff = localStorage.getItem("loggedUserIsStaff") === 'true';
    console.log('is staff?', this.isStaff);
  }

  onSubmit() {
    if (this.KnowledgeAreaForm.invalid) {
      alert('formulário inválido!');
      console.log(this.KnowledgeAreaForm.get('content')!.errors)
    } else {
      this.knowledgeAreaService.post(this.KnowledgeAreaForm.value).subscribe({
        next: (res) => console.log("Sucesso:", res),
        error: (err) => console.error("erro:", err)
      });
    }
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
}

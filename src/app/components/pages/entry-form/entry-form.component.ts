import {afterRender, Component, inject} from '@angular/core';
import {HeaderComponent} from "../../header/header.component";
import {FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {KnowledgeAreaService} from "../../../services/knowledge-area.service";
import {KnowledgeArea} from "../../../interfaces/knowledge-area";
import {NgOptimizedImage} from "@angular/common";
import {QuestionsCarouselComponent} from "../../questions-carousel/questions-carousel.component";
import {Question} from "../../../interfaces/question";

@Component({
  selector: 'app-entry-form',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, FormsModule, NgOptimizedImage, QuestionsCarouselComponent],
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.css'
})
export class EntryFormComponent {
  knowledgeAreas?: KnowledgeArea[]
  private fb = inject(FormBuilder);
  form = this.fb.group({
    content: ['', Validators.required],
    definitions: this.fb.array([this.definitionGroupFactory()]),
    images: this.fb.array([this.imageGroupFactory()]),
    questions: this.fb.array([this.questionGroupFactory(), this.questionGroupFactory(), this.questionGroupFactory(), this.questionGroupFactory(), this.questionGroupFactory(), this.questionGroupFactory(), this.questionGroupFactory(), this.questionGroupFactory()]),
  });

  private notSetUpImagesIndexes: number[] = []
  private notSelectedLastEntriesNames: string[] = []

  constructor(knowledgeAreaService: KnowledgeAreaService) {
    knowledgeAreaService.getAll().subscribe((knowledgeAreas) => {
      this.knowledgeAreas = knowledgeAreas
    })

    afterRender({
      read: () => {
        if (!this.notSetUpImagesIndexes && !this.notSelectedLastEntriesNames) return null;

        this.notSetUpImagesIndexes.forEach(index => {
          this.addImageHandlingToIndex(index)
        })

        this.notSelectedLastEntriesNames.forEach(name => {
          this.selectLastItemInCarousel(name)
        })

        this.notSetUpImagesIndexes = []
        this.notSelectedLastEntriesNames = []
        return null;
      }
    })
  }

  get images() {
    return this.form.get('images') as FormArray;
  }

  get definitions() {
    return this.form.get('definitions') as FormArray
  }

  get questions() {
    return this.form.get('questions') as FormArray;
  }

  definitionGroupFactory() {
    return this.fb.group({content: [''], knowledgeAreaContent: ['']})
  }

  imageGroupFactory() {
    return this.fb.group({caption: [''], base64Image: [''], format: ['']})
  }

  questionGroupFactory(question: Question | null = null) {
    const group = this.fb.group({statement: [''], answer: ['']})
    if (question !== null) group.setValue(question)
    return group
  }

  addDefinition() {
    this.definitions.push(this.definitionGroupFactory())
    this.notSelectedLastEntriesNames.push("definition")
  }

  addImage() {
    this.images.push(this.imageGroupFactory())
    this.notSetUpImagesIndexes.push(this.images.length - 1)
    this.notSelectedLastEntriesNames.push("image")
  }

  addQuestion(data: { question: Question | null }) {
    this.questions.push(this.questionGroupFactory(data.question))
  }

  selectLastItemInCarousel(entityName: string) {
    const items = document.querySelectorAll(`.${entityName}-card .carousel-item`)

    items.forEach(item => {
      if (item.classList.contains("active")) item.classList.remove("active")
    })

    const lastItem = items.item(items.length - 1)
    lastItem.classList.add("active")
  }

  deleteActiveEntity(entityName: string) {
    const numberOfCarouselItems = document.querySelectorAll(`.${entityName}-card .carousel .carousel-item`).length
    if (numberOfCarouselItems <= 1) {
      return null
    }

    const activeCarouselItem = document.querySelector(`.${entityName}-card .carousel .carousel-item.active`)!
    const activeEntityIndex = parseInt(activeCarouselItem.id.split("-").at(-1)!)

    const entityRemoveTranslator: { [key: string]: Function } = {
      definition: this.definitions.removeAt.bind(this.definitions),
      image: this.images.removeAt.bind(this.images),
      question: this.questions.removeAt.bind(this.questions),
    };

    entityRemoveTranslator[entityName](activeEntityIndex)

    let newActiveItemIndex = 0
    if (activeEntityIndex !== 0) {
      newActiveItemIndex = activeEntityIndex - 1;
    }

    const carouselItems = document.querySelectorAll(`.${entityName}-card .carousel .carousel-item`)
    carouselItems.forEach((item) => {
      if (item.classList.contains("active")) item.classList.remove("active")
    })

    const newActiveItem = carouselItems.item(newActiveItemIndex)
    newActiveItem.classList.add("active")

    return null
  }

  deleteActiveDefinition() {
    this.deleteActiveEntity("definition")
  }

  deleteActiveImage() {
    this.deleteActiveEntity("image")
  }

  ngOnInit() {
    document.addEventListener("DOMContentLoaded", () => {
      const carouselCards = [".definition-card", ".image-card"]
      carouselCards.forEach((card) => {
        const firstCarouselItem = document.querySelector(`${card} .carousel .carousel-item`)!
        firstCarouselItem.classList.add("active")
      })

      this.addImageHandlingToIndex(0)
    })
  }

  addImageHandlingToIndex(index: number) {
    const imageContainer = document.querySelector(`div#image-${index}`)!
    const imageFileInput = imageContainer.querySelector("input[type='file']") as HTMLInputElement

    imageFileInput!.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      const file = target.files![0] as File

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result! as string
        this.images.controls.at(index)!.setValue({
          ...this.images.controls.at(index)!.value, base64Image: base64String
        })
      };

      reader.readAsDataURL(file);
    })
  }

  deleteQuestion(index: number) {
    if (this.questions.length <= 1) return null;

    this.questions.removeAt(index)

    return null;
  }

  editQuestion(eventData: { question: Question, index: number }) {
    console.log(eventData.question)
    this.questions.controls.at(eventData.index)!.setValue(eventData.question)
  }

  onSubmit() {
    console.log(this.form.value)
  }
}

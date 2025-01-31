import {afterRender, Component, inject} from '@angular/core';
import {HeaderComponent} from "../../header/header.component";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {KnowledgeAreaService} from "../../../services/knowledge-area.service";
import {KnowledgeArea} from "../../../interfaces/knowledge-area";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {QuestionsCarouselComponent} from "../../questions-carousel/questions-carousel.component";
import {Question} from "../../../interfaces/question";
import {ActivatedRoute} from "@angular/router";
import {EntryService} from "../../../services/entry.service";
import {Entry, EntryToSend} from "../../../interfaces/entry";
import {Definition} from "../../../interfaces/definition";
import {Image} from "../../../interfaces/image";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-entry-form',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, FormsModule, NgOptimizedImage, QuestionsCarouselComponent, NgIf],
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.css'
})
export class EntryFormComponent {
  knowledgeAreas?: KnowledgeArea[]
  entryId: number | null = null;

  private fb = inject(FormBuilder);
  form = this.fb.group({
    content: ['', Validators.required],
    main_term_gender: ['', Validators.required],
    main_term_grammatical_category: ['', Validators.required],
    definitions: this.fb.array([this.definitionGroupFactory()], [Validators.min(1)]),
    images: this.fb.array([this.imageGroupFactory()]),
    questions: this.fb.array(
      [
        this.questionGroupFactory(),
        this.questionGroupFactory(),
        this.questionGroupFactory(),
        this.questionGroupFactory(),
        this.questionGroupFactory(),
      ]
    ),
  });

  private notSetUpImagesIndexes: number[] = []
  private notSelectedLastEntriesNames: string[] = []

  constructor(knowledgeAreaService: KnowledgeAreaService, private route: ActivatedRoute, private entryService: EntryService) {
    this.route.params.subscribe(async (params) => {
      this.entryId = +params["id"];
    })

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

  definitionGroupFactory(definition: Definition | null = null) {
    let group = this.fb.group({content: ['', Validators.required], knowledge_area__content: ['', Validators.required]})
    if (definition !== null)
      group = this.fb.group({
        content: [definition.content],
        knowledge_area__content: [definition.knowledge_area.content]
      })

    return group
  }

  imageGroupFactory(image: Image | null = null) {
    let group = this.fb.group({caption: [''], base64_image: [''], id: [null]})

    if (image !== null)
      group = this.fb.group({
        caption: [image.caption],
        base64_image: [image.url],
        id: [null]
      })

    return group
  }

  questionGroupFactory(question: Question | null = null) {
    let group = this.fb.group({statement: [''], answer: ['']})

    if (question !== null) {
      group = this.fb.group({
        statement: [question.statement],
        answer: [question.answer]
      })
      // console.log("question not null!")
    }
    // else {
    // console.log("question!")
    // }

    console.log(question)
    console.log(group)
    console.log()
    return group
  }

  addDefinition() {
    console.log("addDefinition foi chamada!")
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

    if (this.entryId) {
      this.entryService.get(this.entryId).subscribe((entry: Entry) => {

        const mainTerm = this.entryService.getMainTermFromTerms(entry.terms)
        this.form.get("main_term_gender")!.setValue(mainTerm.gender)
        this.form.get("main_term_grammatical_category")!.setValue(mainTerm.grammatical_category)

        this.setInstanceQuestionsToForm(entry)
        console.log("Acabou questions")

        this.setInstanceDefinitionsToForm(entry)
        console.log("Acabou definitions")

        this.setInstanceImagesToForm(entry)
        console.log("Setou foi tudo!")

        this.form.get("content")!.setValue(this.entryService.parseEditableContent(entry))
      })
    }
  }

  setInstanceQuestionsToForm(entry: Entry) {
    if (entry.questions.length == 0) return null

    const questions = []
    for (let i = 0; i < this.questions.length; i++) {
      if (entry.questions.length <= i) {
        questions.push({statement: "", answer: ""})
      } else {
        questions.push({
          statement: entry.questions.at(i)!.statement,
          answer: entry.questions.at(i)!.answer
        })
      }
    }

    this.questions.setValue(questions)
    return null
  }

  setInstanceDefinitionsToForm(entry: Entry) {
    if (entry.definitions.length == 0) return null

    const definitions = entry.definitions.map(data => new Object(
      {
        content: data.content,
        knowledge_area__content: data.knowledge_area.content
      }
    ))

    definitions.slice(0, -1).forEach(() => {
      this.addDefinition()
    })

    console.log("definitions lenght: ", entry.definitions.length)
    console.log(definitions)

    this.definitions.setValue(definitions)
    return null
  }

  setInstanceImagesToForm(entry: Entry) {
    if (entry.images.length == 0) return null

    console.log(entry.images)
    const images = entry.images.map(data => new Object(
      {
        caption: data.caption,
        base64_image: data.url,
        id: data.id
      }
    ))

    images.slice(0, -1).forEach(() => {
      this.addImage()
    })
    this.images.setValue(images)

    return null
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
          ...this.images.controls.at(index)!.value, base64_image: base64String
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
    const entryData = this.form.value as EntryToSend

    if (this.form.invalid) {
      console.log("INVALID!")
      console.log(this.form.get('content')!.errors)
      console.log(this.getFormValidationErrors(this.form))
      return null
    }

    if (this.entryId) {
      entryData.images = entryData.images.map((image, i) => {
        console.log(image)
        if (image.base64_image && image.base64_image!.includes("http://")) {
          image.base64_image = ""
        }
        return image
      })

      this.entryService.put(this.entryId, entryData).subscribe(() => {
        console.log("sent succesfully!")
      })
    } else {
      this.entryService.post(entryData).subscribe({
        next: (data) => {
          console.log("sent succesfully!")
          console.log(data)
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
        }
      })
    }

    console.log(entryData)
    return null
  }

  getFormValidationErrors(form: FormGroup | FormArray): any {
    const errors: any = {}

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key)

      if (control instanceof FormGroup || control instanceof FormArray) {
        const childErrors = this.getFormValidationErrors(control)
        if (Object.keys(childErrors).length) {
          errors[key] = childErrors
        }
      } else if (control?.errors) {
        errors[key] = control.errors
      }
    })

    return errors
  }
}

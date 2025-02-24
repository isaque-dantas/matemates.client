import {afterRender, Component, inject} from '@angular/core';
import {HeaderComponent} from "../../header/header.component";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {KnowledgeAreaService} from "../../../services/knowledge-area.service";
import {KnowledgeArea} from "../../../interfaces/knowledge-area";
import {NgOptimizedImage} from "@angular/common";
import {QuestionsCarouselComponent} from "../../questions-carousel/questions-carousel.component";
import {Question} from "../../../interfaces/question";
import {ActivatedRoute, Router} from "@angular/router";
import {EntryService} from "../../../services/entry.service";
import {Entry, EntryToSend} from "../../../interfaces/entry";
import {Definition, DefinitionToSend} from "../../../interfaces/definition";
import {Image} from "../../../interfaces/image";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "../../../services/toast.service";
import {Toast} from "../../../interfaces/toast";
import {DefinitionService} from "../../../services/definition.service";
import {QuestionService} from "../../../services/question.service";
import {ImageService} from "../../../services/image.service";
import {ImageToSend} from "../../../interfaces/image-to-send";
import {toArray} from "rxjs";

const keysOfRelatedEntities = ['definitions', 'images', 'questions']
const formKeyTranslator: { [key: string]: string } = {
  main_term_gender: "Gênero",
  main_term_grammatical_category: "Classe gramatical",
  content: "Nome",
  definitions: "Definição",
  images: "Imagem",
  questions: "Exemplo",
  knowledge_area__content: "Área do conhecimento",
}
const formKeyGender: { [key: string]: string } = {
  main_term_gender: "M",
  main_term_grammatical_category: "F",
  content: "M",
  definitions: "F",
  images: "F",
  questions: "M",
  knowledge_area__content: "F",
}

@Component({
  selector: 'app-entry-form',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, FormsModule, NgOptimizedImage, QuestionsCarouselComponent],
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.css'
})
export class EntryFormComponent {
  knowledgeAreas?: KnowledgeArea[]
  entryId: number | null = null;
  toastsFromForm: Toast[] = []
  imageFileList: string[] = []

  dirtyEntities?: {
    entryContent: boolean,
    mainTermGender: boolean,
    mainTermGrammaticalCategory: boolean,
    definitions: { toUpdate: DefinitionToSend[], toCreate: DefinitionToSend[] },
    images: { toUpdate: ImageToSend[], toCreate: ImageToSend[] },
    questions: { toUpdate: Question[], toCreate: Question[] }
  } = undefined

  private fb = inject(FormBuilder);
  form = this.fb.group({
    content: ['', Validators.required],
    main_term_gender: ['', Validators.required],
    main_term_grammatical_category: ['', Validators.required],
    definitions: this.fb.array([
      this.definitionGroupFactory()
    ], [Validators.min(1)]),
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

  constructor(
    private knowledgeAreaService: KnowledgeAreaService,
    private route: ActivatedRoute,
    private entryService: EntryService,
    private toastService: ToastService,
    private definitionService: DefinitionService,
    private questionService: QuestionService,
    private imageService: ImageService,
    private router: Router
  ) {
    this.route.params.subscribe(async (params) => {
      this.entryId = +params["id"];
    })

    this.knowledgeAreaService.getAll().subscribe((knowledgeAreas) => {
      this.knowledgeAreas = knowledgeAreas
    })

    afterRender({
      read: () => {
        if (!this.notSelectedLastEntriesNames) return;

        this.notSelectedLastEntriesNames.forEach(name => {
          this.selectLastItemInCarousel(name)
        })

        this.notSelectedLastEntriesNames = []
        return;
      }
    })

    this.form.valueChanges.subscribe(this.checkFormValidity.bind(this))
    this.form.valueChanges.subscribe(this.updateDirtyEntities.bind(this))
  }

  get images() {
    return this.form.get('images') as FormArray
  }

  get definitions() {
    return this.form.get('definitions') as FormArray
  }

  get questions() {
    return this.form.get('questions') as FormArray
  }

  definitionGroupFactory(definition: Definition | null = null) {
    if (definition == null)
      return this.fb.group({
        id: [null],
        content: ['', Validators.required],
        knowledge_area__content: ['', Validators.required]
      })

    return this.fb.group({
      id: [definition.id],
      content: [definition.content],
      knowledge_area__content: [definition.knowledge_area]
    })
  }

  imageGroupFactory(image: Image | null = null) {
    if (image === null)
      return this.fb.group({caption: [''], base64_image: [''], id: [null]})

    return this.fb.group({
      caption: [image.caption],
      base64_image: [image.url],
      id: [image.id]
    })
  }

  questionGroupFactory(question: Question | null = null) {
    if (question === null)
      return this.fb.group({statement: [''], answer: [''], id: [null]})

    return this.fb.group({
      statement: [question.statement],
      answer: [question.answer],
      id: [question.id],
    })
  }

  addDefinition() {
    // console.log("addDefinition foi chamada!"
    this.definitions.push(this.definitionGroupFactory())
    this.notSelectedLastEntriesNames.push("definition")
  }

  addImage() {
    this.images.push(this.imageGroupFactory())
    this.notSelectedLastEntriesNames.push("image")
  }

  addQuestion(data: { question: Question | null }) {
    this.questions.push(this.questionGroupFactory(data.question))
    this.questions.controls.at(this.questions.controls.length - 1)!.markAsDirty()
    this.updateDirtyEntities()
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
    console.log(entityName)

    const numberOfCarouselItems = document.querySelectorAll(`.${entityName}-card .carousel .carousel-item`).length
    if (numberOfCarouselItems <= 1) {
      return null
    }

    const activeCarouselItem = document.querySelector(`.${entityName}-card .carousel .carousel-item.active`)!
    const activeEntityIndex = parseInt(activeCarouselItem.id.split("-").at(-1)!)

    const entityIdTranslator: { [key: string]: FormArray } = {
      definition: this.definitions,
      image: this.images,
    }

    const entityId: number = entityIdTranslator[entityName].at(activeEntityIndex)!.value.id

    const entityRemoveTranslator: { [key: string]: Function } = {
      definition: (index: number) => {
        this.definitions.removeAt(index)
        this.definitionService.delete(entityId).subscribe()
      },
      image: (index: number) => {
        this.images.removeAt(index)
        this.imageService.delete(entityId).subscribe()
      }
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
    })

    if (this.entryId) {
      this.entryService.get(this.entryId).subscribe((entry: Entry) => {
        this.setInstanceImagesToForm(entry)
        this.setBase64Data(entry.images)

        const mainTerm = this.entryService.getMainTermFromTerms(entry.terms)

        this.form.get("content")!.setValue(this.entryService.parseEditableContent(entry))
        this.form.get("main_term_gender")!.setValue(mainTerm.gender)
        this.form.get("main_term_grammatical_category")!.setValue(mainTerm.grammatical_category)

        this.setInstanceQuestionsToForm(entry)
        this.setInstanceDefinitionsToForm(entry)
      })
    }
  }

  setInstanceQuestionsToForm(entry: Entry) {
    if (entry.questions.length == 0) return null

    const questions = []
    for (let i = 0; i < this.questions.length; i++) {
      if (entry.questions.length <= i) {
        questions.push({statement: "", answer: "", id: null})
      } else {
        questions.push({
          statement: entry.questions.at(i)!.statement,
          answer: entry.questions.at(i)!.answer,
          id: entry.questions.at(i)!.id
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
        knowledge_area__content: data.knowledge_area,
        id: data.id
      }
    ))

    definitions.slice(0, -1).forEach(() => {
      this.addDefinition()
    })

    this.definitions.setValue(definitions)
    return null
  }

  setInstanceImagesToForm(entry: Entry) {
    if (entry.images.length == 0) return;

    const images = entry.images.map((data: Image, index: number) => new Object(
        {
          caption: data.caption,
          base64_image: "",
          id: data.id
        }
      )
    )

    images.slice(0, -1).forEach(() => {
      this.addImage()
    })

    this.images.setValue(images)

    return;
  }

  setBase64Data(images: Image[]) {
    images.forEach((image: Image, index: number) => {
      this.imageService.getFile(image.id!).subscribe(
        (data: Blob) => {
          // console.log(`acabou #${index}`)
          this.images.at(index).setValue({
            ...this.images.at(index).value,
            base64_image: URL.createObjectURL(data)
          })
        }
      )
    })
  }

  handleImageChanging(event: Event, index: number) {
    const target = event.target as HTMLInputElement
    const file = target.files![0] as File

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result! as string
      this.images.controls.at(index)!.setValue({
        ...this.images.controls.at(index)!.value, base64_image: base64String
      })
    };

    reader.readAsDataURL(file);
  }

  deleteQuestion(index: number) {
    if (this.questions.length <= 1) return null;

    const questionId: number | null = this.questions.at(index).value.id
    if (questionId) {
      this.questionService.delete(questionId).subscribe()
    }

    this.questions.removeAt(index)

    return null;
  }

  editQuestion(eventData: { question: Question, index: number }) {
    console.log(eventData.question)
    this.questions.controls.at(eventData.index)!.markAsDirty()
    this.questions.controls.at(eventData.index)!.setValue(eventData.question)
  }

  onSubmit(): void {
    if (this.form.invalid) {
      console.log("INVALID!")
      console.log(this.form.get('content')!.errors)
      console.log(this.getFormValidationErrors(this.form))
      return;
    }

    if (!this.entryId) {
      console.log("Posted entry")
      this.postEntry()
      return;
    }

    if (this.isDirtyEntitiesEmpty()) {
      console.log("não há dirty entries")
      this.toastService.showToasts([{
        title: "Edição do verbete",
        body: "Nenhuma alteração detectada.",
        type: "warning"
      }])

      return;
    }

    this.updateEntry()
    this.createNewRelatedEntities()
  }

  postEntry() {
    const entryData = this.removeEmptyDataFromForm(this.form.value as EntryToSend)

    this.entryService.post(entryData).subscribe(
      {
        next: (data) => {
          this.toastService.showToasts([{
            title: "Criação do verbete",
            body: `Verbete #${data.id} criado com sucesso!`,
            type: "success"
          }])
        },

        error: (error: HttpErrorResponse) => {
          const errorToasts = this.getToastsFromResponseErrors(error.error)
          this.toastService.showToasts(errorToasts)
        }
      }
    )
  }

  updateEntry() {
    this.updateDefinitions(this.dirtyEntities!.definitions.toUpdate)
    this.updateQuestions(this.dirtyEntities!.questions.toUpdate)
    this.updateImages(this.dirtyEntities!.images.toUpdate)

    if (
      !this.dirtyEntities!.entryContent &&
      !this.dirtyEntities!.mainTermGender &&
      !this.dirtyEntities!.mainTermGrammaticalCategory
    ) return;

    this.updateEntryFixedData()
  }

  updateDefinitions(definitions: DefinitionToSend[]) {
    if (definitions.length == 0) return;
    console.log(definitions)

    const successfulToastPrefix = "Edição da definição"
    const failureToastPrefix = "Erro na definição"

    definitions.forEach((definition) => {
      const indexInFormArray = this.getFormArrayIndexFromId(this.definitions, definition.id!)

      this.definitionService.put(definition).subscribe({
        next: () => this.handleSuccessfulPut(indexInFormArray, this.definitions, successfulToastPrefix),
        error: (err: HttpErrorResponse) => this.handleFailurePut(err, indexInFormArray, failureToastPrefix)
      })
    })
  }

  updateQuestions(questions: Question[]) {
    if (questions.length == 0) return;

    const successfulToastPrefix = "Edição do exemplo"
    const failureToastPrefix = "Erro no exemplo"

    questions.forEach((question) => {
      const indexInFormArray = this.getFormArrayIndexFromId(this.questions, question.id!)

      this.questionService.put(question).subscribe({
        next: () => this.handleSuccessfulPut(indexInFormArray, this.questions, successfulToastPrefix),
        error: (err) => this.handleFailurePut(err, indexInFormArray, failureToastPrefix)
      })
    })
  }

  updateImages(images: ImageToSend[]) {
    if (images.length == 0) return;

    const successfulToastPrefix = "Edição da imagem"
    const failureToastPrefix = "Erro na imagem"

    images.forEach((image) => {
      const indexInFormArray = this.getFormArrayIndexFromId(this.images, image.id!)

      this.imageService.put(image).subscribe({
        next: () => this.handleSuccessfulPut(indexInFormArray, this.images, successfulToastPrefix),
        error: (err) => this.handleFailurePut(err, indexInFormArray, failureToastPrefix)
      })
    })
  }

  handleSuccessfulPut(index: number, formArray: FormArray, prefix: string) {
    formArray.at(index).markAsPristine()

    const successToast: Toast = {
      title: `${prefix} #${index + 1}`,
      body: `Edição realizada com sucesso!`,
      type: "success"
    }

    this.toastService.showToasts([successToast])
  }

  handleFailurePut(error: HttpErrorResponse, index: number, prefix: string) {
    const errorToast: Toast = {
      title: `${prefix} #${index + 1}`,
      body: `${error.message} (código ${error.status})`,
      type: "error"
    }

    this.toastService.showToasts([errorToast])
  }

  getFormArrayIndexFromId(formArray: FormArray, id: number): number {
    return Object.values(formArray.value)
      .findIndex((value: any) => value.id === id)
  }

  updateEntryFixedData() {
    const data = {
      content:
        this.dirtyEntities!.entryContent ?
          this.form.controls.content.value! : undefined,

      main_term_gender:
        this.dirtyEntities!.mainTermGender ?
          this.form.controls.main_term_gender.value! : undefined,

      main_term_grammatical_category:
        this.dirtyEntities!.mainTermGrammaticalCategory ?
          this.form.controls.main_term_grammatical_category.value! : undefined,
    }

    console.log(data)

    this.entryService.patch(this.entryId!, data).subscribe({
      next: () => this.toastService.showToasts([{
        title: "Edição dos dados do verbete",
        body: "Operação realizada com suscesso.",
        type: "success"
      }]),
      error: (err: HttpErrorResponse) => this.toastService.showToasts([{
        title: "Edição dos dados do verbete",
        body: `${err.message} (código ${err.status})`,
        type: "error"
      }])
    })
  }

  createNewRelatedEntities() {
    this.insertEntryIdInDirtyEntities()

    if (this.dirtyEntities!.definitions.toCreate) {
      this.postNewDefinitions(this.dirtyEntities!.definitions.toCreate)
    }

    if (this.dirtyEntities!.questions.toCreate) {
      this.postNewQuestions(this.dirtyEntities!.questions.toCreate)
    }

    if (this.dirtyEntities!.images.toCreate) {
      this.postNewImages(this.dirtyEntities!.images.toCreate)
    }
  }

  insertEntryIdInDirtyEntities() {
    this.dirtyEntities!.definitions.toCreate =
      this.dirtyEntities!.definitions.toCreate.map(
        value => new Object({...value, entry: this.entryId!}) as DefinitionToSend
      )

    this.dirtyEntities!.questions.toCreate =
      this.dirtyEntities!.questions.toCreate.map(
        value => new Object({...value, entry: this.entryId!}) as Question
      )

    this.dirtyEntities!.images.toCreate =
      this.dirtyEntities!.images.toCreate.map(
        value => new Object({...value, entry: this.entryId!}) as ImageToSend
      )
  }

  postNewDefinitions(definitions: DefinitionToSend[]) {
    definitions.forEach((definition) => {
      this.definitionService.post(definition).subscribe(
        this.getHandlersForPost(this.definitions, "a definição", definition.id!)
      )
    })
  }

  postNewQuestions(questions: Question[]) {
    questions.forEach((question) => {
      this.questionService.post(question).subscribe(
        this.getHandlersForPost(this.questions, "o exemplo", question.id!)
      )
    })
  }

  postNewImages(images: ImageToSend[]) {
    images.forEach((image) => {
      this.imageService.post(image).subscribe(
        this.getHandlersForPost(this.images, "a imagem", image.id!)
      )
    })
  }

  getHandlersForPost(formArray: FormArray, entityName: string, controlIndex: number) {
    const successToast: Toast = {
      title: `Criação d${entityName} #${controlIndex}`,
      body: "Operação realizada com sucesso!",
      type: "success"
    }

    return {
      next: () => {
        formArray.at(controlIndex)!.markAsPristine()
        this.toastService.showToasts([successToast])
      },
      error: (err: HttpErrorResponse) => {
        this.toastService.showToasts([{
          title: `Criação d${entityName} #${controlIndex}`,
          body: `Erro ${err.message} (código ${err.status})`,
          type: "error"
        }])
      },
    }
  }

  getFormValidationErrors(form: FormGroup | FormArray): any {
    const errors: any = {}

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key)

      if (control instanceof FormGroup || control instanceof FormArray) {
        const childErrors = this.getFormValidationErrors(control as FormGroup | FormArray)
        if (Object.keys(childErrors).length) {
          errors[key] = childErrors
        }
      } else if (control?.errors) {
        errors[key] = control.errors
      }
    })

    return errors
  }

  checkFormValidity(): void {
    const formErrors = this.getFormValidationErrors(this.form)
    const newToasts = this.getToastsFromFormErrors(formErrors)

    if (this.toastService.toastsBeingShown) {
      this.toastService.hideToasts(this.toastsFromForm.map(toast => toast.id!))
    }

    this.toastsFromForm = this.toastService.showToasts(newToasts)
  }

  getToastsFromFormErrors(formErrors: {
    [key: string]: string | { [index: number]: { [key: string]: { required: boolean } } }
  }): Toast[] {
    const toasts: Toast[] = []

    for (let key in formErrors) {
      const error = formErrors[key]
      const translatedKey = formKeyTranslator[key]
      const keyGender = formKeyGender[key]

      if (!keysOfRelatedEntities.includes(key)) {
        toasts.push(
          {
            title: translatedKey,
            body: 'O campo é obrigatório.',
            type: "error"
          }
        )

        continue
      }

      for (let errorIndex in error as { [index: number]: { [key: string]: { required: boolean } } }) {

        const thereAreManyErrors = Object.keys(error[errorIndex]).length > 1
        const pluralSuffix = thereAreManyErrors ? "s" : ""
        const toBeVerb = thereAreManyErrors ? "são" : "é"

        const fieldsWithErrors =
          Object.keys(error[errorIndex])
            .map(name => formKeyTranslator[name] ?? name)
            .map(name => "'" + name + "'")
            .join(", ")

        toasts.push(
          {
            title: `Erro${pluralSuffix} n${keyGender == "M" ? "o" : "a"} ${translatedKey} #${parseInt(errorIndex) + 1}`,
            body: `O${pluralSuffix} campo${pluralSuffix} ${fieldsWithErrors} ${toBeVerb} obrigatório${pluralSuffix}.`,
            type: 'error'
          }
        )
      }
    }

    return toasts
  }

  removeEmptyDataFromForm(entryData: EntryToSend) {
    entryData.definitions = entryData.definitions.filter(
      definition => !this.areAllValuesEmpty(definition)
    )

    entryData.questions = entryData.questions.filter(
      question => !this.areAllValuesEmpty(question)
    )

    entryData.images = entryData.images.filter(
      image => !this.areAllValuesEmpty(image)
    )

    return entryData
  }

  areAllValuesEmpty(obj: object) {
    return Object.values(obj).every(value => value === "" || value == null)
  }

  getToastsFromResponseErrors(error: any): Toast[] {
    const toasts: Toast[] = []

    for (let fieldOrEntityName in error) {

      if (!keysOfRelatedEntities.includes(fieldOrEntityName)) {
        const fieldName = fieldOrEntityName

        const fieldErrors = error[fieldName]

        toasts.push(...fieldErrors.map((fieldError: string): Toast => {
          return {
            title: `Erro em ${formKeyTranslator[fieldName] ?? fieldName}`,
            body: fieldError,
            type: 'error'
          }
        }))

        continue
      }

      for (let [index, entityErrors] of error[fieldOrEntityName].entries()) {
        const entityName = fieldOrEntityName

        for (let fieldName in entityErrors) {
          const fieldErrors = entityErrors[fieldName]
          const keyGender = formKeyGender[entityName]

          toasts.push(...fieldErrors.map((fieldError: string): Toast => {
            return {
              title: `Erro n${keyGender == "M" ? "o" : "a"} '${formKeyTranslator[entityName] ?? entityName}' #${index + 1}`,
              body: fieldError,
              type: 'error'
            }
          }))
        }
      }
    }

    return toasts
  }

  updateDirtyEntities() {
    // console.log(this.questions.value)
    // console.log(this.questions.controls.map(control => control.dirty))

    this.dirtyEntities = {
      definitions: this.getDirtyData(this.definitions),
      images: this.getDirtyData(this.images),
      questions: this.getDirtyData(this.questions),
      entryContent: this.form.controls.content.dirty,
      mainTermGender: this.form.controls.main_term_gender.dirty,
      mainTermGrammaticalCategory: this.form.controls.main_term_grammatical_category.dirty
    }

    // console.log(this.dirtyEntities)
  }

  isDirtyEntitiesEmpty() {
    if (this.dirtyEntities == undefined) return false

    return (
      this.dirtyEntities.definitions.toUpdate.length == 0 &&
      this.dirtyEntities.definitions.toCreate.length == 0 &&

      this.dirtyEntities.questions.toUpdate.length == 0 &&
      this.dirtyEntities.questions.toCreate.length == 0 &&

      this.dirtyEntities.images.toUpdate.length == 0 &&
      this.dirtyEntities.images.toCreate.length == 0 &&

      !this.dirtyEntities.entryContent &&
      !this.dirtyEntities.mainTermGrammaticalCategory &&
      !this.dirtyEntities.mainTermGender
    )
  }

  getDirtyData(formArray: FormArray) {
    return {
      "toUpdate":
        formArray.controls
          .filter(control => control.dirty)
          .map(control => control.value)
          .filter(value => value.id !== null),
      "toCreate":
        formArray.controls
          .map((control, index) => {
            return {dirty: control.dirty, value: control.value, controlIndex: index}
          })
          .filter(control => control.dirty && control.value.id == null)
          .map(control => {
            return {...control.value, id: control.controlIndex}
          }),
    }
  }
}

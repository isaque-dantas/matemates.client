import {afterNextRender, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgOptimizedImage} from "@angular/common";
import {Question} from "../../interfaces/question";

@Component({
  selector: 'app-questions-carousel',
  standalone: true,
  imports: [
    FormsModule,
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  templateUrl: './questions-carousel.component.html',
  styleUrl: './questions-carousel.component.css'
})
export class QuestionsCarouselComponent {
  @Input() form!: FormGroup;
  @Input() questions!: FormArray<FormGroup>;

  @Output() addQuestion = new EventEmitter<{ question: Question | null }>()
  @Output() deleteQuestion = new EventEmitter<number>()
  @Output() editQuestion = new EventEmitter<{ question: Question, index: number }>()

  private fb = inject(FormBuilder)
  questionForm = this.fb.group({
    statement: ["", Validators.required],
    answer: ["", Validators.required],
  })

  private itemSize: number | null = null
  private firstItemIndex: number = 0

  constructor() {
    afterNextRender(() => {
      this.itemSize = this.calculateItemWidth()
    })

    addEventListener("resize", () => {
      this.itemSize = this.calculateItemWidth()
    })

    document.addEventListener("DOMContentLoaded", () => {
      // const itemsHeight = document.querySelector<HTMLElement>(".items-height")!
      // const items = document.querySelector<HTMLElement>(".items")!
      //
      // itemsHeight.style.height = `${items.clientHeight}px`
      // items.style.left = "0"
    })
  }

  ngAfterViewInit() {
    const itemsHeight = document.querySelector<HTMLElement>(".items-height")!
    const items = document.querySelector<HTMLElement>(".items")!

    itemsHeight.style.height = `${items.clientHeight}px`
    items.style.left = "0"
  }

  calculateItemWidth() {
    const item = document.querySelector(".items > div")

    if (item) {
      const rect = item.getBoundingClientRect()
      return rect.width
    }

    return 0
  }

  currentEditingQuestionIndex: number | null = null

  setCurrentEditingQuestionIndex(index: number) {
    this.currentEditingQuestionIndex = index
    this.questionForm.setValue(this.questions.at(index).value)
  }

  delete(index: number) {
    this.deleteQuestion.emit(index)
  }

  edit(index: number) {
    this.editQuestion.emit({question: this.questionForm.value as Question, index: index})
    this.questionForm.reset()

    this.currentEditingQuestionIndex = null
  }

  submitNewQuestion() {
    console.log(this.questionForm.value)
    this.addQuestion.emit({question: this.questionForm.value as Question})
    this.questionForm.reset()

    return null
  }

  resetForm() {
    this.questionForm.reset()
  }

  setFirstItemIndex(index: number) {
    this.firstItemIndex = index
    const items = document.querySelector<HTMLDivElement>(".items")!
    items.style.left = `${this.firstItemIndex * -1 * this.itemSize!}px`
  }

  goToPrevItems() {
    if (this.firstItemIndex < 2) return null;

    this.setFirstItemIndex(this.firstItemIndex - 2)
    return null
  }

  goToNextItems() {
    if (this.firstItemIndex > this.questions.length - 3) return null;

    this.setFirstItemIndex(this.firstItemIndex + 2)
    return null
  }
}

import { Component } from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {ImageService} from "../../../services/image.service";

@Component({
  selector: 'app-image-test',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './image-test.component.html',
  styleUrl: './image-test.component.css'
})
export class ImageTestComponent {
  image: any

}

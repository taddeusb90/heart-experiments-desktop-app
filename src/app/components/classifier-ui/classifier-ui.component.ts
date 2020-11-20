import { Component, OnInit } from '@angular/core';
import { ClassifierService } from '../../services/classifier/classifier.service';

@Component({
  selector: 'app-classifier-ui',
  templateUrl: './classifier-ui.component.html',
  styleUrls: ['./classifier-ui.component.scss'],
})
export class ClassifierUiComponent implements OnInit {
  imageData: ImageData;
  constructor(public classifierService: ClassifierService) {
    this.classifierService.imageDataObservable.subscribe((imageData) => {
      this.imageData = imageData;
      this.classifierService.context.putImageData(imageData, 10, 10);
    });
  }

  ngOnInit(): void {}
}

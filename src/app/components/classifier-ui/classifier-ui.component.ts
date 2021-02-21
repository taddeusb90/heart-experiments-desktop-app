import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-classifier-ui',
  templateUrl: './classifier-ui.component.html',
  styleUrls: ['./classifier-ui.component.scss'],
})
export class ClassifierUiComponent implements OnInit {
  imageData: ImageData;
  constructor() {}

  ngOnInit(): void {}
}

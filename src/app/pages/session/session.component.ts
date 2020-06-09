import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';


@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {
  public webcamImage : WebcamImage = null;

  constructor() {}

  handleImage = (webcamImage: WebcamImage) => {
    this.webcamImage = webcamImage;
  }


  ngOnInit(): void {
    
  }
}

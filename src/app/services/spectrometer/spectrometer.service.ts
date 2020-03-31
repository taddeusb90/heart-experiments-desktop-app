import { Injectable } from '@angular/core';
import { WebcamImage } from "ngx-webcam";
@Injectable({
  providedIn: 'root'
})
export class SpectrometerService {

  constructor() { }

  measureImage(picture: WebcamImage) {
    // https://github.com/lovell/sharp/blob/e0fa15f5cb8896e39c25d51d3370380892bacb50/test/unit/stats.js
  }
}

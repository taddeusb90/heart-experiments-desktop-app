/* eslint-disable one-var */
import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root',
})
export class ClassifierService {
  static instance: ClassifierService;
  public tf: any;
  public cv: any;
  public sharp: any;
  public model: any;

  constructor(public electronService: ElectronService) {
    if (!ClassifierService.instance) {
      ClassifierService.instance = this;
    }
    this.tf = electronService.tf;
    this.cv = electronService.cv;
    this.sharp = electronService.sharp;
    this.model = this.tf.loadLayersModel('assets/model/model.json');
  }

  loadModel = async (): Promise<void> => {
    this.model = await this.tf.loadLayersModel('assets/model/model.json');
  };

  predict = async (image: any): Promise<number> => {
    // await this.cv.imwrite('filename.jpg', image);
    // const data = await this.cv.imencode('.jpg', image);
    const data = await image.getData();
    const imageData = new ImageData(200, 200);
    for (let i = 0; i < data.length; i += 4) {
      imageData.data[i] = data[i]; //red
      imageData.data[i + 1] = data[i + 1]; //green
      imageData.data[i + 2] = data[i + 2]; //blue
      imageData.data[i + 3] = data[i + 3]; //alpha
    }
    const ndarray = await this.tf.browser.fromPixels(imageData).toFloat().expandDims();
    const prediction = await this.model.predict(ndarray).data();
    const predictedClass = prediction.indexOf(Math.max(...prediction));
    return predictedClass;
  };

  loadImage = async (filePath: string): Promise<any> => {
    const image = await await this.sharp(filePath);
    return image;
  };

  cropImage = async (image: any): Promise<any> => {
    const left = 170,
      top = 40,
      width = 650,
      height = 650;

    let croppedImage = await image.extract({ top, left, width, height }).toBuffer();
    croppedImage = await this.cv.imdecode(croppedImage);
    return croppedImage;
  };

  resizeImage = async (image): Promise<any> => {
    const resizedImage = await image.resize(200, 200);
    return resizedImage;
  };

  makePrediction = async (imagePath: string): Promise<number> => {
    let image = await this.loadImage(imagePath);
    image = await this.cropImage(image);
    image = await this.resizeImage(image);
    const prediction = await this.predict(image);
    return prediction;
  };
}

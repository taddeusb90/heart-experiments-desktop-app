/* eslint-disable one-var */
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root',
})
export class ClassifierService {
  static instance: ClassifierService;
  public tf: any;
  public cv: any;
  public model: any;
  public imageDataSubject: Subject<ImageData> = new Subject<ImageData>();
  public predictionSubject: Subject<number> = new Subject<number>();
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  constructor(public electronService: ElectronService) {
    if (!ClassifierService.instance) {
      ClassifierService.instance = this;
    }
    this.tf = electronService.tf;
    this.cv = electronService.cv;
    this.model = this.tf.loadLayersModel('assets/model/model.json');
    setTimeout(() => {
      this.canvas = document.getElementById('classifier-canvas-1') as HTMLCanvasElement;
      this.context = this.canvas.getContext('2d');
    }, 2000);

    return ClassifierService.instance;
  }

  loadModel = async (): Promise<void> => {
    this.model = await this.tf.loadLayersModel('assets/model/model.json');
    console.log('Finished loading model');
  };

  predict = async (image: any): Promise<number> => {
    this.tf.engine().startScope();
    const imageBuffer = image.getDataAsArray();
    const imgData = this.context.createImageData(200, 200);

    const newImageData = imageBuffer.reduce((acc, cv) => {
      return acc.concat(
        cv.reduce((ac, c) => {
          return ac.concat(...c, 255);
        }, []),
      );
    }, []);

    for (let i = 0; i < imgData.data.length; i += 4) {
      // channels are inverted below because opencv does not use the same ordering
      imgData.data[i + 0] = newImageData[i + 2];
      imgData.data[i + 1] = newImageData[i + 1];
      imgData.data[i + 2] = newImageData[i + 0];
      imgData.data[i + 3] = newImageData[i + 3]; // alpha
    }

    this.context.putImageData(imgData, 10, 10);

    const tensor = await this.tf.browser
      .fromPixels(this.context.getImageData(10, 10, 200, 200))
      .toFloat();
    const offset = this.tf.scalar(0.00392156862745098).toFloat();
    const scaled = tensor.mul(offset).toFloat();
    const normalized = scaled.expandDims();
    const prediction = await this.model.predict(normalized).dataSync();
    const predictedClass = prediction.indexOf(Math.max(...prediction));
    this.handlePrediction(predictedClass);
    this.tf.dispose(tensor);
    this.tf.dispose(scaled);
    this.tf.dispose(normalized);
    this.tf.dispose(prediction);
    this.tf.engine().endScope();
    return predictedClass;
  };

  loadImage = async (filePath: string): Promise<any> => {
    const image = await this.cv.imread(filePath);
    return image;
  };

  cropImage = async (image: any): Promise<any> => {
    const left = 170,
      top = 40,
      width = 650,
      height = 650;
    const rect = new this.cv.Rect(left, top, width, height);
    const croppedImage = await image.getRegion(rect);
    return croppedImage;
  };

  resizeImage = async (image): Promise<any> => {
    const resizedImage = await image.resize(200, 200);
    return resizedImage;
  };

  makePrediction = async (imagePath: string): Promise<number> => {
    let image = await this.loadImage(imagePath);
    let croppedImage = await this.cropImage(image);
    image = null;
    let resizedImage = await this.resizeImage(croppedImage);
    croppedImage = null;
    const prediction = await this.predict(resizedImage);
    resizedImage = null;
    return prediction;
  };

  public get predictionObservable(): Observable<number> {
    return this.predictionSubject.asObservable();
  }

  public handlePrediction(prediction: number): void {
    this.predictionSubject.next(prediction);
  }
}

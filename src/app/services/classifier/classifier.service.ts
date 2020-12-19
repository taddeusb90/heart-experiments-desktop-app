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
  public sharp: any;
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
    this.sharp = electronService.sharp;
    this.model = this.tf.loadLayersModel('assets/model/model.json');
    setTimeout(() => {
      this.canvas = document.getElementById('classifier-canvas-1') as HTMLCanvasElement;
      this.context = this.canvas.getContext('2d');
    }, 2000);

    return ClassifierService.instance;
  }

  loadModel = async (): Promise<void> => {
    this.model = await this.tf.loadLayersModel('assets/model/model.json');
  };

  predict = async (images: any): Promise<number> => {
    const image = await this.cv.imread(
      '/mnt/5898DFED2EC1349A/Projects/heart-experiments/desktop/src/assets/test/10/1598690604.jpg',
    );
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

    this.handleImageData(imgData);

    const floatImage = await this.tf.browser
      .fromPixels(this.context.getImageData(10, 10, 200, 200))
      .toFloat();

    const offset = this.tf.scalar(255.0);
    const normalized = floatImage.sub(offset).div(offset);

    const prediction = await this.model.predict(normalized.expandDims()).data();
    const predictedClass = prediction.indexOf(Math.max(...prediction));
    this.handlePrediction(predictedClass);
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

  public get imageDataObservable(): Observable<ImageData> {
    return this.imageDataSubject.asObservable();
  }

  public handleImageData(imageData: ImageData): void {
    this.imageDataSubject.next(imageData);
  }

  public get predictionObservable(): Observable<number> {
    return this.predictionSubject.asObservable();
  }

  public handlePrediction(prediction: number): void {
    this.predictionSubject.next(prediction);
  }
}

/* eslint-disable one-var */
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root',
})
export class SpectrometerService {
  static instance: SpectrometerService;
  private cv: any;
  private initialImage: any;
  public spectroMetric: Subject<number> = new Subject<number>();
  constructor(public electronService: ElectronService) {
    if (!SpectrometerService.instance) {
      SpectrometerService.instance = this;
    }
    this.cv = electronService.cv;
    return SpectrometerService.instance;
  }

  async setInitialImage(initialImagePath: string): Promise<void> {
    this.initialImage = await this.cv.imread(initialImagePath);
    const rect = new this.cv.Rect(186, 0, 650, 620);
    this.initialImage = await this.initialImage.getRegion(rect);
    console.log('finished loading initial image');
  }

  async measureImage(filePath: string): Promise<number> {
    const image = await this.cv.imread(filePath);
    const rect = new this.cv.Rect(186, 0, 650, 620);
    const region = await image.getRegion(rect);
    image.delete();
    const diff = await this.initialImage.absdiff(region);
    const mask = await diff.cvtColor(this.cv.COLOR_BGR2GRAY);
    const th = 50;
    const maskAsArray = await mask.getDataAsArray();
    mask.delete();
    const indexes = maskAsArray
      .reduce((acc, cv) => [...acc, ...cv], [])
      .reduce((acc, value, index) => {
        if (value > th) {
          acc.push(index);
        }
        return acc;
      }, []);

    const imageDataAsArray = await region.getDataAsArray();
    region.delete();
    const imageData = imageDataAsArray.reduce((acc, cv) => [...acc, ...cv], []);
    const cleanValues = indexes.map(
      (index) => imageData[index].reduce((acc, cv) => Number(acc) + Number(cv), 0) / 3,
    );
    if (cleanValues.length) {
      const cleanValuesLength = cleanValues.length;
      const cleanValuesSum = cleanValues.reduce((acc, cv) => Number(acc) + Number(cv), 0);
      const cleanValuesMean = cleanValuesSum / cleanValuesLength;
      return cleanValuesMean;
    }
    return 0;
  }

  public get spectroMetricObservable(): Observable<number> {
    return this.spectroMetric.asObservable();
  }

  public handleMetric(metric: number): void {
    this.spectroMetric.next(metric);
  }
}

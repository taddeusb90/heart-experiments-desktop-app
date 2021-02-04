/* eslint-disable one-var */
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root',
})
export class SpectrometerService {
  static instance: SpectrometerService;
  private sharp: any;
  private cv: any;
  private initialImage: any;
  public spectroMetric: Subject<number> = new Subject<number>();
  constructor(public electronService: ElectronService) {
    if (!SpectrometerService.instance) {
      SpectrometerService.instance = this;
    }
    this.sharp = electronService.sharp;
    this.cv = electronService.cv;
    return SpectrometerService.instance;
  }

  async setInitialImage(initialImagePath: string): Promise<void> {
    // this.initialImage = await this.cv.imread(
    //   '/mnt/F2AE0559AE0517AD/Projects/heart-experiments/data/sessions/1598688579-initial.jpg',
    // );
    this.initialImage = await this.cv.imread(initialImagePath);
    const rect = new this.cv.Rect(186, 0, 650, 620);
    this.initialImage = await this.initialImage.getRegion(rect);
  }

  async measureImage(filePath: string): Promise<number> {
    let image = await this.cv.imread(filePath);
    // let image = await this.cv.imread(
    //   '/mnt/F2AE0559AE0517AD/Projects/heart-experiments/data/sessions/1598688579/complete/1598689243.jpg',
    // );
    const rect = new this.cv.Rect(186, 0, 650, 620);
    const region = await image.getRegion(rect);
    image = region;
    const diff = await this.initialImage.absdiff(image);
    const mask = await diff.cvtColor(this.cv.COLOR_BGR2GRAY);
    const th = 50;
    const indexes = (await mask.getDataAsArray())
      .reduce((acc, cv) => [...acc, ...cv], [])
      .reduce((acc, value, index) => {
        if (value > th) {
          acc.push(index);
        }
        return acc;
      }, []);

    const imageData = (await image.getDataAsArray()).reduce((acc, cv) => [...acc, ...cv], []);
    const cleanValues = indexes.map(
      (index) => imageData[index].reduce((acc, cv) => Number(acc) + Number(cv), 0) / 3,
    );
    const cleanValuesLength = cleanValues.length;
    const cleanValuesSum = cleanValues.reduce((acc, cv) => Number(acc) + Number(cv), 0);
    const cleanValuesMean = cleanValuesSum / cleanValuesLength;
    return cleanValuesMean;
  }

  public get spectroMetricObservable(): Observable<number> {
    return this.spectroMetric.asObservable();
  }

  public handleMetric(metric: number): void {
    this.spectroMetric.next(metric);
  }
}

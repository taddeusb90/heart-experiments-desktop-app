import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CYCLE_STEPS, SENSITIVITY, MINIMUM_WAIT_CYCLES } from '../../constants/graph';
import { COMPLETE, INCOMPLETE } from '../../constants/decellularization-statuses';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  static instance: GraphService;
  private cycleDataPoints: number[] = [];
  public processedDataPoints: number[] = [];
  private numberOfValuesPerCycle: number = CYCLE_STEPS;
  private cycleIndex = 0;
  private sliceLength = 20;
  public decellularizationStatus = INCOMPLETE;

  public updates: Subject<number> = new Subject<number>();

  constructor() {
    if (!GraphService.instance) {
      GraphService.instance = this;
    }
  }

  private decellularizationStatusComplete = (): boolean => {
    if (
      this.cycleDataPoints.length < this.sliceLength &&
      this.cycleDataPoints.length < MINIMUM_WAIT_CYCLES
    )
      return false;
    const dataSubset = this.cycleDataPoints.slice(
      this.cycleDataPoints.length - this.sliceLength,
      this.cycleDataPoints.length,
    );

    return dataSubset.every(
      (dataPoint) =>
        Math.round(dataPoint * SENSITIVITY) === Math.round(dataSubset[0] * SENSITIVITY),
    );
  };

  public setCurrentDataPoint = (currentDataPoint: number): void => {
    this.cycleDataPoints.push(currentDataPoint);
    if (this.cycleIndex >= this.numberOfValuesPerCycle) {
      const average = this.cycleDataPoints.reduce((a, b) => a + b, 0) / this.cycleDataPoints.length;
      this.processedDataPoints.push(average);
      this.handleMetric(average);
      this.cycleDataPoints = [];
      this.cycleIndex = 0;
    }

    this.cycleDataPoints.push(currentDataPoint);
    if (this.decellularizationStatus !== COMPLETE)
      this.decellularizationStatus = this.decellularizationStatusComplete() ? COMPLETE : INCOMPLETE;
    this.cycleIndex += 1;
  };

  public resetGraph = (): void => {
    this.cycleDataPoints = [];
    this.processedDataPoints = [];
    this.cycleIndex = 0;
  };

  public getProcessedDataPoints = (): number[] => this.processedDataPoints;

  public handleMetric = (metric: number): void => this.updates.next(metric);

  public get metricObservable(): Observable<number> {
    return this.updates.asObservable();
  }
}
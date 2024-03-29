import { Component, OnInit, ElementRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() transitionTime = 1000;
  xmax = 100;
  ymax = 255;
  @Input() hticks = 60;
  @Input() data: any[] = [];
  @Input() metric: number;
  @Input() showLabel = 1;
  hostElement;
  svg;
  g;
  colorScale;
  x;
  y;
  colors = d3.scaleOrdinal(d3.schemeCategory10);
  line;

  constructor(private elRef: ElementRef) {
    this.hostElement = this.elRef.nativeElement;
    setInterval(() => {
      this.updateChart();
    }, 1000);
  }

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.updateChart();
    }
  }

  private createChart(): void {
    this.removeExistingChartFromParent();

    this.setChartDimensions();

    this.setColorScale();

    this.addGraphicsElement();

    this.createXAxis();

    this.createYAxis();

    this.drawLineAndPath();
  }

  private setChartDimensions(): void {
    this.svg = d3
      .select(this.hostElement)
      .append('svg')
      .attr('width', '600')
      .attr('height', '290')
      .attr('viewBox', '74 0 90 100');
  }

  private addGraphicsElement(): void {
    this.g = this.svg.append('g').attr('transform', 'translate(0,0)');
  }

  private setColorScale(): void {
    this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  }

  private createXAxis(): void {
    let length = this.xmax;

    if (this.data && this.data.length && this.data[0].length) {
      this.data.forEach((subset) => {
        if (subset.length > length) {
          // eslint-disable-next-line prefer-destructuring
          length = subset.length;
        }
      });
    } else if (this.data && this.data.length) {
      // eslint-disable-next-line prefer-destructuring
      length = this.data.length;
    }

    this.x = d3.scaleLinear().domain([-1, length]).range([30, 170]);
    this.g
      .append('g')
      .attr('transform', 'translate(0,90)')
      .attr('stroke-width', 0.5)
      .call(
        d3
          .axisBottom(this.x)
          .tickSize(1)
          .tickFormat(<any>''),
      );

    this.g
      .append('g')
      .attr('transform', 'translate(0,90)')
      .style('font-size', 4)
      .style('stroke-dasharray', '1,1')
      .attr('stroke-width', 0.1)
      .call(d3.axisBottom(this.x).ticks(10).tickSize(-80));
  }

  private createYAxis(): void {
    let min, max;
    if (this.data && this.data.length && this.data[0].length) {
      this.data.forEach((subset) => {
        if (!min && !max) {
          min = Math.min(...subset);
          max = Math.max(...subset);
        } else {
          if (min > Math.min(...subset)) {
            min = Math.min(...subset);
          }
          if (max < Math.max(...subset)) {
            max = Math.max(...subset);
          }
        }
      });
    } else if (this.data && this.data.length) {
      min = Math.min(...this.data);
      max = Math.max(...this.data);
    }
    const domain = this.data && this.data.length ? [min * 0.9, max * 1.1] : [0, this.ymax];
    this.y = d3.scaleLinear().domain(domain).range([90, 10]);
    this.g
      .append('g')
      .attr('transform', 'translate(30,0)')
      .attr('stroke-width', 0.5)
      .call(
        d3
          .axisLeft(this.y)
          .tickSize(0)
          .tickFormat(<any>''),
      );
    this.g
      .append('g')
      .attr('transform', 'translate(30,0)')
      .style('stroke-dasharray', '1,1')
      .attr('stroke-width', 0.1)
      .call(d3.axisLeft(this.y).ticks(4).tickSize(-140))
      .style('font-size', 4);

    if (this.showLabel === 1) {
      this.g
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(10,50) rotate(-90)')
        .style('font-size', 4)
        .text('Luminosity');
    }
  }

  private drawLineAndPath(): void {
    this.line = d3
      .line()
      .x((d: any) => this.x(d.index))
      .y((d: any) => this.y(d.value));
    if (this.data && this.data.length && this.data[0].length) {
      this.data.forEach((subset, idx) =>
        this.svg
          .append('path')
          .datum(subset.map((value, index) => ({ index, value })))
          .attr('class', 'line')
          .attr('fill', 'none')
          .attr('stroke', this.colors(idx.toString()))
          .attr('stroke-width', 0.5)
          .attr('d', this.line),
      );
    } else if (this.data && this.data.length) {
      this.svg
        .append('path')
        .datum(this.data.map((value, index) => ({ index, value })))
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 0.5)
        .attr('d', this.line);
    }
  }

  public updateChart(): void {
    if (!this.svg) {
      this.createChart();
      return;
    }
    this.createChart();
    // this.updateDomains();
    this.drawLineAndPath();
  }

  private removeExistingChartFromParent(): void {
    d3.select(this.hostElement).select('svg').remove();
  }
}

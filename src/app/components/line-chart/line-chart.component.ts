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
  @Input() data: number[] = [];
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
  }
  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.metric) {
      console.log(this.data, changes.metric);
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
    const viewBoxHeight = 100,
      viewBoxWidth = 200;
    this.svg = d3
      .select(this.hostElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '50%')
      .attr('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight);
  }

  private addGraphicsElement(): void {
    this.g = this.svg.append('g').attr('transform', 'translate(0,0)');
  }

  private setColorScale(): void {
    this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  }

  private createXAxis(): void {
    this.x = d3
      .scaleLinear()
      .domain([0, this.data.length < 100 ? this.xmax : this.data.length])
      .range([30, 170]);
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
    this.y = d3
      .scaleLinear()
      .domain(
        this.data.length
          ? [Math.min(...this.data) * 0.9, Math.max(...this.data) * 1.1]
          : [0, this.ymax],
      )
      .range([90, 10]);
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

  // private updateDomains(): void {
  //   this.x.domain([0, this.data.length < 100 ? this.xmax : this.data.length]);
  //   this.y.domain([this.data.length ? Math.min(...this.data) : 0, this.ymax]);
  // }

  private drawLineAndPath(): void {
    this.line = d3
      .line()
      .x((d: any) => this.x(d.index))
      .y((d: any) => this.y(d.value));
    this.svg
      .append('path')
      .datum(this.data.map((value, index) => ({ index, value })))
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 0.5)
      .attr('d', this.line);
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

import { LineChartComponent } from '../app/components/line-chart/line-chart.component';

export default {
  title: 'Line chart',
  component: LineChartComponent,
};

export const ToStorybook = () => ({
  component: LineChartComponent,
  props: {
    data: [
      12,
      130,
      135,
      12,
      123,
      125,
      122,
      12,
      130,
      135,
      12,
      123,
      125,
      122,
      12,
      130,
      135,
      12,
      123,
      125,
      122,
      12,
      130,
      135,
      12,
      123,
      125,
      122,
      123,
      90,
    ],
    metric: null,
  },
});

ToStorybook.story = {
  name: 'to Storybook',
};

import { AbstractChartManager } from "./abstract-chart-manager";

export class StackedBarChartManager extends AbstractChartManager {
  preprocess() {
    console.log("Stacked bar chart preprocess");
  }
}

import { AbstractChartManager } from "./abstract-chart-manager";

export class LineChartManager extends AbstractChartManager {
  preprocess() {
    console.log("line chart preprocess");
  }

  initializeCharts() {
    console.log("line chart init");
  }
}

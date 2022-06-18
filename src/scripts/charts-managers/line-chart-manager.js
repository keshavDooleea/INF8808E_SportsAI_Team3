import { AbstractChartManager } from "./abstract-chart-manager";

export class LineChartManager extends AbstractChartManager {
  preprocess() {
    console.log("line chart preprocess");
  }

  initializeCharts() {
    this.svg = d3.select("#line-chart-svg");

    this.svg.append("g").attr("id", "chart-g");
  }
}

import { AbstractChartManager } from "./abstract-chart-manager";

/**
 * Manager for stacked chart visualization
 *
 * @class StackedBarChartManager
 */
export class StackedBarChartManager extends AbstractChartManager {
  preprocess() {
    console.log("Stacked bar chart preprocess");
  }

  initializeCharts() {
    this.svg = d3.select("#stacked-bar-chart-svg");
  }
}

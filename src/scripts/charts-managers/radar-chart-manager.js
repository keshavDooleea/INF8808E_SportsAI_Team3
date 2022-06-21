import { AbstractChartManager } from "./abstract-chart-manager";

/**
 * Manager for radar chart visualization
 *
 * @class RadarChartManager
 */
export class RadarChartManager extends AbstractChartManager {
  preprocess() {
    console.log("Radar chart preprocess");
  }

  initializeVariables() {}

  initializeCharts() {
    this.svg = d3.select("#radar-chart-svg");
  }
}

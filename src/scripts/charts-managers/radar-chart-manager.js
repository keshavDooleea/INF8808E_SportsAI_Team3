import { AbstractChartManager } from "./abstract-chart-manager";

export class RadarChartManager extends AbstractChartManager {
  preprocess() {
    console.log("Radar chart preprocess");
  }
}

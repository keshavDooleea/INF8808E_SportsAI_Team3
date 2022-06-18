import { AbstractChartManager } from "./abstract-chart-manager";

export class BarChartManager extends AbstractChartManager {
  preprocess() {
    console.log("Bar chart preprocess");
    console.log(this.playerHelperSingleton.benzemaSummaryData);
    console.log(this.playerHelperSingleton.maneSummaryData);
    console.log(this.playerHelperSingleton.mbappeSummaryData);
    console.log(this.playerHelperSingleton.maneColor);
  }
}

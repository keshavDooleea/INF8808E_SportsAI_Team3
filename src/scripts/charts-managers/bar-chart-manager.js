import { AbstractChartManager } from './abstract-chart-manager'

/**
 * Manager for bar chart visualization
 *
 * @class BarChartManager
 */
export class BarChartManager extends AbstractChartManager {
  preprocess () {
    console.log('Bar chart preprocess')
    console.log(this.playerHelperSingleton.benzemaSummaryData)
    console.log(this.playerHelperSingleton.maneSummaryData)
    console.log(this.playerHelperSingleton.mbappeSummaryData)
    console.log(this.playerHelperSingleton.maneColor)
  }

  initializeVariables () {}

  initializeCharts () {
    this.svg = d3.select('#bar-chart-svg')
  }
}

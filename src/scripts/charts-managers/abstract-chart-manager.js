const { playerHelperSingleton } = require('../helpers/players-helper')
const { chartHelper } = require('../helpers/chart-helper')

/**
 * Declaring an abstract manager Class for charts manager to handle common behaviors/logics.
 *
 * @class AbstractChartManager
 */
export class AbstractChartManager {
  playerHelperSingleton = playerHelperSingleton
  chartHelper = chartHelper

  constructor() {
    if (this.constructor == AbstractChartManager) {
      throw new Error("Abstract classes can't be instantiated.")
    }

    this.preprocess()
    this.initializeVariables()
    this.initializeCharts()
  }

  /**
   * Allow respective child classes to preprocess the CSV data into a desired Object format
   *
   */
  preprocess() {
    throw new Error("Method 'preprocess()' must be implemented.")
  }

  /**
   * Allow respective child classes to create global variables
   *
   */
  initializeVariables() {
    throw new Error("Method 'initializeVariables()' must be implemented.")
  }

  /**
   * Allow respective child classes to set up SVG elements to mount visualizations
   *
   */
  initializeCharts() {
    throw new Error("Method 'initializeCharts()' must be implemented.")
  }

  /**
   * Create a reusable legend based on players name and colors
   *
   * @param {object} svg the d3 svg element
   * @param {number} translateX number of pixels for horizontal translation
   * @param {number} translateY number of pixels for vertical translation
   * @returns {object} The created legend element
   */
  createPlayersLegend(svg, translateX, translateY) {
    return this.chartHelper.createLegend(
      svg,
      translateX,
      translateY,
      this.playerHelperSingleton.playersName,
      this.playerHelperSingleton.playersColor
    )
  }
}

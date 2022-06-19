const { playerHelperSingleton } = require("../players-helper");
const { chartHelper } = require("../chart-helper");

/**
 * Declaring an abstract manager Class for charts manager.
 *
 * @class AbstractChartManager
 */
export class AbstractChartManager {
  playerHelperSingleton = playerHelperSingleton;
  chartHelper = chartHelper;

  constructor() {
    if (this.constructor == AbstractChartManager) {
      throw new Error("Abstract classes can't be instantiated.");
    }

    this.preprocess();
    this.initializeCharts();
  }

  /**
   * Allow respective child classes to preprocess the CSV data into a desired Object format
   *
   */
  preprocess() {
    throw new Error("Method 'preprocess()' must be implemented.");
  }

  /**
   * Allow respective child classes to set up SVG elements to mount visualizations
   *
   */
  initializeCharts() {
    throw new Error("Method 'initializeCharts()' must be implemented.");
  }

  createLegend(svg, translateX, translateY, shape) {
    return this.chartHelper.createLegend(svg, translateX, translateY, shape, this.playerHelperSingleton.playersAttributes);
  }
}

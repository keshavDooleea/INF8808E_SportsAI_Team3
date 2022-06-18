const { playerHelperSingleton } = require("../players-helper");

/**
 * Declaring an abstract manager Class for charts.
 *
 * @class AbstractChartManager
 */
export class AbstractChartManager {
  playerHelperSingleton = playerHelperSingleton;

  constructor() {
    if (this.constructor == AbstractChartManager) {
      throw new Error("Abstract classes can't be instantiated.");
    }

    this.preprocess();
    this.initializeCharts();
  }

  preprocess() {
    throw new Error("Method 'preprocess()' must be implemented.");
  }

  initializeCharts() {}
}

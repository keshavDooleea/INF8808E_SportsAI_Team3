"use strict";

import * as BarChartManager from "./scripts/charts-managers/bar-chart-manager";
import * as LineChartManager from "./scripts/charts-managers/line-chart-manager";
import * as RadarChartManager from "./scripts/charts-managers/radar-chart-manager";
import * as StackedBarChartManager from "./scripts/charts-managers/stacked-bar-chart-manager";
import * as PlayerHelper from "./scripts/players-helper";

/**
 * @file This file is the entry-point for the the code of the project.
 * @author Team 3
 * @version v1.0.0
 */

main();

async function main() {
  await PlayerHelper.playerHelperSingleton.getSummaryData();

  const radarChartManager = new RadarChartManager.RadarChartManager();
  const stackedBarChartManager = new StackedBarChartManager.StackedBarChartManager();
  const barChartManager = new BarChartManager.BarChartManager();
  const lineChartManager = new LineChartManager.LineChartManager();
}

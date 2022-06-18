"use strict";

import { BarChartManager } from "./scripts/charts-managers/bar-chart-manager";
import { LineChartManager } from "./scripts/charts-managers/line-chart-manager";
import { RadarChartManager } from "./scripts/charts-managers/radar-chart-manager";
import { StackedBarChartManager } from "./scripts/charts-managers/stacked-bar-chart-manager";
const { playerHelperSingleton } = require("./scripts/players-helper");

/**
 * @file This file is the entry-point for the the code of the project.
 * @author Team 3
 * @version v1.0.0
 */

main();

async function main() {
  await playerHelperSingleton.getSummaryData();

  const radarChartManager = new RadarChartManager();
  const stackedBarChartManager = new StackedBarChartManager();
  const barChartManager = new BarChartManager();
  const lineChartManager = new LineChartManager();
}

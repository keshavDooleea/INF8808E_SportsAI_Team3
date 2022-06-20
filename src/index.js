"use strict";

const { playerHelperSingleton } = require("./scripts/players-helper");
const { RadarChartManager } = require("./scripts/charts-managers/radar-chart-manager");
const { StackedBarChartManager } = require("./scripts/charts-managers/stacked-bar-chart-manager");
const { BarChartManager } = require("./scripts/charts-managers/bar-chart-manager");
const { LineChartManager } = require("./scripts/charts-managers/line-chart-manager");

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

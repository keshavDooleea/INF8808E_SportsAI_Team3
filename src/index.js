'use strict'

import { BarChartManager } from './scripts/charts-managers/bar-chart-manager'
import { LineChartManager } from './scripts/charts-managers/line-chart/line-chart-manager'
import { RadarChartManager } from './scripts/charts-managers/radar-chart-manager'
import { StackedBarChartManager } from './scripts/charts-managers/stacked-bar-chart-manager'
import { playerHelperSingleton } from './scripts/helpers/players-helper'

/**
 * @file This file is the entry-point for the the code of the project.
 * @author Team 3
 * @version v1.0.0
 */

main()

async function main() {
  // retrieve and parse all CSV datas and store them in a singleton class named 'PlayersHelperClass'
  await playerHelperSingleton.getSummaryData()
  await playerHelperSingleton.getGroupedData()
  await playerHelperSingleton.getChampionshipData()

  // instantiate various charts managers to build charts
  new RadarChartManager('#radar-chart-svg')
  new StackedBarChartManager('#stacked-bar-chart-svg')
  new BarChartManager('#bar-chart-svg')
  new LineChartManager('#line-chart-svg')
}

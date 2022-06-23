import { AbstractChartManager } from './abstract-chart-manager'

/**
 * Manager for stacked chart visualization
 *
 * @class StackedBarChartManager
 */
export class StackedBarChartManager extends AbstractChartManager {
  preprocess () {
    console.log('Stacked bar chart preprocess')
    this.shootingData = this.preprocessShootingData(this.playerHelperSingleton.groupedShootingData)
  }

  initializeVariables () {
    // Each one contains [Goals/Shot, PK Goals / PK attempts]
    this.maneData = []
    this.benzemaData = []
    this.mbappeData = []
  }

  initializeCharts () {
    this.svg = d3.select('#stacked-bar-chart-svg')
  }

  /**
   * Calculates the number of goals, assists and shots taken during a month for a player
   * @param {object[]} playerData the player's data parsed from CSV file
   * @param playerName
   * @param shootingData
   * @returns {object[]} The preprocessed data
   */
  preprocessShootingData (shootingData) {
    console.log('preprocessShootingData')

    shootingData.forEach((element, index) => {
      var PK = 0
      // eslint-disable-next-line eqeqeq
      if (element.PKatt != 0) {
        PK = element.PK / element.PKatt
      }
      if (element.Player === 'Sadio Mané') {
        this.maneData = [element.GSh, PK]
      }
      else if (element.Player === 'Karim Benzema') {
        this.benzemaData = [element.GSh, PK]
      }
      if (element.Player === 'Kylian Mbappé') {
        this.mbappeData = [element.GSh, PK]
      }
    })
  }
}

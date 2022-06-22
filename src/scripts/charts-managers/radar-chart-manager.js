import { AbstractChartManager } from './abstract-chart-manager'

/**
 * Manager for radar chart visualization
 *
 * @class RadarChartManager
 */
export class RadarChartManager extends AbstractChartManager {
  preprocess () {
    this.maneData = this.preprocessPlayer(this.playerHelperSingleton.groupedDefensiveData,
      this.playerHelperSingleton.groupedPassData,
      this.playerHelperSingleton.groupedPossesionData,
      this.playerHelperSingleton.groupedShootingData,
      this.playerHelperSingleton.maneName)
    this.benzemaData = this.preprocessPlayer(this.playerHelperSingleton.groupedDefensiveData,
      this.playerHelperSingleton.groupedPassData,
      this.playerHelperSingleton.groupedPossesionData,
      this.playerHelperSingleton.groupedShootingData,
      this.playerHelperSingleton.benzemaName)
    this.mbappeData = this.preprocessPlayer(this.playerHelperSingleton.groupedDefensiveData,
      this.playerHelperSingleton.groupedPassData,
      this.playerHelperSingleton.groupedPossesionData,
      this.playerHelperSingleton.groupedShootingData,
      this.playerHelperSingleton.mbappeName)
  }

  initializeVariables () {}

  /**
   * Get the Touches, Assists, Attempted Passes, Completed Passes, Pressures, % Completed Dribbles, Tackles, Goals, Shots and Carries of a player
   *
   * @param {object[]} defenceData the defence data parsed from CSV file
   * @param {object[]} passingData the passing data parsed from CSV file
   * @param {object[]} possessionData the possession data parsed from CSV file
   * @param {object[]} shootingdata the shooting data parsed from CSV file
   * @param {string} playerName the player name
   * @returns {object[]} The preprocessed data
   */
  preprocessPlayer (defenceData, passingData, possessionData, shootingdata, playerName) {
    const player = { name: playerName }
    defenceData.forEach(elem => {
      if (elem.Player === playerName) {
        player.tackles = elem.Tkl
        player.pressure = elem.Press
      }
    })
    passingData.forEach(elem => {
      if (elem.Player === playerName) {
        player.attemptedPasses = elem.TotalAtt
        player.completedPasses = elem.TotalCmp
        player.assists = elem.Ast
      }
    })
    possessionData.forEach(elem => {
      if (elem.Player === playerName) {
        player.touches = elem.Touches
        player.carries = elem.Carries
        player.dribblesPercentage = elem.DribbleSuccPerc
      }
    })
    shootingdata.forEach(elem => {
      if (elem.Player === playerName) {
        player.goals = elem.Gls
        player.shots = elem.Sh
      }
    })
    console.log(player)
    return 1
  }

  initializeCharts () {
    this.svg = d3.select('#radar-chart-svg')
  }
}

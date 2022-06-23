import { AbstractChartManager } from './abstract-chart-manager'
import { TEXT_COLORS } from '../utils/utils'

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
    const player = {}
    defenceData.forEach(elem => {
      if (elem.Player === playerName) {
        player.tackles = Number(elem.Tkl)
        player.pressure = Number(elem.Press)
      }
    })
    passingData.forEach(elem => {
      if (elem.Player === playerName) {
        player.attemptedPasses = Number(elem.TotalAtt)
        player.completedPasses = Number(elem.TotalCmp)
        player.assists = Number(elem.Ast)
      }
    })
    possessionData.forEach(elem => {
      if (elem.Player === playerName) {
        player.touches = Number(elem.Touches)
        player.carries = Number(elem.Carries)
        player.dribblesPercentage = Number(elem.DribbleSuccPerc)
      }
    })
    shootingdata.forEach(elem => {
      if (elem.Player === playerName) {
        player.goals = Number(elem.Gls)
        player.shots = Number(elem.Sh)
      }
    })
    return player
  }

  initializeCharts () {
    this.svg = d3.select('#radar-chart-svg')
    this.svgWidth = parseInt(this.svg.style('width'))
    this.svgHeight = parseInt(this.svg.style('height'))

    this.margin = {
      top: 50,
      right: 150,
      bottom: 30,
      left: 60,
      leftPadding: 20
    }

    this.config = {
      radius: 5,
      w: this.getHeight(),
      h: this.getHeight(),
      factor: 1,
      factorLegend: 0.85,
      levels: 5,
      maxValue: 10,
      radians: 2 * Math.PI,
      opacityArea: 0.5,
      ToRight: 500,
      TranslateX: this.getWidth(),
      TranslateY: 30,
      ExtraWidthX: 100,
      ExtraWidthY: 100
    }
    this.setAdjustedPlayerValues(this.maneData, this.benzemaData, this.mbappeData)
    this.fields = Object.keys(this.maneData)
    this.totalFields = this.fields.length
    this.radius = this.config.factor * Math.min(this.config.w / 2, this.config.h / 2)
    this.Format = d3.format('%')
    this.svg
      .append('svg')
      .attr('width', 'auto')
      .attr('height', 'auto')
      .append('g')
      .attr('transform', 'translate(' + 0 + ',' + this.config.TranslateY + ')')

    this.drawSegments(this.config.factor, this.config.radians, this.totalFields)
    this.drawAxes(this.config.factor, this.config.radians, this.totalFields)
    // grid
    // axes
    // plotting
  }

  getHeight () {
    return this.svgHeight - this.margin.top - this.margin.bottom
  }

  getWidth () {
    return this.svgWidth - this.margin.left - this.margin.right - this.margin.leftPadding
  }

  // Returns the max value for the scaling of the radar chart
  getMaxValue (maneData, benzemaData, mbappeData) {
    return Math.max(...Object.values(maneData), ...Object.values(benzemaData), ...Object.values(mbappeData))
  }

  setAdjustedPlayerValues (maneData, benzemaData, mbappeData) {
    const keys = Object.keys(this.maneData)
    this.adjustedManeData = {}
    this.adjustedBenzemaData = {}
    this.adjustedMbappeData = {}
    keys.forEach(key => {
      const max = Math.max(maneData[key], benzemaData[key], mbappeData[key])
      this.adjustedManeData[key] = (maneData[key] * this.config.maxValue) / max
      this.adjustedBenzemaData[key] = (benzemaData[key] * this.config.maxValue) / max
      this.adjustedMbappeData[key] = (mbappeData[key] * this.config.maxValue) / max
    })
  }

  drawSegments (factor, radians, totalFields) {
    for (let j = 0; j < this.config.levels; j++) {
      const levelFactor = this.config.factor * this.radius * ((j + 1) / this.config.levels)
      this.svg.selectAll('g')
        .selectAll('.levels')
        .data(this.fields)
        .enter()
        .append('svg:line')
        .attr('x1', function (d, i) { return levelFactor * (1 - factor * Math.sin(i * radians / totalFields)) })
        .attr('y1', function (d, i) { return levelFactor * (1 - factor * Math.cos(i * radians / totalFields)) })
        .attr('x2', function (d, i) { return levelFactor * (1 - factor * Math.sin((i + 1) * radians / totalFields)) })
        .attr('y2', function (d, i) { return levelFactor * (1 - factor * Math.cos((i + 1) * radians / totalFields)) })
        .attr('class', 'line')
        .style('stroke', TEXT_COLORS.radarSegments)
        .style('stroke-opacity', '1')
        .style('stroke-width', '2px')
        .attr('transform', 'translate(' + (this.config.w - levelFactor) + ', ' + (this.config.h / 2 - levelFactor) + ')')
    }
  }

  drawAxes (factor, radians, totalFields) {
    const axis = this.svg.selectAll('g')
      .selectAll('.axis')
      .data(this.fields)
      .enter()
      .append('g')
      .attr('class', 'axis')

    const w = this.config.w
    const h = this.config.h
    const factorLegend = this.config.factorLegend

    axis.append('line')
      .attr('x1', w / 2)
      .attr('y1', h / 2)
      .attr('x2', function (d, i) { return w / 2 * (1 - factor * Math.sin(i * radians / totalFields)) })
      .attr('y2', function (d, i) { return h / 2 * (1 - factor * Math.cos(i * radians / totalFields)) })
      .attr('class', 'line')
      .style('stroke', TEXT_COLORS.radarAxes)
      .attr('transform', 'translate(' + (w / 2) + ')')
      .style('stroke-width', '2px')

    axis.append('text')
      .attr('class', 'legend')
      .text(function (d) {
        if (d === 'attemptedPasses') return 'Attempted Passes'
        else if (d === 'completedPasses') return 'Completed Passes'
        else if (d === 'dribblesPercentage') return '% Completed Dribbles'
        else return d
      })
      .style('font-size', '18px')
      .attr('text-anchor', function (d, i) {
        console.log(i)
        if (i > 5 && i !== 10) return 'start'
        else if (i < 5 && i !== 0) return 'end'
        else return 'middle'
      })
      .attr('dy', '1.5em')
      .attr('transform', 'translate(' + (w / 2) + ', -20)')
      .attr('x', function (d, i) { return w / 2 * (1 - factorLegend * Math.sin(i * radians / totalFields)) - 60 * Math.sin(i * radians / totalFields) })
      .attr('y', function (d, i) { return h / 2 * (1 - Math.cos(i * radians / totalFields)) - 20 * Math.cos(i * radians / totalFields) })
  }
}

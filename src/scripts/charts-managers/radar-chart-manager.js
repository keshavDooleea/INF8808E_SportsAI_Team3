import { AbstractChartManager } from './abstract-chart-manager'
import { TEXT_COLORS } from '../utils/utils'

/**
 * Manager for radar chart visualization
 *
 * @class RadarChartManager
 */
export class RadarChartManager extends AbstractChartManager {
  constructor(svgId) {
    super(svgId)
  }

  preprocess() {
    this.maneData = this.preprocessPlayer(
      this.playerHelperSingleton.groupedDefensiveData,
      this.playerHelperSingleton.groupedPassData,
      this.playerHelperSingleton.groupedPossesionData,
      this.playerHelperSingleton.groupedShootingData,
      this.playerHelperSingleton.maneName
    )
    this.benzemaData = this.preprocessPlayer(
      this.playerHelperSingleton.groupedDefensiveData,
      this.playerHelperSingleton.groupedPassData,
      this.playerHelperSingleton.groupedPossesionData,
      this.playerHelperSingleton.groupedShootingData,
      this.playerHelperSingleton.benzemaName
    )
    this.mbappeData = this.preprocessPlayer(
      this.playerHelperSingleton.groupedDefensiveData,
      this.playerHelperSingleton.groupedPassData,
      this.playerHelperSingleton.groupedPossesionData,
      this.playerHelperSingleton.groupedShootingData,
      this.playerHelperSingleton.mbappeName
    )
    this.maneDataUEFA = this.preprocessPlayer(
      this.playerHelperSingleton.groupedDefensiveDataUEFA,
      this.playerHelperSingleton.groupedPassDataUEFA,
      this.playerHelperSingleton.groupedPossesionDataUEFA,
      this.playerHelperSingleton.groupedShootingDataUEFA,
      this.playerHelperSingleton.maneName
    )
    this.benzemaDataUEFA = this.preprocessPlayer(
      this.playerHelperSingleton.groupedDefensiveDataUEFA,
      this.playerHelperSingleton.groupedPassDataUEFA,
      this.playerHelperSingleton.groupedPossesionDataUEFA,
      this.playerHelperSingleton.groupedShootingDataUEFA,
      this.playerHelperSingleton.benzemaName
    )
    this.mbappeDataUEFA = this.preprocessPlayer(
      this.playerHelperSingleton.groupedDefensiveDataUEFA,
      this.playerHelperSingleton.groupedPassDataUEFA,
      this.playerHelperSingleton.groupedPossesionDataUEFA,
      this.playerHelperSingleton.groupedShootingDataUEFA,
      this.playerHelperSingleton.mbappeName
    )
  }

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
  preprocessPlayer(
    defenceData,
    passingData,
    possessionData,
    shootingdata,
    playerName
  ) {
    const player = {}
    defenceData.forEach((elem) => {
      if (elem.Player === playerName) {
        player.tackles = Number(elem.Tkl)
        player.pressure = Number(elem.Press)
      }
    })
    passingData.forEach((elem) => {
      if (elem.Player === playerName) {
        player.attemptedPasses = Number(elem.TotalAtt)
        player.completedPasses = Number(elem.TotalCmp)
        player.assists = Number(elem.Ast)
      }
    })
    possessionData.forEach((elem) => {
      if (elem.Player === playerName) {
        player.touches = Number(elem.Touches)
        player.carries = Number(elem.Carries)
        player.dribblesPercentage = Number(elem.DribbleSuccPerc)
      }
    })
    shootingdata.forEach((elem) => {
      if (elem.Player === playerName) {
        player.goals = Number(elem.Gls)
        player.shots = Number(elem.Sh)
      }
    })
    const result = {
      touches: player.touches,
      carries: player.carries,
      shots: player.shots,
      goals: player.goals,
      tackles: player.tackles,
      dribblesPercentage: player.dribblesPercentage,
      pressure: player.pressure,
      completedPasses: player.completedPasses,
      attemptedPasses: player.attemptedPasses,
      assists: player.assists
    }
    return result
  }

  initializeVariables() {
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
      levels: 6,
      maxValue: 50,
      radians: 2 * Math.PI,
      opacityArea: 0.25,
      ToRight: 500,
      TranslateX: this.getWidth(),
      TranslateY: 30,
      ExtraWidthX: 100,
      ExtraWidthY: 100,
      nodeRadius: 7
    }
    this.setAdjustedPlayerValues(
      this.maneData,
      this.benzemaData,
      this.mbappeData
    )
    this.fields = Object.keys(this.adjustedManeData)
    this.totalFields = this.fields.length
    this.radius =
      this.config.factor * Math.min(this.config.w / 2, this.config.h / 2)
    this.Format = d3.format('%')
    this.tooltip = this.createTooltip()
    this.isUEFAChecked = false
  }

  initializeCharts() {
    this.svg
      .append('g')
      .attr('transform', 'translate(' + 0 + ',' + this.config.TranslateY + ')')
      .attr('id', 'mainGraphBody')
      .on('mouseleave', () => {
        for (let index = 0; index < 3; index++) {
          this.svg.select(`.radar-chart-node_${index}`)
          this.tooltip.hide()
          this.svg
            .selectAll('polygon')
            .transition(200)
            .style('fill-opacity', this.config.opacityArea)
            .style('stroke-opacity', 1)
          this.svg.selectAll('circle').transition(200).style('fill-opacity', 1)
        }
      })

    this.drawAreas(
      this.adjustedManeData,
      this.adjustedBenzemaData,
      this.adjustedMbappeData
    )
    this.drawSegments(this.config.factor, this.config.radians, this.totalFields)
    this.drawAxes(this.config.factor, this.config.radians, this.totalFields)
    this.drawNodes(
      this.adjustedManeData,
      this.adjustedBenzemaData,
      this.adjustedMbappeData
    )
    this.drawLegend()
    this.drawCheckbox()
  }

  getHeight() {
    return this.svgHeight - this.margin.top - this.margin.bottom
  }

  getWidth() {
    return (
      this.svgWidth -
      this.margin.left -
      this.margin.right -
      this.margin.leftPadding
    )
  }

  // Returns the max value for the scaling of the radar chart
  getMaxValue(maneData, benzemaData, mbappeData) {
    return Math.max(
      ...Object.values(maneData),
      ...Object.values(benzemaData),
      ...Object.values(mbappeData)
    )
  }

  setAdjustedPlayerValues(maneData, benzemaData, mbappeData) {
    const keys = Object.keys(this.maneData)
    this.adjustedManeData = {}
    this.adjustedBenzemaData = {}
    this.adjustedMbappeData = {}
    keys.forEach((key) => {
      const max = Math.max(maneData[key], benzemaData[key], mbappeData[key])
      this.adjustedManeData[key] =
        (maneData[key] * this.config.maxValue) / max - 2
      this.adjustedBenzemaData[key] =
        (benzemaData[key] * this.config.maxValue) / max - 2
      this.adjustedMbappeData[key] =
        (mbappeData[key] * this.config.maxValue) / max - 2
    })
  }

  drawSegments(factor, radians, totalFields) {
    for (let j = 0; j < this.config.levels; j++) {
      const levelFactor =
        this.config.factor * this.radius * ((j + 1) / this.config.levels)
      this.svg
        .select('#mainGraphBody')
        .selectAll('.levels')
        .data(this.fields)
        .enter()
        .append('svg:line')
        .attr('x1', function (d, i) {
          return (
            levelFactor * (1 - factor * Math.sin((i * radians) / totalFields))
          )
        })
        .attr('y1', function (d, i) {
          return (
            levelFactor * (1 - factor * Math.cos((i * radians) / totalFields))
          )
        })
        .attr('x2', function (d, i) {
          return (
            levelFactor *
            (1 - factor * Math.sin(((i + 1) * radians) / totalFields))
          )
        })
        .attr('y2', function (d, i) {
          return (
            levelFactor *
            (1 - factor * Math.cos(((i + 1) * radians) / totalFields))
          )
        })
        .attr('class', 'line')
        .style('stroke', TEXT_COLORS.radarAxes)
        .style('stroke-opacity', '1')
        .style('stroke-width', '2px')
        .attr(
          'transform',
          'translate(' +
            (this.config.w - levelFactor) +
            ', ' +
            (this.config.h / 2 - levelFactor) +
            ')'
        )
    }
  }

  drawAxes(factor, radians, totalFields) {
    const axis = this.svg
      .select('#mainGraphBody')
      .selectAll('.axis')
      .data(this.fields)
      .enter()
    // .append('g')
    // .attr('class', 'axis')

    const w = this.config.w
    const h = this.config.h
    const factorLegend = this.config.factorLegend

    axis
      .append('line')
      .attr('x1', w / 2)
      .attr('y1', h / 2)
      .attr('x2', function (d, i) {
        return (w / 2) * (1 - factor * Math.sin((i * radians) / totalFields))
      })
      .attr('y2', function (d, i) {
        return (h / 2) * (1 - factor * Math.cos((i * radians) / totalFields))
      })
      .attr('class', 'line')
      .style('stroke', TEXT_COLORS.radarAxes)
      .attr('transform', 'translate(' + w / 2 + ')')
      .style('stroke-width', '2px')

    axis
      .append('text')
      .attr('class', 'axeTitle')
      .attr('id', function (d) {
        return d + 'Title'
      })
      .text(function (d) {
        if (d === 'attemptedPasses') return 'Attempted Passes'
        else if (d === 'completedPasses') return 'Completed Passes'
        else if (d === 'dribblesPercentage') return '% Completed Dribbles'
        else return d
      })
      .style('font-size', '18px')
      .attr('text-anchor', function (d, i) {
        if (i > 5 && i !== 10) return 'start'
        else if (i < 5 && i !== 0) return 'end'
        else return 'middle'
      })
      .attr('dy', '1.5em')
      .attr('transform', 'translate(' + w / 2 + ', -20)')
      .attr('x', function (d, i) {
        return (
          (w / 2) * (1 - factorLegend * Math.sin((i * radians) / totalFields)) -
          60 * Math.sin((i * radians) / totalFields)
        )
      })
      .attr('y', function (d, i) {
        return (
          (h / 2) * (1 - Math.cos((i * radians) / totalFields)) -
          20 * Math.cos((i * radians) / totalFields)
        )
      })

    const rectWidth = 10
    axis
      .append('rect')
      .attr('class', 'axeButton')
      .attr('id', function (data) {
        return data + 'Button'
      })
      .attr('x', function (d, i) {
        return (
          (w / 2) * (1 - factor * Math.sin((i * radians) / totalFields)) -
          rectWidth / 2
        )
      })
      .attr('y', function (d, i) {
        return (
          (h / 2) * (1 - factor * Math.cos((i * radians) / totalFields)) -
          rectWidth / 2
        )
      })
      .attr('width', rectWidth)
      .attr('height', rectWidth)
      .attr('stroke', TEXT_COLORS.radarAxes)
      .attr('stroke-width', '2px')
      .attr('fill', TEXT_COLORS.radarSegments)
      .attr('transform', 'translate(' + w / 2 + ')')
      .on('mouseover', (data, index, element) => {
        this.svg.select(`.${data}Button`)
        this.tooltip.show(data, element[index])
      })
      .on('mouseout', (data) => {
        this.svg.select(`.${data}Button`)
        this.tooltip.hide()
      })
  }

  drawAreas(maneData, benzemaData, mbappeData) {
    const dataSets = [maneData, benzemaData, mbappeData]
    const w = this.config.w
    const h = this.config.h
    const factor = this.config.factor
    const maxValue = this.config.maxValue
    const radians = this.config.radians
    const totalFields = this.totalFields
    const colors = [
      this.playerHelperSingleton.maneColor,
      this.playerHelperSingleton.benzemaColor,
      this.playerHelperSingleton.mbappeColor
    ]
    dataSets.forEach((data, datai) => {
      const dataValues = []
      Object.entries(data).forEach((elem, i) => {
        dataValues.push([
          (w / 2) *
            (1 -
              (parseFloat(Math.max(elem[1], 0)) / maxValue) *
                factor *
                Math.sin((i * radians) / totalFields)),
          (h / 2) *
            (1 -
              (parseFloat(Math.max(elem[1], 0)) / maxValue) *
                factor *
                Math.cos((i * radians) / totalFields))
        ])
      })
      // this.svg.selectAll('g').selectAll('.nodes').data(data)
      // dataValues.push(dataValues[0])
      this.svg
        .select('#mainGraphBody')
        .selectAll('.area')
        .data([dataValues])
        .enter()
        .append('polygon')
        .attr('class', function () {
          return 'radar-chart-serie_' + datai
        })
        .attr('points', function (d) {
          var str = ''
          for (var pti = 0; pti < d.length; pti++) {
            str = str + d[pti][0] + ',' + d[pti][1] + ' '
          }
          return str
        })
        .style('fill', colors[datai])
        .style('fill-opacity', this.config.opacityArea)
        .attr('stroke', colors[datai])
        .attr('stroke-width', '2px')
        .attr('transform', 'translate(' + w / 2 + ')')
    })
  }

  drawNodes(maneData, benzemaData, mbappeData) {
    const dataSets = [maneData, benzemaData, mbappeData]
    let series = 0
    const w = this.config.w
    const h = this.config.h
    const factor = this.config.factor
    const maxValue = this.config.maxValue
    const radians = this.config.radians
    const totalFields = this.totalFields
    const colors = [
      this.playerHelperSingleton.maneColor,
      this.playerHelperSingleton.benzemaColor,
      this.playerHelperSingleton.mbappeColor
    ]
    const players = [
      this.playerHelperSingleton.maneName,
      this.playerHelperSingleton.benzemaName,
      this.playerHelperSingleton.mbappeName
    ]
    dataSets.forEach((data, datai) => {
      const dataValues = []
      Object.entries(data).forEach((elem, i) => {
        dataValues.push([
          (w / 2) *
            (1 -
              (parseFloat(Math.max(elem[1], 0)) / maxValue) *
                factor *
                Math.sin((i * radians) / totalFields)),
          (h / 2) *
            (1 -
              (parseFloat(Math.max(elem[1], 0)) / maxValue) *
                factor *
                Math.cos((i * radians) / totalFields)),
          elem[0],
          players[datai]
        ])
      })
      this.svg
        .select('#mainGraphBody')
        .selectAll('.nodes')
        .data(dataValues)
        .enter()
        .append('svg:circle')
        .attr('class', function () {
          return 'radar-chart-node-serie_' + datai
        })
        .attr('id', function () {
          return 'radar-chart-node_' + datai + '_' + series++
        })
        .attr('r', this.config.nodeRadius)
        .attr('cx', function (j) {
          return j[0]
        })
        .attr('cy', function (j) {
          return j[1]
        })
        .style('fill', colors[datai])
        .attr('transform', 'translate(' + w / 2 + ')')
        .on('mouseover', (data, index, element) => {
          this.svg
            .selectAll('polygon')
            .transition(200)
            .style('fill-opacity', 0.1)
            .style('stroke-opacity', 0.1)
          this.svg
            .selectAll('circle')
            .transition(200)
            .style('fill-opacity', 0.01)
          this.svg
            .selectAll('.common-transition-3')
            .transition(200)
            .style('fill-opacity', 1)
            .attr('r', 10)
          this.svg
            .select(`.radar-chart-serie_${datai}`)
            .transition(200)
            .style('fill-opacity', 0.8)
          this.svg
            .selectAll(`.radar-chart-node-serie_${datai}`)
            .transition(200)
            .style('fill-opacity', 1)
          this.tooltip.show(data, element[index])
        })
        .on('mouseout', (data, index, element) => {
          this.svg.select(`.radar-chart-node_${series}`)
          this.tooltip.hide()
          this.svg
            .selectAll('polygon')
            .transition(200)
            .style('fill-opacity', this.config.opacityArea)
            .style('stroke-opacity', 1)
          this.svg.selectAll('circle').transition(200).style('fill-opacity', 1)
        })
      series = 0
    })
  }

  createTooltip() {
    return this.chartHelper.createTip(this.svg, [-4, 0], (data) =>
      this.getToolTipState(data)
    )
  }

  getToolTipState(data) {
    if (typeof data !== 'string') {
      var selectedPlayerData
      switch (data[3]) {
        case this.playerHelperSingleton.maneName:
          selectedPlayerData = this.maneData
          break
        case this.playerHelperSingleton.benzemaName:
          selectedPlayerData = this.benzemaData
          break
        case this.playerHelperSingleton.mbappeName:
          selectedPlayerData = this.mbappeData
          break
      }
      const result = selectedPlayerData[data[2]]
      return `<div>
        <p class="tip-title">${data[3]}</p>
        <p class="tip-subtitle">${this.getTipTitle(data[2])}</p>
        <div class="tip-content" style="text-align: center; font-size: 20px">${result}</div>
      </div>`
    } else {
      return `<div>
        <p class="tip-title">${this.getTipTitle(data)}</p>
        <div class="tip-content" style="text-align: center; font-size: 20px">${this.getCategoryDescription(
          data
        )}</div>
      </div>`
    }
  }

  getCategoryDescription(category) {
    switch (category) {
      case 'touches':
        return 'Number of times the player touched the ball.'
      case 'assists':
        return 'Assists made by the player.'
      case 'attemptedPasses':
        return 'All passes made by the player, even the incomplete ones.'
      case 'completedPasses':
        return 'Successful passes made by the player.'
      case 'pressure':
        return 'Number of times the player applied pressure to opposing players who were receiving, carrying or releasing the ball.'
      case 'dribblesPercentage':
        return 'Percentage of Dribbles Completed Successfully.'
      case 'tackles':
        return 'Numbers of players tackled by the player.'
      case 'goals':
        return 'Goals scored by the player.'
      case 'shots':
        return 'Shots made by the player. Does not include penalty kicks.'
      case 'carries':
        return 'Number of times the player controlled the ball with their feet.'
    }
  }

  getTipTitle(data) {
    switch (data) {
      case 'dribblesPercentage':
        return '% completed dribbles'
      case 'completedPasses':
        return 'completed passes'
      case 'attemptedPasses':
        return 'attempted passes'
      default:
        return data
    }
  }

  drawLegend() {
    const legend = this.createPlayersLegend(
      this.svg,
      this.getWidth(),
      this.margin.top,
      this.chartHelper.legendLineSymbol
    )
    legend.attr('id', 'radar-chart-legend')
  }

  drawCheckbox() {
    var legendHeight = this.svg
      .select('#radar-chart-legend')
      .node()
      .getBoundingClientRect().height
    const heightOffset = legendHeight + this.margin.top + 55

    const checkbox = this.chartHelper.createCheckbox(
      this.svg,
      this.getWidth(),
      heightOffset,
      'Toggle Radar Chart',
      'All Leagues',
      'UEFA League',
      this.isUEFAChecked,
      () => this.onCheckboxChecked(),
      () => this.onCheckboxUnchecked()
    )

    checkbox.attr('id', 'radar-chart-checkbox').on('mouseenter', () => {
      for (let index = 0; index < 3; index++) {
        this.svg.select(`.radar-chart-node_${index}`)
        this.tooltip.hide()
        this.svg
          .selectAll('polygon')
          .transition(200)
          .style('fill-opacity', this.config.opacityArea)
          .style('stroke-opacity', 1)
        this.svg.selectAll('circle').transition(200).style('fill-opacity', 1)
      }
    })
  }

  onCheckboxChecked() {
    this.isUEFAChecked = true
    this.refreshViews()
  }

  onCheckboxUnchecked() {
    this.isUEFAChecked = false
    this.refreshViews()
  }

  refreshViews() {
    for (let index = 0; index < 3; index++) {
      this.svg
        .selectAll(`.radar-chart-serie_${index}`)
        .transition()
        .duration(750)
        .style('opacity', 0)
      this.svg
        .selectAll(`.radar-chart-node-serie_${index}`)
        .transition()
        .duration(750)
        .style('opacity', 0)
    }
    setTimeout(() => {
      for (let index = 0; index < 3; index++) {
        this.svg.selectAll(`.radar-chart-serie_${index}`).remove()
        this.svg.selectAll(`.radar-chart-node-serie_${index}`).remove()
      }
      this.svg.selectAll(`.line`).remove()
      this.svg.selectAll(`.axeButton`).remove()
      this.svg.selectAll(`.axeTitle`).remove()
      if (this.isUEFAChecked) {
        this.savedData = [this.maneData, this.benzemaData, this.mbappeData]
        this.maneData = this.maneDataUEFA
        this.benzemaData = this.benzemaDataUEFA
        this.mbappeData = this.mbappeDataUEFA
      } else {
        this.maneData = this.savedData[0]
        this.benzemaData = this.savedData[1]
        this.mbappeData = this.savedData[2]
      }
      this.drawRadar()
    }, 750)
  }

  drawRadar() {
    this.setAdjustedPlayerValues(
      this.maneData,
      this.benzemaData,
      this.mbappeData
    )
    this.drawAreas(
      this.adjustedManeData,
      this.adjustedBenzemaData,
      this.adjustedMbappeData
    )
    for (let index = 0; index < 3; index++) {
      this.svg.selectAll(`.radar-chart-serie_${index}`).style('opacity', 0)
    }
    this.drawSegments(this.config.factor, this.config.radians, this.totalFields)
    this.drawAxes(this.config.factor, this.config.radians, this.totalFields)
    this.drawNodes(
      this.adjustedManeData,
      this.adjustedBenzemaData,
      this.adjustedMbappeData
    )
    for (let index = 0; index < 3; index++) {
      this.svg.selectAll(`.radar-chart-serie_${index}`).style('opacity', 0)
      this.svg.selectAll(`.radar-chart-node-serie_${index}`).style('opacity', 0)
    }
    for (let index = 0; index < 3; index++) {
      this.svg
        .selectAll(`.radar-chart-serie_${index}`)
        .transition()
        .duration(750)
        .style('opacity', 1)
      this.svg
        .selectAll(`.radar-chart-node-serie_${index}`)
        .transition()
        .duration(750)
        .style('opacity', 1)
    }
  }
}

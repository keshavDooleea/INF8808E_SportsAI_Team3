import { AbstractChartManager } from './abstract-chart-manager'

/**
 * Manager for stacked chart visualization
 *
 * @class StackedBarChartManager
 */
export class StackedBarChartManager extends AbstractChartManager {
  constructor(svgId) {
    super(svgId)
  }

  preprocess() {
    this.shootingData = this.preprocessShootingData(
      this.playerHelperSingleton.groupedShootingData
    )
  }

  /**
   * Calculates percentage of goals made and PK made for each player
   *
   * @param {object[]} shootingData the grouped shooting data
   * @returns {object[]} the preprocessed data
   **/
  preprocessShootingData(shootingData) {
    shootingData.forEach((element) => {
      var PK = 0
      // eslint-disable-next-line eqeqeq
      if (element.PKatt != '0') {
        PK = Number(element.PK) / Number(element.PKatt)
      }
      if (element.Player === 'Sadio Mané') {
        // this.maneData = [element.Player, [element.GSh, PK]]
        this.maneDataG = {
          player: element.Player,
          shotType: 'Regular Shots',
          made: Number(element.GSh),
          missed: Number(element.Sh)
        }
        this.maneDataP = {
          player: element.Player,
          shotType: 'Penalty Shots',
          made: PK,
          missed: Number(element.PKatt) - PK
        }
      } else if (element.Player === 'Karim Benzema') {
        // this.benzemaData = [element.Player, [element.GSh, PK]]
        this.benzemaDataG = {
          player: element.Player,
          shotType: 'Regular Shots',
          made: Number(element.GSh),
          missed: Number(element.Sh)
        }
        this.benzemaDataP = {
          player: element.Player,
          shotType: 'Penalty Shots',
          made: PK,
          missed: Number(element.PKatt) - PK
        }
      } else if (element.Player === 'Kylian Mbappé') {
        // this.mbappeData = [element.Player, [element.GSh, PK]]
        this.mbappeDataG = {
          player: element.Player,
          shotType: 'Regular Shots',
          made: Number(element.GSh),
          missed: Number(element.Sh)
        }
        this.mbappeDataP = {
          player: element.Player,
          shotType: 'Penalty Shots',
          made: PK,
          missed: Number(element.PKatt) - PK
        }
      }
    })

    return [
      this.maneDataG,
      this.maneDataP,
      this.benzemaDataG,
      this.benzemaDataP,
      this.mbappeDataG,
      this.mbappeDataP
    ]
  }

  initializeVariables() {
    this.leftAxisPosition = 20
    this.heightOffsetAxis = 4
    this.margin = { top: 20, right: 20, bottom: 30, left: 40, leftPadding: 70 }

    this.width = this.svgWidth - this.margin.left - this.margin.right
    this.height = this.svgHeight - this.margin.top - this.margin.bottom

    this.groups = d3
      .map(this.shootingData, (data) => this.getGroupLabelX(data))
      .keys()

    this.labelY = 'Attempted shots per player (%)'
    this.subGroups = ['made', 'missed']
    this.colors = ['steelblue', '#91c9c4']
  }

  getGroupLabelX(data) {
    return `${data.player} - ${data.shotType}`
  }

  initializeCharts() {
    this.drawLegend(this.width * 0.97)
    this.drawLabels()
    this.drawChart()
    this.drawLabelX()
    this.setLabelY(this.labelY, 'stacked-bar-chart-label-y')
  }

  drawLabels() {
    this.setAxisX()
    this.setAxisY()
  }

  // Add X axis
  setAxisX() {
    this.scaleX = d3
      .scaleBand()
      .domain(this.groups)
      .range([0, this.width * 0.85])
      .padding([0.2])

    this.barSize = this.scaleX.bandwidth()

    this.svg
      .append('g')
      .attr(
        'transform',
        `translate(
         ${this.leftAxisPosition + this.margin.leftPadding},
         ${this.height + this.heightOffsetAxis}
       )`
      )
      .call(d3.axisBottom(this.scaleX).tickSize(5))
  }

  setAxisY() {
    // Add Y axis
    var formatPercent = d3.format('.0%')
    this.scaleY = d3.scaleLinear().domain([0, 1]).range([this.height, 0])

    this.svg
      .append('g')
      .attr(
        'transform',
        `translate(
           ${this.leftAxisPosition + this.margin.leftPadding},
           ${this.heightOffsetAxis}
         )`
      )
      .call(d3.axisLeft(this.scaleY).tickFormat(formatPercent))
  }

  drawLabelX() {
    const labelHeightOffset = 40
    const xAxisWidth = this.svg
      .select('#stacked-chart-container')
      .node()
      .getBoundingClientRect().width

    const rectSize = xAxisWidth / this.shootingData.length

    // remove odd positions since each 2 position is associated to a player
    const playerData = this.shootingData.filter((_, index) => index % 2 !== 0)

    this.svg
      .select('#stacked-chart-container')
      .append('g')
      .attr(
        'transform',
        `translate(
        ${this.leftAxisPosition + this.margin.leftPadding},
        ${this.heightOffsetAxis}
      )`
      )
      .selectAll('g')
      .data(playerData)
      .enter()
      .append('text')
      .text((data) => data.player)
      .attr('transform', (_, index) => {
        return `translate(
          ${rectSize * (index * 2) + this.barSize},
          ${this.height + this.heightOffsetAxis + labelHeightOffset}
        )`
      })
  }

  drawLegend(width) {
    const legend = this.chartHelper.createLegend(
      this.svg,
      width - 13,
      this.margin.top,
      ['Shots Made', 'Shots Missed'],
      this.colors
    )
    legend.attr('id', 'stacked-chart-legend')
  }

  drawChart() {
    this.svg.append('g').attr('id', 'stacked-chart-container')

    // Stack the data
    var stackedData = d3.stack().keys(this.subGroups)(this.shootingData)

    var color = d3.scaleOrdinal().domain(this.subGroups).range(this.colors)

    // Place the bars
    this.svg
      .select('#stacked-chart-container')
      .append('g')
      .attr(
        'transform',
        `translate(
          ${this.leftAxisPosition + this.margin.leftPadding},
          ${this.heightOffsetAxis}
        )`
      )
      .selectAll('g')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', (d) => color(d.key))
      .selectAll('rect')
      .data((d) => d)
      .enter()
      .append('rect')
      .attr('x', (d) => this.scaleX(this.getGroupLabelX(d.data)))
      .attr('y', (d) => this.scaleY(d[1]))
      .attr('height', (d) => this.scaleY(d[0]) - this.scaleY(d[1]))
      .attr('width', this.barSize)
  }
}

import { AbstractChartManager } from './abstract-chart-manager'
import { scrollSubject } from '../../scroll'
import { distinctUntilChanged } from 'rxjs'

/**
 * Manager for stacked chart visualization
 *
 * @class StackedBarChartManager
 */
export class StackedBarChartManager extends AbstractChartManager {
  constructor(svgId) {
    super(svgId)

    scrollSubject.pipe(distinctUntilChanged()).subscribe((val) => {
      if (val === 4) this.refreshViews()
    })
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
        PK = Number(element.PK)
      }
      if (element.Player === 'Sadio Mané') {
        // this.maneData = [element.Player, [element.GSh, PK]]
        this.maneDataG = {
          player: element.Player,
          shotType: 'Regular Shots',
          made: Number(element.Gls),
          missed: Number(element.Sh) - Number(element.Gls)
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
          made: Number(element.Gls),
          missed: Number(element.Sh) - Number(element.Gls)
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
          made: Number(element.Gls),
          missed: Number(element.Sh) - Number(element.Gls)
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
    var groups = this.groups
    var ticks = [
      'Regular Shots',
      'Penalty Shots',
      'Regular Shots',
      'Penalty Shots',
      'Regular Shots',
      'Penalty Shots'
    ]

    this.scaleX = d3
      .scaleBand()
      .domain(groups)
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
      .call(
        d3
          .axisBottom()
          .scale(this.scaleX)
          .ticks(ticks)
          .tickValues(groups)
          .tickFormat(function (x) {
            return ticks[groups.indexOf(x)]
          })
      )
  }

  // Add Y axis
  setAxisY() {
    this.scaleY = d3.scaleLinear().domain([0, 100]).range([this.height, 0])

    this.svg
      .append('g')
      .attr(
        'transform',
        `translate(
           ${this.leftAxisPosition + this.margin.leftPadding},
           ${this.heightOffsetAxis}
         )`
      )
      .call(
        d3.axisLeft(this.scaleY).tickFormat(function (d) {
          return d + '%'
        })
      )
  }

  drawLabelX() {
    const labelHeightOffset = 40

    const rectSize = this.svgWidth / this.shootingData.length

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

    var subGroups = ['made', 'missed']

    // Normalize shooting data
    var normalizedData = this.shootingData
    normalizedData.forEach(function (d) {
      var i = 0
      var tot = 0
      var name
      for (i in subGroups) {
        name = subGroups[i]
        tot += +d[name]
      }
      for (i in subGroups) {
        name = subGroups[i]
        if (tot == 0) {
          tot = 100
        }
        d[name] = (d[name] / tot) * 100
      }
    })

    // Stack the data
    var stackedData = d3.stack().keys(this.subGroups)(normalizedData)

    this.tip = this.chartHelper.createTip(this.svg, [-4, 0], (d) => {
      return `<div>
      <p class="tip-title">${d.player}</p>
      <p class="tip-subtitle">${d.shotType}</p>
      <div class="tip-content">Percentage: ${Math.round(d.value)}%</div>
    </div>`
    })

    const tipReference = this.tip
    var colors = ['steelblue', '#91c9c4']

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
      .attr('class', 'stacked-rect')
      .attr('x', (d) => this.scaleX(this.getGroupLabelX(d.data)))
      .attr('y', (d) => this.scaleY(d[1]))
      .attr('height', (d) => this.scaleY(d[0]) - this.scaleY(d[1]))
      .attr('width', this.barSize)
      // Show tooltip
      .on('mouseover', function (d) {
        var ogColor = d3.select(this.parentNode).attr('fill')
        var total = d.data.made + d.data.missed
        var value = 0
        var shotType
        if (d3.rgb(ogColor).toString() == d3.rgb(colors[0])) {
          value = d.data.made
          shotType = 'Shots Made'
        } else {
          value = d.data.missed
          shotType = 'Shots Missed'
        }
        var percent = (value / total) * 100
        tipReference.show(
          { value, player: d.data.player, shotType },
          percent,
          this
        )
        d3.select(this).attr('fill', d3.rgb(ogColor).darker(2))
      })
      .on('mouseout', function () {
        var ogColor = d3.select(this.parentNode).attr('fill')
        d3.select(this).attr('fill', d3.rgb(ogColor))
        tipReference.hide()
      })

    this.svgWidth = this.svg
      .select('#stacked-chart-container')
      .node()
      .getBoundingClientRect().width

    this.svg.selectAll('.stacked-rect').attr('height', 0)

    this.svg
      .selectAll('.stacked-rect')
      .transition()
      .delay(function () {
        return Math.random() * 1000
      })
      .duration(1000)
      .attr('y', (d) => {
        return this.scaleY(d[1])
      })
      .attr('height', (d) => {
        return this.scaleY(d[0]) - this.scaleY(d[1])
      })
  }

  refreshViews() {
    this.svg.selectAll('.stacked-rect').remove()
    this.tip.hide()
    this.drawChart()
  }
}

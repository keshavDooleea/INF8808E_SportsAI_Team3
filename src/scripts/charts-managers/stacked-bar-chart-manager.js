import { AbstractChartManager } from './abstract-chart-manager'

/**
 * Manager for stacked chart visualization
 *
 * @class StackedBarChartManager
 */
export class StackedBarChartManager extends AbstractChartManager {
  preprocess () {
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
  preprocessShootingData (shootingData) {
    shootingData.forEach((element) => {
      var PK = 0
      // eslint-disable-next-line eqeqeq
      if (element.PKatt != '0') {
        PK = Number(element.PK)
      }
      if (element.Player === 'Sadio Mané') {
        // this.maneData = [element.Player, [element.GSh, PK]]
        this.maneDataG = {
          player: element.Player + '\n - Regular Shots',
          made: Number(element.Gls),
          missed: Number(element.Sh) - Number(element.Gls)
        }
        this.maneDataP = {
          player: element.Player + '\n - Penalty Shots',
          made: PK,
          missed: Number(element.PKatt) - PK
        }
      } else if (element.Player === 'Karim Benzema') {
        // this.benzemaData = [element.Player, [element.GSh, PK]]
        this.benzemaDataG = {
          player: element.Player + '\n - Regular Shots',
          made: Number(element.Gls),
          missed: Number(element.Sh) - Number(element.Gls)
        }
        this.benzemaDataP = {
          player: element.Player + '\n - Penalty Shots',
          made: PK,
          missed: Number(element.PKatt) - PK
        }
      } else if (element.Player === 'Kylian Mbappé') {
        // this.mbappeData = [element.Player, [element.GSh, PK]]
        this.mbappeDataG = {
          player: element.Player + '\n - Regular Shots',
          made: Number(element.Gls),
          missed: Number(element.Sh) - Number(element.Gls)
        }
        this.mbappeDataP = {
          player: element.Player + '\n - Penalty Shots',
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

  drawLegend (width) {
    const legend = this.chartHelper.createLegend(
      this.svg,
      width,
      this.margin.top,
      this.chartHelper.legendLineSymbol,
      ['Shots Made', 'Shots Missed'],
      [this.colorGreen, this.colorRed]
    )
    legend.attr('id', 'stacked-chart-legend')
  }

  initializeVariables () {
    this.leftAxisPosition = 20
    this.heightOffsetAxis = 4
    this.margin = { top: 20, right: 20, bottom: 30, left: 40, leftPadding: 70 }
    this.colorGreen = '#4daf4a'
    this.colorRed = '#e41a1c'
  }

  initializeCharts () {
    this.svg = d3.select('#stacked-bar-chart-svg')
    this.svgWidth = parseInt(this.svg.style('width'))
    this.svgHeight = parseInt(this.svg.style('height'))

    var width = this.svgWidth - this.margin.left - this.margin.right
    var height = this.svgHeight - this.margin.top - this.margin.bottom

    var colorGreen = this.colorGreen
    var colorRed = this.colorRed

    // this.svg.attr('width', 600).attr('height', 600).attr('padding', 10)

    var groups = d3
      .map(this.shootingData, function (d) {
        return d.player
      })
      .keys()

    var subGroups = ['made', 'missed']

    var color = d3
      .scaleOrdinal()
      .domain(subGroups)
      .range([d3.rgb(colorGreen), d3.rgb(colorRed)])

    this.drawLegend(width * 0.97)

    this.svg.append('g').attr('id', 'stacked-chart-container')

    // Add X axis
    console.log(groups)
    var x = d3
      .scaleBand()
      .domain(groups)
      .range([0, width * 0.9])
      .padding([0.2])

    this.svg
      .select('#stacked-chart-container')
      .append('g')
      .attr(
        'transform',
        `translate(
          ${this.leftAxisPosition + this.margin.leftPadding},
          ${height + this.heightOffsetAxis}
        )`
      )
      .call(d3.axisBottom(x).tickSize(5))

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 100]).rangeRound([height, 0])
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
      .call(d3.axisLeft(y).tickFormat( function (d) { return d + '%' }))

    // Normalize shooting data
    var normalizedData = this.shootingData
    normalizedData.forEach( function (d) {
      var i = 0
      var tot = 0
      var name
      for ( i in subGroups ) { 
        name = subGroups[i]
        tot += +d[name]
      }
      for (i in subGroups) { 
        name = subGroups[i]
        if ( tot == 0) { tot = 100 }
        d[name] = (d[name] / tot) * 100
      }
    })

    // Stack the data
    var stackedData = d3.stack().keys(subGroups)(normalizedData)
    console.log(stackedData)

    const tip = this.chartHelper.createTip(this.svg, [-4, 0], (d) => {
      return `<span>Percentage: ${Math.round(d)}%</span>`
    })

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
      .attr('fill', function (d) {
        return color(d)
      })
      .selectAll('rect')
      .data(function (d) {
        return d
      })
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return x(d.data.player)
      })
      .attr('y', function (d) {
        return y(d[1])
      })
      .attr('height', function (d) {
        return y(d[0]) - y(d[1])
      })
      .attr('width', function () {
        return x.bandwidth()
      })
      // Show tooltip
      .on('mouseover', function (d) {
        var ogColor = d3.select(this.parentNode).attr('fill')
        var total = d.data.made + d.data.missed
        var value = 0
        if (d3.rgb(ogColor).toString() == d3.rgb(colorGreen)) {
          value = d.data.made
        }
        else {
          value = d.data.missed
        }
        var percent = (value / total) * 100
        tip.show(value, percent, this)
        d3.select(this).attr('fill', d3.rgb(ogColor).darker(2))
      })
      .on('mouseout', function () {
        var ogColor = d3.select(this.parentNode).attr('fill')
        d3.select(this).attr('fill', d3.rgb(ogColor))
        tip.hide()
      })
  }
}

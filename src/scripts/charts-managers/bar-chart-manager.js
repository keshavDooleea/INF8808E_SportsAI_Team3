import { AbstractChartManager } from './abstract-chart-manager'

/**
 * Manager for bar chart visualization
 *
 * @class BarChartManager
 */
export class BarChartManager extends AbstractChartManager {
  preprocess() {
    this.winRegex = /W|1st|^F$/

    this.barChartData = [
      {
        id: 'domestic_cups',
        championshipName: 'Domestic Cup',
        values: []
      },
      {
        id: 'domestic_leagues',
        championshipName: 'Domestic League',
        values: []
      },
      {
        id: 'international_cups',
        championshipName: 'International Cup',
        values: []
      },
      {
        id: 'national_team',
        championshipName: 'National Team',
        values: []
      }
    ]

    let totalDomesticCups = 0
    let totalDomesticLeagues = 0
    let totalInternationalCups = 0
    let totalNationalTeam = 0

    Object.entries(this.playerHelperSingleton.championshipData).forEach(
      ([playerName, data]) => {
        totalDomesticCups += data.domesticCups.length
        totalDomesticLeagues += data.domesticLeagues.length
        totalInternationalCups += data.internationalCups.length
        totalNationalTeam += data.nationalTeam.length
      }
    )

    this.barChartData.forEach((barChart) => {
      Object.entries(this.playerHelperSingleton.championshipData).forEach(
        ([playerName, data]) => {
          const domesticCupsWin = data.domesticCups.filter((c) =>
            this.winRegex.test(c.LgRank)
          ).length

          const domesticLeaguesWin = data.domesticLeagues.filter((c) =>
            this.winRegex.test(c.LgRank)
          ).length

          const internationalCupsWin = data.internationalCups.filter((c) =>
            this.winRegex.test(c.LgRank)
          ).length

          const nationalTeamWin = data.nationalTeam.filter((c) =>
            this.winRegex.test(c.LgRank)
          ).length

          if (barChart.id === 'domestic_cups') {
            barChart.values.push({
              value: domesticCupsWin,
              playerName: playerName
            })
          } else if (barChart.id === 'domestic_leagues') {
            barChart.values.push({
              value: domesticLeaguesWin,
              playerName: playerName
            })
          } else if (barChart.id === 'international_cups') {
            barChart.values.push({
              value: internationalCupsWin,
              playerName: playerName
            })
          } else {
            barChart.values.push({
              value: nationalTeamWin,
              playerName: playerName
            })
          }
        }
      )
    })
  }

  drawLegend() {
    const legend = this.createPlayersLegend(
      this.svg,
      this.svgWidth - this.chartHelper.buttonWidth,
      this.margin.top,
      this.chartHelper.legendLineSymbol
    )
    legend.attr('id', 'bar-chart-legend')
  }

  setLabelY() {
    // break each word in order to display each one in a line for horizontal text
    const labelsY = 'Amount of Championship Won'.split(' ')
    const textHeight = 40

    // display each word in a new line
    labelsY.forEach((label, index) => {
      const positionY =
        (this.margin.top + this.svgHeight + textHeight * index) / 2

      this.svg
        .append('g')
        .append('text')
        .text(label)
        .attr('class', 'bar-chart-label-y')
        .attr(
          'transform',
          `translate(0, ${positionY - (textHeight * labelsY.length) / 2})`
        )
    })
  }

  setLabelX() {
    // label of x axis
    this.svg
      .append('g')
      .append('text')
      .text('Types of championship')
      .attr(
        'transform',
        `translate(${this.leftAxisPosition + this.margin.leftPadding}, ${
          this.svgHeight
        })`
      )
  }

  initializeVariables() {
    this.leftAxisPosition = 20
    this.heightOffsetAxis = 4
    this.margin = { top: 20, right: 20, bottom: 30, left: 40, leftPadding: 70 }
  }

  initializeCharts() {
    this.svg = d3.select('#bar-chart-svg')
    this.svgWidth = parseInt(this.svg.style('width'))
    this.svgHeight = parseInt(this.svg.style('height'))

    const championshipNames = this.barChartData.map(function (d) {
      return d.championshipName
    })
    const playersNames = this.barChartData[0].values.map(function (d) {
      return d.playerName
    })

    var width = this.svgWidth - this.margin.left - this.margin.right
    var height = this.svgHeight - this.margin.top - this.margin.bottom

    this.setLabelX()
    this.setLabelY()
    this.drawLegend()

    const x = d3
      .scaleBand()
      .domain(championshipNames)
      .range([0, width])
      .padding([0.1]) // x0 championship

    this.svg
      .append('g')
      .attr('class', 'x axis')
      .attr(
        'transform',
        `translate(${this.leftAxisPosition + this.margin.leftPadding}, ${
          height + this.heightOffsetAxis
        })`
      )
      .call(d3.axisBottom(x).tickSize(0))

    const xPlayerName = d3
      .scaleBand()
      .domain(playersNames)
      .range([0, x.bandwidth()])
      .padding([0.05]) // x1 playersnames

    const y = d3
      .scaleLinear()
      .domain([
        0,

        d3.max(this.barChartData, function (playerName) {
          return d3.max(playerName.values, function (d) {
            return d.value
          })
        })
      ])
      .range([height, 0])

    this.svg
      .append('g')
      .attr('class', 'y axis')
      .attr(
        'transform',
        `translate(${this.leftAxisPosition + this.margin.leftPadding}, ${
          this.heightOffsetAxis
        })`
      )
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('dy', '.7em')
      .attr('dx', '-20em')
      .style('text-anchor', 'end')
      .style('font-family', 'Inter')
      .style('font-size', '12px')
      .style('font-style', 'normal')
      .style('font-weight', '400')
      .text('Amount of Win (%)')
    var color = d3
      .scaleOrdinal()
      .domain(playersNames)
      .range(['#6f4e7c', '#ffa056', '#4682b4'])

    const tip = this.chartHelper.createTip(this.svg, [-4, 0], (playerData) => {
      return `<span>Won: ${playerData.value}</span>`
    })

    this.svg
      .select('.y')
      .transition()
      .duration(500)
      .delay(1300)
      .style('opacity', '1')

    var slice = this.svg
      .selectAll('.slice')
      .data(this.barChartData)
      .enter()
      .append('g')
      .attr('class', 'g')
      .attr('transform', (d) => {
        return `translate(${x(d.championshipName) + this.margin.leftPadding}, ${
          this.heightOffsetAxis
        })`
      })

    slice
      .selectAll('rect')
      .data(function (d) {
        return d.values
      })
      .enter()
      .append('rect')
      .attr('width', xPlayerName.bandwidth())
      .attr('x', function (d) {
        return xPlayerName(d.playerName)
      })
      .style('fill', function (d) {
        return color(d.playerName)
      })
      .attr('y', function () {
        return y(0)
      })
      .attr('height', function () {
        return height - y(0)
      })
      .on('mouseover', function (data) {
        d3.select(this).style('fill', d3.rgb(color(data.playerName)).darker(2))
        tip.show(data, this)
      })
      .on('mouseout', function (data) {
        d3.select(this).style('fill', color(data.playerName))
        tip.hide()
      })

    slice
      .selectAll('rect')
      .transition()
      .delay(function () {
        return Math.random() * 1000
      })
      .duration(1000)
      .attr('y', function (d) {
        return y(d.value)
      })
      .attr('height', function (d) {
        return height - y(d.value)
      })
  }
}

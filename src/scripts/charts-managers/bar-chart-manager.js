import { TEXT_COLORS } from '../utils/utils'
import { AbstractChartManager } from './abstract-chart-manager'

/**
 * Manager for bar chart visualization
 *
 * @class BarChartManager
 */
export class BarChartManager extends AbstractChartManager {
  constructor(svgId) {
    super(svgId)
  }

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

    const getPercentage = (value, total) => {
      return parseFloat(((value / total) * 100).toFixed(2))
    }

    const getPlayerFullName = (playerName) => {
      const csvPlayerName = playerName.split('_')[0].toLocaleLowerCase()

      if (csvPlayerName.includes('sadio')) {
        return this.playerHelperSingleton.maneName
      }

      if (csvPlayerName.includes('kylian')) {
        return this.playerHelperSingleton.mbappeName
      }

      if (csvPlayerName.includes('karim')) {
        return this.playerHelperSingleton.benzemaName
      }
    }

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

          let playerCompleteName = getPlayerFullName(playerName)

          if (barChart.id === 'domestic_cups') {
            barChart.values.push({
              raw: domesticCupsWin,
              value: getPercentage(domesticCupsWin, data.domesticCups.length),
              playerName: playerName,
              outOf: data.domesticCups.length,
              name: playerCompleteName
            })
          } else if (barChart.id === 'domestic_leagues') {
            barChart.values.push({
              raw: domesticLeaguesWin,
              value: getPercentage(
                domesticLeaguesWin,
                data.domesticLeagues.length
              ),
              playerName: playerName,
              outOf: data.domesticLeagues.length,
              name: playerCompleteName
            })
          } else if (barChart.id === 'international_cups') {
            barChart.values.push({
              raw: internationalCupsWin,
              value: getPercentage(
                internationalCupsWin,
                data.internationalCups.length
              ),
              playerName: playerName,
              outOf: data.internationalCups.length,
              name: playerCompleteName
            })
          } else {
            barChart.values.push({
              raw: nationalTeamWin,
              value: getPercentage(nationalTeamWin, data.nationalTeam.length),
              playerName: playerName,
              outOf: data.nationalTeam.length,
              name: playerCompleteName
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

  setLabelX() {
    this.svg
      .append('g')
      .append('text')
      .text('Amount of Championship Won %')
      .attr(
        'transform',
        `translate(${this.leftAxisPosition + this.margin.leftPadding}, ${
          this.svgHeight - this.margin.bottom
        })`
      )
  }

  createTip() {
    return this.chartHelper.createTip(this.svg, [-4, 0], (playerData) => {
      return `
      <div>
      <p class="tip-title">${playerData.name}</p>
      <p class="tip-subtitle">${playerData.value} %</p>
      <div>
      <span>Won: ${playerData.raw}</span>
      <br>
      <span>Total Championships: ${playerData.outOf}</span>`
    })
  }

  initializeVariables() {
    this.leftAxisPosition = 40
    this.heightOffsetAxis = 4
    this.margin = { top: 20, right: 20, bottom: 30, left: 110, leftPadding: 70 }
    this.width = this.svgWidth - this.margin.left - this.margin.right
    this.height = this.svgHeight - this.margin.top - this.margin.bottom
  }

  initializeCharts() {
    const championshipNames = this.barChartData.map(function (d) {
      return d.championshipName
    })
    const playersNames = this.barChartData[0].values.map(function (d) {
      return d.playerName
    })

    const color = d3
      .scaleOrdinal()
      .domain(playersNames)
      .range(this.playerHelperSingleton.playersColor)

    this.setLabelX()
    this.setLabelY('Types of championship', 'bar-chart-label-y')
    this.drawLegend()
    const tip = this.createTip()

    const y0 = d3
      .scaleBand()
      .domain(championshipNames)
      .rangeRound([this.margin.top, this.height - this.margin.bottom])
      .paddingInner(0.1)

    const y1 = d3
      .scaleBand()
      .domain(playersNames)
      .rangeRound([y0.bandwidth(), 0])
      .padding(0.05)

    this.x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(this.barChartData, function (playerName) {
          return d3.max(playerName.values, function (d) {
            return d.value
          })
        })
      ])
      .nice()
      .rangeRound([this.margin.left, this.width - this.margin.right])

    const xAxis = (g) =>
      g
        .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
        .call(d3.axisBottom(this.x).tickSizeOuter(0))
        .call((g) => g.select('.domain').remove())
        .call(d3.axisBottom(this.x).ticks(10, 's'))

    const yAxis = (g) =>
      g
        .attr('transform', `translate(${this.margin.left},0)`)
        .call(d3.axisLeft(y0).ticks(null, 's'))

    this.drawVerticalLines()

    this.svg
      .append('g')
      .selectAll('g')
      .data(this.barChartData)
      .join('g')
      .attr('transform', (d) => {
        return `translate(0, ${y0(d.championshipName)})`
      })
      .selectAll('rect')
      .data((d) => d.values)
      .join('rect')
      .attr('x', (d) => this.x(0))
      .attr('y', (d) => y1(d.playerName))
      .attr('height', y1.bandwidth())
      .attr('width', 0) // Width initially at 0 for animation
      .attr('fill', (d) => color(d.playerName))
      .on('mouseover', function (data) {
        d3.select(this).style('fill', d3.rgb(color(data.playerName)).darker(2))
        tip.show(data, this)
      })
      .on('mouseout', function (data) {
        d3.select(this).style('fill', color(data.playerName))
        tip.hide()
      })
      .transition()
      .delay(function () {
        return Math.random() * 1000
      })
      .duration(1000)
      .attr('width', (d) => this.x(d.value) - this.x(0))

    this.svg.append('g').call(xAxis)
    this.svg.append('g').call(yAxis)
  }

  drawVerticalLines() {
    const dashArray = 4
    const horizontalState = 14

    for (let i = 1; i < horizontalState; i++) {
      const positionX = this.x(i * 5)

      this.svg
        .append('line')
        .attr('class', 'bar-chart-horizontal-lines')
        .style('stroke', TEXT_COLORS.lightGray)
        .style('stroke-width', 2)
        .attr('stroke-dasharray', dashArray)
        .attr('x1', positionX)
        .attr('y1', 370)
        .attr('x2', positionX)
        .attr('y2', 0)
        .attr(
          'transform',
          `translate(0,${
            (this.height % (this.height - this.margin.bottom)) - 5
          })`
        )
    }
  }
}

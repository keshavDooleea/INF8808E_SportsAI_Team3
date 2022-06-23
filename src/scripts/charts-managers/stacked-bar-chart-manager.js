import { AbstractChartManager } from './abstract-chart-manager'

/**
 * Manager for stacked chart visualization
 *
 * @class StackedBarChartManager
 */
export class StackedBarChartManager extends AbstractChartManager {
  preprocess () {
    this.shootingData = this.preprocessShootingData(this.playerHelperSingleton.groupedShootingData)
  }

  initializeVariables () {}

  initializeCharts () {
    this.svg = d3.select('#stacked-bar-chart-svg')

    this.margin = {
      top: 50,
      right: 150,
      bottom: 30,
      left: 60,
      leftPadding: 20
    }

    this.width = 700 - this.margin.left - this.margin.right
    this.height = 400 - this.margin.top - this.margin.bottom

    console.log(this.shootingData)

    this.svg
      .attr('width', 600)
      .attr('height', 600)
      .attr('padding', 10)

    var groups = d3.map(this.shootingData, function (d) { return (d[0]) }).keys()

    var color = d3.scaleOrdinal()
      .domain(this.shootingData)
      .range(['#e41a1c', '#4daf4a'])

    // Add X axis
    var x = d3.scaleBand()
      .domain(groups)
      .range([0, this.width])
      .padding([0.1])
    this.svg.append('g')
      .attr('transform', 'translate(' + 100 + ',' + this.height + ')')
      .call(d3.axisBottom(x).tickSizeOuter(0))

    var formatPercent = d3.format('.0%')

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 1])
      .range([this.height, 0])
    this.svg.append('g')
      .attr('transform', 'translate(' + 100 + ',' + '0' + ')')
      .call(d3.axisLeft(y).tickFormat(formatPercent))

    this.svg.append('g')
      .selectAll('g')
      .data(this.shootingData)
      .enter()
      .append('g')
      .attr('fill', function (d) { return color(d.key) })
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function (d) { return d })
      .enter().append('rect')
      // .attr('x', function (d) { return x(d.Player) })
      // .attr('y', function (d) { return y(d[1]) })
      // .attr('height', function (d) { return y(d[0]) - y(d[1]) })
      // .attr('width', x.bandwidth())
  }

  /**
   * Calculates percentage of goals made and PK made for each player
   *
   * @param shootingData
   * @returns {object[]} the preprocessed data
   **/

  preprocessShootingData (shootingData) {
    console.log('preprocessShootingData')

    shootingData.forEach((element, index) => {
      var PK = 0
      // eslint-disable-next-line eqeqeq
      if (element.PKatt != 0) {
        PK = element.PK / element.PKatt
      }
      if (element.Player === 'Sadio Mané') {
        this.maneData = [element.Player, element.GSh, PK]
      } else if (element.Player === 'Karim Benzema') {
        this.benzemaData = [element.Player, element.GSh, PK]
      } else if (element.Player === 'Kylian Mbappé') {
        this.mbappeData = [element.Player, element.GSh, PK]
      }
    })
    return [this.maneData, this.benzemaData, this.mbappeData]
  }
}

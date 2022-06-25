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

  initializeVariables () {
    this.margin = {
      top: 50,
      right: 150,
      bottom: 30,
      left: 60,
      leftPadding: 20
    }
  }

  initializeCharts () {
    this.svg = d3.select('#stacked-bar-chart-svg')

    // this.drawLegend()

    this.width = 700 - this.margin.left - this.margin.right
    this.height = 400 - this.margin.top - this.margin.bottom

    console.log(this.shootingData)

    this.svg
      .attr('width', 600)
      .attr('height', 600)
      .attr('padding', 10)

    var subGroups = ['Mané \n Regular Shots', 'Mané \n Penalty Kicks',
      'Benzema \n Regular Shots', 'Benzema \n Penalty Kicks',
      'Mbappe \n Regular Shots', 'Mbappe \n Penalty Kicks']

    var color = d3.scaleOrdinal()
      .domain(this.shootingData)
      .range(['#e41a1c', '#4daf4a'])

    var stack = d3.stack().keys(['gsh', 'gm', 'pk', 'pkm'])
    var datasets = [d3.stack().keys(['gsh', 'gm'])(this.shootingData), d3.stack().keys(['pk', 'pkm'])(this.shootingData)]    
    console.log('datasets', datasets)

    var num_groups = datasets.length

    var xlabels = this.shootingData.map(function (d) { return d.Player })

    // Add X axis
    var x = d3.scaleBand()
      .domain(subGroups)
      .range([0, this.width])
      .padding([0.1])
    this.svg.append('g')
      .attr('transform', 'translate(' + 100 + ',' + this.height + ')')
      .call(d3.axisBottom(x).tickSizeOuter(0))

    // Add Y axis
    var formatPercent = d3.format('.0%')
    var y = d3.scaleLinear()
      .domain([0, 1])
      .range([this.height, 0])
    this.svg.append('g')
      .attr('transform', 'translate(' + 100 + ',' + '0' + ')')
      .call(d3.axisLeft(y).tickFormat(formatPercent))

    // var stackedData = d3.stack()
    //   .keys(subGroups)(this.shootingData)

    this.svg.append('g')
      .selectAll('g')
      .data(datasets)
      .enter()
      .append('g')
      .attr('fill', function (d) { return color(d.key) })
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function (d) { console.log('d', d); return d })
      .enter().append('rect')
      .attr('x', function (d) { console.log('x', x(d)); return x(d) })
      .attr('y', function (d) { console.log('y', y(d)); return y(d) })
      .attr('height', function (d) { console.log(y((d[0]) - y(d[1]))); return y((d[0]) - y(d[1])) })
      .attr('width', x.bandwidth())
  }

  /**
   * Calculates percentage of goals made and PK made for each player
   *
   * @param shootingData
   * @returns {object[]} the preprocessed data
   **/

  preprocessShootingData (shootingData) {
    shootingData.forEach((element) => {
      var PK = 0
      // eslint-disable-next-line eqeqeq
      if (element.PKatt != 0) {
        PK = element.PK / element.PKatt
      }
      if (element.Player === 'Sadio Mané') {
        // this.maneData = [element.Player, [element.GSh, PK]]
        this.maneData = {
          player: element.Player,
          gsh: element.GSh,
          gm: 1 - element.GSh,
          pk: PK,
          pkm: 1 - PK
        }
      } else if (element.Player === 'Karim Benzema') {
        // this.benzemaData = [element.Player, [element.GSh, PK]]
        this.benzemaData = {
          player: element.Player,
          gsh: element.GSh,
          gm: 1 - element.GSh,
          pk: PK,
          pkm: 1 - PK
        }
      } else if (element.Player === 'Kylian Mbappé') {
        // this.mbappeData = [element.Player, [element.GSh, PK]]
        this.mbappeData = {
          player: element.Player,
          gsh: element.GSh,
          gm: 1 - element.GSh,
          pk: PK,
          pkm: 1 - PK
        }
      }
    })
    return [this.maneData, this.benzemaData, this.mbappeData]
  }

  // drawLegend() {
  //   const legend = this.createPlayersLegend(
  //     this.svg,
  //     this.svgWidth - this.chartHelper.buttonWidth,
  //     this.margin.top,
  //     this.chartHelper.legendLineSymbol
  //   )
  //   legend.attr('id', 'stacked-chart-legend')
  // }
}

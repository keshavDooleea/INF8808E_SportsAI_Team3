import { AbstractChartManager } from './abstract-chart-manager'

/**
 * Manager for stacked chart visualization
 *
 * @class StackedBarChartManager
 */
export class StackedBarChartManager extends AbstractChartManager {
  preprocess() {
    this.shootingData = this.preprocessShootingData(
      this.playerHelperSingleton.groupedShootingData
    )
  }

  initializeVariables() {
    this.margin = {
      top: 50,
      right: 150,
      bottom: 30,
      left: 60,
      leftPadding: 20
    }
  }

  initializeCharts() {
    this.svg = d3.select('#stacked-bar-chart-svg')
    this.svgWidth = parseInt(this.svg.style('width'))
    this.svgHeight = parseInt(this.svg.style('height'))
    // this.drawLegend()

    this.width = this.svgWidth - this.margin.left - this.margin.right
    this.height = this.svgHeight - this.margin.top - this.margin.bottom

    var subGroups = [
      'Mané \n Regular Shots',
      'Mané \n Penalty Kicks',
      'Benzema \n Regular Shots',
      'Benzema \n Penalty Kicks',
      'Mbappe \n Regular Shots',
      'Mbappe \n Penalty Kicks'
    ]

    var color = d3
      .scaleOrdinal()
      .domain(this.shootingData)
      .range(['#e41a1c', '#4daf4a'])

    var stack = d3.stack().keys(['gsh', 'gm', 'pk', 'pkm'])
    /**
     * 1 : Man RS
     * 2 : Man PK
     * 3 : Ben RS
     * 4 : Ben PK
     * 5 : Mb RS
     * 6 : Mb PK
     */
    var datasets = [
      d3.stack().keys(['Mangsh', 'Mangm'])(this.shootingData[0]),
      d3.stack().keys(['Manpk', 'Manpkm'])(this.shootingData[0]),
      d3.stack().keys(['Bengsh', 'Bengm'])(this.shootingData[1]),
      d3.stack().keys(['Benpk', 'Benpkm'])(this.shootingData[1]),
      d3.stack().keys(['Mbgsh', 'Mbgm'])(this.shootingData[2]),
      d3.stack().keys(['Mbpk', 'Mbpkm'])(this.shootingData[2])
    ]

    var num_groups = datasets.length

    var xlabels = this.shootingData.map(function (d) {
      return d.Player
    })

    // Add X axis
    var x = d3
      .scaleBand()
      .domain(subGroups)
      .range([0, this.width])
      .padding([0.1])
    this.svg
      .append('g')
      .attr('transform', 'translate(' + 100 + ',' + this.height + ')')
      .call(d3.axisBottom(x).tickSizeOuter(0))

    // Add Y axis
    var formatPercent = d3.format('.0%')
    var y = d3.scaleLinear().domain([0, 1]).range([this.height, 0])
    this.svg
      .append('g')
      .attr('transform', 'translate(' + 100 + ',' + '0' + ')')
      .call(d3.axisLeft(y).tickFormat(formatPercent))

    // var stackedData = d3.stack()
    //   .keys(subGroups)(this.shootingData)

    this.svg
      .append('g')
      .selectAll('g')
      .data(datasets)
      .enter()
      .append('g')
      .attr('fill', function (d) {
        return color(d.key)
      })
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function (d) {
        return d
      })
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return x(d.key)
      })
      .attr('y', function (d) {
        return y(d.key)
      })
      .attr('height', function (d) {
        return y(d[0][0]) - y(d[0][1])
      })
      .attr('width', x.bandwidth())
      .attr('transform', `translate(150, 0)`)
  }

  /**
   * Calculates percentage of goals made and PK made for each player
   *
   * @param shootingData
   * @returns {object[]} the preprocessed data
   **/

  // preprocessShootingData(shootingData) {
  //   shootingData.forEach((element) => {
  //     var PK = 0
  //     // eslint-disable-next-line eqeqeq
  //     if (element.PKatt != 0) {
  //       PK = element.PK / element.PKatt
  //     }
  //     if (element.Player === 'Sadio Mané') {
  //       // this.maneData = [element.Player, [element.GSh, PK]]
  //       this.maneData = {
  //         player: element.Player,
  //         gsh: element.GSh,
  //         gm: 1 - element.GSh,
  //         pk: PK,
  //         pkm: 1 - PK
  //       }
  //     } else if (element.Player === 'Karim Benzema') {
  //       // this.benzemaData = [element.Player, [element.GSh, PK]]
  //       this.benzemaData = {
  //         player: element.Player,
  //         gsh: element.GSh,
  //         gm: 1 - element.GSh,
  //         pk: PK,
  //         pkm: 1 - PK
  //       }
  //     } else if (element.Player === 'Kylian Mbappé') {
  //       // this.mbappeData = [element.Player, [element.GSh, PK]]
  //       this.mbappeData = {
  //         player: element.Player,
  //         gsh: element.GSh,
  //         gm: 1 - element.GSh,
  //         pk: PK,
  //         pkm: 1 - PK
  //       }
  //     }
  //   })
  //   return [this.maneData, this.benzemaData, this.mbappeData]
  // }

  preprocessShootingData(shootingData) {
    shootingData.forEach((element) => {
      var PK = 0
      // eslint-disable-next-line eqeqeq
      if (element.PKatt != 0) {
        PK = Number(element.PK) / Number(element.PKatt)
      }
      if (element.Player === 'Sadio Mané') {
        // this.maneData = [element.Player, [element.GSh, PK]]
        this.maneDataG = {
          player: element.Player,
          Mangsh: Number(element.GSh),
          Mangm: 1 - Number(element.GSh),
          Manpk: PK,
          Manpkm: 1 - PK
        }
      } else if (element.Player === 'Karim Benzema') {
        // this.benzemaData = [element.Player, [element.GSh, PK]]
        this.benzemaDataG = {
          player: element.Player,
          Bengsh: Number(element.GSh),
          Bengm: 1 - Number(element.GSh),
          Benpk: PK,
          Benpkm: 1 - PK
        }
      } else if (element.Player === 'Kylian Mbappé') {
        // this.mbappeData = [element.Player, [element.GSh, PK]]
        this.mbappeDataG = {
          player: element.Player,
          Mbgsh: Number(element.GSh),
          Mbgm: 1 - Number(element.GSh),
          Mbpk: PK,
          Mbpkm: 1 - PK
        }
      }
    })
    return [[this.maneDataG], [this.benzemaDataG], [this.mbappeDataG]]
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

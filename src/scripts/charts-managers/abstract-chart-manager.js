const { playerHelperSingleton } = require('../helpers/players-helper')
const { chartHelper } = require('../helpers/chart-helper')

/**
 * Declaring an abstract manager Class for charts manager to handle common behaviors/logics.
 *
 * @class AbstractChartManager
 */
export class AbstractChartManager {
  playerHelperSingleton = playerHelperSingleton
  chartHelper = chartHelper

  /**
   * Define common flow of functions for inherited child classes
   *
   * @param {string} svgId the HTML identifier of the HTML svg element
   */
  constructor(svgId) {
    if (this.constructor == AbstractChartManager) {
      throw new Error("Abstract classes can't be instantiated.")
    }

    this.preprocess()
    this.initializeSvg(svgId)
    this.initializeVariables()
    this.initializeCharts()
  }

  /**
   * Allow respective child classes to preprocess the CSV data into a desired Object format
   *
   */
  preprocess() {
    throw new Error("Method 'preprocess()' must be implemented.")
  }

  /**
   * Initialize svg for child classes as well as its width and height
   *
   * @param {string} svgId the HTML identifier of the HTML svg element
   */
  initializeSvg(svgId) {
    this.svg = d3.select(svgId)
    this.svgWidth = parseInt(this.svg.style('width'))
    this.svgHeight = parseInt(this.svg.style('height'))
  }

  /**
   * Allow respective child classes to create global variables
   *
   */
  initializeVariables() {
    throw new Error("Method 'initializeVariables()' must be implemented.")
  }

  /**
   * Allow respective child classes to set up SVG elements to mount visualizations
   *
   */
  initializeCharts() {
    throw new Error("Method 'initializeCharts()' must be implemented.")
  }

  /**
   * Create a reusable legend based on players name and colors
   *
   * @param {object} svg the d3 svg element
   * @param {number} translateX number of pixels for horizontal translation
   * @param {number} translateY number of pixels for vertical translation
   * @returns {object} The created legend element
   */
  createPlayersLegend(svg, translateX, translateY) {
    return this.chartHelper.createLegend(
      svg,
      translateX,
      translateY,
      this.playerHelperSingleton.playersName,
      this.playerHelperSingleton.playersColor
    )
  }

  /**
   * Sets the label of Y axis
   * Breaks the label into individual word to display each word in a new line
   *
   * @param {string} text label of the y axis
   * @param {string} elementClass class attribute to set for the element
   */
  setLabelY(text, elementClass) {
    // break each word in order to display each one in a line for horizontal text
    const labelsY = text.split(' ')
    const textHeight = 40

    // display each word in a new line
    labelsY.forEach((label, index) => {
      const positionY =
        (this.margin.top + this.svgHeight + textHeight * index) / 2

      this.svg
        .append('g')
        .append('text')
        .text(label)
        .attr('class', elementClass)
        .attr(
          'transform',
          `translate(0, ${positionY - (textHeight * labelsY.length) / 2})`
        )
    })
  }

  /**
   * Create animation by interpolating svg path
   *
   * @param {object} path the svg path element
   * @param {number} duration time of the animation duration
   */
  animateDashOffset(path, duration) {
    path
      .transition()
      .duration(duration)
      .styleTween('stroke-dashoffset', function () {
        const pathLength = path.node().getTotalLength()
        return d3.interpolate(0, pathLength)
      })
  }
}

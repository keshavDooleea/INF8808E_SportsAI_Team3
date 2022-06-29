import d3Legend from 'd3-svg-legend'
import d3Tip from 'd3-tip'

/**
 * This helper class handles reusable UI components
 *
 * @class ChartHelperClass
 */
class ChartHelperClass {
  /**
   * Set a fixed width of a button
   *
   * @returns {number} The width of button
   */
  get buttonWidth() {
    return 120
  }

  /**
   * Set a fixed height of a button
   *
   * @returns {number} The height of button
   */
  get buttonHeight() {
    return 30
  }

  /**
   * Create a common reusable button and return it
   *
   * @param {object} svg the d3 svg element
   * @param {number} translateX number of pixels for horizontal translation
   * @param {number} translateY number of pixels for vertical translation
   * @param {string} text the label of the button
   * @returns {object} The created button element
   */
  createButton(svg, translateX, translateY, text) {
    const button = svg
      .append('g')
      .attr('transform', `translate(${translateX - 1}, ${translateY})`)
      .attr('width', this.buttonWidth)

    button
      .append('rect')
      .attr('width', this.buttonWidth)
      .attr('height', this.buttonHeight)
      .attr('class', 'button-rect')
      .attr('opacity', '0.7')
      .on('mouseenter', function () {
        d3.select(this).attr('opacity', '1')
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', '0.7')
      })

    button
      .append('text')
      .attr('x', this.buttonWidth / 2)
      .attr('y', this.buttonHeight / 2)
      .attr('class', 'button-text')
      .text(text)
      .attr('font-size', 14)

    return button
  }

  /**
   * Create a common reusable legend and return it
   *
   * @param {object} svg the d3 svg element
   * @param {number} translateX number of pixels for horizontal translation
   * @param {number} translateY number of pixels for vertical translation
   * @param {string[]} domainNames names of each legend item
   * @param {string[]} domainColors colors of each legend symbol
   * @returns {object} The created legend element
   */
  createLegend(svg, translateX, translateY, domainNames, domainColors) {
    const symbolSize = 150
    const colorScale = d3.scaleOrdinal(domainColors).domain(domainNames)

    // customize a d3 square symbol
    const legendSymbol = d3.symbol().type(d3.symbolSquare).size(symbolSize)

    // customize legend
    const designLegend = d3Legend
      .legendColor()
      .title('Legend')
      .scale(colorScale)
      .shape('path', legendSymbol())

    // draw legend on screen
    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${translateX}, ${translateY})`)
      .call(designLegend)

    return legend
  }

  /**
   * Common logic to create a tip panel
   * Note: The position is automatically handled by D3
   *
   * @param {object} svg the d3 svg element
   * @param {number[]} offset array with 2 elements [y, x] for the tip 2D offset
   * @param {function} contentCallbackFunction the function which is called on hovered to display data passed
   * @returns {d3Tip} The created tip element
   */
  createTip(svg, offset, contentCallbackFunction) {
    const tip = d3Tip()
      .attr('class', 'tip-panel d3-tip')
      .offset(offset)
      .html((data) => contentCallbackFunction(data))

    svg.call(tip)

    return tip
  }

  /**
   * Create a checkbox with 2 ends
   *
   * @param {object} svg the element to insert the checkbox
   * @param {number} translateX the position x of the checkbox
   * @param {number} translateY the position y of the checkbox
   * @param {string} title the title of the checkbox
   * @param {string} leftText the text to the left side of the checkbox
   * @param {string} rightText the text to the right side of the checkbox
   * @param {boolean} isChecked the default state of the checkbox
   * @param {function} checkedCallback the callback function which is called when the checkbox is checked
   * @param {function} unCheckedCallback the callback function which is called when the checkbox is unchecked
   * @returns {object} The created checkbox element
   */
  createCheckbox(
    svg,
    translateX,
    translateY,
    title,
    leftText,
    rightText,
    isChecked,
    checkedCallback,
    unCheckedCallback
  ) {
    const checkboxRadius = 15
    const circleRadius = 10
    const circleColor = 'gray'
    const textPositionY = this.buttonHeight + checkboxRadius + 3

    // draw main checkbox
    const checkbox = svg
      .append('g')
      .attr('transform', `translate(${translateX - 1}, ${translateY})`)

    // insert checkbox title
    checkbox
      .append('g')
      .append('text')
      .text(title)
      .attr('transform', 'translate(0, -7)')
      .attr('class', 'secondary-color')

    checkbox
      .append('rect')
      .attr('width', this.buttonWidth)
      .attr('height', this.buttonHeight)
      .attr('class', 'checkbox-rect')
      .attr('rx', checkboxRadius)
      .attr('opacity', '0.7')
      .on('mouseenter', function () {
        d3.select(this).attr('opacity', '1')
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', '0.7')
      })

    // draw small circle in checkbox
    const circle = checkbox
      .append('circle')
      .attr('cx', checkboxRadius)
      .attr('cy', checkboxRadius)
      .attr('r', circleRadius)
      .attr('fill', circleColor)
      .attr('stroke', '#5f697d')
      .attr('class', 'common-transition-3')
      .attr('is-checked', isChecked)
    this.updateCheckboxCirclePosition(circle, isChecked, checkboxRadius)

    // add listener when clicked on checkbox
    checkbox.on('click', () => {
      const isChecked = circle.attr('is-checked') === 'false'
      circle.attr('is-checked', isChecked)

      this.updateCheckboxCirclePosition(circle, isChecked, checkboxRadius)
      isChecked ? checkedCallback() : unCheckedCallback()
    })

    // place checkbox texts in extremities
    this.breakAndPlaceTexts(checkbox, leftText, 0, textPositionY, 'start')
    this.breakAndPlaceTexts(
      checkbox,
      rightText,
      this.buttonWidth,
      textPositionY,
      'end'
    )

    return checkbox
  }

  /**
   * Handles position of the circle element in the checkbox/rectangle element
   *
   * @param {object} circle d3 circle element inside checkbox
   * @param {boolean} isChecked state of the checkbox
   * @param {number} checkboxRadius the size of the circle
   */
  updateCheckboxCirclePosition(circle, isChecked, checkboxRadius) {
    const circlePosition = isChecked
      ? this.buttonWidth - checkboxRadius
      : checkboxRadius
    circle.attr('cx', circlePosition)
  }

  /**
   * split word and place them vertically
   *
   * @param {object} element the dom element to put the text in
   * @param {string} textToSplit the text to break into individual word
   * @param {number} textPositionX the x position to place the text
   * @param {number} textPositionY the y position to place the text
   * @param {string} textAnchor the alignment of the text
   */
  breakAndPlaceTexts(
    element,
    textToSplit,
    textPositionX,
    textPositionY,
    textAnchor
  ) {
    const texts = textToSplit.split(' ')
    const textHeightOffset = 15

    texts.forEach((text, index) => {
      element
        .append('g')
        .append('text')
        .text(text)
        .attr('text-anchor', textAnchor)
        .attr(
          'transform',
          `translate(${textPositionX}, ${
            textPositionY + textHeightOffset * index
          })`
        )
    })
  }
}

module.exports = {
  chartHelper: new ChartHelperClass()
}

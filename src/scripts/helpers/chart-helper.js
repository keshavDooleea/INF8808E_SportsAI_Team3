import d3Legend from "d3-svg-legend";
import d3Tip from "d3-tip";

class ChartHelperClass {
  get buttonWidth() {
    return 120;
  }

  get buttonHeight() {
    return 30;
  }

  /**
   * Create a common reusable button and return it
   *
   * @param {*} svg
   * @param {*} translateX
   * @param {*} translateY
   * @param {*} text
   * @returns {*} The created button
   */
  createButton(svg, translateX, translateY, text) {
    const button = svg
      .append("g")
      .attr("transform", `translate(${translateX - 1}, ${translateY})`)
      .attr("width", this.buttonWidth);

    button
      .append("rect")
      .attr("width", this.buttonWidth)
      .attr("height", this.buttonHeight)
      .attr("class", "button-rect")
      .attr("opacity", "0.7")
      .on("mouseenter", function () {
        d3.select(this).attr("opacity", "1");
      })
      .on("mouseleave", function () {
        d3.select(this).attr("opacity", "0.7");
      });

    button
      .append("text")
      .attr("x", this.buttonWidth / 2)
      .attr("y", this.buttonHeight / 2)
      .attr("class", "button-text")
      .text(text)
      .attr("font-size", 14);

    return button;
  }

  get legendSquareSymbol() {
    return "square";
  }

  get legendLineSymbol() {
    return "line";
  }

  /**
   *
   * @param {*} svg
   * @param {*} translateX
   * @param {*} translateY
   * @param {*} symbol the symbol of the legend's scale ('square', 'line')
   * @param {*} domainNames names of each legend item
   * @param {*} domainColors colors of each legend symbol
   * @param {*} playersAttributes
   * @returns {*} The created legend
   */
  createLegend(svg, translateX, translateY, symbol, domainNames, domainColors) {
    const colorScale = d3.scaleOrdinal(domainColors).domain(domainNames);

    // customize a d3 symbol
    const legendSymbol = this.getLegendSymbolFactory(symbol);
    const designLegend = d3Legend.legendColor().title("Legend").scale(colorScale).shape("path", legendSymbol());

    // draw legend on screen
    const legend = svg.append("g").attr("class", "legend").attr("transform", `translate(${translateX}, ${translateY})`).call(designLegend);

    return legend;
  }

  /**
   * Create a custom shape/symbol for legend's scale
   *
   * @param {*} symbol
   * @returns {*} The created symbol
   */
  getLegendSymbolFactory(symbol) {
    const symbolSize = 150;

    switch (symbol) {
      case this.legendSquareSymbol:
        return d3.symbol().type(d3.symbolSquare).size(symbolSize);
      case this.legendLineSymbol:
        return d3.symbol().type(d3.symbolSquare).size(symbolSize);
    }
  }

  /**
   * Common logic to create a tip panel
   * Note: The position is automatically handled by D3
   *
   * @param {*} svg the svg element of the visualization
   * @param {*} contentCallbackFunction the function which is called on hovered to display data passed
   * @returns {*} The created tip
   */
  createTip(svg, contentCallbackFunction) {
    const tip = d3Tip()
      .attr("class", "tip-panel")
      .html((data) => contentCallbackFunction(data));

    svg.call(tip);

    return tip;
  }

  /**
   * Create a checkbox with 2 ends
   *
   * @param {*} svg the element to insert the checkbox
   * @param {*} translateX the position x of the checkbox
   * @param {*} translateY the position y of the checkbox
   * @param {*} title the title of the checkbox
   * @param {*} leftText the text to the left side of the checkbox
   * @param {*} rightText the text to the right side of the checkbox
   * @param {*} checkedCallback the callback function which is called when the checkbox is checked
   * @param {*} unCheckedCallback the callback function which is called when the checkbox is unchecked
   * @returns {*} The created checkbox
   */
  createCheckbox(svg, translateX, translateY, title, leftText, rightText, checkedCallback, unCheckedCallback) {
    const checkboxRadius = 15;
    const circleRadius = 10;
    const circleColor = "gray";
    const textPositionY = this.buttonHeight + checkboxRadius + 3;

    svg.append("g").append("text").text(title).attr("transform", `translate(${translateX}, ${translateY})`).attr("class", "secondary-color");

    // draw main checkbox
    const checkbox = svg.append("g").attr("transform", `translate(${translateX - 1}, ${translateY + 7})`);
    checkbox
      .append("rect")
      .attr("width", this.buttonWidth)
      .attr("height", this.buttonHeight)
      .attr("class", "checkbox-rect")
      .attr("rx", checkboxRadius)
      .attr("opacity", "0.7")
      .on("mouseenter", function () {
        d3.select(this).attr("opacity", "1");
      })
      .on("mouseleave", function () {
        d3.select(this).attr("opacity", "0.7");
      });

    // draw small circle in checkbox
    const circle = checkbox.append("circle").attr("cx", checkboxRadius).attr("cy", checkboxRadius).attr("r", circleRadius).attr("fill", circleColor).attr("stroke", "#5f697d").attr("class", "common-transition-3").attr("is-checked", false);

    // add listener when clicked on checkbox
    checkbox.on("click", () => {
      const isChecked = circle.attr("is-checked") === "false";
      circle.attr("is-checked", isChecked);

      const circlePosition = isChecked ? this.buttonWidth - checkboxRadius : checkboxRadius;
      circle.attr("cx", circlePosition);

      isChecked ? checkedCallback() : unCheckedCallback();
    });

    // place checkbox extremities texts
    this.breakAndPlaceTexts(checkbox, leftText, 0, textPositionY, "start");
    this.breakAndPlaceTexts(checkbox, rightText, this.buttonWidth, textPositionY, "end");

    return checkbox;
  }

  /**
   * split word and place them vertically
   *
   * @param {*} element the dom element to put the text in
   * @param {*} textToSplit the text to break into individual word
   * @param {*} textPositionX the x position to place the text
   * @param {*} textPositionY the y position to place the text
   * @param {*} textAnchor the alignment of the text
   */
  breakAndPlaceTexts(element, textToSplit, textPositionX, textPositionY, textAnchor) {
    const texts = textToSplit.split(" ");
    const textHeightOffset = 15;

    texts.forEach((text, index) => {
      element
        .append("g")
        .append("text")
        .text(text)
        .attr("text-anchor", textAnchor)
        .attr("transform", `translate(${textPositionX}, ${textPositionY + textHeightOffset * index})`);
    });
  }
}

module.exports = {
  chartHelper: new ChartHelperClass(),
};

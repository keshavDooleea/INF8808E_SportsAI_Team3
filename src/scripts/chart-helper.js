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
   * @returns
   */
  createButton(svg, translateX, translateY, text) {
    const button = svg.append("g").attr("transform", `translate(${translateX}, ${translateY})`).attr("width", this.buttonWidth);

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
   * @returns
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
   * @returns
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
   * @returns
   */
  createTip(svg, contentCallbackFunction) {
    const tip = d3Tip()
      .attr("class", "tip-panel")
      .html((data) => contentCallbackFunction(data));

    svg.call(tip);

    return tip;
  }
}

module.exports = {
  chartHelper: new ChartHelperClass(),
};

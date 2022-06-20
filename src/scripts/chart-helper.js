import d3Legend from "d3-svg-legend";

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
   * @param {*} playersAttributes
   * @returns
   */
  createLegend(svg, translateX, translateY, symbol, playersAttributes) {
    const colorScale = d3.scaleOrdinal(playersAttributes.colors).domain(playersAttributes.names);

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
    const circleSize = 150;

    switch (symbol) {
      case this.legendSquareSymbol:
        return d3.symbol().type(d3.symbolSquare).size(circleSize);
      case this.legendLineSymbol:
        return d3.symbol().type(d3.symbolSquare).size(circleSize);
    }
  }
}

module.exports = {
  chartHelper: new ChartHelperClass(),
};

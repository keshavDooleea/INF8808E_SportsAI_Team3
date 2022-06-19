class ChartHelperClass {
  get buttonWidth() {
    return 100;
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
}

module.exports = {
  chartHelper: new ChartHelperClass(),
};

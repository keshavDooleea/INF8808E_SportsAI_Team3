import { getMonthInNumeric, getMonthYear } from "../utils/date";
import { rangeInterval } from "../utils/utils";
import { AbstractChartManager } from "./abstract-chart-manager";

/**
 * Manager for line chart visualization
 *
 * @class LineChartManager
 */
export class LineChartManager extends AbstractChartManager {
  preprocess() {
    this.maneData = this.preprocessPlayer(this.playerHelperSingleton.maneSummaryData);
    this.benzemaData = this.preprocessPlayer(this.playerHelperSingleton.benzemaSummaryData);
    this.mbappeData = this.preprocessPlayer(this.playerHelperSingleton.mbappeSummaryData);
  }

  /**
   * Calculates the number of goals, assists and shots taken during a month
   *
   * @param {object[]} playerData the player's data parsed from CSV file
   * @returns {object[]} The preprocessed data
   */
  preprocessPlayer(playerData) {
    const monthlyObj = {};

    playerData.forEach((element) => {
      const monthNumeric = getMonthInNumeric(element.Date);
      const monthYear = getMonthYear(element.Date);

      if (!monthlyObj[monthNumeric]) {
        // new month found -> set a new month as key to the monthlyObj and set statistics as values
        monthlyObj[monthNumeric] = {
          monthYear,
          monthNumeric,
          goals: Number(element.Gls),
          shots: Number(element.Sh),
          assists: Number(element.Ast),
        };
      } else {
        // Increase statistics for the current month
        monthlyObj[monthNumeric].goals += Number(element.Gls);
        monthlyObj[monthNumeric].shots += Number(element.Sh);
        monthlyObj[monthNumeric].assists += Number(element.Ast);
      }
    });

    const monthlyMapValues = Object.values(monthlyObj);
    const montlyArray = [];

    for (let i = 6; i <= 10; i++) {
      montlyArray.push(monthlyMapValues[i]);
    }

    for (let i = 0; i <= 5; i++) {
      montlyArray.push(monthlyMapValues[i]);
    }

    return montlyArray;
  }

  initializeCharts() {
    this.svg = d3.select("#line-chart-svg");
    this.svgWidth = parseInt(this.svg.style("width"));
    this.svgHeight = parseInt(this.svg.style("height"));

    this.margin = {
      top: 50,
      right: 30,
      bottom: 30,
      left: 60,
    };

    this.setAxisY();
    this.setAxisX();
    this.setGraphLabels();

    this.show();
  }

  get height() {
    return this.svgHeight - this.margin.top - this.margin.bottom;
  }

  get width() {
    return this.svgWidth - this.margin.left - this.margin.right;
  }

  getScaleX() {
    return d3.scaleBand().domain([8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6]).range([0, this.width]);
  }

  getScaleY() {
    return d3.scaleBand().domain(rangeInterval(0, 10, 1)).range([this.height, 0]);
  }

  setAxisX() {
    this.svg.append("g").attr("class", "margin-bottom-20").attr("transform", `translate(${this.margin.left}, ${this.height})`).call(d3.axisBottom(this.getScaleX()));
  }

  setAxisY() {
    this.svg.append("g").attr("transform", `translate(${this.margin.left}, 0)`).call(d3.axisLeft(this.getScaleY()));
  }

  setGraphLabels() {
    // label of y axis
    this.svg
      .append("g")
      .append("text")
      .text("Amount of goals scored")
      .attr("transform", `translate(${this.margin.left / 2}, ${this.svgHeight / 2}), rotate(-90)`);

    // label of x axis
    this.svg
      .append("g")
      .append("text")
      .text("Month of the season")
      .attr("class", "axis-text")
      .attr("transform", `translate(${this.svgWidth / 2}, ${this.svgHeight - this.margin.bottom})`);
  }

  show() {
    const scaleX = this.getScaleX();
    const scaleY = this.getScaleY();
    const offsetX = this.margin.left;
    const mane = this.maneData;

    this.svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("d", function () {
        return d3
          .line()
          .x(function (d) {
            return scaleX(d.monthNumeric) + offsetX;
          })
          .y(function (d) {
            const value = Number(d.goals) ? Number(d.goals) : 0;
            return scaleY(value);
          })(mane);
      });
  }
}

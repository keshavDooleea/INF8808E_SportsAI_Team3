import { getMonthInNumeric, getMonthYear } from "../utils/date";
import { rangeInterval, TEXT_COLORS } from "../utils/utils";
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
      right: 150,
      bottom: 30,
      left: 60,
    };

    this.drawButton();

    this.setAxisY();
    this.setAxisX();
    this.setGraphLabels();
    this.setTitle();

    this.show();
  }

  get height() {
    return this.svgHeight - this.margin.top - this.margin.bottom;
  }

  get width() {
    return this.svgWidth - this.margin.left - this.margin.right;
  }

  getScaleX() {
    const domainLabels = this.maneData.map((element) => element.monthYear);
    return d3.scaleBand().domain(domainLabels).range([0, this.width]);
  }

  getScaleY() {
    return d3
      .scaleBand()
      .domain(rangeInterval(0, 10, 1))
      .range([this.height - this.margin.top, 0]);
  }

  setAxisX() {
    this.svg.append("g").attr("class", "margin-bottom-20").attr("transform", `translate(${this.margin.left}, ${this.height})`).call(d3.axisBottom(this.getScaleX()));
  }

  setAxisY() {
    this.svg.append("g").attr("transform", `translate(${this.margin.left}, ${this.margin.top})`).call(d3.axisLeft(this.getScaleY()));
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

  setTitle() {
    const title = this.svg.append("g").attr("id", "line-chart-title");

    title.append("text").attr("fill", TEXT_COLORS.secondaryColor).text("Displaying: ");
    title.append("text").text("Goals").attr("transform", "translate(65, 0)").attr("font-size", 18);

    title.attr("transform", `translate(${this.margin.left},  ${this.margin.top / 2})`);
  }

  drawButton() {
    this.chartHelper.createButton(this.svg, this.svgWidth - this.chartHelper.buttonWidth, 0, "Show Assists");
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
            return scaleX(d.monthYear) + offsetX;
          })
          .y(function (d) {
            const value = Number(d.goals) ? Number(d.goals) : 0;
            return scaleY(value);
          })(mane);
      });
  }
}

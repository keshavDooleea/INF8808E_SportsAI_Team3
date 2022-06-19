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

    this.toggleState();
    this.setTitle();
    this.setAxisY();
    this.setAxisX();
    this.setGraphLabels();
    this.drawLines();
    this.drawButton();
  }

  get height() {
    return this.svgHeight - this.margin.top - this.margin.bottom;
  }

  get width() {
    return this.svgWidth - this.margin.left - this.margin.right;
  }

  get isGoalView() {
    return this.currentState?.view === "Goals";
  }

  getScaleX() {
    const domainLabels = this.maneData.map((element) => element.monthYear);
    return d3.scaleBand().domain(domainLabels).range([0, this.width]);
  }

  getScaleY() {
    return d3
      .scaleBand()
      .domain(this.currentState.domainY)
      .range([this.height - this.margin.top, 0]);
  }

  setAxisX() {
    this.svg.append("g").attr("class", "margin-bottom-20").attr("transform", `translate(${this.margin.left}, ${this.height})`).call(d3.axisBottom(this.getScaleX()));
  }

  setAxisY() {
    this.svg.append("g").attr("id", "line-chart-y-domain").attr("transform", `translate(${this.margin.left}, ${this.margin.top})`).call(d3.axisLeft(this.getScaleY()));
  }

  setGraphLabels() {
    // label of y axis
    this.svg
      .append("g")
      .append("text")
      .text(this.currentState.labelY)
      .attr("id", "line-chart-y-label")
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
    title.append("text").attr("id", "line-chart-view-title").text("Goals").attr("transform", "translate(65, 0)").attr("font-size", 18);

    title.attr("transform", `translate(${this.margin.left},  ${this.margin.top / 2})`);
  }

  get buttonText() {
    return this.currentState.view === "Goals" ? "Assists" : "Goals";
  }

  drawButton() {
    const button = this.chartHelper.createButton(this.svg, this.svgWidth - this.chartHelper.buttonWidth, 0, `Show ${this.buttonText}`);
    button.attr("id", "line-chart-button");

    button.on("click", () => {
      this.toggleState();
      this.refreshViews();
    });
  }

  toggleState() {
    if (this.isGoalView) {
      this.currentState = {
        view: "Assists",
        labelY: "Number of assists made",
        domainY: rangeInterval(0, 7, 1),
      };
    } else {
      this.currentState = {
        view: "Goals",
        labelY: "Amount of goals scored",
        domainY: rangeInterval(0, 14, 1),
      };
    }
  }

  refreshViews() {
    this.svg.select("#line-chart-button text").text(`Show ${this.buttonText}`);
    this.svg.select("#line-chart-view-title").text(this.currentState.view);
    this.svg.select("#line-chart-y-label").text(this.currentState.labelY);
    this.svg.select("#line-chart-y-domain").call(d3.axisLeft(this.getScaleY()));

    // clear all svg path before redrawing
    this.svg.selectAll(".line-chart-path").remove();
    this.drawLines();
  }

  drawLines() {
    this.drawLine(this.maneData, this.playerHelperSingleton.maneColor);
    this.drawLine(this.benzemaData, this.playerHelperSingleton.benzemaColor);
    this.drawLine(this.mbappeData, this.playerHelperSingleton.mbappeColor);
  }

  drawLine(playerData, playerColor) {
    const scaleX = this.getScaleX();
    const scaleY = this.getScaleY();
    const offsetX = this.margin.left;

    this.svg
      .append("path")
      .attr("class", "line-chart-path")
      .attr("fill", "none")
      .attr("stroke", playerColor)
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("d", () => {
        return d3
          .line()
          .x((data) => {
            return scaleX(data.monthYear) + offsetX;
          })
          .y((data) => {
            const statProperty = this.isGoalView ? data.goals : data.assists;
            const value = Number(statProperty) ? Number(statProperty) : 0;
            return scaleY(value);
          })(playerData);
      });
  }
}

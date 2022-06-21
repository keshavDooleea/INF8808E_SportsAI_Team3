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
    this.maneData = this.preprocessPlayer(this.playerHelperSingleton.maneSummaryData, this.playerHelperSingleton.maneName);
    this.benzemaData = this.preprocessPlayer(this.playerHelperSingleton.benzemaSummaryData, this.playerHelperSingleton.benzemaName);
    this.mbappeData = this.preprocessPlayer(this.playerHelperSingleton.mbappeSummaryData, this.playerHelperSingleton.mbappeName);
  }

  initializeVariables() {
    this.maxGoals = this.getMaxNbStat(true);
    this.maxAssists = this.getMaxNbStat(false);

    this.lineSize = 2;
    this.isGoalScoredChecked = false;
    this.yAxisLabelsDuration = 1500;
    this.playerLinesDuration = 2500;
    this.horizontalDashOffsetDuration = 250;

    this.states = {
      assists: {
        view: "Assists",
        labelY: "Number of assists made",
        domainY: rangeInterval(0, this.maxAssists, 1),
      },
      goalsScored: {
        view: "Goals Scored",
        labelY: "Number of goals scored",
        domainY: rangeInterval(0, this.maxGoals, 1),
      },
      goalsConversionRate: {
        view: "Goals Conversion Rate",
        labelY: "% of goals converted",
        domainY: rangeInterval(0, this.maxGoals, 1),
      },
    };

    this.currentState = this.states.goalsScored;
  }

  /**
   * Calculates the number of goals, assists and shots taken during a month
   *
   * @param {object[]} playerData the player's data parsed from CSV file
   * @returns {object[]} The preprocessed data
   */
  preprocessPlayer(playerData, playerName) {
    const monthlyObj = {};
    const playerFirstName = playerName.split(" ")[0];

    playerData.forEach((element, index) => {
      const monthNumeric = getMonthInNumeric(element.Date);
      const monthYear = getMonthYear(element.Date);

      if (!monthlyObj[monthNumeric]) {
        // new month found -> set a new month as key to the monthlyObj and set statistics as values
        monthlyObj[monthNumeric] = {
          monthYear,
          playerName,
          id: `${playerFirstName}-${index}`,
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

  getMaxNbStat(isMaxGoals) {
    const playersData = [this.maneData, this.benzemaData, this.mbappeData];

    // get max stat for every player
    const allPlayersMax = playersData.map((player) =>
      d3.max(player, (playerData) => {
        return isMaxGoals ? Number(playerData.goals) : Number(playerData.assists);
      })
    );

    // get the max out of all three players
    const maxStat = d3.max(allPlayersMax);

    return maxStat;
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
      leftPadding: 15,
    };

    this.setTitle();
    this.setAxisY();
    this.setAxisX();
    this.setGraphLabels();
    this.drawLines();
    this.drawLegend();
    this.drawButton();
    this.drawCheckbox();
    this.drawTip();
  }

  get height() {
    return this.svgHeight - this.margin.top - this.margin.bottom;
  }

  get width() {
    return this.svgWidth - this.margin.left - this.margin.right - this.margin.leftPadding;
  }

  get leftAxisPosition() {
    return this.margin.left + this.margin.leftPadding;
  }

  get isGoalView() {
    return this.currentState === this.states.goalsConversionRate || this.currentState === this.states.goalsScored;
  }

  get buttonText() {
    return this.isGoalView ? "Assists" : "Goals";
  }

  get seasonMonths() {
    return this.maneData.map((element) => element.monthYear);
  }

  get yOffsetIntervals() {
    return this.height / this.currentState.domainY.length / 2;
  }

  get xOffsetIntervals() {
    return this.width / this.seasonMonths.length / 2;
  }

  get legendHeight() {
    return this.svg.select("#line-chart-legend").node().getBoundingClientRect().height;
  }

  get buttonHeight() {
    return this.svg.select("#line-chart-button").node().getBoundingClientRect().height;
  }

  getScaleX() {
    return d3.scaleBand().domain(this.seasonMonths).range([0, this.width]);
  }

  getScaleY() {
    return d3
      .scaleBand()
      .domain(this.currentState.domainY)
      .range([this.height - this.margin.top, 0]);
  }

  setAxisX() {
    this.svg.append("g").attr("class", "margin-bottom-20").attr("transform", `translate(${this.leftAxisPosition}, ${this.height})`).call(d3.axisBottom(this.getScaleX()));
  }

  setAxisY() {
    this.svg.append("g").attr("id", "line-chart-y-domain").attr("transform", `translate(${this.leftAxisPosition}, ${this.margin.top})`).call(d3.axisLeft(this.getScaleY()));
  }

  setGraphLabels() {
    this.setLabelY();
    this.setLabelX();
  }

  setLabelY() {
    // break each word in order to display each one in a line for horizontal text
    const labelsY = this.currentState.labelY.split(" ");
    const textHeight = 40;

    // display each word in a new line
    labelsY.forEach((label, index) => {
      const positionY = (this.margin.top + this.svgHeight + textHeight * index) / 2;

      this.svg
        .append("g")
        .append("text")
        .text(label)
        .attr("class", "line-chart-label-y")
        .attr("transform", `translate(0, ${positionY - (textHeight * labelsY.length) / 2})`);
    });
  }

  setLabelX() {
    // label of x axis
    this.svg
      .append("g")
      .append("text")
      .text("Month of the season")
      .attr("transform", `translate(${this.leftAxisPosition}, ${this.svgHeight - this.margin.bottom})`);
  }

  setTitle() {
    const title = this.svg.append("g").attr("id", "line-chart-title");

    title.append("text").attr("id", "line-chart-view-main-title").attr("fill", TEXT_COLORS.secondaryColor).text("Displaying: ");
    title.append("text").attr("id", "line-chart-view-title").text(this.currentState.view).attr("transform", "translate(65, 0)").attr("font-size", 18);
    title.append("text").attr("fill", TEXT_COLORS.secondaryColor).attr("id", "line-chart-title-details").text("line chart for the 2021/2022 season");
    title.attr("transform", `translate(${this.leftAxisPosition},  ${this.margin.top / 2})`);

    this.updateTitleDetailsPosition();
  }

  /**
   * Position title details when the view changes
   */
  updateTitleDetailsPosition() {
    const leftOffset = 6;

    this.svg.select("#line-chart-title-details").attr("transform", () => {
      const titleWidth = this.svg.select("#line-chart-view-main-title").node().getBoundingClientRect().width;
      const titleViewWidth = this.svg.select("#line-chart-view-title").node().getBoundingClientRect().width;
      return `translate(${titleWidth + titleViewWidth + leftOffset}, 0)`;
    });
  }

  drawLegend() {
    const legend = this.createPlayersLegend(this.svg, this.svgWidth - this.chartHelper.buttonWidth, this.margin.top, this.chartHelper.legendLineSymbol);
    legend.attr("id", "line-chart-legend");
  }

  toolTipContent(playerData) {
    let htmlContent = "";

    if (this.isGoalView) {
      // edge case where number of shots is 0 in CSV data
      if (playerData.shots === 0) {
        playerData.shots = playerData.goals;
      }

      const goalRatio = (playerData.goals / playerData.shots) * 100;

      htmlContent = `
        <p>Total shots : ${playerData.shots}</p>
        <p>Goals scored: ${playerData.goals}</p>
        <p>Goals ratio : ${goalRatio.toFixed(2)} %</p>`;
    } else {
      htmlContent = `<p>Assists: ${playerData.assists}</p>`;
    }

    return `<div>
      <p class="tip-title">${playerData.playerName}</p>
      <p class="tip-subtitle">${playerData.monthYear}</p>
      <div class="tip-content">${htmlContent}</div>
    </div>`;
  }

  drawTip() {
    this.tip = this.chartHelper.createTip(this.svg, (playerData) => this.toolTipContent(playerData));
  }

  /**
   * show goals scored on checked
   */
  onCheckboxChecked() {
    this.isGoalScoredChecked = true;
    this.currentState = this.states.goalsConversionRate;
    this.refreshViews();
  }

  /**
   * show goals conversion rate on unchecked
   */
  onCheckboxUnchecked() {
    this.isGoalScoredChecked = false;
    this.currentState = this.states.goalsScored;
    this.refreshViews();
  }

  drawCheckbox() {
    const heightOffset = this.legendHeight + this.buttonHeight + this.margin.top + 55;

    const checkbox = this.chartHelper.createCheckbox(
      this.svg,
      this.svgWidth - this.chartHelper.buttonWidth,
      heightOffset,
      "Toggle Goals chart",
      "Goals Scored",
      "Goals Ratio",
      this.isGoalScoredChecked,
      () => this.onCheckboxChecked(),
      () => this.onCheckboxUnchecked()
    );

    checkbox.attr("id", "line-chart-checkbox");
  }

  drawButton() {
    const heightOffset = this.legendHeight + this.margin.top + 10;
    const button = this.chartHelper.createButton(this.svg, this.svgWidth - this.chartHelper.buttonWidth, heightOffset, `Show ${this.buttonText}`);
    button.attr("id", "line-chart-button");

    button.on("click", () => {
      this.toggleState();
      this.refreshViews();
    });
  }

  toggleState() {
    if (this.isGoalView) {
      this.currentState = this.states.assists;
      this.svg.select("#line-chart-checkbox").remove();
      return;
    }

    this.currentState = this.isGoalScoredChecked ? this.states.goalsConversionRate : this.states.goalsScored;
    this.drawCheckbox();
  }

  refreshViews() {
    this.svg.select("#line-chart-button text").text(`Show ${this.buttonText}`);
    this.svg.select("#line-chart-view-title").text(this.currentState.view);

    this.svg.transition().duration(this.yAxisLabelsDuration).select("#line-chart-y-domain").call(d3.axisLeft(this.getScaleY()));

    // clear all svg path before redrawing
    this.svg.selectAll(".line-chart-path").remove();
    this.svg.selectAll(".line-chart-horizontal-lines").remove();
    this.svg.selectAll(".line-chart-dots").remove();
    this.svg.selectAll(".line-chart-label-y").remove();

    this.setLabelY();
    this.updateTitleDetailsPosition();
    this.drawLines();
  }

  drawLines() {
    this.drawHorizontalLines();
    this.drawPlayerLine(this.maneData, this.playerHelperSingleton.maneColor);
    this.drawPlayerLine(this.benzemaData, this.playerHelperSingleton.benzemaColor);
    this.drawPlayerLine(this.mbappeData, this.playerHelperSingleton.mbappeColor);

    // show dots only after animations have completed
    setTimeout(() => {
      this.svg.selectAll(".line-chart-dots").attr("opacity", 1);
    }, this.playerLinesDuration);
  }

  /**
   * Draw horizontal lines aligned with y labels/ticks
   */
  drawHorizontalLines() {
    const dashArray = 4;

    for (let i = 0; i < this.currentState.domainY.length; i++) {
      const positionY = this.getScaleY()(i) + this.yOffsetIntervals - this.lineSize;

      this.svg
        .append("line")
        .attr("class", "line-chart-horizontal-lines")
        .style("stroke", TEXT_COLORS.lightGray)
        .style("stroke-width", this.lineSize)
        .attr("stroke-dasharray", dashArray)
        .attr("x1", 0)
        .attr("y1", positionY)
        .attr("x2", this.width)
        .attr("y2", positionY)
        .attr("transform", `translate(${this.leftAxisPosition}, ${this.margin.top})`)
        .call((path) => this.animateDashOffset(path, this.horizontalDashOffsetDuration * (i + 1)));
    }
  }

  getLineYValue(data) {
    const statProperty = this.isGoalView ? data.goals : data.assists;
    const value = Number(statProperty) ? Number(statProperty) : 0;
    return this.getScaleY()(value);
  }

  /**
   * Draw the main line of the visualizaation
   *
   * @param {*} playerData the data of the player to display and draw
   * @param {*} playerColor the color of the line
   */
  drawPlayerLine(playerData, playerColor) {
    const baseRadius = 3;
    const hoveredRadius = 5;
    const svgTransform = `translate(${this.leftAxisPosition + this.xOffsetIntervals}, ${this.margin.top + this.yOffsetIntervals - this.lineSize})`;

    // draw lines representing the statistics
    this.svg
      .append("path")
      .attr("class", "line-chart-path")
      .attr("transform", svgTransform)
      .attr("fill", "none")
      .attr("stroke", playerColor)
      .attr("stroke-width", this.lineSize)
      .attr("stroke-linejoin", "round")
      .attr("d", () => {
        return d3
          .line()
          .x((data) => this.getScaleX()(data.monthYear))
          .y((data) => this.getLineYValue(data))(playerData);
      })
      .call((path) => this.lineAnimation(path, this.playerLinesDuration));

    // draw dots at the end of each line sections
    this.svg
      .selectAll("line-chart-path dots")
      .data(playerData)
      .enter()
      .append("circle")
      .attr("class", "line-chart-dots common-transition-3")
      .attr("id", (data) => data.id)
      .attr("cursor", "pointer")
      .attr("fill", playerColor)
      .attr("stroke", "#fff")
      .attr("r", baseRadius)
      .attr("opacity", 0)
      .attr("transform", svgTransform)
      .attr("cx", (data) => this.getScaleX()(data.monthYear))
      .attr("cy", (data) => this.getLineYValue(data))
      .on("mouseover", (data, index, element) => {
        this.svg.select(`.line-chart-dots#${data.id}`).attr("r", hoveredRadius);
        this.tip.show(data, element[index]);
      })
      .on("mouseleave", (data) => {
        this.svg.select(`.line-chart-dots#${data.id}`).attr("r", baseRadius);
        this.tip.hide();
      });
  }

  lineAnimation(path, duration) {
    if (!path) return;

    path
      .transition()
      .duration(duration)
      .attrTween("stroke-dasharray", function () {
        const pathLength = path.node().getTotalLength();
        const pathInterpolation = d3.interpolateString("0," + pathLength, pathLength + "," + pathLength);

        return function (timeFraction) {
          return pathInterpolation(timeFraction);
        };
      });
  }

  animateDashOffset(path, duration) {
    path
      .transition()
      .duration(duration)
      .styleTween("stroke-dashoffset", function () {
        const pathLength = path.node().getTotalLength();
        return d3.interpolate(0, pathLength);
      });
  }
}

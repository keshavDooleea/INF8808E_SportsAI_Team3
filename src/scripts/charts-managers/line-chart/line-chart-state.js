import { rangeInterval } from "../../utils/utils";

/**
 * Class to handle the current state of the line chart:
 * Goals scored state, goal conversion state and assists state
 *
 * Handle all features related to states:
 * Line paths, button texts, tooltip content, domain values
 *
 * @class LineChartState
 */
export class LineChartState {
  constructor(maxGoals, maxAssists) {
    this.maxGoals = maxGoals;
    this.maxAssists = maxAssists;

    this.currentState = this.states.goalsScored;
    this.isGoalScoredChecked = false;
  }

  /**
   * Possible states for the line chart
   * @returns {object[]} All the possible states
   */
  get states() {
    return {
      assists: {
        view: "Assists",
        labelY: "Number of assists made",
        domainY: rangeInterval(0, this.maxAssists, 1),
        scaleY: d3.scaleBand(),
      },
      goalsScored: {
        view: "Goals Scored",
        labelY: "Number of goals scored",
        domainY: rangeInterval(0, this.maxGoals, 1),
        scaleY: d3.scaleBand(),
      },
      goalsConversionRate: {
        view: "Goals Conversion Rate",
        labelY: "Goals converted (%)",
        domainY: rangeInterval(0, 100, 100),
        scaleY: d3.scaleLinear(),
      },
    };
  }

  /**
   * Check if we are in the goals view or assists view
   *
   * @returns {boolean} true if the chart is displaying goals view
   */
  get isGoalView() {
    return this.currentState.view !== this.states.assists.view;
  }

  /**
   * Get some configurations for the dashed lines on the y axis
   *
   * @returns {object} y axis lines configurations
   */
  get horizontalLinesState() {
    if (this.currentState.view === this.states.goalsConversionRate.view) {
      return {
        isGoalConversion: true,
        length: 10,
        scaleOffset: 10,
      };
    } else {
      return {
        isGoalConversion: false,
        length: this.currentState.domainY.length,
        scaleOffset: 1,
      };
    }
  }

  /**
   * Sets the current state to goals conversion
   */
  setGoalConvertionRate() {
    this.currentState = this.states.goalsConversionRate;
    this.isGoalScoredChecked = true;
  }

  /**
   * Sets the current state to goals scored
   */
  setGoalsScored() {
    this.currentState = this.states.goalsScored;
    this.isGoalScoredChecked = false;
  }

  /**
   * Sets the current state to assists
   */
  setAssists() {
    this.currentState = this.states.assists;
  }

  /**
   * Updates state based on current view
   */
  updateState() {
    if (this.isGoalView) {
      this.setAssists();
      return;
    }

    this.isGoalScoredChecked ? this.setGoalConvertionRate() : this.setGoalsScored();
  }

  /**
   * Get the data value to display based on the current state
   *
   * @param {*} playerData the data to be displayed
   * @returns {number} the calculated value to display
   */
  getStateValue(playerData) {
    let statProperty = 0;

    switch (this.currentState.view) {
      case this.states.assists.view:
        statProperty = playerData.assists;
        break;

      case this.states.goalsScored.view:
        statProperty = playerData.goals;
        break;

      case this.states.goalsConversionRate.view:
        const shotsTaken = playerData.shots === 0 ? playerData.goals : playerData.shots;
        statProperty = Math.min(((playerData.goals / shotsTaken) * 100).toFixed(), 100);
        break;
    }

    const value = Number(statProperty) ? Number(statProperty) : 0;
    return value;
  }

  /**
   * Builds the content of the tip based on the current state
   *
   * @param {*} playerData the data to be displayed
   * @returns {string} the html result to display in the tip on mouse hover
   */
  getToolTipState(playerData) {
    let htmlContent = "";

    if (playerData.shots === 0) {
      playerData.shots = playerData.goals;
    }

    const goalRatio = (playerData.goals / playerData.shots) * 100;

    switch (this.currentState.view) {
      case this.states.assists.view:
        htmlContent = `<p>Assists: ${playerData.assists}</p>`;
        break;

      case this.states.goalsScored.view:
      case this.states.goalsConversionRate.view:
        htmlContent = `
            <p>Total shots : ${playerData.shots}</p>
            <p>Goals scored: ${playerData.goals}</p>
            <p>Goals ratio : ${goalRatio.toFixed(2)} %</p>`;
        break;
    }

    return `<div>
      <p class="tip-title">${playerData.playerName}</p>
      <p class="tip-subtitle">${playerData.monthYear}</p>
      <div class="tip-content">${htmlContent}</div>
    </div>`;
  }
}

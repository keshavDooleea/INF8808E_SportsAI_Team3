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
  /**
   *
   * @param {object} playersData data of all three players
   */
  constructor(playersData) {
    this.maxGoals = this.getMaxNbStat(true, playersData);
    this.maxAssists = this.getMaxNbStat(false, playersData);

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
   * Gets either the maximum goals scored or the maximum assists out of all three players
   *
   * @param {boolean} isMaxGoals whether to compare goals or assists
   * @param {object} playersData data of all three players
   * @returns {number} the maximum value for the statistic
   */
  getMaxNbStat(isMaxGoals, playersData) {
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
   * Calculates the goal scored ratio based on total goals scored and total shots taken
   *
   * @param {object} playesData data of the current player to calculate goal ratio
   * @returns {string} the calculated goals ratio
   */
  calculateGoalRatio(playerData) {
    const shotsTaken = playerData.shots === 0 ? playerData.goals : playerData.shots;
    const goalRatio = (playerData.goals / shotsTaken) * 100;

    return goalRatio.toFixed(2);
  }

  /**
   * Get the data value to display based on the current state
   *
   * @param {object} playerData the data to be displayed
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
        const goalRatio = this.calculateGoalRatio(playerData);
        statProperty = Math.min(goalRatio, 100);
        break;
    }

    const value = Number(statProperty) ? Number(statProperty) : 0;
    return value;
  }

  /**
   * Builds the content of the tip based on the current state
   *
   * @param {object} playerData the data to be displayed
   * @returns {string} the html result to display in the tip on mouse hover
   */
  getToolTipState(playerData) {
    let htmlContent = "";

    switch (this.currentState.view) {
      case this.states.assists.view:
        htmlContent = `<p>Assists: ${playerData.assists}</p>`;
        break;

      case this.states.goalsScored.view:
      case this.states.goalsConversionRate.view:
        htmlContent = `
            <p>Total shots : ${playerData.shots || playerData.goals}</p>
            <p>Goals scored: ${playerData.goals}</p>
            <p>Goals ratio : ${this.calculateGoalRatio(playerData)} %</p>`;
        break;
    }

    return `<div>
      <p class="tip-title">${playerData.playerName}</p>
      <p class="tip-subtitle">${playerData.monthYear}</p>
      <div class="tip-content">${htmlContent}</div>
    </div>`;
  }
}

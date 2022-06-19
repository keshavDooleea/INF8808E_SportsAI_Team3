import { getMonthInNumeric, getMonthYear } from "../utils/date";
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

    return monthlyObj;
  }

  initializeCharts() {
    this.svg = d3.select("#line-chart-svg");

    this.svg.append("g").attr("id", "chart-g");
  }
}

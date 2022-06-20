import { csvToObject } from "./utils/csv-parser";

class PlayersHelperClass {
  async getSummaryData() {
    this.maneSummaryData = await csvToObject("sadio_mane/summary.csv");
    this.benzemaSummaryData = await csvToObject("karim_benzema/summary.csv");
    this.mbappeSummaryData = await csvToObject("kylian_mbappe/summary.csv");
  }

  get maneColor() {
    return "#4682B4";
  }

  get benzemaColor() {
    return "#6F4E7C";
  }

  get mbappeColor() {
    return "#FFA056";
  }

  get maneShortName() {
    return "sadioMane";
  }

  get benzemaShortName() {
    return "karimBenzema";
  }

  get mbappeShortName() {
    return "kylianMbappe";
  }

  get playersAttributes() {
    return [
      {
        name: "Sadio Mané",
        color: this.maneColor,
      },
      {
        name: "Karim Benzema",
        color: this.benzemaColor,
      },
      {
        name: "Kylian Mbappé",
        color: this.mbappeColor,
      },
    ];
  }

  /**
   *
   * @returns {object[]} Array of all 3 players names
   */
  get playersName() {
    return this.playersAttributes.map((player) => player.name);
  }

  /**
   *
   * @returns {object[]} Array of all 3 players colors
   */
  get playersColor() {
    return this.playersAttributes.map((player) => player.color);
  }
}

module.exports = {
  playerHelperSingleton: new PlayersHelperClass(),
};

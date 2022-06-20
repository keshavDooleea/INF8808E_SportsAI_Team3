import { csvToJSON } from "./utils/csv-parser";

class PlayersHelperClass {
  async getSummaryData() {
    this.maneSummaryData = await csvToJSON("sadio_mane/summary.csv");
    this.benzemaSummaryData = await csvToJSON("karim_benzema/summary.csv");
    this.mbappeSummaryData = await csvToJSON("kylian_mbappe/summary.csv");
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

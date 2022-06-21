import { csvToObject } from "../utils/csv-parser";

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

  get maneName() {
    return "Sadio Mané";
  }

  get benzemaName() {
    return "Karim Benzema";
  }

  get mbappeName() {
    return "Kylian Mbappé";
  }

  get playersAttributes() {
    return [
      {
        name: this.maneName,
        color: this.maneColor,
      },
      {
        name: this.benzemaName,
        color: this.benzemaColor,
      },
      {
        name: this.mbappeName,
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

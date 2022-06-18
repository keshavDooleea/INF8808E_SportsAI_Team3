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
}

module.exports = {
  playerHelperSingleton: new PlayersHelperClass(),
};

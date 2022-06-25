import { csvToObject } from '../utils/csv-parser'

class PlayersHelperClass {
  async getSummaryData () {
    this.maneSummaryData = await csvToObject('sadio_mane/summary.csv')
    this.benzemaSummaryData = await csvToObject('karim_benzema/summary.csv')
    this.mbappeSummaryData = await csvToObject('kylian_mbappe/summary.csv')
  }

  async getGroupedData () {
    this.groupedDefensiveData = await csvToObject(
      'grouped_data/grouped_defensive_stats.csv'
    )
    this.groupedPassData = await csvToObject(
      'grouped_data/grouped_pass_stats.csv'
    )
    this.groupedPossesionData = await csvToObject(
      'grouped_data/grouped_possession_stats.csv'
    )
    this.groupedShootingData = await csvToObject(
      'grouped_data/grouped_shooting_stats.csv'
    )
  }

  async getChampionshipData () {
    this.championshipData = {
      sadio_mane: {
        domesticCups: {},
        domesticLeagues: {},
        internationalCups: {},
        nationalTeam: {}
      },
      karim_benzema: {
        domesticCups: {},
        domesticLeagues: {},
        internationalCups: {},
        nationalTeam: {}
      },
      kylian_mbappe: {
        domesticCups: {},
        domesticLeagues: {},
        internationalCups: {},
        nationalTeam: {}
      }
    }

    await Promise.all(
      Object.keys(this.championshipData).map(async (player) => {
        console.log('keys', player)
        this.championshipData[player].domesticCups = await csvToObject(
          `${player}/domestic_cups.csv`
        )

        this.championshipData[player].domesticLeagues = await csvToObject(
          `${player}/domestic_leagues.csv`
        )

        this.championshipData[player].internationalCups = await csvToObject(
          `${player}/international_cups.csv`
        )

        this.championshipData[player].nationalTeam = await csvToObject(
          `${player}/national_team.csv`
        )
      })
    )

    console.log(
      'champions hsip data',
      this.championshipData.karim_benzema.domesticCups
    )
  }

  get maneColor () {
    return '#4682B4'
  }

  get benzemaColor () {
    return '#6F4E7C'
  }

  get mbappeColor () {
    return '#FFA056'
  }

  get maneName () {
    return 'Sadio Mané'
  }

  get benzemaName () {
    return 'Karim Benzema'
  }

  get mbappeName () {
    return 'Kylian Mbappé'
  }

  get playersAttributes () {
    return [
      {
        name: this.maneName,
        color: this.maneColor
      },
      {
        name: this.benzemaName,
        color: this.benzemaColor
      },
      {
        name: this.mbappeName,
        color: this.mbappeColor
      }
    ]
  }

  /**
   *
   * @returns {object[]} Array of all 3 players names
   */
  get playersName () {
    return this.playersAttributes.map((player) => player.name)
  }

  /**
   *
   * @returns {object[]} Array of all 3 players colors
   */
  get playersColor () {
    return this.playersAttributes.map((player) => player.color)
  }
}

module.exports = {
  playerHelperSingleton: new PlayersHelperClass()
}

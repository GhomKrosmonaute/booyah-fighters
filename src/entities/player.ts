import * as _ from "radash"
import * as stats from "./stats"

export interface PlayerData {
  username: string
  stats: stats.Stats
}

export class Player {
  constructor(private _data: PlayerData) {}

  public getUsername(): string {
    return this._data.username
  }

  public cloneStats(): stats.Stats {
    return _.clone(this._data.stats)
  }
}

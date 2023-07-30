import * as player from "./player"
import * as stats from "./stats"

class Fighter {
  static fromPlayer(player: player.Player): Fighter {
    return new Fighter(player.getUsername(), player.cloneStats())
  }

  constructor(
    private _name: string,
    private _stats: stats.Stats,
  ) {}
}

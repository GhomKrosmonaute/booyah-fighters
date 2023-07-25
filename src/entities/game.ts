import * as booyah from "@ghom/booyah"
import * as fight from "../pages/fight"
import * as home from "../pages/home"

export const gamePages = {
  home: () => new home.Home(),
  fight: () => new fight.Fight(),
} as const

export type GamePage = keyof typeof gamePages

export interface GameEventNames extends booyah.BaseCompositeEvents {
  notification: [message: string, type: "info" | "error"]
}

export class Game extends booyah.Composite<GameEventNames> {
  private _stateMachine!: booyah.StateMachine

  get defaultChildChipContext() {
    return {
      container: window.app.stage,
    }
  }

  public changePage(page: GamePage) {
    this._stateMachine.changeState(page)
    console.log("game changePage", page)
  }

  protected _onActivate() {
    this._stateMachine = new booyah.StateMachine(gamePages, {
      startingState: "home",
    })

    this._activateChildChip(this._stateMachine)
  }
}

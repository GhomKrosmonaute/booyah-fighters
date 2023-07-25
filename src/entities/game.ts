import * as chip from "@ghom/booyah/src/chip";
import * as fight from "../pages/fight";
import * as home from "../pages/home";

export const gamePages = {
  home: () => new home.Home(),
  fight: () => new fight.Fight(),
} as const;

export type GamePage = keyof typeof gamePages;

export interface GameEventNames extends chip.BaseCompositeEvents {
  notification: [message: string, type: "info" | "error"];
}

export class Game extends chip.Composite<GameEventNames> {
  private _stateMachine!: chip.StateMachine;

  get defaultChildChipContext() {
    return {
      container: window.app.stage,
    };
  }

  public changePage(page: GamePage) {
    this._stateMachine.changeState(page);
    console.log("game changePage", page);
  }

  protected _onActivate() {
    this._stateMachine = new chip.StateMachine(gamePages, {
      startingState: "home",
    });

    this._activateChildChip(this._stateMachine);
  }
}

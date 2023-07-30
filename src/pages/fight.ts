import * as booyah from "@ghom/booyah"
import * as pixiChip from "../entities/pixiChip"
import * as team from "../entities/team"
import * as stats from "../entities/stats"

interface FightContext {
  leftTeam: FightTeam
  rightTeam: FightTeam
  results: TurnResult[]
  terminated: boolean
}

type TurnResult = Action[]

interface Action {
  time: number
  subject: FightTeamMember
  type: ActionType
}

interface ActionTypes {
  attack: [target: FightTeamMember, damageAmount: number]
  heal: [target: FightTeamMember, healAmount: number]
  buff: [
    target: FightTeamMember,
    buffedStatName: stats.StatName,
    buffAmount: number,
  ]
  debuff: [
    target: FightTeamMember,
    debuffedStatName: stats.StatName,
    debuffAmount: number,
  ]
}

type ActionType = keyof ActionTypes

export class Fight extends pixiChip.Container {
  private _context!: FightContext

  protected _onActivate() {
    this._activateChildChip(
      new booyah.Sequence([
        new FightTurn(this._context),
        new booyah.Lambda(() => {
          this.terminate(booyah.makeSignal("end", this._context))
        }),
      ]),
    )
  }

  protected _onTerminate() {}
}

class FightTurn extends pixiChip.Container {
  constructor(private _context: FightContext) {
    super()
  }

  protected _onActivate() {
    this._activateChildChip(
      new booyah.Sequence([
        // The user can choose a power-set and roll the "dices".
        new Mulligan(this._context),
        // The fight is calculated and played.
        new AutoFight(this._context),
        // If the fight is not over, the next turn is played.
        () =>
          this._context.terminated
            ? new booyah.Lambda(() => {
                this.terminate()
              })
            : new FightTurn(this._context),
      ]),
    )
  }

  protected _onTerminate() {}
}

class Mulligan extends pixiChip.Container {
  constructor(private _context: FightContext) {
    super()
  }

  protected _onActivate() {}

  protected _onTerminate() {}
}

/**
 * Calculate all the fight on activate, stock the result, then play the fight animations.
 */
class AutoFight extends pixiChip.Container {
  constructor(private _context: FightContext) {
    super()
  }

  protected _onActivate() {}

  protected _onTerminate() {}
}

class FightTeam extends team.Team {}

class FightTeamMember extends team.TeamMember {}

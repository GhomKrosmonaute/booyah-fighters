import * as booyah from "@ghom/booyah"
import * as pixi from "pixi.js"
import * as pixiChip from "../entities/pixiChip"
import * as demo from "../entities/demo"
import * as team from "../entities/team"
import * as stats from "../entities/stats"

interface FightContext {
  mulligan: MulliganChoice[]
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
    // todo: create a context with players, etc
    this._context = {
      mulligan: [],
    }

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
      new booyah.Sequence(
        [
          // The user can choose a power-set and roll the "dices".
          () => new Mulligan(this._context),
          // The fight is calculated and played.
          () => new AutoFight(this._context),
          // If the fight is not over, the next turn is played.
          () =>
            this._context.terminated
              ? new booyah.Lambda(() => {
                  this.terminate()
                })
              : new booyah.Transitory(),
        ],
        { loop: true },
      ),
    )
  }

  protected _onTerminate() {}
}

const mulliganChoices = {
  assault: {
    melee: (ctx) => new MulliganChoice(ctx),
    assassination: (ctx) => new MulliganChoice(ctx),
    special: (ctx) => new MulliganChoice(ctx),
  },
  defense: {
    heal: (ctx) => new MulliganChoice(ctx),
    shield: (ctx) => new MulliganChoice(ctx),
    special: (ctx) => new MulliganChoice(ctx),
  },
  ruse: {
    rallying: (ctx) => new MulliganChoice(ctx),
    sabotage: (ctx) => new MulliganChoice(ctx),
    special: (ctx) => new MulliganChoice(ctx),
  },
} satisfies Record<
  string,
  Record<string, (ctx: FightContext) => MulliganChoice>
>

type MulliganActionType = keyof typeof mulliganChoices

type MulliganActionName = keyof (typeof mulliganChoices)[MulliganActionType]

class MulliganChoice extends pixiChip.Container {
  constructor(private _context: FightContext) {
    super()
  }

  protected _onActivate() {}

  protected _onTerminate() {}
}

class Mulligan extends pixiChip.Container {
  constructor(private _context: FightContext) {
    super()
  }

  protected _onActivate() {
    let columnX = 0

    for (const category of Object.keys(mulliganChoices)) {
      columnX += 200

      const column = new pixi.Container()

      column.position.x = columnX
      column.addChild(
        (() => {
          const text = new pixi.Text(category, {
            fill: 0xffffff,
            fontSize: 24,
          })

          text.position.y = 50

          return text
        })(),
      )

      let rowY = 50

      for (const choiceName of Object.keys(mulliganChoices[category])) {
        rowY += 60

        this._activateChildChip(
          new booyah.Alternative([
            new booyah.Functional({
              shouldTerminate: () => !column.visible,
            }),
            new demo.DemoButton(choiceName, { x: 0, y: rowY }, () => {
              this._context.mulligan.push(
                mulliganChoices[category][choiceName](this._context),
              )

              column.visible = false

              if (this._context.mulligan.length === 3) {
                this.terminate()
              }
            }),
          ]),
          {
            context: {
              container: column,
            },
          },
        )
      }

      this._container.addChild(column)
    }
  }

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

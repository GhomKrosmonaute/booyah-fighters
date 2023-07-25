import * as pixi from "pixi.js"
import * as booyah from "@ghom/booyah"
import * as fight from "../pages/fight"
import * as home from "../pages/home"
import * as loader from "./loader"
import * as audio from "./audio"
import * as i18n from "./i18n"

export const gamePages = {
  home: () => new home.Home(),
  fight: () => new fight.Fight(),
} satisfies booyah.StateTableDescriptor

export type GamePage = keyof typeof gamePages

export interface GameEventNames extends booyah.BaseCompositeEvents {
  notification: [message: string, type: "info" | "error"]
}

export class Game extends booyah.Composite<GameEventNames> {
  private _pages!: booyah.StateMachine

  public fonts!: Record<string, pixi.LoadFontData>
  public images!: Record<string, pixi.Texture>
  public musics!: Record<string, audio.Music>
  public sounds!: Record<string, audio.Sound>
  public texts!: Record<string, Record<i18n.Languages, string>>

  get defaultChildChipContext() {
    return {
      container: window.app.stage,
    }
  }

  public changePage(page: GamePage) {
    this._pages.changeState(page)
    console.log("game changePage", page)
  }

  protected _onActivate() {
    this._pages = new booyah.StateMachine(gamePages, {
      startingState: "home",
    })

    this._activateChildChip(
      new booyah.Sequence([
        new loader.Loader({
          dir: "/resources/images",
          transform: (path) => pixi.Texture.from(path),
          onLoaded: (resources) => {
            this.images = resources
          },
        }),
        () => this._pages,
      ])
    )
  }
}

import * as pixi from "pixi.js"
import * as booyah from "@ghom/booyah"

import images from "../generated/images"
import musics from "../generated/musics"
import sounds from "../generated/sounds"
import texts from "../generated/texts"

import * as fight from "../pages/fight"
import * as error from "../pages/error"
import * as home from "../pages/home"

import * as loader from "./loader"
import * as audio from "./audio"
import * as i18n from "./i18n"

export const gamePages = {
  home: () => new home.Home(),
  fight: () => new fight.Fight(),
  error: () => new error.Error(),
} satisfies booyah.StateTableDescriptor

export type GamePage = keyof typeof gamePages

export interface GameEventNames extends booyah.BaseCompositeEvents {
  notification: [message: string, type: "info" | "error"]
}

export class Game extends booyah.Composite<GameEventNames> {
  private _pages!: booyah.StateMachine

  public fonts!: Record<string, pixi.LoadFontData>
  public images!: Record<keyof typeof images, pixi.Texture>
  public musics!: Record<string, audio.Music>
  public sounds!: Record<string, audio.Sound>
  public texts!: typeof texts

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
    this.texts = texts

    this._pages = new booyah.StateMachine(
      {
        loading: new booyah.Sequence([
          new loader.Loader({
            source: Object.entries(images),
            transform: ([id, path]) =>
              [
                id,
                pixi.Texture.from(path, {
                  width: 600,
                  height: 360,
                }),
              ] as const,
            onLoaded: (resources) => {
              this.images = Object.fromEntries(resources) as Record<
                keyof typeof images,
                pixi.Texture
              >
            },
          }),
          new loader.Loader({
            source: musics,
            transform: (path) => new audio.Music(path),
            onLoaded: (resources) => {
              this.musics = Object.fromEntries(
                resources.map((resource) => [
                  musics[resources.indexOf(resource)],
                  resource,
                ]),
              )
            },
          }),
          new loader.Loader({
            source: sounds,
            transform: (path) => new audio.Sound(path),
            onLoaded: (resources) => {
              this.sounds = Object.fromEntries(
                resources.map((resource) => [
                  sounds[resources.indexOf(resource)],
                  resource,
                ]),
              )
            },
          }),
        ]),
        ...gamePages,
      },
      {
        startingState: "loading",
        signals: {
          loading: "home",
        },
      },
    )

    this._activateChildChip(this._pages)
  }
}

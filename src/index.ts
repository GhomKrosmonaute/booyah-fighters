import * as pixi from "pixi.js"
import * as booyah from "@ghom/booyah"
import * as game from "./entities/game"

declare global {
  interface Window {
    game: game.Game
    app: pixi.Application<HTMLCanvasElement>
  }

  interface ObjectConstructor {
    keys<T>(object: T): (keyof T)[]
  }
}

window.app = new pixi.Application({
  resizeTo: window,
})

window.game = new game.Game()

document.body.appendChild(window.app.view)

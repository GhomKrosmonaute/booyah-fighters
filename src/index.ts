import * as pixi from "pixi.js";

import * as running from "@ghom/booyah/src/running";

import * as game from "./entities/game";

declare global {
  interface Window {
    game: game.Game;
    app: pixi.Application<HTMLCanvasElement>;
  }
}

window.app = new pixi.Application({
  resizeTo: window,
});

window.game = new game.Game();

document.body.appendChild(window.app.view);

const runner = new running.Runner(window.game);

runner.start();

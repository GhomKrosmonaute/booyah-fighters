import * as running from "@ghom/booyah/src/running";

import * as game from "./entities/game";

declare global {
  interface Window {
    game: game.Game;
  }
}

window.game = new game.Game();

const runner = new running.Runner(window.game);

runner.start();

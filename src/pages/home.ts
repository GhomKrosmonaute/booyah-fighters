import * as chip from "@ghom/booyah/src/chip";

export class Home extends chip.Composite {
  protected _onActivate() {
    document.getElementById("app")!.innerHTML = "Home";

    this._subscribe(document.getElementById("start-fight"), "click", () => {
      window.game.changePage("fight");
    });
  }

  protected _onTerminate() {
    document.getElementById("app")!.innerHTML = "";
  }
}

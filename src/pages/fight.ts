import * as chip from "@ghom/booyah/src/chip";

export interface FightEventNames extends chip.BaseCompositeEvents {
  test: [oui: true];
}

export class Fight extends chip.Composite<FightEventNames> {
  protected _onActivate() {
    document.getElementById("app")!.innerHTML = "Fight";
  }

  protected _onTerminate() {
    document.getElementById("app")!.innerHTML = "";
  }
}

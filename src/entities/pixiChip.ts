import * as chip from "@ghom/booyah/src/chip";

import * as pixi from "pixi.js";

export class Container<
  ContainerEvents extends chip.BaseCompositeEvents = chip.BaseCompositeEvents
> extends chip.Composite<ContainerEvents> {
  protected _container!: pixi.Container;

  get defaultChildChipContext() {
    return {
      container: this._container,
    };
  }

  public activate(
    tickInfo: chip.TickInfo,
    chipContext: chip.ChipContext,
    inputSignal?: chip.Signal,
    reloadMemento?: chip.ReloadMemento
  ) {
    this._container = new pixi.Container();

    super.activate(tickInfo, chipContext, inputSignal, reloadMemento);

    this._chipContext.container.addChild(this._container);
  }

  public terminate() {
    this._chipContext.container.removeChild(this._container);

    super.terminate();
  }
}

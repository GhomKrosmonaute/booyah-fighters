import * as booyah from "@ghom/booyah"
import * as pixi from "pixi.js"

export class Container<
  ContainerEvents extends
    booyah.BaseCompositeEvents = booyah.BaseCompositeEvents,
> extends booyah.Composite<ContainerEvents> {
  protected _container!: pixi.Container

  get defaultChildChipContext() {
    return {
      container: this._container,
    }
  }

  public activate(
    tickInfo: booyah.TickInfo,
    chipContext: booyah.ChipContext,
    inputSignal?: booyah.Signal,
    reloadMemento?: booyah.ReloadMemento,
  ) {
    this._container = new pixi.Container()

    super.activate(tickInfo, chipContext, inputSignal, reloadMemento)

    this._chipContext.container.addChild(this._container)
  }

  public terminate(outputSignal: booyah.Signal = booyah.makeSignal()) {
    this._chipContext.container.removeChild(this._container)

    super.terminate()
  }
}

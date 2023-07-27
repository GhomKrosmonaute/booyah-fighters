import * as pixi from "pixi.js"
import * as booyah from "@ghom/booyah"
import * as pixiChip from "./pixiChip"

export interface ProgressBarEvents extends booyah.BaseCompositeEvents {
  updated: [value: number]
}

export interface ProgressBarOptions {
  startValue: number
  color: number
  width: number
  height: number
  position: pixi.IPointData
}

export class ProgressBar extends pixiChip.Container<ProgressBarEvents> {
  /**
   * From 0 to 1.
   * @private
   */
  private _value!: number
  private _bar!: pixi.Graphics

  constructor(private _options: ProgressBarOptions) {
    super()
  }

  public get percent() {
    return this._value * 100
  }

  public get value() {
    return this._value
  }

  public set value(value: number) {
    this._value = value
    this._update()
  }

  private _update() {
    this._bar
      .clear()
      .beginFill(this._options.color)
      .drawRoundedRect(
        0,
        0,
        this._options.width * this._value,
        this._options.height,
        this._options.height / 2,
      )
      .endFill()

    this.emit("updated", this._value)
  }

  protected _onActivate() {
    this._container.position.copyFrom(this._options.position)

    this._value = this._options.startValue

    this._container.addChild(
      new pixi.Graphics()
        .beginFill(0x888888)
        .drawRoundedRect(
          0,
          0,
          this._options.width,
          this._options.height,
          this._options.height / 2,
        )
        .endFill(),
    )

    this._bar = new pixi.Graphics()
    this._container.addChild(this._bar)

    this._update()
  }
}

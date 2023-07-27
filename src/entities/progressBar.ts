import * as pixi from "pixi.js"
import * as pixiChip from "./pixiChip"

export interface ProgressBarOptions {
  startValue: number
  color: number
  width: number
  position: pixi.IPointData
}

export class ProgressBar extends pixiChip.Container {
  /**
   * From 0 to 1.
   * @private
   */
  private _value!: number
  private _greyBar!: pixi.Graphics
  private _colorBar!: pixi.Graphics

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
    this._colorBar.width = this._value * this._options.width
  }

  protected _onActivate() {
    this._container.position.copyFrom(this._options.position)

    this._value = this._options.startValue

    this._greyBar = new pixi.Graphics()
    this._greyBar.beginFill(0x888888)
    this._greyBar.drawRect(0, 0, this._options.width, 10)
    this._greyBar.endFill()
    this._container.addChild(this._greyBar)

    this._colorBar = new pixi.Graphics()
    this._colorBar.beginFill(this._options.color)
    this._colorBar.drawRect(0, 0, this._options.width, 10)
    this._colorBar.endFill()
    this._container.addChild(this._colorBar)

    this._update()
  }
}

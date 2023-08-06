import * as pixi from "pixi.js"
import * as pixiChip from "./pixiChip"

export class DemoButton extends pixiChip.Container {
  constructor(
    private _text: string,
    private _position: pixi.IPointData,
    private _onClick: () => void,
  ) {
    super()
  }

  protected _onActivate() {
    this._container.position.copyFrom(this._position)
    this._container.addChild(
      (() => {
        const bg = new pixi.Graphics()
          .beginFill(0x333333)
          .drawRoundedRect(-50, -25, 100, 50, 10)
          .endFill()

        bg.eventMode = "dynamic"

        bg.addChild(
          (() => {
            const text = new pixi.Text(this._text, {
              fill: 0xffffff,
              fontSize: 24,
            })

            text.anchor.set(0.5)

            return text
          })(),
        )

        this._subscribe(bg, "pointertap", () => {
          this._onClick()
        })

        return bg
      })(),
    )
  }
}

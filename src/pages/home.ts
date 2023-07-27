import * as pixi from "pixi.js"
import * as pixiChip from "../entities/pixiChip"

export class Home extends pixiChip.Container {
  protected _onActivate() {
    const testSprite = new pixi.Sprite(
      window.game.images["../../resources/images/test.jpg"],
    )

    this._container.addChild(testSprite)

    const fightButton = new pixi.Graphics()
      .beginFill(0x00ff00)
      .drawRect(0, 0, 100, 100)
      .endFill()

    fightButton.x = 100
    fightButton.y = 100
    fightButton.eventMode = "dynamic"

    this._container.addChild(fightButton)

    this._subscribe(fightButton, "pointertap", () => {
      window.game.changePage("fight")
    })
  }
}

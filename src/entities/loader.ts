import * as pixi from "pixi.js"
import * as pixiChip from "./pixiChip"
import * as progressBar from "./progressBar"

export interface LoaderOptions<Raw, Refined> {
  id: string
  source: readonly Raw[]
  transform: (raw: Raw) => Promise<Refined> | Refined
  onLoaded: (resources: Refined[]) => void
}

export class Loader<Raw, Refined> extends pixiChip.Container {
  private _progressBar!: progressBar.ProgressBar

  constructor(private _options: LoaderOptions<Raw, Refined>) {
    super()
  }

  protected _onActivate() {
    this._container.y = window.screen.height - 50

    this._progressBar = new progressBar.ProgressBar({
      startValue: 0,
      color: 0x247afd,
      width: 300,
      height: 10,
      position: {
        x: window.screen.width / 2 - 150,
        y: 0,
      },
    })

    this._activateChildChip(this._progressBar)

    this._container.addChild(
      (() => {
        const text = new pixi.Text("Loading " + this._options.id + "...", {
          fill: 0xffffff,
          fontSize: 18,
        })

        text.anchor.set(0, 1)
        text.position.x = window.screen.width / 2 - 150

        return text
      })(),
    )

    this._container.addChild(
      (() => {
        const text = new pixi.Text("0%", {
          fill: 0xffffff,
          fontSize: 18,
        })

        text.anchor.set(1, 1)
        text.position.x = window.screen.width / 2 + 150

        this._subscribe(this._progressBar, "updated", (value) => {
          text.text = Math.round(value * 100) + "%"
        })

        return text
      })(),
    )

    const resources: Refined[] = []

    const load = async () => {
      console.time("load " + this._options.id)

      for (const raw of this._options.source) {
        resources.push(await this._options.transform(raw))

        this._progressBar.value = resources.length / this._options.source.length
      }

      console.timeEnd("load " + this._options.id)
    }

    load()
      .then(() => {
        this._options.onLoaded?.(resources)

        this.terminate()
      })
      .catch((error: Error) => {
        window.game.changePage("error")

        throw error
      })
  }
}

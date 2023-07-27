import * as pixi from "pixi.js"
import * as booyah from "@ghom/booyah"
import * as pixiChip from "./pixiChip"
import * as progressBar from "./progressBar"

interface BaseRefinedResource {
  name: string
}

export interface LoaderOptions<Raw, Refined> {
  source: readonly Raw[]
  transform: (raw: Raw) => Promise<Refined> | Refined
  onLoaded?: (resources: Refined[]) => void
}

export class Loader<Raw, Refined> extends pixiChip.Container {
  private _resources!: Refined[]
  private _progressBar!: progressBar.ProgressBar

  constructor(private _options: LoaderOptions<Raw, Refined>) {
    super()
  }

  /**
   * @todo
   *   - Show loading screen with a progress bar and the name of loaded resources.
   *   - On loaded, terminate this entity
   */
  protected _onActivate() {
    this._resources = []

    this._progressBar = new progressBar.ProgressBar({
      startValue: 0,
      color: 0x00ff00,
      width: 100,
      position: {
        x: window.screen.width / 2,
        y: window.screen.height / 2,
      },
    })

    this._activateChildChip(this._progressBar)

    const load = async () => {
      for (const raw of this._options.source) {
        this._resources.push(await this._options.transform(raw))
        this._progressBar.value +=
          this._resources.length / this._options.source.length
      }
    }

    load()
      .then(() => {
        this._options.onLoaded?.(this._resources)
        this.terminate()
      })
      .catch((error: Error) => {
        window.game.changePage("error")
        throw error
      })
  }
}

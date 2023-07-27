import * as pixiChip from "./pixiChip"
import * as progressBar from "./progressBar"

export interface LoaderOptions<Raw, Refined> {
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
    this._progressBar = new progressBar.ProgressBar({
      startValue: 0,
      color: 0x247afd,
      width: 100,
      height: 10,
      position: {
        x: window.screen.width / 2 - 50,
        y: window.screen.height / 2,
      },
    })

    this._activateChildChip(this._progressBar)

    const resources: Refined[] = []

    const load = async () => {
      for (const raw of this._options.source) {
        resources.push(await this._options.transform(raw))
        this._progressBar.value = resources.length / this._options.source.length
      }
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

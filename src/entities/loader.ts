import * as fs from "fs"
import * as path from "path"
import * as pixi from "pixi.js"
import * as pixiChip from "./pixiChip"

export interface LoaderOptions<Type> {
  dir: string
  transform: (path: string) => Type
  onLoaded: (resources: Record<string, Type>) => void
}

export class Loader<Type> extends pixiChip.Container {
  private _resources!: Record<string, Type>

  constructor(private _options: LoaderOptions<Type>) {
    super()
  }

  public get(name: string) {
    return this._resources[name]
  }

  /**
   * @todo
   *   - Show loading screen with a progress bar and the name of loaded resources.
   *   - On loaded, terminate this entity
   */
  protected _onActivate() {
    this._resources = {}

    // todo: add progress bar
    // this._container.addChild()

    const resources = fs.readdirSync(this._options.dir, "utf8")

    for (const file of resources) {
      const name = path.filename(file)
      this._resources[name] = this._options.transform(file)
      console.log("loaded resource", name)
      // todo: update progress bar
    }

    // todo: call onLoaded and terminate
  }
}

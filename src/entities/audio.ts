import * as booyah from "@ghom/booyah"
import * as howler from "howler"

export abstract class Audio extends booyah.ChipBase {
  constructor(public readonly source: string) {
    super()
  }
}

export class Sound extends Audio {}

export class Music extends Audio {}

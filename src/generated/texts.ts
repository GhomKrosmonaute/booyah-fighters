import fight from "../../resources/texts/fight.json"
import home from "../../resources/texts/home.json"

export const texts = {
  ...fight,
  ...home,
} as const

export default texts

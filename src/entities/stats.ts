export interface Stats {
  /**
   * Base health points.
   */
  health: number

  /**
   * Power of physical attacks and mastery of weapons.
   * Mixed with luck for critical hits and stunning.
   */
  attack: number

  /**
   * Shielding from weapons and physical attacks.
   */
  defense: number

  /**
   * Used for "action per second" ratio and for physical movements.
   * Mixed with luck for dodging.
   */
  speed: number

  /**
   * Power of mental attacks like "intimidation" or "nice cop, bad cop"
   * Mixed with luck for hypnotizing or punctual power-up (self-mind-control).
   */
  mind: number

  /**
   * Used for all actions that require luck.
   * The max value is 10% up to level 25, 20% up to level 50, 30% up to level 75, 40% up to level 100. then 50%.
   */
  luck: number
}

export type StatName = keyof Stats

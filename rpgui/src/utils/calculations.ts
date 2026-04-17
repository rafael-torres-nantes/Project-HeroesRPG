import type { Attributes } from '../types'

export interface DerivedStats {
  // FOR
  meleeDamage: string
  carryWeight: number
  // AGI
  movement: number
  // INT
  languages: number
  // POD
  shortRestRecovery: number
  podBonus: number
  // VIG
  longRestRecovery: string
  vigBonus: number
  // Combat
  maxHP: number
  maxPH: number
  passivePerception: number
  blockBonus: number
  dodgeBonus: number
  mentalDefense: number
}

export function calcDerived(attrs: Attributes, level: number, blockSkill = 0, dodgeSkill = 0): DerivedStats {
  const { FOR, AGI, INT, PRE, POD, VIG } = attrs

  // FOR
  let meleeDamage = `1d4+${FOR}`
  if (FOR >= 12) meleeDamage = `1d12+1d6+${FOR}`
  else if (FOR >= 10) meleeDamage = `1d12+${FOR}`
  else if (FOR >= 8) meleeDamage = `1d10+${FOR}`
  else if (FOR >= 5) meleeDamage = `1d8+${FOR}`
  else if (FOR >= 3) meleeDamage = `1d6+${FOR}`

  let carryWeight = 6 + FOR
  if (FOR >= 12) carryWeight = 18 + FOR
  else if (FOR >= 8) carryWeight = 12 + FOR

  // AGI
  let movement = 9
  if (AGI >= 10) movement = 27
  else if (AGI >= 5) movement = 18

  let agiPerceptionBonus = 0
  if (AGI >= 10) agiPerceptionBonus = 10
  else if (AGI >= 5) agiPerceptionBonus = 5

  // INT
  let languages = 1
  if (INT >= 10) languages = 3
  let intPerceptionBonus = 0
  if (INT >= 5) intPerceptionBonus = 5

  // POD
  let shortRestRecovery = 2
  if (POD >= 10) shortRestRecovery = 8
  else if (POD >= 5) shortRestRecovery = 4

  let podBonus = 0
  if (POD >= 3) podBonus += 10
  if (POD >= 8) podBonus += 10
  if (POD >= 12) podBonus += 10

  // VIG
  let longRestRecovery = `2d6+${VIG}`
  if (VIG >= 12) longRestRecovery = `6d6+${VIG}`
  else if (VIG >= 8) longRestRecovery = `3d6+${VIG}`

  let vigBonus = 0
  if (VIG >= 3) vigBonus += 10
  if (VIG >= 5) vigBonus += 10
  if (VIG >= 8) vigBonus += 20
  if (VIG >= 10) vigBonus += 20
  if (VIG >= 12) vigBonus += 30

  // Combat
  const maxHP = 12 + (level * (4 + 3 + VIG))
  const maxPH = 10 + (level * (8 + POD)) + podBonus
  const passivePerception = 10 + AGI + INT + agiPerceptionBonus + intPerceptionBonus
  const blockBonus = FOR + blockSkill
  const dodgeBonus = AGI + dodgeSkill
  const mentalDefense = PRE

  return {
    meleeDamage, carryWeight,
    movement,
    languages,
    shortRestRecovery, podBonus,
    longRestRecovery, vigBonus,
    maxHP, maxPH,
    passivePerception,
    blockBonus, dodgeBonus, mentalDefense,
  }
}

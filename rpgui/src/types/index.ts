export type Archetype = 'Conjuração' | 'Corporal' | 'Emissor' | 'Manipulação' | 'Quântico' | 'Metamorfo' | 'Mentalista' | 'Nenhum'

export type PowerLevel = 'Raro' | 'Lendário' | 'Mítico' | 'Artefato Único'

export interface Skill {
  id: string
  name: string
  value: number
}

export interface Attributes {
  FOR: number
  AGI: number
  INT: number
  PRE: number
  POD: number
  VIG: number
}

export interface TalentEntry {
  id: string
  name: string
  level: number
}

export interface Equipment {
  id: string
  name: string
  damage: string
  weight: number
  quantity: number
}

export interface IndividualidadeLevel {
  description: string
  damage: string
  phCost: string
  dodgeDT: string
}

export interface IndividualidadeAbility {
  id: string
  name: string
  gasCount: string
  techniqueCount: string
  statusEffect: string
  statusDT: string
  notes?: string
  description?: string
  builderState?: any
  level1: IndividualidadeLevel
  level2: IndividualidadeLevel
  level3: IndividualidadeLevel
}

export interface Character {
  id: string
  name: string
  concept: string
  occupation: string
  heroRank: string
  age: number
  progressPoints: number
  level: number
  archetype: Archetype
  attributes: Attributes
  skills: Record<string, number>
  talents: TalentEntry[]
  equipment: Equipment[]
  currentHP?: number
  currentPH?: number
  currentArmor?: number
  armorType?: string
  individualidadeName: string
  individualidadeAbilities: IndividualidadeAbility[]
  notes: string
  createdAt: string
  updatedAt: string
}

export interface ItemAbility {
  id: string
  name: string
  description: string
  damage: string
  staminaCost: string
  cd: string
  isPassive: boolean
}

export interface Item {
  id: string
  name: string
  history: string
  visualDescription: string
  origin: string
  currentLocation: string
  abilities: ItemAbility[]
  baseDamage: string
  conditionOfUse: string
  risks: string
  powerLevel: PowerLevel
  itemType: string
  keyConcept: string
  createdAt: string
  updatedAt: string
}

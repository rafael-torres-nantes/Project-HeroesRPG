export interface DamageRollResult {
  itemName: string
  rollNotation: string
  diceResults: number[]
  diceTotal: number
  modifier: number
  total: number
}

export const isValidRoll = (str: string) => {
  if (!str) return false
  const parts = str.replace(/\s+/g, '').match(/[+-]?(?:\d+[dD]\d+|\d+)/g)
  return parts !== null && parts.some(p => p.toLowerCase().includes('d'))
}

export const executeRoll = (damageStr: string): Omit<DamageRollResult, 'itemName'> | null => {
  if (!damageStr) return null
  const parts = damageStr.replace(/\s+/g, '').match(/[+-]?(?:\d+[dD]\d+|\d+)/g)
  if (!parts) return null
  if (!parts.some(p => p.toLowerCase().includes('d'))) return null

  const diceResults: number[] = []
  let modifier = 0
  let diceTotal = 0
  
  parts.forEach(part => {
    const sign = part.startsWith('-') ? -1 : 1
    const cleanPart = part.replace(/^[+-]/, '')
    if (cleanPart.toLowerCase().includes('d')) {
      const [qtdStr, facesStr] = cleanPart.toLowerCase().split('d')
      const qtd = parseInt(qtdStr, 10) || 1
      const faces = parseInt(facesStr, 10) || 1
      
      for (let i = 0; i < qtd; i++) {
        const r = Math.floor(Math.random() * faces) + 1
        const val = r * sign
        diceResults.push(val)
        diceTotal += val
      }
    } else {
      modifier += Number(cleanPart) * sign
    }
  })
  
  return {
    rollNotation: damageStr,
    diceResults,
    diceTotal,
    modifier,
    total: diceTotal + modifier
  }
}

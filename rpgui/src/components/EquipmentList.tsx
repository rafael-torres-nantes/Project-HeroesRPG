import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { Equipment } from '../types'
import { nanoid } from '../utils/nanoid'
import { EQUIPMENT_CATALOG } from '../data/equipment'
import type { EquipmentDef } from '../data/equipment'
import { executeRoll, isValidRoll, type DamageRollResult } from '../utils/dice'

interface Props {
  equipment: Equipment[]
  onChange: (equipment: Equipment[]) => void
}

export default function EquipmentList({ equipment, onChange }: Props) {
  const [showCatalog, setShowCatalog] = useState(false)
  const [roll, setRoll] = useState<DamageRollResult | null>(null)

  const handleRoll = (item: Equipment) => {
    const res = executeRoll(item.damage || '')
    if (!res) return
    setRoll({ 
      itemName: item.name || 'Arma/Item', 
      ...res
    })
  }

  const addCustom = () => onChange([...equipment, { id: nanoid(), name: '', damage: '', weight: 0, quantity: 1 }])

  const addFromCatalog = (def: EquipmentDef) => {
    let desc = ''
    if (def.category === 'melee' || def.category === 'ranged') {
      desc = def.damage || ''
      if (def.notes) desc += ` ${def.notes}`
      if (def.range) desc += ` ${def.range}`
      if (def.cadence) desc += ` [${def.cadence}]`
      if (def.magazine) desc += ` ${def.magazine}`
    } else {
      if (def.advantage) desc += def.advantage
      if (def.penalty) desc += ` | Penalidade: ${def.penalty}`
    }
    onChange([...equipment, { id: nanoid(), name: def.name, damage: desc.trim(), weight: def.weight, quantity: 1 }])
    setShowCatalog(false)
  }

  const remove = (id: string) => onChange(equipment.filter(e => e.id !== id))
  const update = <K extends keyof Equipment>(id: string, field: K, val: Equipment[K]) =>
    onChange(equipment.map(e => e.id === id ? { ...e, [field]: val } : e))

  const totalWeight = equipment.reduce((sum, e) => sum + (e.weight * e.quantity), 0)

  const catalogCategories = [
    { title: 'Corpo-a-corpo', items: EQUIPMENT_CATALOG.filter(e => e.category === 'melee') },
    { title: 'Armas de Fogo e à Distância', items: EQUIPMENT_CATALOG.filter(e => e.category === 'ranged') },
    { title: 'Equipamentos (Ferramentas)', items: EQUIPMENT_CATALOG.filter(e => e.category === 'tool') },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="font-impact text-[11px] tracking-[3px] uppercase" style={{ color: '#e8a000' }}>
          {equipment.length} Itens · {totalWeight.toFixed(1)} kg
        </span>
        <div className="flex gap-2">
          <button type="button" onClick={addCustom}
            className="font-impact text-[11px] tracking-[2px] uppercase px-3 py-1.5 transition-colors"
            style={{ background: '#111', border: '1px solid #2a2a2a', color: '#888' }}
            onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.borderColor = '#e8a000'; ;(e.currentTarget as HTMLElement).style.color = '#e8a000' }}
            onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'; ;(e.currentTarget as HTMLElement).style.color = '#888' }}>
            + Customizado
          </button>
          <button type="button" onClick={() => setShowCatalog(true)}
            className="font-impact text-[11px] tracking-[2px] uppercase px-3 py-1.5 transition-colors"
            style={{ background: '#111', border: '2px solid #e8a000', color: '#e8a000' }}
            onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.background = '#e8a000'; ;(e.currentTarget as HTMLElement).style.color = '#000' }}
            onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.background = '#111'; ;(e.currentTarget as HTMLElement).style.color = '#e8a000' }}>
            + Catálogo
          </button>
        </div>
      </div>

      {equipment.length === 0 && (
        <p className="text-[12px] italic text-center py-4" style={{ color: '#555' }}>Nenhum equipamento</p>
      )}

      {equipment.length > 0 && (
        <div style={{ border: '1px solid #2a2a2a' }}>
          {/* Header */}
          <div className="hidden md:grid px-3 py-2 font-impact text-[10px] tracking-[2px] uppercase"
            style={{ background: '#e8a000', color: '#000', gridTemplateColumns: '1fr 1.8fr 70px 60px 36px', borderBottom: '3px solid #000' }}>
            <span>Nome</span><span>Dano / Efeito</span><span className="text-center">Peso</span><span className="text-center">Qtd</span><span />
          </div>
          {equipment.map((item, idx) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr_70px_60px_36px] items-center px-3 py-2"
              style={{ borderTop: idx > 0 ? '1px solid #1a1a1a' : 'none', background: idx % 2 === 0 ? '#0d0d0d' : '#111' }}>
              <input type="text" placeholder="Nome" value={item.name}
                onChange={e => update(item.id, 'name', e.target.value)}
                className="bg-transparent focus:outline-none font-impact text-[13px] tracking-[1px]"
                style={{ color: '#e8a000', borderBottom: '1px solid #2a2a2a' }} />
              <div className="flex items-center gap-2">
                <input type="text" placeholder="Ex: 2d8+4 Concussivo" value={item.damage}
                  onChange={e => update(item.id, 'damage', e.target.value)}
                  className="flex-1 bg-transparent focus:outline-none text-[12px]"
                  style={{ color: '#d8d8d8', borderBottom: '1px solid #2a2a2a' }} />
                {isValidRoll(item.damage || '') && (
                  <button type="button" onClick={() => handleRoll(item)}
                    className="font-impact text-[9px] tracking-[1px] uppercase px-1.5 py-0.5 shrink-0 transition-colors"
                    style={{ background: '#2a1010', border: '1px solid #d44040', color: '#d44040' }}
                    onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.background = '#d44040'; ;(e.currentTarget as HTMLElement).style.color = '#000' }}
                    onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.background = '#2a1010'; ;(e.currentTarget as HTMLElement).style.color = '#d44040' }}>
                    d
                  </button>
                )}
              </div>
              <input type="number" step="0.1" min={0} value={item.weight}
                onChange={e => update(item.id, 'weight', Number(e.target.value))}
                className="w-14 text-center font-impact text-[13px] focus:outline-none mx-auto"
                style={{ background: '#111', border: '1px solid #2a2a2a', color: '#888', padding: '3px' }} />
              <input type="number" min={1} value={item.quantity}
                onChange={e => update(item.id, 'quantity', Math.max(1, Number(e.target.value)))}
                className="w-12 text-center font-impact text-[13px] focus:outline-none mx-auto"
                style={{ background: '#111', border: '1px solid #2a2a2a', color: '#888', padding: '3px' }} />
              <button type="button" onClick={() => remove(item.id)}
                className="flex items-center justify-center mx-auto transition-colors"
                style={{ color: '#555' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#d44040')}
                onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Catalog Modal */}
      {showCatalog && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 overflow-auto"
          style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setShowCatalog(false)}>
          <div style={{ border: '3px solid #e8a000', background: '#0d0d0d', width: '100%', maxWidth: 800 }}
            onClick={e => e.stopPropagation()}>
            <div className="panel-header halftone-header flex justify-between">
              <span>⚔ Catálogo de Armas e Equipamentos</span>
              <button onClick={() => setShowCatalog(false)} className="font-impact text-[13px] z-10 transition-colors" style={{ color: '#555' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#d44040')}
                onMouseLeave={e => (e.currentTarget.style.color = '#555')}>✕</button>
            </div>
            <div className="p-4 space-y-6 max-h-[65vh] overflow-y-auto">
              {catalogCategories.map((cat, idx) => (
                <div key={idx}>
                  <div className="font-impact text-[11px] tracking-[3px] uppercase mb-3 pl-2" style={{ color: '#e8a000', borderLeft: '3px solid #e8a000' }}>{cat.title}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {cat.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex items-start justify-between gap-2 p-3 transition-colors"
                        style={{ background: '#111', border: '1px solid #2a2a2a' }}>
                        <div className="flex-1 min-w-0">
                          <div className="font-impact text-[13px] tracking-[1px]" style={{ color: '#d8d8d8' }}>{item.name}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.damage && <span className="font-impact text-[10px] px-1.5 py-0.5" style={{ background: '#2a1010', border: '1px solid #d44040', color: '#d44040' }}>{item.damage}</span>}
                            <span className="font-impact text-[10px] px-1.5 py-0.5" style={{ background: '#1a1a1a', border: '1px solid #333', color: '#888' }}>{item.weight} kg</span>
                          </div>
                          {item.notes && <div className="text-[11px] mt-1" style={{ color: '#666' }}>{item.notes}</div>}
                        </div>
                        <button type="button" onClick={() => addFromCatalog(item)}
                          className="font-impact text-[10px] tracking-[1px] uppercase px-2 py-1 shrink-0 transition-colors"
                          style={{ background: '#111', border: '1px solid #e8a000', color: '#e8a000' }}
                          onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.background = '#e8a000'; ;(e.currentTarget as HTMLElement).style.color = '#000' }}
                          onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.background = '#111'; ;(e.currentTarget as HTMLElement).style.color = '#e8a000' }}>
                          <Plus size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Damage Roll Modal */}
      {roll && (
        <div className="fixed inset-0 flex items-center justify-center z-50 cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setRoll(null)}>
          <div style={{ border: '3px solid #d44040', background: '#0d0d0d', minWidth: 260 }} onClick={e => e.stopPropagation()}>
            <div className="halftone-header flex items-center gap-2 px-3.5 py-[7px] font-impact text-[12px] tracking-[3px] uppercase"
              style={{ background: '#d44040', borderBottom: '3px solid #000', color: '#000' }}>
              ⚔ {roll.itemName}
            </div>
            <div className="p-5 text-center">
              <div className="font-impact text-[60px] leading-none mb-2" style={{ color: '#d44040' }}>{roll.total}</div>
              <div className="text-[12px] space-y-1 mb-2" style={{ color: '#888' }}>
                <div>Dados: <span style={{ color: '#e8a000' }}>[{roll.diceResults.join(', ')}]</span></div>
                {roll.modifier !== 0 && <div>Mod: <span style={{ color: roll.modifier > 0 ? '#4a8fd4' : '#d44040' }}>{roll.modifier > 0 ? '+' : ''}{roll.modifier}</span></div>}
              </div>
            </div>
            <button onClick={() => setRoll(null)}
              className="w-full font-impact text-[11px] tracking-[2px] uppercase py-2 transition-colors"
              style={{ background: '#111', color: '#555', borderTop: '1px solid #2a2a2a' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e8a000')}
              onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

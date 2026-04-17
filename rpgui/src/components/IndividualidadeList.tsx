import { useState } from 'react'
import { Trash2, Calculator, RefreshCw } from 'lucide-react'
import type { IndividualidadeAbility, IndividualidadeLevel } from '../types'
import { nanoid } from '../utils/nanoid'
import TechniqueBuilderModal from './TechniqueBuilderModal'
import { executeRoll, isValidRoll } from '../utils/dice'
import type { DamageRollResult } from '../utils/dice'

interface Props {
  abilities: IndividualidadeAbility[]
  podValue?: number
  currentPH?: number
  onChange: (abilities: IndividualidadeAbility[]) => void
  onSpendPH?: (amount: number) => void
}

const emptyLevel = (): IndividualidadeLevel => ({ description: '', damage: '', phCost: '', dodgeDT: '' })

const emptyAbility = (): IndividualidadeAbility => ({
  id: nanoid(),
  name: '',
  gasCount: '',
  techniqueCount: '',
  statusEffect: '',
  statusDT: '',
  notes: '',
  description: '',
  level1: emptyLevel(),
  level2: emptyLevel(),
  level3: emptyLevel(),
})

const resolveDynamicDamage = (str: string, pod: number) => {
  if (!str) return str;
  return str.replace(/(\d+)?x?POD/gi, (_match: string, p1: string) => {
    const mult = p1 ? Number(p1) : 1;
    return String(mult * pod);
  });
};

export default function IndividualidadeList({ abilities, onChange, podValue = 0, currentPH, onSpendPH }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [roll, setRoll] = useState<DamageRollResult | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const toggle = (id: string) => setExpanded(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const remove = (id: string) => onChange(abilities.filter(a => a.id !== id))

  const handleRoll = (name: string, rawDamage: string) => {
    const calc = resolveDynamicDamage(rawDamage, podValue || 0);
    const res = executeRoll(calc);
    if (res) {
      setRoll({ itemName: name, ...res });
    }
  };

  const updateAbility = <K extends keyof IndividualidadeAbility>(id: string, field: K, val: IndividualidadeAbility[K]) =>
    onChange(abilities.map(a => a.id === id ? { ...a, [field]: val } : a))

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="font-impact text-[11px] tracking-[3px] uppercase" style={{ color: '#4a8fd4' }}>
          {abilities.length} Habilidades
        </span>
        <div className="flex gap-2">
          <button type="button" onClick={() => { const ab = emptyAbility(); onChange([...abilities, ab]); setExpanded(prev => new Set([...prev, ab.id])) }}
            className="flex items-center gap-1 font-impact text-[11px] tracking-[2px] uppercase px-3 py-1.5 transition-colors"
            style={{ background: '#111', border: '1px solid #333', color: '#888' }}
            onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.borderColor = '#555'; ;(e.currentTarget as HTMLElement).style.color = '#ccc' }}
            onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.borderColor = '#333'; ;(e.currentTarget as HTMLElement).style.color = '#888' }}>
            + Manual
          </button>
          <button type="button" onClick={() => setIsCalculatorOpen(true)}
            className="flex items-center gap-1 font-impact text-[11px] tracking-[2px] uppercase px-3 py-1.5 transition-colors"
            style={{ background: '#111', border: '2px solid #e8a000', color: '#e8a000' }}
            onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.background = '#e8a000'; ;(e.currentTarget as HTMLElement).style.color = '#000' }}
            onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.background = '#111'; ;(e.currentTarget as HTMLElement).style.color = '#e8a000' }}>
            <Calculator size={13} /> Criar c/ P.I.
          </button>
        </div>
      </div>

      {(isCalculatorOpen || editingId !== null) && <TechniqueBuilderModal
        onClose={() => { setIsCalculatorOpen(false); setEditingId(null) }}
        podValue={podValue}
        initialName={editingId !== null ? (abilities.find(a => a.id === editingId)?.name ?? '') : ''}
        initialState={editingId !== null ? (abilities.find(a => a.id === editingId)?.builderState) : undefined}
        onSave={(data) => {
          if (editingId !== null) {
            onChange(abilities.map(a => a.id === editingId ? {
              ...a,
              name: data.name,
              notes: data.notes,
              statusEffect: data.damage,
              techniqueCount: data.range,
              statusDT: data.phCost,
              gasCount: data.dt,
              description: data.description,
              builderState: data.builderState,
            } : a))
            setEditingId(null)
          } else {
            const ab = emptyAbility()
            ab.name = data.name
            ab.notes = data.notes
            ab.statusEffect = data.damage
            ab.techniqueCount = data.range
            ab.statusDT = data.phCost
            ab.gasCount = data.dt
            ab.description = data.description
            onChange([...abilities, ab])
            setExpanded(prev => new Set([...prev, ab.id]))
            setIsCalculatorOpen(false)
          }
        }}
      />}

      <div className="space-y-3">
        {abilities.map(ab => {
          const isOpen = expanded.has(ab.id)
          return (
            <div key={ab.id} style={{ border: '1px solid #2a2a2a' }}>
              {/* Header */}
              <div
                className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors"
                style={{ background: isOpen ? '#111' : '#0d0d0d', borderBottom: isOpen ? '1px solid #2a2a2a' : 'none' }}
                onClick={() => toggle(ab.id)}
                role="button"
                aria-expanded={isOpen}
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggle(ab.id)}
              >
                <input type="text" placeholder="Nome da habilidade" value={ab.name}
                  onClick={e => e.stopPropagation()}
                  onChange={e => updateAbility(ab.id, 'name', e.target.value)}
                  aria-label="Nome da habilidade"
                  className="flex-1 font-impact text-[14px] tracking-[1px] bg-transparent focus:outline-none"
                  style={{ color: ab.name ? '#d8d8d8' : '#555' }} />
                {/* Pills de stats visíveis sem expandir */}
                {!isOpen && (
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    {ab.statusEffect && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: '#2a0a0a', color: '#c44444', border: '1px solid #3a1010', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                        {ab.statusEffect}
                      </span>
                    )}
                    {ab.statusDT && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: '#0a0a1a', color: '#4a8fd4', border: '1px solid #101830', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                        {ab.statusDT}
                      </span>
                    )}
                    {!ab.statusEffect && !ab.statusDT && (
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: '#0a1a14', color: '#20c997', border: '1px solid #1a3a28' }}>
                        Passiva
                      </span>
                    )}
                  </div>
                )}
                <button type="button" onClick={e => { e.stopPropagation(); setEditingId(ab.id) }}
                  aria-label="Recalcular com calculadora de P.I."
                  title="Recalcular com calculadora"
                  className="transition-colors p-1 rounded" style={{ color: '#555', flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#e8a000')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                  <RefreshCw size={13} />
                </button>
                <button type="button" onClick={e => { e.stopPropagation(); remove(ab.id) }}
                  aria-label="Remover habilidade"
                  className="transition-colors p-1 rounded" style={{ color: '#555', flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#d44040')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                  <Trash2 size={13} />
                </button>
              </div>

              {isOpen && (
                <div className="p-3 space-y-3" style={{ background: '#0d0d0d' }}>
                  {/* Stats grid compacto */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {([
                      { label: 'Dano', value: ab.statusEffect, color: '#c44444' },
                      { label: 'Custo PH', value: ab.statusDT, color: '#4a8fd4' },
                      { label: 'Alcance', value: ab.techniqueCount, color: '#e8a000' },
                      { label: 'DT (Testes)', value: ab.gasCount, color: '#9b60d4' },
                    ] as const).map(({ label, value, color }) => (
                      <div key={label} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 3, padding: '6px 8px', textAlign: 'center' }}>
                        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '1px', color: '#444', marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: value ? color : '#333' }}>
                          {value || '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Descrição */}
                  <div style={{ background: '#111', border: '1px solid #2a2a2a', borderTop: '2px solid #4a8fd4', padding: '8px' }}>
                    <span className="block font-impact text-[10px] tracking-[2px] uppercase mb-1" style={{ color: '#4a8fd4' }}>Descri��o</span>
                    <textarea 
                      value={ab.description || ''} 
                      onChange={e => updateAbility(ab.id, 'description', e.target.value)}
                      rows={4} 
                      placeholder="Descreva o que a t�cnica faz e sua �rea de efeito..."
                      className="w-full text-[12px] font-mono bg-transparent focus:outline-none resize-y"
                      style={{ color: '#d8d8d8', minHeight: '80px' }} 
                    />
                  </div>

                  {/* Quick Combat Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {([
                      { label: 'Dano', field: 'statusEffect' as const, placeholder: 'Ex: 2d6+5' },
                      { label: 'DT (Testes)', field: 'gasCount' as const, placeholder: 'Ex: 15 (CON)' },
                      { label: 'Alcance', field: 'techniqueCount' as const, placeholder: 'Ex: 9m / Cone' },
                    ] as const).map(({ label, field, placeholder }) => (
                      <div key={field} style={{ background: '#111', border: '1px solid #2a2a2a', borderTop: '2px solid #1a3a5a', padding: '6px 8px' }}>
                        <span className="block font-bold text-[9px] tracking-[2px] uppercase mb-1" style={{ color: '#4a8fd4' }}>{label}</span>
                        <div style={{ position: 'relative', width: '100%' }}>
                        <input type="text" placeholder={placeholder}
                          value={ab[field]}
                          onChange={e => updateAbility(ab.id, field, e.target.value)}
                          className="w-full text-[12px] font-mono bg-transparent focus:outline-none text-[#e8e8e8]"
                          style={{ color: '#d8d8d8', paddingRight: field === 'statusEffect' ? '30px' : '0' }}
                        />
                        {(field === 'statusEffect' && isValidRoll(resolveDynamicDamage(ab.statusEffect, podValue || 0))) && (
                          <button type="button" onClick={() => handleRoll(ab.name, ab.statusEffect)}
                            className="absolute top-0 right-0 h-[100%] font-impact text-[9px] tracking-[1px] uppercase px-1.5 transition-colors"
                            style={{ background: '#2a1010', color: '#d44040' }}
                            onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.background = '#d44040'; ;(e.currentTarget as HTMLElement).style.color = '#000' }}
                            onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.background = '#2a1010'; ;(e.currentTarget as HTMLElement).style.color = '#d44040' }}>
                            Roll
                          </button>
                        )}
                      </div>
                      </div>
                    ))}
                    {/* Custo P.H. com bot�o consumir */}
                    <div style={{ background: '#111', border: '1px solid #2a2a2a', borderTop: '2px solid #4a8fd4', padding: '6px 8px' }}>
                      <span className="block font-bold text-[9px] tracking-[2px] uppercase mb-1" style={{ color: '#4a8fd4' }}>Custo P.H.</span>
                      <input type="text" placeholder="Ex: 12 P.I." value={ab.statusDT}
                        onChange={e => updateAbility(ab.id, 'statusDT', e.target.value)}
                        className="w-full text-[12px] font-mono bg-transparent focus:outline-none text-[#e8e8e8]"
                        style={{ color: '#d8d8d8', marginBottom: 4 }} />
                      {onSpendPH && (() => {
                        const cost = Math.round(parseFloat(ab.statusDT) || 0)
                        const canAfford = (currentPH ?? 0) >= cost && cost > 0
                        return (
                          <button
                            type="button"
                            onClick={() => cost > 0 && onSpendPH(cost)}
                            disabled={!canAfford}
                            style={{
                              width: '100%', padding: '3px 0', fontSize: 9, textTransform: 'uppercase',
                              letterSpacing: 1, cursor: canAfford ? 'pointer' : 'not-allowed',
                              background: canAfford ? '#080d1a' : '#111',
                              border: `1px solid ${canAfford ? '#1a3a5a' : '#1a1a1a'}`,
                              color: canAfford ? '#4a8fd4' : '#333',
                              borderRadius: 2,
                            }}>
                            {cost > 0 ? `- ${cost} P.H.` : '�'}
                          </button>
                        )
                      })()}
                    </div>
                  </div>

                  {/* PI Notes */}
                  <div style={{ background: '#111', border: '1px solid #2a2a2a', borderTop: '2px solid #e8a000', padding: '8px' }}>
                    <span className="block font-impact text-[10px] tracking-[2px] uppercase mb-1" style={{ color: '#e8a000' }}>Notas de C�lculo P.I.</span>
                    <textarea 
                      value={ab.notes || ''} 
                      onChange={e => updateAbility(ab.id, 'notes', e.target.value)}
                      rows={6} 
                      placeholder="Nenhuma nota de c�lculo P.I. registrada."
                      className="w-full text-[11px] font-mono bg-transparent focus:outline-none resize-y"
                      style={{ color: '#a0a0a0', minHeight: '100px' }} 
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Damage Roll Modal */}
      {roll && (
        <div className="fixed inset-0 flex items-center justify-center z-50 cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setRoll(null)}>
          <div style={{ border: '3px solid #d44040', background: '#0d0d0d', minWidth: 260 }} onClick={e => e.stopPropagation()}>
            <div className="halftone-header flex items-center gap-2 px-3.5 py-[7px] font-impact text-[12px] tracking-[3px] uppercase"
              style={{ background: '#d44040', borderBottom: '3px solid #000', color: '#000' }}>
              ✦ {roll.itemName}
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
              FECHAR
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import type { Attributes } from '../types'
import { SKILL_CATEGORIES } from '../data/skills'
import { ATTR_COLORS } from '../styles/theme'

interface Props {
  skills: Record<string, number>
  attributes: Attributes
  onChange: (skills: Record<string, number>) => void
}

interface RollResult {
  skillName: string
  d20: number
  attrVal: number
  attrName: string
  skillVal: number
  total: number
}

export default function SkillList({ skills, attributes, onChange }: Props) {
  const [roll, setRoll] = useState<RollResult | null>(null)

  const updateSkill = (id: string, val: number) => onChange({ ...skills, [id]: Math.max(0, val) })

  const rollSkill = (skillId: string, skillName: string, attr: keyof Attributes) => {
    const d20 = Math.floor(Math.random() * 20) + 1
    const attrVal = attributes[attr]
    const skillVal = skills[skillId] ?? 0
    setRoll({ skillName, d20, attrVal, attrName: attr, skillVal, total: d20 + attrVal + skillVal })
  }

  const isCrit = roll?.d20 === 20
  const isFail = roll?.d20 === 1

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" style={{ gap: '1px', background: '#2a2a2a' }}>
        {SKILL_CATEGORIES.map(cat => {
          const attrColor = ATTR_COLORS[cat.skills[0]?.attr as string] || '#888'
          return (
            <div key={cat.id} style={{ background: '#0d0d0d' }}>
              <div className="px-3 py-1.5 font-impact text-[10px] tracking-[3px] uppercase"
                style={{ borderLeft: `3px solid ${attrColor}`, color: attrColor, background: '#0a0a0a' }}>
                {cat.label}
              </div>
              <div>
                {cat.skills.map(s => {
                  const val = skills[s.id] ?? 0
                  const color = ATTR_COLORS[s.attr as string] || '#888'
                  return (
                    <div key={s.id} className="flex items-center gap-2 px-2 py-1.5" style={{ borderTop: '1px solid #161616' }}>
                      <button
                        type="button"
                        onClick={() => rollSkill(s.id, s.name, s.attr as keyof Attributes)}
                        aria-label={`Rolar ${s.name}`}
                        className="font-impact tracking-[1px] uppercase shrink-0 transition-colors"
                        style={{ fontSize: 10, padding: '3px 6px', background: '#111', border: `1px solid ${color}40`, color, borderRadius: 2 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = color; (e.currentTarget as HTMLElement).style.color = '#000' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#111'; (e.currentTarget as HTMLElement).style.color = color }}>
                        d20
                      </button>
                      <span className="text-[12px] flex-1" style={{ color: val > 0 ? '#d8d8d8' : '#555' }}>{s.name}</span>
                      <span className="font-impact tracking-[1px] px-1 py-0.5 shrink-0"
                        style={{ fontSize: 10, background: `${color}18`, border: `1px solid ${color}30`, color, borderRadius: 2 }}>
                        {s.attr}
                      </span>
                      <input
                        type="number"
                        value={val}
                        onChange={e => updateSkill(s.id, Number(e.target.value))}
                        aria-label={`Bônus de ${s.name}`}
                        className="text-center font-impact focus:outline-none"
                        style={{ width: 36, fontSize: 14, background: '#111', border: `1px solid ${val > 0 ? color + '60' : '#2a2a2a'}`, color: val > 0 ? color : '#555', padding: '2px', borderRadius: 2 }} />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de resultado */}
      {roll && (
        <div className="fixed inset-0 flex items-center justify-center z-50 cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setRoll(null)}>
          <div style={{ border: '3px solid #e8a000', background: '#0d0d0d', minWidth: 260 }}
            onClick={e => e.stopPropagation()}>
            <div className="panel-header halftone-header">🎲 {roll.skillName}</div>
            <div className="p-5 text-center">
              <div className="font-impact text-[72px] leading-none mb-2" style={{
                color: isCrit ? '#d44040' : isFail ? '#555' : '#e8a000',
                textShadow: isCrit ? '0 0 20px #ff440088' : 'none',
              }}>
                {roll.d20}
              </div>
              {isCrit && <div className="font-impact text-[13px] tracking-[3px] mb-2" style={{ color: '#d44040' }}>CRÍTICO!</div>}
              {isFail && <div className="font-impact text-[13px] tracking-[3px] mb-2" style={{ color: '#555' }}>FALHA CRÍTICA</div>}
              <div className="text-[12px] space-y-1 mb-4" style={{ color: '#888' }}>
                <div>d20 = <span style={{ color: '#e8a000' }}>{roll.d20}</span></div>
                <div>{roll.attrName} = <span style={{ color: '#e8a000' }}>{roll.attrVal}</span></div>
                <div>Perícia = <span style={{ color: '#e8a000' }}>{roll.skillVal}</span></div>
              </div>
              <div className="font-impact text-[14px] tracking-[2px] border-t pt-3" style={{ color: '#d8d8d8', borderColor: '#2a2a2a' }}>
                TOTAL = <span style={{ color: '#e8a000', fontSize: 22 }}>{roll.total}</span>
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

import { useState } from 'react'
import type { ItemAbility } from '../types'
import { nanoid } from '../utils/nanoid'

interface Props {
  abilities: ItemAbility[]
  onChange: (abilities: ItemAbility[]) => void
}

const emptyAbility = (): ItemAbility => ({
  id: nanoid(), name: '', description: '', damage: '', staminaCost: '', cd: '', isPassive: false
})

export default function AbilityList({ abilities, onChange }: Props) {
  const [expanded, setExpanded] = useState<string[]>([])

  const toggle = (id: string) =>
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const add = () => {
    if (abilities.length >= 4) return
    const a = emptyAbility()
    onChange([...abilities, a])
    setExpanded(prev => [...prev, a.id])
  }

  const remove = (id: string) => onChange(abilities.filter(a => a.id !== id))

  const update = <K extends keyof ItemAbility>(id: string, field: K, val: ItemAbility[K]) =>
    onChange(abilities.map(a => a.id === id ? { ...a, [field]: val } : a))

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="font-impact text-[11px] tracking-[3px] uppercase" style={{ color: '#4a8fd4' }}>
          {abilities.length}/4 Habilidades
        </span>
        <button type="button" onClick={add} disabled={abilities.length >= 4}
          className="font-impact text-[11px] tracking-[2px] uppercase px-3 py-1.5 transition-colors disabled:opacity-30"
          style={{ background: '#111', border: '2px solid #4a8fd4', color: '#4a8fd4' }}
          onMouseEnter={e => { if (abilities.length < 4) { ;(e.currentTarget as HTMLElement).style.background = '#4a8fd4'; ;(e.currentTarget as HTMLElement).style.color = '#000' } }}
          onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.background = '#111'; ;(e.currentTarget as HTMLElement).style.color = '#4a8fd4' }}>
          + Habilidade
        </button>
      </div>

      <div className="space-y-2">
        {abilities.map(a => (
          <div key={a.id} style={{ border: '1px solid #2a2a2a', borderLeft: '3px solid #4a8fd4', background: '#0d0d0d' }}>
            <div className="flex items-center gap-2 px-3 py-2 cursor-pointer"
              style={{ borderBottom: expanded.includes(a.id) ? '1px solid #2a2a2a' : 'none' }}
              onClick={() => toggle(a.id)}>
              <span className="font-impact text-[12px] tracking-[1px] flex-1" style={{ color: a.name ? '#d8d8d8' : '#555' }}>
                {a.name || 'Nova Habilidade'}
              </span>
              {a.isPassive && (
                <span className="font-impact text-[9px] tracking-[1px] px-1.5 py-0.5"
                  style={{ background: '#1a2a1a', border: '1px solid #3dc48e30', color: '#3dc48e' }}>PASSIVA</span>
              )}
              <button type="button" onClick={e => { e.stopPropagation(); remove(a.id) }}
                className="font-impact text-[10px] px-1.5 py-0.5 transition-colors"
                style={{ background: '#1a1a1a', border: '1px solid #333', color: '#555' }}
                onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.color = '#d44040'; ;(e.currentTarget as HTMLElement).style.borderColor = '#d44040' }}
                onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.color = '#555'; ;(e.currentTarget as HTMLElement).style.borderColor = '#333' }}>
                ✕
              </button>
              <span className="font-impact text-[11px]" style={{ color: '#555' }}>{expanded.includes(a.id) ? '▾' : '▸'}</span>
            </div>

            {expanded.includes(a.id) && (
              <div className="p-3 grid grid-cols-2 gap-2">
                {([
                  { key: 'name' as const, label: 'Nome', span: 2 },
                  { key: 'description' as const, label: 'Descrição', span: 2, textarea: true },
                  { key: 'damage' as const, label: 'Dano', span: 1 },
                  { key: 'staminaCost' as const, label: 'Custo em PH', span: 1 },
                  { key: 'cd' as const, label: 'CD', span: 1 },
                ] as { key: keyof ItemAbility; label: string; span: number; textarea?: boolean }[]).map(({ key, label, span, textarea }) => (
                  <div key={String(key)} className={span === 2 ? 'col-span-2' : ''}
                    style={{ background: '#111', border: '1px solid #2a2a2a', borderTop: '2px solid #1a3a5a', padding: '6px 8px' }}>
                    <span className="block font-bold text-[9px] tracking-[2px] uppercase mb-1" style={{ color: '#4a8fd4' }}>{label}</span>
                    {textarea ? (
                      <textarea value={a[key] as string} onChange={e => update(a.id, key, e.target.value as ItemAbility[typeof key])}
                        rows={2} className="w-full text-[12px] bg-transparent focus:outline-none resize-none" style={{ color: '#d8d8d8' }} />
                    ) : (
                      <input type="text" value={a[key] as string} onChange={e => update(a.id, key, e.target.value as ItemAbility[typeof key])}
                        className="w-full text-[12px] bg-transparent focus:outline-none" style={{ color: '#d8d8d8' }} />
                    )}
                  </div>
                ))}
                <div className="col-span-2 mt-1">
                  <button type="button" onClick={() => update(a.id, 'isPassive', !a.isPassive)}
                    className="font-impact text-[11px] tracking-[2px] uppercase px-3 py-1.5 transition-colors"
                    style={{
                      background: a.isPassive ? '#3dc48e' : '#111',
                      border: '1px solid #3dc48e',
                      color: a.isPassive ? '#000' : '#3dc48e',
                    }}>
                    {a.isPassive ? '✓ Passiva' : 'Passiva?'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

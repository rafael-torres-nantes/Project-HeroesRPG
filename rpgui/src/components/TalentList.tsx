import { useState } from 'react'
import type { TalentEntry } from '../types'
import { TALENT_CATALOG } from '../data/talents'
import { nanoid } from '../utils/nanoid'

interface Props {
  talents: TalentEntry[]
  onChange: (talents: TalentEntry[]) => void
}

export default function TalentList({ talents, onChange }: Props) {
  const [showCatalog, setShowCatalog] = useState(false)

  const add = (name: string) => {
    if (talents.some(t => t.name === name)) return
    onChange([...talents, { id: nanoid(), name, level: 1 }])
    setShowCatalog(false)
  }

  const remove = (id: string) => onChange(talents.filter(t => t.id !== id))

  const addedNames = new Set(talents.map(t => t.name))

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="font-impact text-[11px] tracking-[3px] uppercase" style={{ color: '#e8a000' }}>
          {talents.length} Talentos Adquiridos
        </span>
        <button type="button" onClick={() => setShowCatalog(true)}
          className="font-impact text-[11px] tracking-[2px] uppercase px-3 py-1.5 transition-colors"
          style={{ background: '#111', border: '2px solid #e8a000', color: '#e8a000' }}
          onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.background = '#e8a000'; ;(e.currentTarget as HTMLElement).style.color = '#000' }}
          onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.background = '#111'; ;(e.currentTarget as HTMLElement).style.color = '#e8a000' }}>
          + Catálogo
        </button>
      </div>

      {talents.length === 0 && (
        <p className="text-[12px] italic text-center py-4" style={{ color: '#555' }}>Nenhum talento adquirido</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {talents.map(t => {
          const def = TALENT_CATALOG.find(d => d.name === t.name)
          return (
            <div key={t.id} className="flex items-start justify-between gap-2 p-3"
              style={{ background: '#111', border: '1px solid #2a2a2a', borderLeft: '3px solid #e8a000' }}>
              <div className="flex-1 min-w-0">
                <div className="font-impact text-[13px] tracking-[1px]" style={{ color: '#e8a000' }}>{t.name}</div>
                {def?.requirement && <div className="text-[11px] mt-0.5" style={{ color: '#555' }}>Req: {def.requirement}</div>}
                {def?.description && <div className="text-[11px] mt-1 line-clamp-2" style={{ color: '#888' }}>{def.description}</div>}
              </div>
              <button type="button" onClick={() => remove(t.id)}
                className="font-impact text-[10px] px-1.5 py-0.5 shrink-0 transition-colors"
                style={{ background: '#1a1a1a', border: '1px solid #333', color: '#555' }}
                onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.color = '#d44040'; ;(e.currentTarget as HTMLElement).style.borderColor = '#d44040' }}
                onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.color = '#555'; ;(e.currentTarget as HTMLElement).style.borderColor = '#333' }}>
                ✕
              </button>
            </div>
          )
        })}
      </div>

      {/* Catálogo modal */}
      {showCatalog && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 overflow-auto"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setShowCatalog(false)}>
          <div style={{ border: '3px solid #e8a000', background: '#0d0d0d', width: '100%', maxWidth: 700 }}
            onClick={e => e.stopPropagation()}>
            <div className="panel-header halftone-header flex justify-between">
              <span>★ Catálogo de Talentos</span>
              <button onClick={() => setShowCatalog(false)}
                className="font-impact text-[13px] z-10 transition-colors" style={{ color: '#555' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#d44040')}
                onMouseLeave={e => (e.currentTarget.style.color = '#555')}>✕</button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
              {TALENT_CATALOG.map(t => {
                const has = addedNames.has(t.name)
                return (
                  <button key={t.name} type="button" onClick={() => add(t.name)} disabled={has}
                    className="text-left p-3 transition-colors"
                    style={{
                      background: has ? '#0a0a0a' : '#111',
                      border: '1px solid #2a2a2a',
                      borderLeft: `3px solid ${has ? '#2a2a2a' : '#e8a000'}`,
                      opacity: has ? 0.4 : 1,
                      cursor: has ? 'default' : 'pointer',
                    }}>
                    <div className="font-impact text-[13px] tracking-[1px] mb-0.5" style={{ color: has ? '#555' : '#e8a000' }}>{t.name}</div>
                    {t.requirement && <div className="text-[10px] mb-1" style={{ color: '#555' }}>Req: {t.requirement}</div>}
                    <div className="text-[11px]" style={{ color: '#888' }}>{t.description}</div>
                    {has && <div className="font-impact text-[9px] tracking-[2px] mt-1" style={{ color: '#555' }}>JÁ ADQUIRIDO</div>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

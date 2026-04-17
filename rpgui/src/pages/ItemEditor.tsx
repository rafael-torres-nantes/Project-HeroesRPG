import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import AbilityList from '../components/AbilityList'
import { storage } from '../store/storage'
import { nanoid } from '../utils/nanoid'
import type { Item, PowerLevel } from '../types'
import { RARITY_COLORS } from '../styles/theme'

const POWER_LEVELS: PowerLevel[] = ['Raro', 'Lendário', 'Mítico', 'Artefato Único']

const defaultItem = (): Item => ({
  id: nanoid(),
  name: '',
  history: '',
  visualDescription: '',
  origin: '',
  currentLocation: '',
  abilities: [],
  baseDamage: '',
  conditionOfUse: '',
  risks: '',
  powerLevel: 'Lendário',
  itemType: '',
  keyConcept: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

const ItemField = ({ label, value, onChange, placeholder, textarea = false, rows = 2 }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; textarea?: boolean; rows?: number
}) => (
  <div style={{ background: '#111', border: '1px solid #2a2a2a', borderTop: '2px solid #1a3a5a', padding: '6px 8px' }}>
    <span className="block font-bold text-[9px] tracking-[2px] uppercase mb-1" style={{ color: '#4a8fd4' }}>{label}</span>
    {textarea ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder}
        className="w-full text-[12px] bg-transparent focus:outline-none resize-none" style={{ color: '#d8d8d8' }} />
    ) : (
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full text-[12px] bg-transparent focus:outline-none" style={{ color: '#d8d8d8' }} />
    )}
  </div>
)

const PanelHeader = ({ label, color, bg }: { label: string; color: string; bg: string }) => (
  <div className="panel-header halftone-header" style={{ background: bg, color }}>
    {label}
  </div>
)

export default function ItemEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState<Item>(defaultItem)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (id) {
      const found = storage.getItems().find(i => i.id === id)
      if (found) setItem(found)
    }
  }, [id])

  const update = <K extends keyof Item>(key: K, val: Item[K]) =>
    setItem(prev => ({ ...prev, [key]: val }))

  const save = () => {
    storage.saveItem({ ...item, updatedAt: new Date().toISOString() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    if (!id) navigate(`/items/${item.id}`, { replace: true })
  }

  const rarityColor = RARITY_COLORS[item.powerLevel] || '#e8a000'

  return (
    <Layout>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] gap-4 items-start">
        {/* Main panels */}
        <div className="space-y-0">

          {/* Identidade */}
          <div style={{ border: '2px solid #e8a000', marginBottom: 4 }}>
            <PanelHeader label="⚔ Identidade do Item" color="#000" bg="#e8a000" />
            <div className="p-3 space-y-2" style={{ background: '#0d0d0d' }}>
              <div className="grid grid-cols-2 gap-2">
                <ItemField label="Nome do Item" value={item.name} onChange={v => update('name', v)} placeholder="Ex: Mão do Homem Sem Rumo" />
                <div style={{ background: '#111', border: '1px solid #2a2a2a', borderTop: '2px solid #1a3a5a', padding: '6px 8px' }}>
                  <span className="block font-bold text-[9px] tracking-[2px] uppercase mb-1" style={{ color: '#4a8fd4' }}>Raridade</span>
                  <select value={item.powerLevel} onChange={e => update('powerLevel', e.target.value as PowerLevel)}
                    className="w-full text-[12px] bg-transparent focus:outline-none" style={{ color: rarityColor }}>
                    {POWER_LEVELS.map(p => <option key={p} style={{ color: RARITY_COLORS[p] || '#d8d8d8', background: '#111' }}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ItemField label="Tipo de Item" value={item.itemType} onChange={v => update('itemType', v)} placeholder="Ex: Armadura, Arma Branca, Acessório" />
                <ItemField label="Dano Base" value={item.baseDamage} onChange={v => update('baseDamage', v)} placeholder="Ex: 2d6+FOR ou N/A" />
              </div>
              <ItemField label="Conceito-Chave" value={item.keyConcept} onChange={v => update('keyConcept', v)} placeholder="Ex: Uma luva que rouba memórias" />
            </div>
          </div>

          {/* Lore */}
          <div style={{ border: '2px solid #1a4a2a', marginBottom: 4 }}>
            <PanelHeader label="◈ Lore" color="#86efac" bg="#1a2a1a" />
            <div className="p-3 space-y-2" style={{ background: '#0a130a' }}>
              <ItemField label="História" value={item.history} onChange={v => update('history', v)} textarea rows={4} placeholder="A lenda por trás do item..." />
              <ItemField label="Descrição Visual" value={item.visualDescription} onChange={v => update('visualDescription', v)} textarea rows={3} placeholder="Materiais, texturas, energia que emana..." />
              <div className="grid grid-cols-2 gap-2">
                <ItemField label="Origem" value={item.origin} onChange={v => update('origin', v)} placeholder="Ex: Ossos de um velocista lendário" />
                <ItemField label="Paradeiro Atual" value={item.currentLocation} onChange={v => update('currentLocation', v)} placeholder="Ex: Desconhecido" />
              </div>
            </div>
          </div>

          {/* Habilidades */}
          <div style={{ border: '2px solid #1a2a5a', marginBottom: 4 }}>
            <PanelHeader label="◇ Habilidades do Item" color="#93c5fd" bg="#1a1a2a" />
            <div className="p-3" style={{ background: '#080810' }}>
              <AbilityList abilities={item.abilities} onChange={abilities => update('abilities', abilities)} />
            </div>
          </div>

          {/* Preço do Poder */}
          <div style={{ border: '2px solid #5a1a1a' }}>
            <PanelHeader label="☠ O Preço do Poder" color="#fca5a5" bg="#2a1010" />
            <div className="p-3 space-y-2" style={{ background: '#130808' }}>
              <ItemField label="Condição de Uso" value={item.conditionOfUse} onChange={v => update('conditionOfUse', v)} textarea rows={2} placeholder="Requisito para ativar o item..." />
              <ItemField label="Riscos / Maldição" value={item.risks} onChange={v => update('risks', v)} textarea rows={3} placeholder="Efeito colateral, maldição ou consequência perigosa..." />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:sticky xl:top-4 xl:self-start space-y-3">
          {/* Item preview badge */}
          <div style={{ border: `2px solid ${rarityColor}`, background: '#0d0d0d' }}>
            <div className="halftone-header px-3 py-2 font-impact text-[11px] tracking-[3px] uppercase"
              style={{ background: rarityColor, color: '#000', borderBottom: `3px solid #000` }}>
              {item.powerLevel}
            </div>
            <div className="p-3">
              <div className="font-impact text-[18px] tracking-[1px] leading-tight mb-1" style={{ color: rarityColor }}>
                {item.name || 'Sem nome'}
              </div>
              <div className="text-[11px] mb-2" style={{ color: '#888' }}>
                {item.itemType || '—'}
              </div>
              {item.baseDamage && (
                <div className="font-impact text-[11px] tracking-[1px] px-2 py-1 inline-block"
                  style={{ background: '#2a1010', border: '1px solid #d44040', color: '#d44040' }}>
                  {item.baseDamage}
                </div>
              )}
              {item.abilities.length > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="font-impact text-[9px] tracking-[2px] uppercase mb-2" style={{ color: '#555' }}>Habilidades</div>
                  {item.abilities.map(a => (
                    <div key={a.id} className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-impact tracking-[1px]" style={{ color: a.name ? '#d8d8d8' : '#555' }}>{a.name || '—'}</span>
                      {a.isPassive ? (
                        <span className="font-impact text-[9px] px-1 py-0.5" style={{ background: '#1a2a1a', border: '1px solid #3dc48e30', color: '#3dc48e' }}>PAS</span>
                      ) : a.staminaCost ? (
                        <span className="font-impact text-[9px] px-1 py-0.5" style={{ background: '#1a2a3a', border: '1px solid #4a8fd430', color: '#4a8fd4' }}>{a.staminaCost}PH</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
              {(item.conditionOfUse || item.risks) && (
                <div className="mt-3 pt-2" style={{ borderTop: '1px solid #2a2a2a' }}>
                  <div className="font-impact text-[9px] tracking-[2px] uppercase mb-1" style={{ color: '#d44040' }}>Perigos</div>
                  {item.conditionOfUse && <p className="text-[11px] mb-1" style={{ color: '#888' }}>{item.conditionOfUse}</p>}
                  {item.risks && <p className="text-[11px]" style={{ color: '#888' }}>{item.risks}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <button onClick={save}
            className="clip-btn-right w-full font-impact text-[13px] tracking-[3px] uppercase py-3 transition-colors"
            style={{
              background: saved ? '#3dc48e' : '#e8a000',
              color: '#000',
              border: 'none',
            }}>
            {saved ? '✓ Salvo!' : 'Salvar Item'}
          </button>

          <button onClick={() => navigate('/')}
            className="w-full font-impact text-[11px] tracking-[2px] uppercase py-2 transition-colors"
            style={{ background: '#111', border: '1px solid #2a2a2a', color: '#555' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e8a000')}
            onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
            ← Voltar
          </button>
        </div>
      </div>
    </Layout>
  )
}

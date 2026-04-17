import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import Layout from '../components/Layout'
import { storage } from '../store/storage'
import type { Character, Item } from '../types'
import { calcDerived } from '../utils/calculations'
import { ARCHETYPE_COLORS, RARITY_COLORS } from '../styles/theme'

function AddCard({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      minHeight: '200px',
      background: '#0d0d0d',
      borderRadius: '10px',
      border: '2px dashed #1a1a1a',
      color: '#2a2a2a',
      textDecoration: 'none',
      transition: 'all 0.2s',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement
      el.style.borderColor = '#333'
      el.style.color = '#555'
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement
      el.style.borderColor = '#1a1a1a'
      el.style.color = '#2a2a2a'
    }}>
      <div style={{ fontSize: '26px', lineHeight: 1 }}>+</div>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>{label}</div>
    </Link>
  )
}

function CharacterCard({ character, onDelete }: { character: Character; onDelete: () => void }) {
  const stats = calcDerived(character.attributes, character.level)
  const attrs = character.attributes
  const accentColor = ARCHETYPE_COLORS[character.archetype] || '#555'
  const attrKeys = ['FOR', 'AGI', 'INT', 'PRE', 'POD', 'VIG'] as const
  const maxAttrVal = Math.max(...attrKeys.map(k => attrs[k]))

  const currentHP = character.currentHP ?? stats.maxHP
  const currentPH = character.currentPH ?? stats.maxPH
  const pvPct = Math.min(100, Math.round((currentHP / stats.maxHP) * 100))
  const phPct = Math.min(100, Math.round((currentPH / stats.maxPH) * 100))

  return (
    <div style={{
      background: '#111',
      borderRadius: '10px',
      overflow: 'hidden',
      border: '1px solid #1a1a1a',
      transition: 'border-color 0.2s, transform 0.15s',
      position: 'relative',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement
      el.style.borderColor = '#2a2a2a'
      el.style.transform = 'translateY(-2px)'
      el.querySelector<HTMLElement>('.card-actions')?.style.setProperty('opacity', '1')
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement
      el.style.borderColor = '#1a1a1a'
      el.style.transform = 'translateY(0)'
      el.querySelector<HTMLElement>('.card-actions')?.style.setProperty('opacity', '0')
    }}>
      {/* Borda top colorida por arquétipo */}
      <div style={{ height: '3px', background: accentColor, opacity: 0.7 }} />

      {/* Card top */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid #161616',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '40px', height: '40px',
          borderRadius: '8px',
          background: accentColor + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accentColor,
          fontSize: '17px', fontWeight: 800,
          flexShrink: 0,
          opacity: 0.85,
        }}>
          {(character.name || '?')[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#e0e0e0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {character.name || 'Sem nome'}
          </div>
          <div style={{ fontSize: '12px', color: accentColor, marginTop: '2px', opacity: 0.75 }}>
            {character.archetype}
          </div>
        </div>
        <div style={{
          background: '#161616', color: '#666',
          fontSize: '11px', fontWeight: 700,
          padding: '4px 8px', borderRadius: '5px',
          whiteSpace: 'nowrap',
        }}>
          Nv {character.level}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '12px 14px 14px' }}>
        {/* PV bar */}
        <div style={{ marginBottom: '9px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#555' }}>PV</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#c05050' }}>{currentHP} / {stats.maxHP}</span>
          </div>
          <div style={{ height: '5px', background: '#161616', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${pvPct}%`, height: '100%', background: 'linear-gradient(90deg, #6b1212, #c05050)', borderRadius: '3px', transition: 'width 0.3s' }} />
          </div>
        </div>
        {/* PH bar */}
        <div style={{ marginBottom: '11px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#555' }}>PH</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#4a7ab8' }}>{currentPH} / {stats.maxPH}</span>
          </div>
          <div style={{ height: '5px', background: '#161616', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${phPct}%`, height: '100%', background: 'linear-gradient(90deg, #112444, #4a7ab8)', borderRadius: '3px', transition: 'width 0.3s' }} />
          </div>
        </div>
        {/* Atributos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
          {attrKeys.map(k => {
            const isTop = attrs[k] === maxAttrVal
            return (
              <div key={k} style={{
                background: '#161616',
                borderRadius: '5px',
                padding: '6px 3px',
                textAlign: 'center',
                border: isTop ? `1px solid ${accentColor}` : '1px solid transparent',
              }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: isTop ? accentColor : '#bbb' }}>{attrs[k]}</div>
                <div style={{ fontSize: '9px', fontWeight: 600, color: isTop ? accentColor : '#444', marginTop: '1px', opacity: isTop ? 0.65 : 1 }}>{k}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Ações hover */}
      <div className="card-actions" style={{
        position: 'absolute', top: '10px', right: '10px',
        display: 'flex', gap: '4px',
        opacity: 0, transition: 'opacity 0.15s',
      }}>
        <button onClick={e => { e.preventDefault(); onDelete() }} style={{
          background: '#111', border: '1px solid #222',
          color: '#555', borderRadius: '5px', padding: '4px', cursor: 'pointer', lineHeight: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#c05050')}
        onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
          <Trash2 size={12} />
        </button>
        <Link to={`/characters/${character.id}`} style={{
          background: '#111', border: '1px solid #222',
          color: '#555', borderRadius: '5px', padding: '4px', lineHeight: 0, display: 'block',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#d8d8d8')}
        onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
          <Edit2 size={12} />
        </Link>
      </div>
    </div>
  )
}

function ItemCard({ item, onDelete }: { item: Item; onDelete: () => void }) {
  const accentColor = RARITY_COLORS[item.powerLevel] || '#555'

  return (
    <div style={{
      background: '#111',
      borderRadius: '10px',
      overflow: 'hidden',
      border: '1px solid #1a1a1a',
      transition: 'border-color 0.2s, transform 0.15s',
      position: 'relative',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement
      el.style.borderColor = '#2a2a2a'
      el.style.transform = 'translateY(-2px)'
      el.querySelector<HTMLElement>('.card-actions')?.style.setProperty('opacity', '1')
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement
      el.style.borderColor = '#1a1a1a'
      el.style.transform = 'translateY(0)'
      el.querySelector<HTMLElement>('.card-actions')?.style.setProperty('opacity', '0')
    }}>
      {/* Borda top colorida por raridade */}
      <div style={{ height: '3px', background: accentColor, opacity: 0.7 }} />

      {/* Card top */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid #161616',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '40px', height: '40px',
          borderRadius: '8px',
          background: accentColor + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accentColor,
          fontSize: '17px', fontWeight: 800,
          flexShrink: 0,
          opacity: 0.85,
        }}>
          {(item.name || '?')[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#e0e0e0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.name || 'Sem nome'}
          </div>
          <div style={{ fontSize: '12px', color: accentColor, marginTop: '2px', opacity: 0.75 }}>
            {item.itemType || 'Item Especial'}
          </div>
        </div>
        <div style={{
          background: '#161616', color: '#666',
          fontSize: '11px', fontWeight: 700,
          padding: '4px 8px', borderRadius: '5px',
          whiteSpace: 'nowrap',
        }}>
          {item.powerLevel}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{ fontSize: '12px', fontStyle: 'italic', color: '#666', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '10px' }}>
          {item.keyConcept || 'Sem descrição'}
        </p>
        <div style={{ fontSize: '11px', color: '#444' }}>
          {item.abilities.length} habilidade{item.abilities.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Ações hover */}
      <div className="card-actions" style={{
        position: 'absolute', top: '10px', right: '10px',
        display: 'flex', gap: '4px',
        opacity: 0, transition: 'opacity 0.15s',
      }}>
        <button onClick={e => { e.preventDefault(); onDelete() }} style={{
          background: '#111', border: '1px solid #222',
          color: '#555', borderRadius: '5px', padding: '4px', cursor: 'pointer', lineHeight: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#c05050')}
        onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
          <Trash2 size={12} />
        </button>
        <Link to={`/items/${item.id}`} style={{
          background: '#111', border: '1px solid #222',
          color: '#555', borderRadius: '5px', padding: '4px', lineHeight: 0, display: 'block',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#d8d8d8')}
        onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
          <Edit2 size={12} />
        </Link>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [tab, setTab] = useState<'characters' | 'items'>('characters')

  const load = () => {
    setCharacters(storage.getCharacters().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
    setItems(storage.getItems().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
  }

  useEffect(() => { load() }, [])

  const deleteChar = (id: string) => { if (confirm('Excluir personagem?')) { storage.deleteCharacter(id); load() } }
  const deleteItem = (id: string) => { if (confirm('Excluir item?')) { storage.deleteItem(id); load() } }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try { storage.importJSON(ev.target?.result as string); load() } catch { alert('Arquivo inválido') }
    }
    reader.readAsText(file)
  }

  const isCharTab = tab === 'characters'

  return (
    <Layout>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Import/Export */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '24px' }}>
          <label style={{
            background: 'transparent', border: '1px solid #1a1a1a',
            color: '#555', padding: '6px 12px', borderRadius: '6px',
            fontSize: '12px', cursor: 'pointer',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#d8d8d8' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#555' }}>
            ↓ Importar
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          </label>
          <button onClick={storage.exportJSON} style={{
            background: 'transparent', border: '1px solid #1a1a1a',
            color: '#555', padding: '6px 12px', borderRadius: '6px',
            fontSize: '12px', cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#d8d8d8')}
          onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
            ↑ Exportar
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'inline-flex',
          background: '#111',
          padding: '3px',
          borderRadius: '8px',
          marginBottom: '20px',
          gap: '2px',
          border: '1px solid #1a1a1a',
        }}>
          {(['characters', 'items'] as const).map(t => {
            const active = tab === t
            const count = t === 'characters' ? characters.length : items.length
            return (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '7px 18px',
                borderRadius: '6px',
                fontSize: '13px', fontWeight: 600,
                background: active ? '#1a1a1a' : 'transparent',
                color: active ? '#d8d8d8' : '#444',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                {t === 'characters' ? 'Personagens' : 'Itens Especiais'}
                <span style={{
                  background: active ? '#222' : '#161616',
                  color: active ? '#888' : '#444',
                  fontSize: '10px', fontWeight: 700,
                  padding: '1px 6px', borderRadius: '8px',
                }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#3a3a3a' }}>
            {isCharTab ? 'Seus personagens' : 'Seus itens especiais'}
          </span>
          <Link to={isCharTab ? '/characters/new' : '/items/new'} style={{
            background: '#1a1a1a', color: '#d8d8d8',
            padding: '7px 14px', borderRadius: '6px',
            fontSize: '12px', fontWeight: 600,
            textDecoration: 'none',
            border: '1px solid #333',
          }}>
            {isCharTab ? '+ Novo Personagem' : '+ Novo Item'}
          </Link>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {isCharTab
            ? characters.map(c => <CharacterCard key={c.id} character={c} onDelete={() => deleteChar(c.id)} />)
            : items.map(i => <ItemCard key={i.id} item={i} onDelete={() => deleteItem(i.id)} />)
          }
          <AddCard
            to={isCharTab ? '/characters/new' : '/items/new'}
            label={isCharTab ? 'Novo Personagem' : 'Novo Item'}
          />
        </div>
      </div>
    </Layout>
  )
}

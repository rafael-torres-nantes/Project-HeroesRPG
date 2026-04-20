import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Dice6 } from 'lucide-react'
import Layout from '../components/Layout'

import AttributeInput from '../components/AttributeInput'
import DerivedPanel from '../components/DerivedPanel'
import SkillList from '../components/SkillList'
import TalentList from '../components/TalentList'
import EquipmentList from '../components/EquipmentList'
import IndividualidadeList from '../components/IndividualidadeList'
import { storage } from '../store/storage'
import { calcDerived } from '../utils/calculations'
import { nanoid } from '../utils/nanoid'
import { initSkills, ALL_SKILLS } from '../data/skills'
import { executeRoll, type DamageRollResult } from '../utils/dice'
import type { Character, Archetype, Attributes } from '../types'

const ARCHETYPES: Archetype[] = ['Nenhum', 'Conjuração', 'Corporal', 'Emissor', 'Manipulação', 'Quântico', 'Metamorfo', 'Mentalista']

const defaultChar = (): Character => ({
  id: nanoid(),
  name: '',
  concept: '',
  occupation: '',
  heroRank: '',
  age: 0,
  progressPoints: 0,
  level: 1,
  archetype: 'Nenhum',
  attributes: { FOR: 0, AGI: 0, INT: 0, PRE: 0, POD: 0, VIG: 0 },
  skills: initSkills(),
  talents: [],
  equipment: [],
  individualidadeName: '',
  individualidadeAbilities: [],
  notes: '',
  appearance: '',
  conceptArt: [],
  personality: { traits: '', motivations: '', fears: '' },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrate(raw: any): Character {
  const base = initSkills()
  let skills: Record<string, number> = base
  if (Array.isArray(raw.skills)) {
    ALL_SKILLS.forEach(s => {
      const match = raw.skills.find((old: { name: string; value: number }) =>
        old.name && s.name.toLowerCase().startsWith(old.name.toLowerCase().split('(')[0].trim().substring(0, 5))
      )
      if (match) base[s.id] = match.value ?? 0
    })
    skills = base
  } else if (raw.skills && typeof raw.skills === 'object') {
    skills = { ...base, ...raw.skills }
  }

  let individualidadeName: string = raw.individualidadeName ?? ''
  let notes: string = raw.notes ?? ''
  if (raw.individualidade && !raw.individualidadeName) {
    individualidadeName = raw.individualidade.name ?? ''
    if (raw.individualidade.description) {
      notes = notes ? `${notes}\n\n[Individualidade]: ${raw.individualidade.description}` : `[Individualidade]: ${raw.individualidade.description}`
    }
  }

  return {
    id: raw.id ?? nanoid(),
    name: raw.name ?? '',
    concept: raw.concept ?? '',
    occupation: raw.occupation ?? '',
    heroRank: raw.heroRank ?? '',
    age: raw.age ?? 0,
    progressPoints: raw.progressPoints ?? 0,
    level: raw.level ?? 1,
    archetype: raw.archetype ?? 'Nenhum',
    attributes: raw.attributes ?? { FOR: 1, AGI: 1, INT: 1, PRE: 1, POD: 1, VIG: 1 },
    skills,
    talents: raw.talents ?? [],
    equipment: raw.equipment ?? [],
    individualidadeName,
    individualidadeAbilities: raw.individualidadeAbilities ?? [],
    notes,
    appearance: raw.appearance ?? '',
    conceptArt: raw.conceptArt ?? [],
    personality: raw.personality ?? { traits: '', motivations: '', fears: '' },
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
  }
}

// UI helpers
const SectionLabel = ({ children, color = '#333' }: { children: React.ReactNode; color?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 14, fontWeight: 600 }}>
    <span style={{ display: 'inline-block', width: 3, height: 13, borderRadius: 2, background: color, flexShrink: 0 }} />
    {children}
  </div>
)

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 6 }}>{label}</div>
    {children}
  </div>
)


function CollapsiblePanel({ icon, title, count, children, id, defaultOpen = false }: {
  icon: string; title: string; count?: string; children: React.ReactNode; id?: string; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = id ?? `panel-${title.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <div style={{ borderBottom: '1px solid #2a2a2a' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex items-center gap-2 text-left"
        style={{ padding: '16px 28px', background: open ? '#141414' : '#111', border: 'none', cursor: 'pointer', transition: 'background 0.15s', borderLeft: open ? '3px solid #e8a000' : '3px solid transparent' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#161616')}
        onMouseLeave={e => (e.currentTarget.style.background = open ? '#141414' : '#111')}
        onFocus={e => (e.currentTarget.style.background = '#161616')}
        onBlur={e => (e.currentTarget.style.background = open ? '#141414' : '#111')}
      >
        <span style={{ fontSize: 13, color: open ? '#e8a000' : '#666' }}>{icon}</span>
        <span style={{ flex: 1, fontSize: 12, color: open ? '#d8d8d8' : '#999', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: open ? 600 : 400 }}>{title}</span>
        {count && !open && <span style={{ fontSize: 10, color: '#555', background: '#1a1a1a', padding: '2px 8px', borderRadius: 3, border: '1px solid #2a2a2a' }}>{count}</span>}
        <span style={{
          fontSize: 11, color: open ? '#e8a000' : '#555', marginLeft: 8,
          display: 'inline-block',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }}>▸</span>
      </button>
      {open && (
        <div id={panelId} style={{ padding: '4px 28px 24px', background: '#0f0f0f', borderLeft: '3px solid #e8a000' }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function CharacterEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [char, setChar] = useState<Character>(defaultChar)
  const [saved, setSaved] = useState(false)
  const [pvDelta, setPvDelta] = useState(0)
  const [phDelta, setPhDelta] = useState(0)
  const [penetratingDelta, setPenetratingDelta] = useState(0)
  const [roll, setRoll] = useState<DamageRollResult | null>(null)
  const [activeTab, setActiveTab] = useState<'ficha' | 'aparencia' | 'personalidade'>('ficha')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleRollMelee = (damage: string) => {
    const res = executeRoll(damage)
    if (!res) return
    setRoll({
      itemName: 'Dano Corpo-a-Corpo',
      ...res
    })
  }

  useEffect(() => {
    if (id) {
      const found = storage.getCharacters().find(c => c.id === id)
      if (found) setChar(migrate(found))
    }
  }, [id])

  const update = <K extends keyof Character>(key: K, val: Character[K]) =>
    setChar(prev => ({ ...prev, [key]: val }))

  const updateAttr = (attr: keyof Attributes, val: number) =>
    setChar(prev => ({ ...prev, attributes: { ...prev.attributes, [attr]: val } }))

  const blockSkill = char.skills['bloquear'] ?? 0
  const dodgeSkill = char.skills['esquivar'] ?? 0
  const derived = calcDerived(char.attributes, char.level, blockSkill, dodgeSkill)
  const currentHP = char.currentHP ?? derived.maxHP
  const currentArmor = char.currentArmor ?? 0
  const armorType = char.armorType ?? 'Nenhuma'
  const currentPH = char.currentPH ?? derived.maxPH

  const applyDamage = (delta: number) => {
    const eff = delta || 1
    setChar(prev => {
      const armor = prev.currentArmor ?? 0
      const hp = prev.currentHP ?? derived.maxHP
      const effectiveDmg = Math.max(0, eff - armor)
      return { ...prev, currentHP: Math.max(0, hp - effectiveDmg) }
    })
    setPvDelta(0)
  }

  const applyDamagePenetrating = (delta: number) => {
    const eff = delta || 1
    setChar(prev => ({ ...prev, currentHP: Math.max(0, (prev.currentHP ?? derived.maxHP) - eff) }))
    setPvDelta(0)
  }

  const applyHeal = (delta: number) => {
    const eff = delta || 1
    setChar(prev => ({ ...prev, currentHP: Math.min(derived.maxHP, (prev.currentHP ?? derived.maxHP) + eff) }))
    setPvDelta(0)
  }

  const applyPHSpend = (delta: number) => {
    const eff = delta || 1
    setChar(prev => ({ ...prev, currentPH: Math.max(0, (prev.currentPH ?? derived.maxPH) - eff) }))
    setPhDelta(0)
  }

  const applyPHRecover = (delta: number) => {
    const eff = delta || 1
    setChar(prev => ({ ...prev, currentPH: Math.min(derived.maxPH, (prev.currentPH ?? derived.maxPH) + eff) }))
    setPhDelta(0)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => {
        const result = ev.target?.result as string
        if (result) setChar(prev => ({ ...prev, conceptArt: [...prev.conceptArt, result] }))
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const removeImage = (idx: number) => {
    setChar(prev => ({ ...prev, conceptArt: prev.conceptArt.filter((_, i) => i !== idx) }))
  }

  const updatePersonality = (field: keyof Character['personality'], val: string) => {
    setChar(prev => ({ ...prev, personality: { ...prev.personality, [field]: val } }))
  }

  const save = () => {
    storage.saveCharacter({ ...char, updatedAt: new Date().toISOString() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    if (!id) navigate(`/characters/${char.id}`, { replace: true })
  }

  const fieldInputStyle: React.CSSProperties = {
    background: 'transparent', border: 'none', borderBottom: '1px solid #2a2a2a',
    color: '#d8d8d8', fontSize: 13, width: '100%', outline: 'none',
    padding: '4px 0', transition: 'border-color 0.15s',
  }
  const levelInputStyle: React.CSSProperties = {
    background: 'transparent', border: 'none', borderBottom: '1px solid #2a2a2a',
    color: '#e8a000', fontSize: 22, fontWeight: 700, width: '100%', outline: 'none',
    padding: '3px 0', transition: 'border-color 0.15s',
  }
  const focusGold = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderBottomColor = '#e8a000'),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderBottomColor = '#2a2a2a'),
  }

  return (
    <Layout>
      <div className="p-5">
        <button type="button" onClick={() => navigate('/')}
          style={{ background: 'transparent', border: 'none', color: '#555', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', marginBottom: 14, padding: '4px 0', display: 'flex', alignItems: 'center', gap: 6 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#e8a000')}
          onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
          ← Lista de Personagens
        </button>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px]" style={{ border: '1px solid #1e1e1e' }}>

          {/* COLUNA PRINCIPAL */}
          <div style={{ borderRight: '0px' }} className="xl:border-r-[3px] xl:border-r-gold">

            {/* ABAS */}
            <div style={{ display: 'flex', borderBottom: '1px solid #1e1e1e', background: '#0a0a0a' }}>
              {(['ficha', 'aparencia', 'personalidade'] as const).map(tab => {
                const labels = { ficha: 'Ficha', aparencia: 'Aparência', personalidade: 'Personalidade' }
                const active = activeTab === tab
                return (
                  <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '12px 20px', background: 'transparent', border: 'none',
                      borderBottom: active ? '2px solid #e8a000' : '2px solid transparent',
                      color: active ? '#e8a000' : '#555', fontSize: 11, textTransform: 'uppercase',
                      letterSpacing: '2px', cursor: 'pointer', transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#888' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#555' }}>
                    {labels[tab]}
                  </button>
                )
              })}
            </div>

            {activeTab === 'ficha' && <>
            {/* IDENTIDADE */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid #1e1e1e' }}>
              <SectionLabel color="#e8a000">Identidade</SectionLabel>
              <input
                type="text"
                value={char.name}
                onChange={e => update('name', e.target.value)}
                placeholder="Nome do personagem"
                aria-label="Nome do personagem"
                onFocus={e => (e.currentTarget.style.borderBottomColor = '#e8a000')}
                onBlur={e => (e.currentTarget.style.borderBottomColor = '#333')}
                style={{
                  background: 'transparent', border: 'none', borderBottom: '1px solid #333',
                  color: '#fff', fontSize: 24, fontWeight: 700, letterSpacing: 1,
                  width: '100%', marginBottom: 20, outline: 'none', paddingBottom: 6,
                  transition: 'border-color 0.15s',
                }}
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field label="Individualidade">
                  <input type="text" value={char.individualidadeName}
                    onChange={e => update('individualidadeName', e.target.value)}
                    placeholder="Ex: Assimilação Hazard"
                    aria-label="Nome da Individualidade"
                    {...focusGold}
                    style={fieldInputStyle} />
                </Field>
                <div>
                  <label htmlFor="field-archetype" style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 6, display: 'block' }}>Arquétipo</label>
                  <select id="field-archetype" value={char.archetype} onChange={e => update('archetype', e.target.value as Archetype)}
                    {...focusGold}
                    style={{ ...fieldInputStyle, cursor: 'pointer' }}>
                    {ARCHETYPES.map(a => <option key={a} style={{ background: '#111' }}>{a}</option>)}
                  </select>
                </div>
                <Field label="Ocupação">
                  <input type="text" value={char.occupation} onChange={e => update('occupation', e.target.value)}
                    placeholder="Ex: Químico"
                    aria-label="Ocupação"
                    {...focusGold}
                    style={fieldInputStyle} />
                </Field>
                <Field label="Rank de Herói">
                  <input type="text" value={char.heroRank} onChange={e => update('heroRank', e.target.value)}
                    placeholder="Ex: Herói - Cat. D"
                    aria-label="Rank de Herói"
                    {...focusGold}
                    style={fieldInputStyle} />
                </Field>
                <Field label="Conceito">
                  <input type="text" value={char.concept} onChange={e => update('concept', e.target.value)}
                    placeholder="Ex: Hacker ex-militar"
                    aria-label="Conceito do personagem"
                    {...focusGold}
                    style={fieldInputStyle} />
                </Field>
                <Field label="Nível">
                  <input type="number" min={0} max={30} value={char.level}
                    onChange={e => update('level', Math.min(30, Math.max(0, Number(e.target.value))))}
                    aria-label="Nível do personagem"
                    {...focusGold}
                    style={levelInputStyle} />
                </Field>
                <Field label="Idade">
                  <input type="number" min={0} value={char.age} onChange={e => update('age', Number(e.target.value))}
                    aria-label="Idade do personagem"
                    {...focusGold}
                    style={fieldInputStyle} />
                </Field>
                <Field label="P. de Progresso">
                  <input type="number" min={0} value={char.progressPoints} onChange={e => update('progressPoints', Number(e.target.value))}
                    aria-label="Pontos de Progresso"
                    {...focusGold}
                    style={fieldInputStyle} />
                </Field>
              </div>
            </div>

            {/* ATRIBUTOS */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid #1e1e1e' }}>
              <SectionLabel color="#333">Atributos</SectionLabel>
              <div className="grid grid-cols-6" style={{ gap: 10 }}>
                {(['FOR','AGI','INT','PRE','POD','VIG'] as const).map(attr => (
                  <AttributeInput key={attr} label={attr} value={char.attributes[attr]}
                    onChange={v => updateAttr(attr, v)} min={0} max={20} />
                ))}
              </div>
            </div>

            {/* STATUS */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid #1e1e1e' }}>
              <SectionLabel color="#c05050">Status de Combate</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
                {/* PV */}
                <div style={{ background: '#111', padding: 18, borderRadius: 6, borderTop: '2px solid #c05050', overflow: 'hidden' }}>
                  <div style={{ fontSize: 12, color: '#c05050', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 10, fontWeight: 700 }}>
                    Pontos de Vida
                  </div>
                  <div style={{ position: 'relative', background: '#1a1a1a', height: 6, borderRadius: 3, marginBottom: 14, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #6b1212, #c05050)', width: `${derived.maxHP > 0 ? Math.round((currentHP / derived.maxHP) * 100) : 0}%`, transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 42, fontWeight: 700, color: '#c05050', lineHeight: 1 }}>{currentHP}</span>
                    <span style={{ fontSize: 20, color: '#2a2a2a', fontWeight: 300, lineHeight: 1 }}>/</span>
                    <span style={{ fontSize: 22, color: '#666', fontWeight: 600, lineHeight: 1 }}>{derived.maxHP}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="number" min={0} value={pvDelta || ''} placeholder="1"
                      aria-label="Quantidade de PV"
                      onChange={e => setPvDelta(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
                      style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', color: '#ccc', fontSize: 15, width: 54, textAlign: 'center', padding: '7px 4px', outline: 'none', borderRadius: 3 }} />
                    <button type="button"
                      onClick={() => applyDamage(pvDelta)}
                      style={{ flex: 1, padding: '8px 0', background: '#200a0a', border: '1px solid #4a1010', color: '#d44040', fontSize: 12, letterSpacing: '1px', cursor: 'pointer', borderRadius: 3, textTransform: 'uppercase', fontWeight: 700 }}>
                      − Dano
                    </button>
                    <button type="button"
                      onClick={() => applyHeal(pvDelta)}
                      style={{ flex: 1, padding: '8px 0', background: '#0a1a0a', border: '1px solid #1a3a1a', color: '#3dc48e', fontSize: 12, letterSpacing: '1px', cursor: 'pointer', borderRadius: 3, textTransform: 'uppercase', fontWeight: 700 }}>
                      + Cura
                    </button>
                  </div>
                </div>
                  {/* ARMADURA */}
                  <div style={{ background: '#111', padding: 18, borderRadius: 6, borderTop: '2px solid #5a9e6a', overflow: 'hidden' }}>
                    <div style={{ fontSize: 12, color: '#5a9e6a', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12, fontWeight: 700 }}>
                      Armadura
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label htmlFor="armor-type-select" style={{ fontSize: 11, color: '#777', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: 6 }}>Tipo</label>
                      <select
                        id="armor-type-select"
                        value={armorType}
                        onChange={e => update('armorType', e.target.value)}
                        style={{ background: '#0d0d0d', border: '1px solid #2a3a2a', color: '#5a9e6a', fontSize: 11, padding: '5px 8px', outline: 'none', borderRadius: 3, width: '100%', cursor: 'pointer' }}
                      >
                        <option style={{ background: '#111' }}>Nenhuma</option>
                        <option style={{ background: '#111' }}>Elemental (T1)</option>
                        <option style={{ background: '#111' }}>Elemental (T2)</option>
                        <option style={{ background: '#111' }}>Elemental (T3)</option>
                        <option style={{ background: '#111' }}>Conc / Bal / Cort</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label htmlFor="armor-value-input" style={{ fontSize: 11, color: '#777', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: 6 }}>Redução de Dano</label>
                      <input
                        id="armor-value-input"
                        type="number" min={0} value={currentArmor}
                        onChange={e => update('currentArmor', Math.max(0, Number(e.target.value) || 0))}
                        onFocus={e => (e.currentTarget.style.borderBottomColor = '#5a9e6a')}
                        onBlur={e => (e.currentTarget.style.borderBottomColor = '#2a3a2a')}
                        style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #2a3a2a', color: '#5a9e6a', fontSize: 38, fontWeight: 700, lineHeight: 1, outline: 'none', width: '100%', marginBottom: 4, transition: 'border-color 0.15s' }}
                      />
                      <div style={{ fontSize: 11, color: '#555', letterSpacing: 1 }}>
                        pts de redução por ataque (mín. 0)
                      </div>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ background: '#1a1a1a', height: 4, borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ background: 'linear-gradient(90deg, #1a3a1a, #5a9e6a)', height: '100%', borderRadius: 2, width: `${Math.min(100, (currentArmor / 20) * 100)}%`, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input type="number" min={0} value={penetratingDelta || ''} placeholder="1"
                        aria-label="Quantidade de dano penetrante"
                        onChange={e => setPenetratingDelta(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
                        style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', color: '#ccc', fontSize: 13, width: 54, textAlign: 'center', padding: '7px 4px', outline: 'none', borderRadius: 3 }} />
                      <button type="button"
                        onClick={() => { applyDamagePenetrating(penetratingDelta); setPenetratingDelta(0) }}
                        style={{ flex: 1, padding: '8px 0', background: '#200a0a', border: '1px solid #4a1010', color: '#d44040', fontSize: 11, letterSpacing: '1px', cursor: 'pointer', borderRadius: 3, textTransform: 'uppercase', fontWeight: 700 }}>
                        − Penetrante
                      </button>
                    </div>
                  </div>

                {/* PH */}
                <div style={{ background: '#111', padding: 18, borderRadius: 6, borderTop: '2px solid #4a8fd4', overflow: 'hidden' }}>
                  <div style={{ fontSize: 12, color: '#4a8fd4', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 10, fontWeight: 700 }}>
                    Pontos Heróicos
                  </div>
                  <div style={{ position: 'relative', background: '#1a1a1a', height: 6, borderRadius: 3, marginBottom: 14, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #112444, #4a8fd4)', width: `${derived.maxPH > 0 ? Math.round((currentPH / derived.maxPH) * 100) : 0}%`, transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 42, fontWeight: 700, color: '#4a8fd4', lineHeight: 1 }}>{currentPH}</span>
                    <span style={{ fontSize: 20, color: '#2a2a2a', fontWeight: 300, lineHeight: 1 }}>/</span>
                    <span style={{ fontSize: 22, color: '#666', fontWeight: 600, lineHeight: 1 }}>{derived.maxPH}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="number" min={0} value={phDelta || ''} placeholder="1"
                      aria-label="Quantidade de PH"
                      onChange={e => setPhDelta(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
                      style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', color: '#ccc', fontSize: 15, width: 54, textAlign: 'center', padding: '7px 4px', outline: 'none', borderRadius: 3 }} />
                    <button type="button"
                      onClick={() => applyPHSpend(phDelta)}
                      style={{ flex: 1, padding: '8px 0', background: '#080d1a', border: '1px solid #111f3a', color: '#4a8fd4', fontSize: 12, letterSpacing: '1px', cursor: 'pointer', borderRadius: 3, textTransform: 'uppercase', fontWeight: 700 }}>
                      − Gastar
                    </button>
                    <button type="button"
                      onClick={() => applyPHRecover(phDelta)}
                      style={{ flex: 1, padding: '8px 0', background: '#0a1a0a', border: '1px solid #1a3a1a', color: '#3dc48e', fontSize: 12, letterSpacing: '1px', cursor: 'pointer', borderRadius: 3, textTransform: 'uppercase', fontWeight: 700 }}>
                      + Rec.
                    </button>
                  </div>
                </div>
              </div>

              {/* DANO / DESLOC / PERCEP */}
              <div className="grid grid-cols-3" style={{ gap: 20, marginTop: 20 }}>
                
                {/* Dano C.C. */}
                <div 
                  onClick={() => handleRollMelee(derived.meleeDamage)}
                  style={{ background: 'linear-gradient(135deg, #1f0a0a 0%, #111 100%)', border: '1px solid #3a1515', padding: '16px 20px', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}
                  className="group transition-all hover:border-[#d44040]"
                >
                  <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all text-[#d44040]">
                    <Dice6 size={80} />
                  </div>
                  <div style={{ fontSize: 11, color: '#d44040', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, zIndex: 1, fontWeight: 600 }}>
                    <Dice6 size={14} /> Dano C.C.
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1, zIndex: 1, fontFamily: 'Impact, Arial Black, sans-serif', letterSpacing: 1 }}>
                    {derived.meleeDamage}
                  </div>
                </div>

                {/* Deslocamento */}
                <div style={{ background: 'linear-gradient(135deg, #1f1c0a 0%, #111 100%)', border: '1px solid #3a3215', padding: '16px 20px', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                  <div style={{ fontSize: 11, color: '#e8a000', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8, zIndex: 1, fontWeight: 600 }}>
                    Deslocamento
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1, zIndex: 1, fontFamily: 'Impact, Arial Black, sans-serif', letterSpacing: 1 }}>
                    {derived.movement}m
                  </div>
                </div>

                {/* Percepção Passiva */}
                <div style={{ background: 'linear-gradient(135deg, #0a1f10 0%, #111 100%)', border: '1px solid #153a25', padding: '16px 20px', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                  <div style={{ fontSize: 11, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8, zIndex: 1, fontWeight: 600 }}>
                    Percep. Passiva
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1, zIndex: 1, fontFamily: 'Impact, Arial Black, sans-serif', letterSpacing: 1 }}>
                    {derived.passivePerception}
                  </div>
                </div>

              </div>

            </div>

            {/* PERÍCIAS */}
            <CollapsiblePanel icon="◎" title="Perícias" defaultOpen
              count={`${Object.values(char.skills).filter(v => v > 0).length} treinadas`}>
              <SkillList skills={char.skills} attributes={char.attributes}
                onChange={skills => update('skills', skills)} />
            </CollapsiblePanel>

            {/* TALENTOS */}
            <CollapsiblePanel icon="★" title="Talentos" count={`${char.talents.length} talentos`}>
              <TalentList talents={char.talents} onChange={talents => update('talents', talents)} />
            </CollapsiblePanel>

            {/* EQUIPAMENTOS */}
            <CollapsiblePanel icon="⚔" title="Equipamentos" count={`${char.equipment.length} itens`}>
              <EquipmentList equipment={char.equipment} onChange={equipment => update('equipment', equipment)} />
            </CollapsiblePanel>

            {/* INDIVIDUALIDADES */}
            <CollapsiblePanel icon="✦" title="Individualidades" defaultOpen>
              <IndividualidadeList
                abilities={char.individualidadeAbilities}
                onChange={abs => update('individualidadeAbilities', abs)}
                podValue={char.attributes.POD}
                currentPH={currentPH}
                onSpendPH={amount => applyPHSpend(amount)}
              />
            </CollapsiblePanel>

            {/* NOTAS */}
            <CollapsiblePanel icon="✎" title="Notas">
              <textarea value={char.notes} onChange={e => update('notes', e.target.value)}
                rows={4} placeholder="Backstory, anotações, outros..."
                className="w-full text-[13px] focus:outline-none resize-none"
                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #1e1e1e', padding: '8px 0', color: '#d8d8d8', width: '100%' }} />
            </CollapsiblePanel>
            </>}

            {/* ABA APARÊNCIA */}
            {activeTab === 'aparencia' && (
              <div>
                {/* Descrição Física */}
                <div style={{ borderBottom: '1px solid #2a2a2a' }}>
                  <div style={{ padding: '16px 28px', background: '#141414', borderLeft: '3px solid #e8a000', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, color: '#e8a000' }}>◉</span>
                    <span style={{ fontSize: 12, color: '#d8d8d8', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>Descrição Física</span>
                  </div>
                  <div style={{ padding: '16px 28px 24px', background: '#0f0f0f', borderLeft: '3px solid #e8a000' }}>
                    <textarea
                      value={char.appearance}
                      onChange={e => update('appearance', e.target.value)}
                      rows={5}
                      placeholder="Descreva a aparência do personagem: altura, compleição, traços marcantes, estilo de roupa..."
                      className="w-full focus:outline-none resize-none"
                      style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, color: '#d8d8d8', fontSize: 13, padding: '12px 14px', width: '100%', lineHeight: 1.6 }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#e8a000')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
                    />
                  </div>
                </div>

                {/* Concept Art */}
                <div style={{ borderBottom: '1px solid #2a2a2a' }}>
                  <div style={{ padding: '16px 28px', background: '#141414', borderLeft: '3px solid #e8a000', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#e8a000' }}>◈</span>
                      <span style={{ fontSize: 12, color: '#d8d8d8', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>Concept Art</span>
                      {char.conceptArt.length > 0 && (
                        <span style={{ fontSize: 10, color: '#555', background: '#1a1a1a', padding: '2px 8px', borderRadius: 3, border: '1px solid #2a2a2a' }}>{char.conceptArt.length} imagem{char.conceptArt.length !== 1 ? 'ns' : ''}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#888', fontSize: 10, textTransform: 'uppercase', letterSpacing: '2px', padding: '5px 12px', cursor: 'pointer', borderRadius: 3 }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#e8a000'; e.currentTarget.style.color = '#e8a000' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888' }}>
                      + Adicionar
                    </button>
                  </div>
                  <div style={{ padding: '16px 28px 24px', background: '#0f0f0f', borderLeft: '3px solid #e8a000' }}>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageUpload} />
                    {char.conceptArt.length === 0 ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{ border: '1px dashed #2a2a2a', borderRadius: 4, padding: '32px 20px', textAlign: 'center', color: '#444', fontSize: 12, cursor: 'pointer', letterSpacing: '1px' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#555')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}>
                        Clique para adicionar imagens de concept art
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                        {char.conceptArt.map((src, idx) => (
                          <div key={idx} style={{ position: 'relative', background: '#111', borderRadius: 4, overflow: 'hidden', border: '1px solid #2a2a2a', aspectRatio: '3/4' }}>
                            <img src={src} alt={`Concept art ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.75)', border: '1px solid #3a1515', color: '#d44040', width: 24, height: 24, borderRadius: 3, cursor: 'pointer', fontSize: 12, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#200a0a')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.75)')}>
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ABA PERSONALIDADE */}
            {activeTab === 'personalidade' && (
              <div>
                {([
                  { field: 'traits' as const, icon: '◆', label: 'Traços de Personalidade', placeholder: 'Como o personagem age, se comporta, suas manias e hábitos...' },
                  { field: 'motivations' as const, icon: '◇', label: 'Motivações', placeholder: 'O que move o personagem, seus objetivos e ambições...' },
                  { field: 'fears' as const, icon: '◈', label: 'Medos / Fraquezas', placeholder: 'O que o personagem teme, seus pontos cegos e vulnerabilidades...' },
                ]).map(({ field, icon, label, placeholder }) => (
                  <div key={field} style={{ borderBottom: '1px solid #2a2a2a' }}>
                    <div style={{ padding: '16px 28px', background: '#141414', borderLeft: '3px solid #e8a000', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#e8a000' }}>{icon}</span>
                      <span style={{ fontSize: 12, color: '#d8d8d8', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>{label}</span>
                    </div>
                    <div style={{ padding: '16px 28px 24px', background: '#0f0f0f', borderLeft: '3px solid #e8a000' }}>
                      <textarea
                        value={char.personality[field]}
                        onChange={e => updatePersonality(field, e.target.value)}
                        rows={4}
                        placeholder={placeholder}
                        className="w-full focus:outline-none resize-none"
                        style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, color: '#d8d8d8', fontSize: 13, padding: '12px 14px', width: '100%', lineHeight: 1.6 }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e8a000')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="xl:sticky xl:top-0 xl:self-start" style={{ background: '#0a0a0a', borderLeft: '1px solid #1e1e1e' }}>
            <DerivedPanel stats={derived} />
            <div className="p-3.5">
              <button type="button" onClick={save}
                className="w-full font-impact text-[14px] tracking-[3px] uppercase clip-btn-right transition-colors"
                style={{ background: saved ? '#22c55e' : '#e8a000', color: '#000', padding: '13px', border: 'none' }}>
                {saved ? '✓ Salvo!' : '✦ Salvar Ficha'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE ROLAGEM */}
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
    </Layout>
  )
}



import { useState } from 'react'
import { X, Calculator, Zap } from 'lucide-react'

interface Props {
  onClose: () => void
  podValue?: number
  initialName?: string
  onSave?: (data: { name: string, notes: string, damage: string, range: string, phCost: string, dt: string, description: string, builderState: any }) => void
  initialState?: any
}

type Rarity = 'Comum' | 'Rara' | 'Épica'
const RARITY_COLOR: Record<Rarity, string> = {
  Comum: '#aaaaaa',
  Rara: '#4a8fd4',
  Épica: '#a855f7',
}

const ARCHETYPES = [
  { name: 'Corpóreo',                     mult: 0.5, rarity: 'Comum' as Rarity },
  { name: 'Emissor',                       mult: 0.6, rarity: 'Comum' as Rarity },
  { name: 'Manipulação',                   mult: 0.7, rarity: 'Comum' as Rarity },
  { name: 'Conjuração / Materialização',   mult: 1.0, rarity: 'Comum' as Rarity },
  { name: 'Metamorfo',                     mult: 0.6, rarity: 'Rara'  as Rarity },
  { name: 'Imissor',                       mult: 0.6, rarity: 'Rara'  as Rarity },
  { name: 'Mentalista',                    mult: 0.8, rarity: 'Rara'  as Rarity },
  { name: 'Quântico',                      mult: 1.0, rarity: 'Épica' as Rarity },
  { name: 'Spectros / Shikigami',          mult: 1.0, rarity: 'Épica' as Rarity },
]

const ELEMENT_TYPES = [
  { label: 'Nenhum / Básico', sg: 0, esq: 0, bloq: 0 },
  { label: '[T1] Concussivo', sg: 0, esq: 0, bloq: 0 },
  { label: '[T1] Cortante', sg: 3, esq: 5, bloq: 3 },
  { label: '[T1] Esmagamento', sg: 5, esq: 3, bloq: 8 },
  { label: '[T1] Asfixiante', sg: 13, esq: 10, bloq: 35 },
  { label: '[T2] Balístico', sg: 0, esq: 35, bloq: 20 },
  { label: '[T2] Perfurante', sg: 3, esq: 10, bloq: 5 },
  { label: '[T2] Corrosivo', sg: 13, esq: 8, bloq: 45 },
  { label: '[T2] Congelante', sg: 13, esq: 15, bloq: 10 },
  { label: '[T2] Gás Sonífico', sg: 18, esq: 15, bloq: 'N/A' },
  { label: '[T3] Desestabilizador', sg: 15, esq: 10, bloq: 25 },
  { label: '[T3] Flamejante', sg: 15, esq: 18, bloq: 40 },
  { label: '[T3] Sônico', sg: 15, esq: 45, bloq: 50 },
  { label: '[T3] Venenoso', sg: 18, esq: 20, bloq: 'N/A' },
  { label: '[T3] Elétrico', sg: 18, esq: 40, bloq: 48 },
  { label: '[T3] Sísmico', sg: 20, esq: 10, bloq: 45 },
  { label: '[T3] Explosivo', sg: 20, esq: 25, bloq: 35 },
  { label: '[T3] Luz', sg: 20, esq: 50, bloq: 25 },
  { label: '[T3] Gás Mostarda', sg: 23, esq: 10, bloq: 'N/A' },
  { label: '[T4] Magmático', sg: 23, esq: 15, bloq: 50 },
  { label: '[T4] Gás Sarin', sg: 23, esq: 20, bloq: 55 },
  { label: '[T4] Estelar', sg: 23, esq: 25, bloq: 50 },
  { label: '[T4] Necrótico', sg: 25, esq: 15, bloq: 30 },
  { label: '[T4] Radiativo', sg: 25, esq: 45, bloq: 50 },
  { label: '[T5] Gravitacional', sg: 25, esq: 35, bloq: 45 },
  { label: '[T5] Psiônico', sg: 25, esq: 40, bloq: 'N/A' },
  { label: '[T5] Cósmico', sg: 30, esq: 50, bloq: 50 },
]

const ACTIONS = [
  { name: 'Principal / Preparada', mult: 1.0 },
  { name: 'Movimento', mult: 1.2 },
  { name: 'Bônus', mult: 1.4 },
  { name: 'Reação', mult: 1.6 },
]

const RANGES = [
  { label: 'Nenhum / Toque', cost: 0 },
  { label: '3m', cost: -1 },
  { label: '4.5m', cost: 0 },
  { label: '9m', cost: 1 },
  { label: '18m', cost: 2 },
  { label: '27m', cost: 4 },
  { label: '36m', cost: 8 },
  { label: '54m', cost: 16 },
  { label: '72m', cost: 24 },
  { label: '108m', cost: 32 },
  { label: '216m', cost: 46 },
  { label: '540m', cost: 102 },
  { label: '1080m', cost: 204 },
  { label: '2160m', cost: 306 },
  { label: '5400m', cost: 408 },
  { label: '10800m', cost: 816 },
]

const AREAS = [
  { label: 'Nenhum (Alvo Único)', userCost: 0, extCost: 0 },
  { label: 'Ponto Fixo', userCost: 0, extCost: 6 },
  { label: 'Linha Reta', userCost: 0, extCost: 8 },
  { label: 'Cone a Frente', userCost: 5, extCost: 12 },
  { label: 'Circular', userCost: 10, extCost: 16 },
]

const STATUS_GRAVITY = [
  { label: 'Sem Efeito', fixo: 0, mult: 0 },
  { label: '⚠️ Leve (1x)', fixo: 3, mult: 1 },
  { label: '☢️ Moderado (2x)', fixo: 6, mult: 2 },
  { label: '💀 Grave (3x)', fixo: 12, mult: 3 },
  { label: '☠️ Fatal (5x)', fixo: 36, mult: 5 },
]

const DURATIONS = [
  { label: 'Instantâneo', base: 0 },
  { label: '2 Turnos', base: 4 },
  { label: '4 Turnos', base: 6 },
  { label: '6 Turnos', base: 10 },
  { label: '8 Turnos', base: 16 },
  { label: '10 Turnos', base: 24 },
  { label: '12 Turnos', base: 34 },
]

const DICE_TYPES = [
  { label: 'Nenhum', bonus: 0, healBonus: 0 },
  { label: 'd4', bonus: 0, healBonus: 2 },
  { label: 'd6', bonus: 1, healBonus: 4 },
  { label: 'd8', bonus: 2, healBonus: 6 },
  { label: 'd10', bonus: 3, healBonus: 8 },
  { label: 'd12', bonus: 4, healBonus: 10 },
]

const MOVEMENT_TYPES = [
  { label: 'Nenhum', costPer3m: 0 },
  { label: 'Distância', costPer3m: 1 },
  { label: 'Pular', costPer3m: 2 },
  { label: 'Nadar', costPer3m: 2 },
  { label: 'Voar', costPer3m: 3 },
  { label: 'Teleportar', costPer3m: 5 },
]

const INFO_TYPES = [
  { label: 'Nenhum', cost: 0 },
  { label: 'Imprecisas + Atrasadas', cost: 4 },
  { label: 'Imprecisas + Tempo Real', cost: 8 },
  { label: 'Precisas + Tempo Real', cost: 12 },
  { label: 'Extremamente Precisas', cost: 16 },
]

function ArchetypeSelect({ value, onChange }: { value: number; onChange: (i: number) => void }) {
  const [open, setOpen] = useState(false)
  const current = ARCHETYPES[value]
  const color = RARITY_COLOR[current.rarity]
  return (
    <div style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: '#0d0d0d', border: '1px solid #2a2a2a', borderLeft: `3px solid ${color}`,
          padding: '6px 10px', cursor: 'pointer', borderRadius: 2,
        }}>
        <span style={{ fontSize: 11, color }}>{current.name}</span>
        <span style={{ fontSize: 9, color: '#555' }}>×{current.mult} · {current.rarity} ▾</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: 2, overflow: 'hidden' }}>
          {ARCHETYPES.map((opt, i) => {
            const c = RARITY_COLOR[opt.rarity]
            return (
              <button key={i} type="button"
                onClick={() => { onChange(i); setOpen(false) }}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 10px', background: i === value ? '#151515' : 'transparent',
                  border: 'none', borderLeft: `3px solid ${c}`, cursor: 'pointer',
                  borderBottom: '1px solid #111',
                }}>
                <span style={{ fontSize: 11, color: c }}>{opt.name}</span>
                <span style={{ fontSize: 9, color: '#555' }}>×{opt.mult} · {opt.rarity}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

type TabKey = 'base' | 'alcance' | 'utilidade'

export default function TechniqueBuilderModal({ onClose, onSave, podValue = 0, initialName = '', initialState }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('base')
  const [techName, setTechName] = useState(initialState?.techName || initialName)
  const [archetypeIdx, setArchetypeIdx] = useState(initialState?.archetypeIdx || 0)
  const [actionIdx, setActionIdx] = useState(initialState?.actionIdx || 0)
  const [elementIdx, setElementIdx] = useState(initialState?.elementIdx || 0)
  const [baseCD, setBaseCD] = useState(initialState?.baseCD ?? podValue)

  const [isHeal, setIsHeal] = useState(initialState?.isHeal || false)
  const [diceTypeIdx, setDiceTypeIdx] = useState(initialState?.diceTypeIdx || 0)
  const [diceQtd, setDiceQtd] = useState(initialState?.diceQtd || 1)

  const [rangeIdx, setRangeIdx] = useState(initialState?.rangeIdx || 2)
  const [areaIdx, setAreaIdx] = useState(initialState?.areaIdx || 0)
  const [areaSize, setAreaSize] = useState(initialState?.areaSize || '')
  const [isCatalystExt, setIsCatalystExt] = useState(initialState?.isCatalystExt || false)

  const [statusIdx, setStatusIdx] = useState(initialState?.statusIdx || 0)
  const [durationIdx, setDurationIdx] = useState(initialState?.durationIdx || 0)

  const [moveTypeIdx, setMoveTypeIdx] = useState(initialState?.moveTypeIdx || 0)
  const [moveMeters, setMoveMeters] = useState(initialState?.moveMeters || 3)

  const [infoTypeIdx, setInfoTypeIdx] = useState(initialState?.infoTypeIdx || 0)

  const [customLimits, setCustomLimits] = useState(initialState?.customLimits || 0)
  const [customBuffs, setCustomBuffs] = useState(initialState?.customBuffs || 0)

  const [techDescription, setTechDescription] = useState(initialState?.techDescription || '')

  // ─── Costs ───
  const calcDamageCost = () => {
    if (diceTypeIdx === 0 || diceQtd < 1) return 0
    if (isHeal) return ((diceQtd - 1) * 8) + DICE_TYPES[diceTypeIdx].healBonus
    return ((diceQtd - 1) * 4) + DICE_TYPES[diceTypeIdx].bonus
  }
  const damageCost = calcDamageCost()
  const rangeCost = rangeIdx === 0 ? 0 : RANGES[rangeIdx].cost
  const areaCost = areaIdx === 0 ? 0 : (isCatalystExt ? AREAS[areaIdx].extCost : AREAS[areaIdx].userCost)
  const statusFixo = STATUS_GRAVITY[statusIdx].fixo
  const durationBase = DURATIONS[durationIdx].base
  const statusTotalCost = statusIdx === 0 ? 0 : statusFixo + durationBase
  const movementBlocks = Math.floor(moveMeters / 3)
  const moveCost = moveTypeIdx === 0 ? 0 : movementBlocks * MOVEMENT_TYPES[moveTypeIdx].costPer3m
  const infoCost = INFO_TYPES[infoTypeIdx].cost

  const baseTotal = damageCost + rangeCost + areaCost + statusTotalCost + moveCost + infoCost + customBuffs - Math.abs(customLimits)
  const archMult = ARCHETYPES[archetypeIdx].mult
  const actionMult = ACTIONS[actionIdx].mult
  const finalCost = Math.ceil(Math.max(0, baseTotal * archMult * actionMult))
  const statusModPOD = STATUS_GRAVITY[statusIdx].mult * podValue

  // ─── Styles ───
  const inputStyle: React.CSSProperties = {
    background: '#0d0d0d', color: '#e8a000', border: '1px solid #2a2a2a',
    fontSize: 11, padding: '6px 8px', outline: 'none', width: '100%', borderRadius: 2,
  }
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' }

  const SectionTitle = ({ title, color = '#555' }: { title: string; color?: string }) => (
    <div style={{
      fontSize: 9, textTransform: 'uppercase', letterSpacing: '3px',
      color, fontWeight: 700, marginBottom: 8, marginTop: 16,
      borderBottom: `1px solid #1e1e1e`, paddingBottom: 6,
    }}>
      {title}
    </div>
  )

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 }}>
      <span style={{ fontSize: 11, color: '#888', flex: 1 }}>{label}</span>
      <div style={{ minWidth: 160 }}>{children}</div>
    </div>
  )

  const CostBadge = ({ value, color = '#e8a000' }: { value: number | string; color?: string }) => (
    <span style={{ fontFamily: 'monospace', fontSize: 12, color, fontWeight: 700 }}>{value}</span>
  )

  const TABS: { key: TabKey; label: string; color: string }[] = [
    { key: 'base', label: 'Dano / Status', color: '#d44040' },
    { key: 'alcance', label: 'Alcance / Área', color: '#e8a000' },
    { key: 'utilidade', label: 'Utilidade & Suporte', color: '#3dc48e' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.9)' }} onClick={onClose}>
      <div style={{
        background: '#090909', border: '1px solid #2a2a2a',
        width: '100%', maxWidth: 1100, display: 'flex',
        maxHeight: '92vh', overflow: 'hidden', borderRadius: 2,
      }} onClick={e => e.stopPropagation()}>

        {/* Barra lateral de cor */}
        <div style={{ width: 3, background: 'linear-gradient(180deg, #4a8fd4 0%, #e8a000 50%, #d44040 100%)', flexShrink: 0 }} />

        {/* Painel principal */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', borderRight: '1px solid #1e1e1e' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <Calculator size={15} style={{ color: '#4a8fd4' }} />
            <span style={{ fontFamily: 'Impact, Arial Black', fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', color: '#4a8fd4' }}>
              Criador de Técnica / Individualidade
            </span>
          </div>
          <div style={{ fontSize: 10, color: '#444', marginBottom: 16, letterSpacing: 1 }}>
            Custo calculado conforme regras mecânicas do Sistema H.I.K. v2.0
          </div>

          {/* Nome */}
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Nome da Técnica..."
              value={techName}
              onChange={e => setTechName(e.target.value)}
              style={{
                background: 'transparent', border: 'none', borderBottom: '1px solid #333',
                color: '#fff', fontSize: 18, fontWeight: 700, letterSpacing: 1,
                width: '100%', outline: 'none', paddingBottom: 6,
              }}
            />
          </div>

          {/* Base sempre visível */}
          <div className="grid grid-cols-2 gap-6" style={{ marginBottom: 16 }}>
            <div>
              <SectionTitle title="Derivação / Arquétipo" color="#4a8fd4" />
              <ArchetypeSelect value={archetypeIdx} onChange={setArchetypeIdx} />
            </div>
            <div>
              <SectionTitle title="Tipo de Ação" color="#4a8fd4" />
              <select value={actionIdx} onChange={e => setActionIdx(Number(e.target.value))} style={selectStyle}>
                {ACTIONS.map((opt, i) => <option key={i} value={i} style={{ background: '#111' }}>{opt.name} ×{opt.mult}</option>)}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 2, marginBottom: 16, borderBottom: '1px solid #1e1e1e' }}>
            {TABS.map(tab => (
              <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
                style={{
                  background: activeTab === tab.key ? '#111' : 'transparent',
                  border: 'none', borderBottom: activeTab === tab.key ? `2px solid ${tab.color}` : '2px solid transparent',
                  color: activeTab === tab.key ? tab.color : '#555',
                  fontSize: 10, textTransform: 'uppercase', letterSpacing: '2px',
                  padding: '8px 14px', cursor: 'pointer', marginBottom: -1,
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab: Dano / Status ── */}
          {activeTab === 'base' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <SectionTitle title="Elemento / Natureza" color="#a855f7" />
                <select value={elementIdx} onChange={e => setElementIdx(Number(e.target.value))} style={selectStyle}>
                  {ELEMENT_TYPES.map((opt, i) => <option key={i} value={i} style={{ background: '#111' }}>{opt.label}</option>)}
                </select>

                {elementIdx !== 0 && (
                  <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', borderLeft: '2px solid #4a8fd4', padding: '10px 12px', marginTop: 10, borderRadius: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 10, color: '#666' }}>CD Base (mod. POD):</span>
                      <input type="number" value={baseCD} onChange={e => setBaseCD(Number(e.target.value))}
                        style={{ background: '#000', color: '#e8a000', border: '1px solid #222', width: 52, textAlign: 'center', padding: '3px 6px', outline: 'none', fontSize: 12, borderRadius: 2 }} />
                    </div>
                    {[
                      { label: 'Salva-Guarda', val: ELEMENT_TYPES[elementIdx].sg },
                      { label: 'Esquiva', val: ELEMENT_TYPES[elementIdx].esq },
                      { label: 'Bloqueio', val: ELEMENT_TYPES[elementIdx].bloq },
                    ].map(({ label, val }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 3 }}>
                        <span style={{ color: '#666' }}>DT {label}:</span>
                        <span style={{ color: '#a8ccee', fontFamily: 'monospace' }}>
                          {String(val) === 'N/A' ? 'N/A' : `CD ${baseCD > 0 ? baseCD + Number(val) : val}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <SectionTitle title="Dados de Dano / Cura" color="#d44040" />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 11, color: '#888', marginBottom: 10 }}>
                  <input type="checkbox" checked={isHeal} onChange={e => setIsHeal(e.target.checked)}
                    style={{ accentColor: '#3dc48e', width: 14, height: 14 }} />
                  <span style={{ color: isHeal ? '#3dc48e' : '#888' }}>
                    {isHeal ? '✦ Modo Cura ativo' : 'Modo de Cura (custo diferenciado)'}
                  </span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="number" min={1} value={diceQtd} onChange={e => setDiceQtd(Number(e.target.value))}
                    disabled={diceTypeIdx === 0}
                    style={{ ...inputStyle, width: 52, textAlign: 'center', opacity: diceTypeIdx === 0 ? 0.4 : 1 }} />
                  <span style={{ fontSize: 11, color: '#444' }}>d</span>
                  <select value={diceTypeIdx} onChange={e => setDiceTypeIdx(Number(e.target.value))} style={{ ...selectStyle, width: 70 }}>
                    {DICE_TYPES.map((opt, i) => <option key={i} value={i} style={{ background: '#111' }}>{opt.label.replace('d', '') || '—'}</option>)}
                  </select>
                </div>
                {diceTypeIdx !== 0 && (
                  <div style={{ fontSize: 10, color: '#555', marginTop: 4, fontFamily: 'monospace' }}>
                    {diceQtd}{DICE_TYPES[diceTypeIdx].label}{statusModPOD > 0 ? ` + ${statusModPOD} (Status×modPOD)` : ''} · +{damageCost} P.I.
                  </div>
                )}
              </div>

              <div>
                <SectionTitle title="Condição de Status" color="#a855f7" />
                <Row label="Gravidade">
                  <select value={statusIdx} onChange={e => setStatusIdx(Number(e.target.value))} style={selectStyle}>
                    {STATUS_GRAVITY.map((opt, i) => <option key={i} value={i} style={{ background: '#111' }}>{opt.label}</option>)}
                  </select>
                </Row>
                {statusIdx !== 0 && (
                  <Row label="Duração Máxima">
                    <select value={durationIdx} onChange={e => setDurationIdx(Number(e.target.value))} style={selectStyle}>
                      {DURATIONS.map((opt, i) => <option key={i} value={i} style={{ background: '#111' }}>{opt.label}</option>)}
                    </select>
                  </Row>
                )}

                <SectionTitle title="Adicionais & Limitações" color="#888" />
                <Row label="Bônus Manuais (+P.I.)">
                  <input type="number" value={customBuffs || ''} placeholder="0"
                    onChange={e => setCustomBuffs(Number(e.target.value) || 0)}
                    style={{ ...inputStyle, color: '#4a8fd4', textAlign: 'center' }} />
                </Row>
                <Row label="Limitações (−P.I.)">
                  <input type="number" value={customLimits || ''} placeholder="0"
                    onChange={e => setCustomLimits(Number(e.target.value) || 0)}
                    style={{ ...inputStyle, color: '#d44040', textAlign: 'center' }} />
                </Row>

                <SectionTitle title="Descrição" color="#888" />
                <textarea
                  value={techDescription}
                  onChange={e => setTechDescription(e.target.value)}
                  rows={4}
                  placeholder="Efeito visual, narrativa e comportamento..."
                  style={{
                    background: '#0d0d0d', border: '1px solid #1e1e1e', color: '#ccc',
                    fontSize: 11, width: '100%', outline: 'none', resize: 'vertical',
                    padding: '8px 10px', borderRadius: 2, lineHeight: 1.6, fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
          )}

          {/* ── Tab: Alcance / Área ── */}
          {activeTab === 'alcance' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <SectionTitle title="Alcance do Ataque" color="#e8a000" />
                <select value={rangeIdx} onChange={e => setRangeIdx(Number(e.target.value))} style={selectStyle}>
                  {RANGES.map((opt, i) => <option key={i} value={i} style={{ background: '#111' }}>{opt.label}</option>)}
                </select>

                <SectionTitle title="Formato de Ataque" color="#e8a000" />
                <select value={areaIdx} onChange={e => setAreaIdx(Number(e.target.value))} style={{ ...selectStyle, marginBottom: 10 }}>
                  {AREAS.map((opt, i) => <option key={i} value={i} style={{ background: '#111' }}>{opt.label}</option>)}
                </select>

                <SectionTitle title="Tamanho da Área" color="#e8a000" />
                <input type="text" value={areaSize} onChange={e => setAreaSize(e.target.value)}
                  placeholder="Ex: 5m raio, 3×3, cone 9m..."
                  style={{ ...inputStyle, color: '#ccc', marginBottom: 10 }} />

                {areaIdx !== 0 && (
                  <div>
                    <div style={{ fontSize: 10, color: '#555', marginBottom: 6 }}>Origem do Catalisador:</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button type="button" onClick={() => setIsCatalystExt(false)}
                        style={{ fontSize: 9, padding: '5px 14px', textTransform: 'uppercase', letterSpacing: 1, borderRadius: 2, border: 'none', cursor: 'pointer', background: !isCatalystExt ? '#22c55e' : '#111', color: !isCatalystExt ? '#000' : '#555' }}>
                        Usuário
                      </button>
                      <button type="button" onClick={() => setIsCatalystExt(true)}
                        style={{ fontSize: 9, padding: '5px 14px', textTransform: 'uppercase', letterSpacing: 1, borderRadius: 2, border: 'none', cursor: 'pointer', background: isCatalystExt ? '#d44040' : '#111', color: isCatalystExt ? '#fff' : '#555' }}>
                        Externo
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ── Tab: Utilidade & Suporte ── */}
          {activeTab === 'utilidade' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                

                  <SectionTitle title="Locomoção" color="#3dc48e" />
                <Row label="Tipo de Movimento">
                  <select value={moveTypeIdx} onChange={e => setMoveTypeIdx(Number(e.target.value))} style={selectStyle}>
                    {MOVEMENT_TYPES.map((opt, i) => <option key={i} value={i} style={{ background: '#111' }}>{opt.label}</option>)}
                  </select>
                </Row>
                {moveTypeIdx !== 0 && (
                  <Row label="Distância (Metros)">
                    <input type="number" min={3} step={3} value={moveMeters} onChange={e => setMoveMeters(Number(e.target.value))}
                      style={{ ...inputStyle, textAlign: 'center' }} />
                  </Row>
                )}

                  <SectionTitle title="Habilidades Informativas" color="#3dc48e" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {INFO_TYPES.map((opt, i) => (
                    <button key={i} type="button" onClick={() => setInfoTypeIdx(i)}
                      style={{
                        textAlign: 'left', padding: '9px 12px', border: '1px solid',
                        borderColor: infoTypeIdx === i ? '#3dc48e' : '#1e1e1e',
                        background: infoTypeIdx === i ? '#0a1f14' : 'transparent',
                        color: infoTypeIdx === i ? '#3dc48e' : '#555',
                        borderRadius: 2, cursor: 'pointer', fontSize: 11,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                      <span>{opt.label}</span>
                      {opt.cost > 0 && <span style={{ fontFamily: 'monospace', color: '#3dc48e' }}>+{opt.cost} P.I.</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                

                <SectionTitle title="Criação de Itens" color="#a855f7" />
                <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', borderLeft: '2px solid #a855f7', borderRadius: 2, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, color: '#888', lineHeight: 1.8, marginBottom: 12 }}>
                    <strong style={{ color: '#a855f7' }}>Fórmula:</strong><br />
                    Escala de Tamanho<br />
                    + Dano do Item<br />
                    + ∑ Condição de Status<br />
                    + ∑ [PV do Item ÷ 3]<br />
                    + <strong style={{ color: '#e8a000' }}>4 P.I. (base)</strong>
                  </div>
                  <div style={{ background: '#111', border: '1px solid #2a1a2a', borderRadius: 2, padding: '10px 12px' }}>
                    <div style={{ fontSize: 9, color: '#a855f7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>⚠ Atenção</div>
                    <div style={{ fontSize: 10, color: '#666', lineHeight: 1.6 }}>
                      Criação de itens requer alinhamento com o <strong style={{ color: '#a855f7' }}>Guia</strong>. Use as abas <em>Dano / Status</em> e <em>Alcance / Área</em> para calcular os componentes e depois discuta o resultado.
                    </div>
                  </div>
                </div>

                <SectionTitle title="Sobre o Sistema" color="#444" />
                <div style={{ fontSize: 10, color: '#3a3a3a', lineHeight: 1.8 }}>
                  As Utilidades são habilidades que fornecem informação ou criam objetos. Seu custo em P.I. é somado normalmente ao multiplicador de arquétipo e ação.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Painel Direito: Log de custos ── */}
        <div style={{ width: 290, background: '#050505', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'relative' }}>
          <button onClick={onClose}
            style={{ position: 'absolute', top: 14, right: 14, background: 'transparent', border: 'none', color: '#444', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#d44040')}
            onMouseLeave={e => (e.currentTarget.style.color = '#444')}>
            <X size={16} />
          </button>

          <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid #111' }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '3px', color: '#444', marginBottom: 2 }}>Log de Custos</div>
            <div style={{ fontSize: 10, color: '#333' }}>P.I. = Pontos de Índice</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
            {[
              { label: `${isHeal ? 'Cura' : 'Dano'} (${diceTypeIdx !== 0 ? `${diceQtd}${DICE_TYPES[diceTypeIdx].label}` : 'Nenhum'})`, value: damageCost, color: '#d44040' },
              { label: `Alcance (${RANGES[rangeIdx].label})`, value: rangeCost, color: '#e8a000' },
              { label: `Área (${AREAS[areaIdx].label})`, value: areaCost, color: '#e8a000' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '6px 0', borderBottom: '1px solid #0e0e0e' }}>
                <span style={{ fontSize: 11, color: '#555' }}>{label}</span>
                <CostBadge value={value > 0 ? `+${value}` : String(value)} color={value !== 0 ? color : '#333'} />
              </div>
            ))}

            {statusTotalCost > 0 && (
              <div style={{ marginBottom: 8, padding: '6px 0', borderBottom: '1px solid #0e0e0e' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#555' }}>Status ({STATUS_GRAVITY[statusIdx].label})</span>
                  <CostBadge value={`+${statusTotalCost}`} color="#a855f7" />
                </div>
                <div style={{ fontSize: 9, color: '#333', marginTop: 3, fontFamily: 'monospace' }}>
                  Fixo {statusFixo} + Dur. {durationBase} ({DURATIONS[durationIdx].label})
                </div>
              </div>
            )}

            {moveCost > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '6px 0', borderBottom: '1px solid #0e0e0e' }}>
                <span style={{ fontSize: 11, color: '#555' }}>Locomoção ({moveMeters}m)</span>
                <CostBadge value={`+${moveCost}`} color="#3dc48e" />
              </div>
            )}

            {infoCost > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '6px 0', borderBottom: '1px solid #0e0e0e' }}>
                <span style={{ fontSize: 11, color: '#555' }}>Info ({INFO_TYPES[infoTypeIdx].label})</span>
                <CostBadge value={`+${infoCost}`} color="#3dc48e" />
              </div>
            )}

            {customBuffs !== 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '6px 0', borderBottom: '1px solid #0e0e0e' }}>
                <span style={{ fontSize: 11, color: '#4a8fd4' }}>Adicionais</span>
                <CostBadge value={`+${customBuffs}`} color="#4a8fd4" />
              </div>
            )}

            {customLimits !== 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '6px 0', borderBottom: '1px solid #0e0e0e' }}>
                <span style={{ fontSize: 11, color: '#d44040' }}>Limitações</span>
                <CostBadge value={`-${Math.abs(customLimits)}`} color="#d44040" />
              </div>
            )}
          </div>

          {/* Rodapé */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #111' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
              <span style={{ color: '#555' }}>Subtotal Bruto</span>
              <span style={{ color: '#888', fontFamily: 'monospace' }}>{baseTotal} P.I.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 3 }}>
              <span style={{ color: '#444' }}>× Ação ({ACTIONS[actionIdx].name})</span>
              <span style={{ color: '#e8a000', fontFamily: 'monospace' }}>×{actionMult.toFixed(1)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 12 }}>
              <span style={{ color: RARITY_COLOR[ARCHETYPES[archetypeIdx].rarity] }}>{ARCHETYPES[archetypeIdx].name.split('/')[0].trim()} [{ARCHETYPES[archetypeIdx].rarity}]</span>
              <span style={{ color: '#4a8fd4', fontFamily: 'monospace' }}>×{archMult.toFixed(1)}</span>
            </div>

            <div style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: 2, padding: '14px 16px', textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '3px', color: '#444', marginBottom: 4 }}>Custo Final</div>
              <div style={{ fontFamily: 'Impact, Arial Black', fontSize: 42, color: '#e8a000', lineHeight: 1, letterSpacing: 1 }}>
                {finalCost}
                <span style={{ fontSize: 16, color: '#888', marginLeft: 4 }}>P.I.</span>
              </div>
            </div>

            {onSave && (
              <button
                type="button"
                onClick={() => {
                  if (!techName.trim()) { alert('Dê um nome à técnica!'); return }
                  const calcDanoBase = diceQtd > 0 && diceTypeIdx > 0
                    ? `${diceQtd}${DICE_TYPES[diceTypeIdx].label}` : '—'
                  const podMult = STATUS_GRAVITY[statusIdx].mult;
                    const podStr = podMult > 0 ? (podMult === 1 ? 'POD' : podMult + 'xPOD') : '';
                    const calcDano = podStr && calcDanoBase !== '—' ? `${calcDanoBase} + ${podStr}` : calcDanoBase;
                  let calcRange = rangeCost !== 0 ? RANGES[rangeIdx].label : 'Corpo-a-Corpo'
                  if (areaIdx !== 0) calcRange += ` / ${AREAS[areaIdx].label}${areaSize ? ` (${areaSize})` : ''}`
                  const calcDT = `CD ${baseCD > 0 ? baseCD + Number(ELEMENT_TYPES[elementIdx].sg) : ELEMENT_TYPES[elementIdx].sg} (${ELEMENT_TYPES[elementIdx].label})`
                  const notesLines = [
                    `Custo Total: ${finalCost} P.I.`,
                    `Arquétipo: ${ARCHETYPES[archetypeIdx].name} (×${archMult})`,
                    `Ação: ${ACTIONS[actionIdx].name} (×${actionMult})`,
                    damageCost > 0 ? `${isHeal ? 'Cura' : 'Dano'}: ${calcDano} = +${damageCost} P.I.` : null,
                    rangeCost !== 0 ? `Alcance ${RANGES[rangeIdx].label}: ${rangeCost > 0 ? '+' : ''}${rangeCost} P.I.` : null,
                    areaCost > 0 ? `Área ${AREAS[areaIdx].label}${areaSize ? ` (${areaSize})` : ''}: +${areaCost} P.I.` : null,
                    statusTotalCost > 0 ? `Status ${STATUS_GRAVITY[statusIdx].label}: +${statusTotalCost} P.I.` : null,
                    moveCost > 0 ? `Locomoção ${moveMeters}m: +${moveCost} P.I.` : null,
                    infoCost > 0 ? `Informação (${INFO_TYPES[infoTypeIdx].label}): +${infoCost} P.I.` : null,
                    customBuffs !== 0 ? `Adicionais: +${customBuffs} P.I.` : null,
                    customLimits !== 0 ? `Limitações: -${Math.abs(customLimits)} P.I.` : null,
                  ].filter(Boolean).join('\n')

                  onSave({
                    name: techName,
                    notes: notesLines,
                    damage: calcDano,
                    range: calcRange,
                    phCost: `${finalCost} P.I.`,
                    dt: calcDT,
                    description: techDescription || `${ARCHETYPES[archetypeIdx].name} — ${ACTIONS[actionIdx].name}.`,
                    builderState: { techName, archetypeIdx, actionIdx, elementIdx, baseCD, isHeal, diceTypeIdx, diceQtd, rangeIdx, areaIdx, areaSize, isCatalystExt, statusIdx, durationIdx, moveTypeIdx, moveMeters, infoTypeIdx, customLimits, customBuffs, techDescription },
                  })
                }}
                style={{
                  width: '100%', background: '#e8a000', color: '#000', border: 'none',
                  fontFamily: 'Impact, Arial Black', fontSize: 13, textTransform: 'uppercase',
                  letterSpacing: 2, padding: '11px 0', cursor: 'pointer', borderRadius: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#ffb000')}
                onMouseLeave={e => (e.currentTarget.style.background = '#e8a000')}
              >
                <Zap size={14} />
                Adicionar na Lista
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

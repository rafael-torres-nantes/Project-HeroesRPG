import type { DerivedStats } from '../utils/calculations'

interface Props { stats: DerivedStats }

const StatBox = ({ label, value, color = '#e8a000' }: { label: string; value: string | number; color?: string }) => (
  <div style={{ background: '#111', padding: '12px 16px', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
    <span style={{ fontSize: 16, fontWeight: 700, color, letterSpacing: 1 }}>{value}</span>
  </div>
)

export default function DerivedPanel({ stats }: Props) {
  return (
    <div style={{ background: 'transparent' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e1e1e', marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase', letterSpacing: '3px' }}>Defesas</div>
      </div>
      <div className="flex flex-col gap-2 px-4">
        <StatBox label="Bloqueio"            value={`+${stats.blockBonus}`}   color="#4a8fd4" />
        <StatBox label="Esquiva"             value={`+${stats.dodgeBonus}`}   color="#4a8fd4" />
        <StatBox label="Def. Mental"         value={`+${stats.mentalDefense}`} />
      </div>

      <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e1e1e', marginTop: 8, marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase', letterSpacing: '3px' }}>Descanso & Combate</div>
      </div>
      <div className="flex flex-col gap-2 px-4 pb-4 border-b border-[#1e1e1e]">
        <StatBox label="Desc. Longo"         value={`${stats.longRestRecovery} PV`} color="#d44040" />
        <StatBox label="Desc. Curto"         value={`${stats.shortRestRecovery} PH/h`} color="#4a8fd4" />
        <StatBox label="Peso Suportado"      value={`${stats.carryWeight} slots`} color="#ccc" />
        <StatBox label="Idiomas"             value={stats.languages} color="#ccc" />
      </div>
    </div>
  )
}


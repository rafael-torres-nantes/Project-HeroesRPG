import { ATTR_COLORS } from '../styles/theme'

interface Props {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  colorTheme?: unknown // kept for backward compat, unused
}

export default function AttributeInput({ label, value, onChange, min = 0, max = 20 }: Props) {
  const color = ATTR_COLORS[label] || '#e8a000'

  return (
    <div className="flex flex-col items-center text-center" style={{
      background: '#111',
      borderBottom: `3px solid ${color}`,
      borderRadius: '2px 2px 0 0',
      padding: '14px 8px',
    }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 6 }}>
        {value}
      </div>
      <div style={{
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color,
        marginBottom: 10,
      }}>
        {label}
      </div>
      <div className="flex justify-center" style={{ gap: 4 }}>
        {([['−', () => onChange(Math.max(min, value - 1))], ['+', () => onChange(Math.min(max, value + 1))]] as [string, () => void][]).map(([op, fn]) => (
          <button key={op} type="button" onClick={fn}
            className="flex items-center justify-center"
            style={{
              width: 24, height: 20,
              background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#888',
              fontSize: 13, cursor: 'pointer', borderRadius: 2,
              transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = color
              el.style.color = '#000'
              el.style.borderColor = color
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = '#1a1a1a'
              el.style.color = '#888'
              el.style.borderColor = '#2a2a2a'
            }}>
            {op}
          </button>
        ))}
      </div>
    </div>
  )
}

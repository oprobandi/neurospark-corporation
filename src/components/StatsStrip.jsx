import { useInView } from '../hooks/useInView'

const STATS = [
  { num: '150+',  label: 'East African Businesses Served' },
  { num: '14hrs', label: 'Average Hours Reclaimed Per Week' },
  { num: '3×',    label: 'Average SEO Traffic Growth in 90 Days' },
]

export default function StatsStrip() {
  const [ref, visible] = useInView()
  return (
    <div ref={ref} style={{ background: '#0A1F44', padding: '56px 0' }}>
      <div className="max-w-[1100px] mx-auto px-6 grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', textAlign: 'center' }}>
        {STATS.map((s, i) => (
          <div
            key={i}
            className={visible ? `animate-fade-up delay-${(i + 1) * 100}` : 'hidden-anim'}
          >
            <span
              style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 'clamp(2.4rem,5vw,3.8rem)', color: '#C9A84C', display: 'block', lineHeight: 1 }}
            >
              {s.num}
            </span>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: 8 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

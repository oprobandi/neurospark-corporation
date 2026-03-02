import logo from '../../assets/logo.jpg'

export default function Wordmark({ size = '1.35rem', footer = false }) {
  return (
    <span className="flex items-center gap-2.5" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: size }}>
      <img
        src={logo}
        alt="Neurospark Corporation"
        className="rounded-full object-cover flex-shrink-0"
        style={{ height: 42, width: 42 }}
      />
      <span>
        <span style={{ color: footer ? '#C9A84C' : '#0A1F44' }}>Neuro</span>
        <span style={{ color: '#C9A84C' }}>spark</span>{' '}
        <span style={{ color: footer ? '#94A3B8' : '#0A1F44', fontWeight: 300 }}>Corporation</span>
      </span>
    </span>
  )
}

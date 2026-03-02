import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import Eyebrow from './ui/Eyebrow'
import { IMAGES } from '../constants'

const CARDS = [
  {
    avatar: IMAGES.av1,
    name: 'Amina Wanjiku',
    role: 'Founder, Savana Logistics',
    quote: 'Before Neurospark Corporation, I spent my Sunday evenings preparing Monday reports. Now that time belongs to my family — and my team gets better data than I used to produce manually.',
    metric: '⚡ Reclaimed 14 hours per week',
    tag: 'Operations Automation',
    delay: 'delay-100',
  },
  {
    avatar: IMAGES.av2,
    name: 'David Odhiambo',
    role: 'CEO, Maisha Healthcare',
    quote: 'Our website was three years old and embarrassing us in pitches. Three weeks after onboarding Neurospark Corporation, it looked like a company half our age would envy. Now it updates itself.',
    metric: '📈 3× increase in inbound enquiries',
    tag: 'Website Management',
    delay: 'delay-200',
  },
  {
    avatar: IMAGES.av3,
    name: 'Grace Kamau',
    role: 'Director, Zuri Interiors',
    quote: "We went from page 4 to page 1 for 'interior designers Nairobi' in under 90 days. We didn't write a single blog post ourselves. I just track the bookings.",
    metric: '🏆 Page 1 ranking in 90 days',
    tag: 'SEO Growth',
    delay: 'delay-300',
  },
]

function TestimonialCard({ avatar, name, role, quote, metric, tag, delay }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`animate-fade-up ${delay} flex flex-col rounded-2xl p-8 transition-all duration-300`}
      style={{
        background: 'white',
        boxShadow: hover ? '0 8px 40px rgba(10,31,68,0.14)' : '0 2px 24px rgba(10,31,68,0.08)',
        border: hover ? '1px solid #C9A84C' : '1px solid transparent',
        transform: hover ? 'translateY(-6px)' : 'none',
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <img src={avatar} alt={name} loading="lazy" className="rounded-full object-cover flex-shrink-0" style={{ width: 48, height: 48 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0A1F44' }}>{name}</div>
          <div style={{ fontSize: '0.8rem', color: '#6B6B6B' }}>{role}</div>
        </div>
      </div>
      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '3rem', color: '#C9A84C', lineHeight: 0.5, display: 'block', marginBottom: 14 }}>"</span>
      <p className="flex-1" style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: '1.05rem', color: '#0A1F44', lineHeight: 1.6, marginBottom: 20 }}>{quote}</p>
      <div style={{ fontWeight: 700, color: '#C9A84C', fontSize: '1rem', marginBottom: 14 }}>{metric}</div>
      <span style={{ background: 'rgba(56,189,248,0.12)', color: '#0ea5e9', fontSize: '0.78rem', borderRadius: 999, padding: '4px 14px', display: 'inline-block', fontWeight: 600, alignSelf: 'flex-start' }}>{tag}</span>
    </div>
  )
}

export default function Testimonials() {
  const [ref, visible] = useInView()
  return (
    <section ref={ref} id="results" style={{ background: '#F5EFE0', padding: 'clamp(80px,10vw,140px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14">
          <Eyebrow>WHAT OUR CLIENTS STOPPED WORRYING ABOUT</Eyebrow>
          <h2
            className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'}
            style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: '#0A1F44', maxWidth: 540, margin: '0 auto' }}
          >
            Real results from businesses just like yours.
          </h2>
        </div>
        {visible && (
          <div className="grid gap-7" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
            {CARDS.map((c, i) => <TestimonialCard key={i} {...c} />)}
          </div>
        )}
      </div>
    </section>
  )
}

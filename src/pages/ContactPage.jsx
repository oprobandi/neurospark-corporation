/**
 * ContactPage.jsx — /contact
 *
 * Place at: src/pages/ContactPage.jsx
 *
 * Add to App.jsx routes:
 *   import ContactPage from './pages/ContactPage'
 *   <Route path="/contact" element={<ContactPage />} />
 *
 * Also update Navbar NAV_LINKS:
 *   { label: 'Contact', href: '/contact', internal: true }
 *
 * Query param support:
 *   /contact?enquiry=agent    → pre-selects "Deploy an Agent"
 *   /contact?enquiry=web      → pre-selects "Build a Website"
 *   /contact?enquiry=seo      → pre-selects "SEO Strategy"
 *   /contact?enquiry=custom   → pre-selects "Custom Project"
 *   /contact?enquiry=enterprise → pre-selects "Enterprise Partner"
 *   /contact?plan=growth      → shows plan badge in form
 *
 * Sections:
 *   1. PageHero              — minimal, navy, editorial
 *   2. EnquiryTypeSelector   — 4 card buttons, gold-border on active
 *   3. ContactGrid           — 2-col: form (left) + info panel (right)
 *   4. WhatsAppCTA           — large green CTA with pre-drafted message
 *   5. ReassuranceStrip      — trust line below form
 */

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  MapPin, Mail, Phone, Clock, Linkedin, Twitter, Instagram,
  CheckCircle, Shield, Zap, Bot, Globe, TrendingUp, Package,
  ChevronRight, MessageCircle,
} from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { C, FONTS } from '../constants'
// ─── Font aliases (sourced from constants.js) ─────────────────────────────────
const FD = FONTS.display
const FB = FONTS.body
const FM = FONTS.mono


// ─── Design tokens ───────────────────────────────────────────────────────────

// ─── Enquiry type definitions ────────────────────────────────────────────────
const ENQUIRY_TYPES = [
  {
    id:      'agent',
    label:   'Deploy an Agent',
    icon:    Bot,
    desc:    'I want to automate a specific business operation',
    waText:  "Hi NeuroSpark! I'd like to deploy an AI agent for my business.",
    fields:  ['name', 'company', 'email', 'phone', 'agent_interest', 'message'],
  },
  {
    id:      'web',
    label:   'Build a Website',
    icon:    Globe,
    desc:    'New site or redesign — managed by an agent',
    waText:  "Hi NeuroSpark! I'd like to discuss building or redesigning my business website.",
    fields:  ['name', 'company', 'email', 'phone', 'current_site', 'message'],
  },
  {
    id:      'seo',
    label:   'SEO Strategy',
    icon:    TrendingUp,
    desc:    'Grow my search visibility in East Africa',
    waText:  "Hi NeuroSpark! I'd like to discuss an SEO strategy for my business.",
    fields:  ['name', 'company', 'email', 'phone', 'website', 'message'],
  },
  {
    id:      'custom',
    label:   'Custom Project',
    icon:    Package,
    desc:    'Something specific — let me explain',
    waText:  "Hi NeuroSpark! I have a custom project I'd like to discuss.",
    fields:  ['name', 'company', 'email', 'phone', 'message'],
  },
]

// ─── Shared ──────────────────────────────────────────────────────────────────
function DotGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="contactDots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="rgba(201,168,76,0.11)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#contactDots)" />
      </svg>
    </div>
  )
}

function Label({ children, required }) {
  return (
    <label style={{ display: 'block', fontFamily: FB, fontWeight: 600, fontSize: '0.82rem', color: C.navy, marginBottom: 6, letterSpacing: '0.01em' }}>
      {children}{required && <span style={{ color: C.gold, marginLeft: 3 }}>*</span>}
    </label>
  )
}

function Input({ type = 'text', placeholder, value, onChange, prefix, required, style: extraStyle = {} }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      border: `1.5px solid ${focused ? C.navy : C.border}`,
      borderRadius: 10, overflow: 'hidden',
      background: 'white', transition: 'border-color 0.25s',
      ...extraStyle,
    }}>
      {prefix && (
        <span style={{ padding: '0 12px', fontFamily: FM, fontSize: '0.82rem', fontWeight: 600, color: C.muted, borderRight: `1px solid ${C.border}`, background: '#F8F9FC', alignSelf: 'stretch', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {prefix}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1, border: 'none', outline: 'none',
          padding: '12px 14px', fontFamily: FB, fontSize: '0.9rem', color: C.charcoal,
          background: 'transparent',
        }}
      />
    </div>
  )
}

function Textarea({ placeholder, value, onChange, rows = 5, required }) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', border: `1.5px solid ${focused ? C.navy : C.border}`,
        borderRadius: 10, outline: 'none', resize: 'vertical',
        padding: '12px 14px', fontFamily: FB, fontSize: '0.9rem', color: C.charcoal,
        background: 'white', transition: 'border-color 0.25s', boxSizing: 'border-box',
        lineHeight: 1.7,
      }}
    />
  )
}

// ─── 1. PageHero ─────────────────────────────────────────────────────────────
function PageHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: C.navy,
        paddingTop:    'clamp(110px,13vw,150px)',
        paddingBottom: 'clamp(56px,7vw,90px)',
        textAlign: 'center',
      }}
    >
      <DotGrid />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 80%, rgba(201,168,76,0.09) 0%, transparent 60%)',
      }} />

      <div className="max-w-[740px] mx-auto px-6 relative z-10">
        <p className="animate-fade-up mb-3" style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: C.gold, fontWeight: 700 }}>
          CONTACT US
        </p>
        <h1 className="animate-fade-up delay-100" style={{
          fontFamily: FD, fontWeight: 700,
          fontSize: 'clamp(2.2rem,5vw,3.6rem)',
          color: 'white', lineHeight: 1.15, marginBottom: 16,
        }}>
          Let's Build{' '}
          <em style={{ color: C.gold }}>Something.</em>
        </h1>
        <p className="animate-fade-up delay-200" style={{
          fontFamily: FB, color: '#94A3B8',
          fontSize: 'clamp(0.95rem,1.8vw,1.05rem)',
          lineHeight: 1.85, maxWidth: 520, margin: '0 auto',
        }}>
          Tell us your biggest operational headache. We'll tell you exactly how to solve it — and walk you through the agent that does it, live.
        </p>
      </div>
    </section>
  )
}

// ─── 2. EnquiryTypeSelector ──────────────────────────────────────────────────
function EnquiryTypeSelector({ active, onSelect }) {
  return (
    <div style={{ padding: 'clamp(40px,6vw,64px) 0 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <p style={{ fontFamily: FB, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: C.muted, fontWeight: 700, marginBottom: 14, textAlign: 'center' }}>
          What brings you here?
        </p>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', marginBottom: 0 }}>
          {ENQUIRY_TYPES.map(t => {
            const isActive = active === t.id
            return (
              <button
                key={t.id}
                onClick={() => onSelect(t.id)}
                style={{
                  background: isActive ? C.navy : 'white',
                  border: `2px solid ${isActive ? C.gold : C.border}`,
                  borderRadius: 14, padding: '18px 18px',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.25s',
                  boxShadow: isActive ? '0 8px 28px rgba(10,31,68,0.18)' : '0 2px 10px rgba(10,31,68,0.05)',
                  transform: isActive ? 'translateY(-3px)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: isActive ? C.goldDim : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <t.icon size={17} color={isActive ? C.gold : C.muted} />
                  </div>
                </div>
                <div style={{ fontFamily: FD, fontWeight: 700, fontSize: '0.95rem', color: isActive ? 'white' : C.navy, marginBottom: 4 }}>
                  {t.label}
                </div>
                <div style={{ fontFamily: FB, fontSize: '0.78rem', color: isActive ? '#94A3B8' : C.muted, lineHeight: 1.4 }}>
                  {t.desc}
                </div>
                {isActive && (
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontFamily: FM, fontSize: '0.68rem', color: C.gold, fontWeight: 700 }}>SELECTED</span>
                    <CheckCircle size={12} color={C.gold} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── 3. Contact Form ─────────────────────────────────────────────────────────
function ContactForm({ enquiryId, planLabel, onSubmit }) {
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    agent_interest: '', current_site: '', website: '', message: '',
    pref: 'whatsapp',
  })

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  const enquiry = ENQUIRY_TYPES.find(t => t.id === enquiryId) || ENQUIRY_TYPES[0]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email) { alert('Please fill in your name and email.'); return }
    onSubmit(form, enquiry)
  }

  const inputSx = { marginBottom: 16 }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Plan badge */}
      {planLabel && (
        <div style={{ background: C.goldDim, border: `1px solid ${C.gold}`, borderRadius: 10, padding: '10px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={14} color={C.gold} />
          <span style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.78rem', color: C.navy }}>
            Enquiring about: {planLabel}
          </span>
        </div>
      )}

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 16 }}>
        <div>
          <Label required>Full Name</Label>
          <Input placeholder="Jane Wanjiku" value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <Label>Company Name</Label>
          <Input placeholder="Acme Ltd" value={form.company} onChange={set('company')} />
        </div>
      </div>

      <div style={inputSx}>
        <Label required>Email Address</Label>
        <Input type="email" placeholder="jane@acme.co.ke" value={form.email} onChange={set('email')} required />
      </div>

      <div style={inputSx}>
        <Label>Phone Number</Label>
        <Input placeholder="712 345 678" value={form.phone} onChange={set('phone')} prefix="🇰🇪 +254" />
      </div>

      {/* Context-sensitive field */}
      {enquiryId === 'agent' && (
        <div style={inputSx}>
          <Label>Which agent interests you most?</Label>
          <div style={{ position: 'relative' }}>
            <select
              value={form.agent_interest}
              onChange={set('agent_interest')}
              style={{
                width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 10,
                padding: '12px 14px', fontFamily: FB, fontSize: '0.9rem', color: form.agent_interest ? C.charcoal : C.muted,
                background: 'white', outline: 'none', appearance: 'none', cursor: 'pointer',
              }}
            >
              <option value="">Select an agent (or 'Not sure yet')</option>
              <option value="not-sure">Not sure yet — I need guidance</option>
              {['PESA — Payments Reconciliation', 'KODI — KRA Tax Compliance', 'MALIPO — Kenyan Payroll',
                'Mkopo — SME Lending', 'DHAMINI — NSE Research', 'BIASHARA — EAC Trade',
                'Bidhaa — Export Intelligence', 'Soko — Govt Tenders', 'Ruhusa — County Licensing',
                'SHAMBA — Agriculture', 'Ardhi — Real Estate', 'ZURI — Customer Service'].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <ChevronRight size={16} color={C.muted} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none' }} />
          </div>
        </div>
      )}

      {enquiryId === 'web' && (
        <div style={inputSx}>
          <Label>Current website URL (if any)</Label>
          <Input placeholder="https://mycompany.co.ke" value={form.current_site} onChange={set('current_site')} />
        </div>
      )}

      {enquiryId === 'seo' && (
        <div style={inputSx}>
          <Label>Website to optimise</Label>
          <Input placeholder="https://mycompany.co.ke" value={form.website} onChange={set('website')} />
        </div>
      )}

      <div style={inputSx}>
        <Label>Your Message</Label>
        <Textarea
          placeholder="Describe your biggest operational challenge, or what you'd like to achieve. The more specific, the better — we'll tailor our response accordingly."
          value={form.message}
          onChange={set('message')}
          rows={5}
        />
      </div>

      {/* Preference toggle */}
      <div style={{ marginBottom: 24 }}>
        <Label>Preferred response method</Label>
        <div style={{ display: 'flex', gap: 10 }}>
          {[{ val: 'whatsapp', label: 'WhatsApp' }, { val: 'email', label: 'Email' }].map(opt => (
            <button
              key={opt.val}
              type="button"
              onClick={() => setForm(f => ({ ...f, pref: opt.val }))}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 999,
                border: `1.5px solid ${form.pref === opt.val ? C.navy : C.border}`,
                background: form.pref === opt.val ? C.navy : 'white',
                color: form.pref === opt.val ? C.gold : C.muted,
                fontFamily: FB, fontWeight: 700, fontSize: '0.85rem',
                cursor: 'pointer', transition: 'all 0.25s',
              }}
            >
              {opt.val === 'whatsapp' ? '💬 ' : '📧 '}{opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        style={{
          width: '100%', background: C.gold, color: C.navy, border: 'none',
          borderRadius: 999, padding: '14px 24px',
          fontFamily: FB, fontWeight: 700, fontSize: '0.95rem',
          cursor: 'pointer', transition: 'all 0.3s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#b8943e'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(201,168,76,0.42)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
      >
        Send Message →
      </button>
    </form>
  )
}

// ─── 3b. Info Panel ──────────────────────────────────────────────────────────
function InfoPanel() {
  const SOCIAL = [
    { Icon: Linkedin, href: '#', label: 'LinkedIn' },
    { Icon: Twitter,  href: '#', label: 'Twitter'  },
    { Icon: Instagram,href: '#', label: 'Instagram'},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Contact details card */}
      <div style={{ background: C.navy, borderRadius: 18, padding: '28px 28px', color: 'white' }}>
        <p style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: C.gold, fontWeight: 700, marginBottom: 18 }}>
          GET IN TOUCH
        </p>

        {[
          { Icon: Mail,    label: 'Email',    val: 'hello@neurosparkcorporation.ai', href: 'mailto:hello@neurosparkcorporation.ai' },
          { Icon: Phone,   label: 'Phone',    val: '+254 799 644 100',               href: 'tel:+254799644100' },
          { Icon: MapPin,  label: 'Location', val: 'Nairobi, Kenya',                 href: null },
        ].map(({ Icon, label, val, href }) => (
          <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={16} color={C.gold} />
            </div>
            <div>
              <div style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', fontWeight: 700, marginBottom: 2 }}>{label}</div>
              {href
                ? <a href={href} style={{ fontFamily: FB, fontSize: '0.88rem', color: 'white', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = C.gold} onMouseLeave={e => e.currentTarget.style.color = 'white'}>{val}</a>
                : <span style={{ fontFamily: FB, fontSize: '0.88rem', color: 'white' }}>{val}</span>}
            </div>
          </div>
        ))}

        {/* Social icons */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 18, marginTop: 4, display: 'flex', gap: 10 }}>
          {SOCIAL.map(({ Icon, href, label }) => {
            const [hover, setHover] = useState(false)
            return (
              <a
                key={label} href={href}
                aria-label={label}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: `1px solid ${hover ? C.gold : '#1A3060'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: hover ? C.gold : '#94A3B8', textDecoration: 'none',
                  transition: 'all 0.25s',
                }}
              >
                <Icon size={15} />
              </a>
            )
          })}
        </div>
      </div>

      {/* Office hours card */}
      <div style={{ background: C.sand, borderRadius: 18, padding: '24px 26px', border: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Clock size={16} color={C.gold} />
          <p style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: C.navy, fontWeight: 700 }}>
            OFFICE HOURS
          </p>
        </div>
        {[
          { day: 'Mon – Fri', hours: '08:00 – 18:00 EAT' },
          { day: 'Saturday',  hours: '09:00 – 13:00 EAT' },
          { day: 'Sunday',    hours: 'Agents always on 🤖' },
        ].map(({ day, hours }) => (
          <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontFamily: FB, fontSize: '0.85rem', color: C.charcoal, fontWeight: 600 }}>{day}</span>
            <span style={{ fontFamily: FM, fontSize: '0.82rem', color: C.muted }}>{hours}</span>
          </div>
        ))}
        <p style={{ fontFamily: FB, fontSize: '0.78rem', color: C.muted, marginTop: 12, lineHeight: 1.65 }}>
          WhatsApp responses typically within 2 hours during office hours. AI agents operate 24/7 regardless.
        </p>
      </div>

      {/* Map placeholder card */}
      <div style={{ borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.border}`, background: '#EEF2F8', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, padding: 24 }}>
        <MapPin size={28} color={C.gold} />
        <p style={{ fontFamily: FD, fontWeight: 700, fontSize: '1rem', color: C.navy, marginBottom: 2 }}>Nairobi, Kenya</p>
        <p style={{ fontFamily: FB, fontSize: '0.82rem', color: C.muted }}>Westlands / CBD area</p>
        <a
          href="https://maps.google.com/?q=Nairobi+Kenya"
          target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: FB, fontWeight: 700, fontSize: '0.8rem', color: C.gold, textDecoration: 'none', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          Open in Maps <ChevronRight size={13} />
        </a>
      </div>
    </div>
  )
}

// ─── 3. ContactGrid ──────────────────────────────────────────────────────────
function ContactGrid({ enquiryId, planLabel, onFormSubmit }) {
  const [ref, visible] = useInView(0.05)

  return (
    <section ref={ref} style={{ background: C.bg, padding: 'clamp(48px,6vw,80px) 0 clamp(60px,8vw,100px)' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid gap-12 items-start" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
          {/* Left — form */}
          <div className={visible ? 'animate-slide-l' : 'hidden-anim'}>
            <p style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: C.gold, fontWeight: 700, marginBottom: 10 }}>
              YOUR MESSAGE
            </p>
            <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', color: C.navy, marginBottom: 22 }}>
              Tell us what you need.
            </h2>
            <ContactForm enquiryId={enquiryId} planLabel={planLabel} onSubmit={onFormSubmit} />
          </div>

          {/* Right — info */}
          <div className={visible ? 'animate-slide-r' : 'hidden-anim'}>
            <InfoPanel />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 4. WhatsAppCTA ──────────────────────────────────────────────────────────
function WhatsAppCTA({ enquiryId }) {
  const enquiry = ENQUIRY_TYPES.find(t => t.id === enquiryId) || ENQUIRY_TYPES[0]
  const [hover, setHover] = useState(false)
  const [ref, visible] = useInView()

  return (
    <section ref={ref} style={{ background: C.sand, padding: 'clamp(48px,6vw,80px) 0' }}>
      <div className="max-w-[680px] mx-auto px-6 text-center">
        <div className={visible ? 'animate-fade-up' : 'hidden-anim'} style={{
          background: 'white', borderRadius: 20, padding: 'clamp(28px,4vw,44px)',
          border: `1px solid ${C.border}`,
          boxShadow: '0 8px 40px rgba(10,31,68,0.07)',
        }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(37,211,102,0.1)', border: '1.5px solid rgba(37,211,102,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <MessageCircle size={26} color={C.green} />
          </div>
          <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.2rem,2.4vw,1.6rem)', color: C.navy, marginBottom: 10 }}>
            Prefer to chat directly?
          </h3>
          <p style={{ fontFamily: FB, fontSize: '0.92rem', color: C.muted, lineHeight: 1.8, marginBottom: 24, maxWidth: 420, margin: '0 auto 24px' }}>
            Skip the form — open WhatsApp and we'll respond within 2 hours. A pre-drafted message is ready based on your selected enquiry type.
          </p>
          <a
            href={`https://wa.me/254799644100?text=${encodeURIComponent(enquiry.waText)}`}
            target="_blank" rel="noopener noreferrer"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: hover ? '#1aad57' : C.green, color: 'white',
              border: 'none', borderRadius: 999, padding: '13px 28px',
              fontFamily: FB, fontWeight: 700, fontSize: '0.95rem',
              textDecoration: 'none', cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: hover ? '0 8px 28px rgba(37,211,102,0.4)' : '0 4px 16px rgba(37,211,102,0.25)',
              transform: hover ? 'translateY(-2px)' : 'none',
            }}
          >
            {/* WhatsApp SVG icon */}
            <svg viewBox="0 0 24 24" width={20} height={20} fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Open WhatsApp Chat
          </a>
          <p style={{ fontFamily: FB, fontSize: '0.78rem', color: '#94A3B8', marginTop: 14 }}>
            Typical response: within 2 hours · {enquiry.label}
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── 5. ReassuranceStrip ─────────────────────────────────────────────────────
function ReassuranceStrip() {
  return (
    <div style={{ background: C.navy, padding: '20px 0' }}>
      <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap justify-center gap-8">
        {[
          { Icon: Shield,       text: 'No long-term contracts' },
          { Icon: Zap,          text: 'Onboarded in 5 business days' },
          { Icon: CheckCircle,  text: 'Cancel anytime' },
          { Icon: MessageCircle,text: 'Response within 2 hours' },
        ].map(({ Icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: FB, fontSize: '0.82rem', color: '#64748B' }}>
            <Icon size={14} color={C.sky} />
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Success screen ──────────────────────────────────────────────────────────
function SuccessScreen({ enquiryId, onReset }) {
  const enquiry = ENQUIRY_TYPES.find(t => t.id === enquiryId) || ENQUIRY_TYPES[0]
  return (
    <section style={{ background: C.bg, padding: 'clamp(80px,12vw,140px) 0', textAlign: 'center' }}>
      <div className="max-w-[560px] mx-auto px-6">
        <div style={{ fontSize: '3.5rem', marginBottom: 20 }}>✅</div>
        <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: C.navy, marginBottom: 14 }}>
          Message sent. We'll be in touch.
        </h2>
        <p style={{ fontFamily: FB, color: C.muted, lineHeight: 1.85, marginBottom: 28 }}>
          Thank you for reaching out about <strong>{enquiry.label}</strong>. You'll hear from us within 2 hours during office hours, or first thing the next morning.
        </p>
        <a
          href={`https://wa.me/254799644100?text=${encodeURIComponent(enquiry.waText)}`}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C.green, color: 'white', borderRadius: 999,
            padding: '12px 24px', fontFamily: FB, fontWeight: 700, fontSize: '0.9rem',
            textDecoration: 'none', marginBottom: 14,
          }}
        >
          Also ping us on WhatsApp
        </a>
        <br />
        <button
          onClick={onReset}
          style={{ background: 'none', border: 'none', color: C.gold, fontFamily: FB, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', marginTop: 6 }}
        >
          Send another message →
        </button>
      </div>
    </section>
  )
}

// ─── ContactPage Root ────────────────────────────────────────────────────────
export default function ContactPage() {
  const [searchParams]  = useSearchParams()
  const [enquiryId,     setEnquiryId]   = useState('agent')
  const [submitted,     setSubmitted]   = useState(false)

  // Read query params on mount
  useEffect(() => {
    const eq = searchParams.get('enquiry')
    if (eq) {
      const match = ENQUIRY_TYPES.find(t => t.id === eq)
      if (match) setEnquiryId(match.id)
      // enterprise is a special keyword that maps to custom
      else if (eq === 'enterprise') setEnquiryId('custom')
    }
  }, [searchParams])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const planLabel = searchParams.get('plan')
    ? { starter: 'Starter Agent', growth: 'Growth Engine', enterprise: 'Enterprise Partner' }[searchParams.get('plan')]
    : null

  const handleFormSubmit = (form, enquiry) => {
    // Build WhatsApp message with form data
    const parts = [
      enquiry.waText,
      form.name    ? `\nName: ${form.name}`          : '',
      form.company ? `\nCompany: ${form.company}`    : '',
      form.email   ? `\nEmail: ${form.email}`        : '',
      form.phone   ? `\nPhone: +254${form.phone}`    : '',
      form.agent_interest ? `\nAgent interest: ${form.agent_interest}` : '',
      form.current_site   ? `\nCurrent site: ${form.current_site}`     : '',
      form.website        ? `\nWebsite: ${form.website}`               : '',
      planLabel    ? `\nPlan: ${planLabel}`           : '',
      form.message ? `\nMessage: ${form.message}`    : '',
      `\nPreferred response: ${form.pref}`,
    ].join('')

    if (form.pref === 'whatsapp') {
      window.open(`https://wa.me/254799644100?text=${encodeURIComponent(parts)}`, '_blank')
    } else {
      // Email fallback — open mail client
      const subject = encodeURIComponent(`NeuroSpark Enquiry — ${enquiry.label}`)
      const body    = encodeURIComponent(parts)
      window.open(`mailto:hello@neurosparkcorporation.ai?subject=${subject}&body=${body}`)
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <PageHero />
        <SuccessScreen enquiryId={enquiryId} onReset={() => setSubmitted(false)} />
        <ReassuranceStrip />
      </>
    )
  }

  return (
    <>
      <PageHero />
      <EnquiryTypeSelector active={enquiryId} onSelect={setEnquiryId} />
      <ContactGrid
        enquiryId={enquiryId}
        planLabel={planLabel}
        onFormSubmit={handleFormSubmit}
      />
      <WhatsAppCTA enquiryId={enquiryId} />
      <ReassuranceStrip />
    </>
  )
}

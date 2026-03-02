/**
 * AgentsPage.jsx — /agents route
 *
 * Place at: src/pages/AgentsPage.jsx
 *
 * Features:
 *   • PageHero with animated dot-grid background + glass card
 *   • Sticky AgentFilterBar with category pills + live search
 *   • AgentCountStrip interstitial
 *   • AgentGrid — all 12 agents in 3-column responsive layout
 *   • CalloutBanner — custom agent request CTA
 *
 * All 12 agents grouped across 4 categories:
 *   Finance & Tax | Trade & Compliance | Sector Intelligence | Customer Experience
 */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Zap, Shield, Globe, BarChart2, FileText, Package, Briefcase, Building2, ShoppingCart, Lock, MessageCircle, X } from 'lucide-react'
import Eyebrow from '../components/ui/Eyebrow'
import { BtnGold, BtnGhost } from '../components/ui/Buttons'
import { useInView } from '../hooks/useInView'
import { C, FONTS } from '../constants'

const FONT_DISPLAY = FONTS.display
const FONT_BODY    = FONTS.body
const FONT_MONO    = FONTS.mono

// ─── Design tokens ─────────────────────────────────────────────────────────

// ─── Full agent catalogue ────────────────────────────────────────────────────
const AGENTS = [
  // ── Finance & Tax ──────────────────────────────────────────────────────────
  {
    code:     'PESA',
    name:     'Mobile Payments Reconciliation',
    meaning:  'Pesa = Money',
    category: 'Finance & Tax',
    icon:     '💳',
    IconComp: BarChart2,
    tags:     ['M-Pesa', 'Airtel Money', 'Reconciliation', 'Fintech'],
    desc:     'Automatically reconciles M-Pesa, Airtel Money, T-Kash and bank transactions. Detects discrepancies, monitors float, and generates audit-ready reports — eliminating hours of manual cross-referencing every week.',
    slug:     'pesa',
  },
  {
    code:     'KODI',
    name:     'KRA Tax Compliance',
    meaning:  'Kodi = Tax',
    category: 'Finance & Tax',
    icon:     '📋',
    IconComp: FileText,
    tags:     ['KRA', 'iTax', 'VAT', 'PAYE', 'WHT'],
    desc:     'Monitors your KRA obligations calendar, files VAT, PAYE, and withholding tax returns on schedule, and flags compliance risks before they become penalties. Integrates directly with KRA iTax and eTIMS.',
    slug:     'kodi',
  },
  {
    code:     'MALIPO',
    name:     'Kenyan Payroll Compliance',
    meaning:  'Malipo = Payments',
    category: 'Finance & Tax',
    icon:     '💼',
    IconComp: Briefcase,
    tags:     ['NSSF', 'SHA', 'Housing Levy', 'PAYE', 'P9'],
    desc:     'Runs compliant Kenyan payroll end-to-end. Calculates NSSF, SHA/NHIF, and Housing Levy deductions, generates P9 forms, files PAYE via iTax, and dispatches payslips — all without manual intervention.',
    slug:     'malipo',
  },
  {
    code:     'Mkopo',
    name:     'SME Lending Eligibility',
    meaning:  'Mkopo = Loan',
    category: 'Finance & Tax',
    icon:     '🏦',
    IconComp: Shield,
    tags:     ['Credit', 'Lenders', 'SME Finance', 'CRB'],
    desc:     'Screens your business against Kenyan lender criteria, identifies your best funding matches, and prepares a loan-readiness dossier. Covers banks, SACCOs, DFIs, and digital lenders active in East Africa.',
    slug:     'mkopo',
  },
  {
    code:     'DHAMINI',
    name:     'NSE Investment Research',
    meaning:  'Dhamini = Security/Guarantee',
    category: 'Finance & Tax',
    icon:     '📈',
    IconComp: BarChart2,
    tags:     ['NSE', 'EAC Capital Markets', 'Equities', 'Research'],
    desc:     'Delivers daily equity research briefs on Nairobi Securities Exchange listed companies. Monitors price movements, dividend announcements, and analyst consensus for East African capital market participants.',
    slug:     'dhamini',
  },

  // ── Trade & Compliance ─────────────────────────────────────────────────────
  {
    code:     'BIASHARA',
    name:     'East African Trade Compliance',
    meaning:  'Biashara = Business/Trade',
    category: 'Trade & Compliance',
    icon:     '🌍',
    IconComp: Globe,
    tags:     ['EAC', 'Customs', 'Tariffs', 'Cross-Border'],
    desc:     'Navigates EAC cross-border trade regulations, classifies goods under EAC tariff schedules, prepares customs documentation, and alerts you to regulatory changes across Kenya, Uganda, Tanzania, Rwanda and Burundi.',
    slug:     'biashara',
  },
  {
    code:     'Bidhaa',
    name:     'Export Market Intelligence',
    meaning:  'Bidhaa = Goods/Products',
    category: 'Trade & Compliance',
    icon:     '📦',
    IconComp: Package,
    tags:     ['Export', 'Market Access', 'Standards', 'KEBS'],
    desc:     'Identifies export market opportunities, maps compliance requirements for KEBS, KEPHIS, and destination-market standards, and produces export-readiness assessments for Kenyan manufacturers and agribusinesses.',
    slug:     'bidhaa',
  },
  {
    code:     'Soko',
    name:     'Government Tender & Procurement',
    meaning:  'Soko = Market/Marketplace',
    category: 'Trade & Compliance',
    icon:     '🏛️',
    IconComp: Building2,
    tags:     ['PPADA', 'Tenders', 'Procurement', 'Government'],
    desc:     'Tracks open government tenders across Kenya\'s national and county procurement portals, evaluates bid eligibility, and prepares PPADA-compliant submission packages — so you never miss a contract opportunity.',
    slug:     'soko',
  },
  {
    code:     'Ruhusa',
    name:     'County Business Licensing',
    meaning:  'Ruhusa = Permit/Permission',
    category: 'Trade & Compliance',
    icon:     '📜',
    IconComp: Lock,
    tags:     ['County', 'Licenses', 'By-Laws', 'Permits'],
    desc:     'Maps the licensing requirements for your business across all 47 Kenyan counties, tracks renewal deadlines, and prepares permit applications aligned to county by-laws — eliminating compliance surprises.',
    slug:     'ruhusa',
  },

  // ── Sector Intelligence ────────────────────────────────────────────────────
  {
    code:     'SHAMBA',
    name:     'Agriculture Supply Chain',
    meaning:  'Shamba = Farm/Field',
    category: 'Sector Intelligence',
    icon:     '🌾',
    IconComp: Truck,
    tags:     ['Agri', 'EAGC', 'KMD', 'KEPHIS', 'Commodity Prices'],
    desc:     'Tracks commodity prices across major Kenyan markets (EAGC, NCE), monitors KMD weather forecasts for planting decisions, flags KEPHIS phytosanitary alerts, and optimises agri-logistics routing for smallholders and aggregators.',
    slug:     'shamba',
  },
  {
    code:     'Ardhi',
    name:     'Kenya Real Estate Intelligence',
    meaning:  'Ardhi = Land/Earth',
    category: 'Sector Intelligence',
    icon:     '🏠',
    IconComp: Building2,
    tags:     ['Real Estate', 'Valuation', 'Nairobi', 'Planning'],
    desc:     'Delivers real-time Kenyan property market data, automated valuations for residential and commercial units, planning compliance checks, and investment opportunity alerts across Nairobi, Mombasa, and major upcountry markets.',
    slug:     'ardhi',
  },

  // ── Customer Experience ────────────────────────────────────────────────────
  {
    code:     'ZURI',
    name:     'Swahili Customer Service',
    meaning:  'Zuri = Good / Beautiful',
    category: 'Customer Experience',
    icon:     '🤝',
    IconComp: MessageCircle,
    tags:     ['Swahili', 'English', 'Sheng', 'WhatsApp', 'Customer Support'],
    desc:     'Handles customer enquiries, complaints, and sales conversations in English, Swahili, and Sheng — 24/7, across WhatsApp, SMS, and web chat. Trained on East African business culture, not a Western call-centre script.',
    slug:     'zuri',
  },
]

const CATEGORIES = ['All', 'Finance & Tax', 'Trade & Compliance', 'Sector Intelligence', 'Customer Experience']

const CATEGORY_META = {
  'Finance & Tax':       { color: '#3B82F6', bg: '#EFF6FF', label: 'Finance & Tax' },
  'Trade & Compliance':  { color: '#10B981', bg: '#ECFDF5', label: 'Trade & Compliance' },
  'Sector Intelligence': { color: '#F59E0B', bg: '#FFFBEB', label: 'Sector Intelligence' },
  'Customer Experience': { color: '#8B5CF6', bg: '#F5F3FF', label: 'Customer Experience' },
}

// ─── Dot grid background (hero) ───────────────────────────────────────────────
function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="rgba(201,168,76,0.18)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  )
}

// ─── PageHero ─────────────────────────────────────────────────────────────────
function PageHero({ onBrowse }) {
  return (
    <section
      className="relative overflow-hidden text-center"
      style={{
        background: C.navy,
        paddingTop:    'clamp(120px,14vw,160px)',
        paddingBottom: 'clamp(80px,10vw,120px)',
      }}
    >
      <DotGrid />

      {/* Glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 500,
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, rgba(56,189,248,0.07) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-[900px] mx-auto px-6 relative z-10">
        <Eyebrow className="animate-fade-up" style={{ color: C.gold }}>
          THE AGENTS
        </Eyebrow>

        <h1
          className="animate-fade-up delay-100"
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 'clamp(2.2rem,5vw,3.8rem)',
            lineHeight: 1.15,
            color: 'white',
            marginBottom: 20,
          }}
        >
          Kenya's Most Powerful AI Agents
          <br />
          <em style={{ color: C.gold }}>Built for Business.</em>
        </h1>

        <p
          className="animate-fade-up delay-200 mx-auto"
          style={{
            fontFamily: FONT_BODY,
            fontSize: 'clamp(1rem,2vw,1.1rem)',
            color: '#94A3B8',
            maxWidth: 560,
            lineHeight: 1.85,
            marginBottom: 36,
          }}
        >
          12 domain-specific agents — each one built from the ground up for the regulatory, financial, and operational realities of doing business in East Africa. Not adapted from Western tools. Built here, for here.
        </p>

        <div className="animate-fade-up delay-300 flex flex-wrap justify-center gap-4">
          <button
            onClick={onBrowse}
            style={{
              background: C.gold,
              color: C.navy,
              border: 'none',
              borderRadius: 999,
              padding: '13px 28px',
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#b8943e'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(201,168,76,0.38)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = C.gold
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Browse All Agents ↓
          </button>
          <a
            href="/contact"
            style={{
              background: 'transparent',
              color: C.sky,
              border: `2px solid ${C.sky}`,
              borderRadius: 999,
              padding: '13px 28px',
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              transition: 'background 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Talk to Sales
          </a>
        </div>

        {/* Glass stat chips */}
        <div className="animate-fade-up delay-400 flex flex-wrap justify-center gap-4 mt-12">
          {['12 Agents Live', '24/7 Operation', 'No-Code Setup', 'Deployed in 5 Days'].map(chip => (
            <span
              key={chip}
              style={{
                background: 'rgba(10,31,68,0.6)',
                backdropFilter: 'blur(18px)',
                border: `1px solid rgba(201,168,76,0.28)`,
                borderRadius: 999,
                padding: '7px 16px',
                color: '#CBD5E1',
                fontSize: '0.82rem',
                fontFamily: FONT_BODY,
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── AgentFilterBar ───────────────────────────────────────────────────────────
function AgentFilterBar({ activeCategory, setActiveCategory, search, setSearch, gridRef }) {
  const [isSticky, setIsSticky] = useState(false)
  const barRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!barRef.current) return
      setIsSticky(barRef.current.getBoundingClientRect().top <= 70)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={barRef}
      style={{
        position: 'sticky',
        top: 70,
        zIndex: 40,
        background: isSticky ? 'rgba(250,250,247,0.96)' : C.bg,
        borderBottom: isSticky ? `1px solid ${C.border}` : '1px solid transparent',
        backdropFilter: isSticky ? 'blur(12px)' : 'none',
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
        boxShadow: isSticky ? '0 4px 24px rgba(10,31,68,0.06)' : 'none',
        padding: '14px 0',
      }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const active = cat === activeCategory
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: active ? C.navy : 'white',
                    color:      active ? C.gold : C.charcoal,
                    border:     `1px solid ${active ? C.navy : C.border}`,
                    borderRadius: 999,
                    padding: '7px 16px',
                    fontFamily: FONT_BODY,
                    fontWeight: active ? 600 : 400,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Search input */}
          <div style={{ position: 'relative', minWidth: 220 }}>
            <Search
              size={15}
              style={{
                position: 'absolute', left: 13, top: '50%',
                transform: 'translateY(-50%)',
                color: C.muted, pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search agents…"
              style={{
                width: '100%',
                border: `1px solid ${C.border}`,
                borderRadius: 999,
                padding: '9px 36px 9px 36px',
                fontFamily: FONT_BODY,
                fontSize: '0.88rem',
                background: 'white',
                color: C.charcoal,
                outline: 'none',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: C.muted, display: 'flex', alignItems: 'center',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── AgentCountStrip ──────────────────────────────────────────────────────────
function AgentCountStrip({ count, total }) {
  return (
    <div style={{ background: C.bg, padding: '18px 0', borderBottom: `1px solid ${C.border}` }}>
      <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between flex-wrap gap-3">
        <p style={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '0.88rem', margin: 0 }}>
          Showing{' '}
          <span style={{ color: C.navy, fontWeight: 700 }}>
            {count}
          </span>{' '}
          {count === total ? '' : `of ${total} `}
          agent{count !== 1 ? 's' : ''}
          {count === total ? ' — all domains' : ' matching your filter'}
        </p>
        <span style={{
          color: C.gold,
          fontSize: '0.75rem',
          fontFamily: FONT_BODY,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Built for East Africa
        </span>
      </div>
    </div>
  )
}

// ─── AgentCard ────────────────────────────────────────────────────────────────
function AgentCard({ agent, index, visible }) {
  const [hover, setHover] = useState(false)
  const meta = CATEGORY_META[agent.category] || {}
  const delay = `delay-${((index % 3) + 1) * 100}`

  return (
    <article
      id={agent.slug}
      className={visible ? `animate-fade-up ${delay}` : 'hidden-anim'}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'white',
        borderRadius: 18,
        border: `1px solid ${hover ? C.gold : C.border}`,
        borderTop: `4px solid ${hover ? C.gold : 'transparent'}`,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: hover
          ? `0 16px 48px rgba(10,31,68,0.14), 0 0 0 0 transparent`
          : `0 2px 14px rgba(10,31,68,0.05)`,
        transform: hover ? 'translateY(-5px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Card header */}
      <div style={{ padding: '24px 26px 18px' }}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{agent.icon}</span>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: C.navy,
                background: C.goldDim,
                border: `1px solid ${C.gold}`,
                borderRadius: 999,
                padding: '3px 11px',
              }}
            >
              {agent.code}
            </span>
          </div>

          <span
            style={{
              fontSize: '0.68rem',
              fontFamily: FONT_BODY,
              fontWeight: 600,
              color: meta.color,
              background: meta.bg,
              padding: '4px 10px',
              borderRadius: 999,
              flexShrink: 0,
            }}
          >
            {agent.category}
          </span>
        </div>

        <h3
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: '1.05rem',
            color: C.navy,
            lineHeight: 1.3,
            marginBottom: 4,
          }}
        >
          {agent.name}
        </h3>

        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: '0.75rem',
            fontStyle: 'italic',
            color: C.muted,
            marginBottom: 12,
          }}
        >
          {agent.meaning}
        </p>

        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: '0.88rem',
            color: C.charcoal,
            lineHeight: 1.7,
          }}
        >
          {agent.desc}
        </p>
      </div>

      {/* Tags */}
      <div style={{ padding: '0 26px 16px', flex: 1 }}>
        <div className="flex flex-wrap gap-1.5">
          {agent.tags.map(t => (
            <span
              key={t}
              style={{
                fontSize: '0.7rem',
                fontFamily: FONT_BODY,
                color: C.navy,
                background: '#EEF2F8',
                borderRadius: 999,
                padding: '3px 10px',
                fontWeight: 600,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* CTA footer */}
      <div
        style={{
          padding: '14px 26px 22px',
          borderTop: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: hover ? '#FAFAF7' : 'white',
          transition: 'background 0.3s',
        }}
      >
        <Link
          to={`/agents/${agent.slug}`}
          className="no-underline flex items-center gap-1.5"
          style={{
            color: C.gold,
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: '0.88rem',
            transition: 'gap 0.2s',
          }}
        >
          Learn More <ArrowRight size={14} />
        </Link>
        <a
          href={`https://wa.me/254799644100?text=I%27d%20like%20to%20deploy%20${encodeURIComponent(agent.code)}%20(${encodeURIComponent(agent.name)})`}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline flex items-center gap-1.5"
          style={{
            color: '#25D366',
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: '0.82rem',
          }}
        >
          Deploy ↗
        </a>
      </div>
    </article>
  )
}

// ─── AgentGrid ────────────────────────────────────────────────────────────────
function AgentGrid({ agents }) {
  const [ref, visible] = useInView(0.05)

  if (agents.length === 0) {
    return (
      <div className="text-center py-24" style={{ color: C.muted, fontFamily: FONT_BODY }}>
        <p style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</p>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: C.charcoal, marginBottom: 8 }}>
          No agents found
        </p>
        <p style={{ fontSize: '0.9rem' }}>
          Try a different search term or browse all categories.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="grid gap-7"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
    >
      {agents.map((agent, i) => (
        <AgentCard
          key={agent.code}
          agent={agent}
          index={i}
          visible={visible}
        />
      ))}
    </div>
  )
}

// ─── CalloutBanner ────────────────────────────────────────────────────────────
function CalloutBanner() {
  const [ref, visible] = useInView()
  const [hover, setHover] = useState(false)

  return (
    <div
      ref={ref}
      className={`${visible ? 'animate-fade-up' : 'hidden-anim'} rounded-2xl overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, ${C.navyDeep} 0%, ${C.navyMid} 60%, #1a3565 100%)`,
        padding: 'clamp(40px,6vw,64px)',
        position: 'relative',
        marginTop: 56,
        textAlign: 'center',
      }}
    >
      {/* Dot grid overlay */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dotsBanner" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(201,168,76,0.12)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotsBanner)" />
        </svg>
      </div>

      <div className="relative z-10">
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.gold,
            display: 'block',
            marginBottom: 14,
          }}
        >
          CUSTOM AGENTS
        </span>

        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 'clamp(1.6rem,3vw,2.2rem)',
            color: 'white',
            lineHeight: 1.25,
            marginBottom: 14,
          }}
        >
          Can't find the right agent?<br />
          <em style={{ color: C.gold }}>We'll build it for you.</em>
        </h2>

        <p
          style={{
            fontFamily: FONT_BODY,
            color: '#94A3B8',
            fontSize: '0.95rem',
            lineHeight: 1.75,
            maxWidth: 520,
            margin: '0 auto 28px',
          }}
        >
          Every business is different. If you have a domain-specific operational challenge that none of the 12 agents solves, we scope and build custom agents — designed exactly around your workflows, your systems, and your market.
        </p>

        <a
          href="/contact"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="no-underline inline-block rounded-full font-semibold"
          style={{
            background: hover ? '#b8943e' : C.gold,
            color: C.navy,
            padding: '13px 32px',
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: '0.95rem',
            transition: 'all 0.3s',
            boxShadow: hover ? '0 6px 24px rgba(201,168,76,0.4)' : 'none',
            transform: hover ? 'translateY(-2px)' : 'none',
          }}
        >
          Request a Custom Agent →
        </a>

        {/* Reassurances */}
        <div className="flex flex-wrap justify-center gap-6 mt-7">
          {['Scoped in 48 hours', 'Built in 2–3 weeks', 'No long-term contract'].map(r => (
            <span
              key={r}
              style={{
                fontSize: '0.8rem',
                color: '#64748B',
                fontFamily: FONT_BODY,
              }}
            >
              ✓ {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── AgentsPage Root ──────────────────────────────────────────────────────────
export default function AgentsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search,         setSearch]         = useState('')
  const gridRef = useRef(null)

  const scrollToGrid = () => {
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Filter agents
  const filtered = AGENTS.filter(a => {
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.desc.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.meaning.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <PageHero onBrowse={scrollToGrid} />

      <AgentFilterBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        search={search}
        setSearch={setSearch}
        gridRef={gridRef}
      />

      <AgentCountStrip count={filtered.length} total={AGENTS.length} />

      {/* Agent grid */}
      <section
        ref={gridRef}
        style={{ background: C.bg, padding: 'clamp(56px,7vw,100px) 0' }}
      >
        <div className="max-w-[1100px] mx-auto px-6">
          {/* Category heading */}
          {activeCategory !== 'All' && (
            <div className="mb-10">
              <h2
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 'clamp(1.5rem,2.8vw,2rem)',
                  fontWeight: 700,
                  color: C.navy,
                  marginBottom: 4,
                }}
              >
                {activeCategory}
              </h2>
              <p style={{ fontFamily: FONT_BODY, color: C.muted, fontSize: '0.9rem' }}>
                {filtered.length} agent{filtered.length !== 1 ? 's' : ''} in this category
              </p>
              <div style={{ width: 48, height: 3, background: C.gold, borderRadius: 2, marginTop: 10 }} />
            </div>
          )}

          <AgentGrid agents={filtered} />
          <CalloutBanner />
        </div>
      </section>
    </>
  )
}

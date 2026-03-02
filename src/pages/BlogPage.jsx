/**
 * BlogPage.jsx — /blog
 *
 * Place at: src/pages/BlogPage.jsx
 *
 * Add to App.jsx routes:
 *   import BlogPage from './pages/BlogPage'
 *   <Route path="/blog"      element={<BlogPage />} />
 *   <Route path="/blog/:slug" element={<BlogPage />} />
 *
 * Sections (list view):
 *   1. PageHero        — search bar + category filter pills
 *   2. FeaturedPost    — large 2-col card, Ken Burns hover
 *   3. BlogGrid        — 3-col responsive, live search + category filter
 *   4. NewsletterBlock — email capture, sand bg
 *
 * Single post view (/blog/:slug):
 *   1. PostHero        — full-width image header
 *   2. PostBody        — typeset prose
 *   3. SuggestedArticles — 3 related cards
 *   4. NewsletterBlock
 */

import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Search, Clock, Calendar, ArrowRight, X, ChevronRight, User } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { C, FONTS } from '../constants'
// ─── Font aliases (sourced from constants.js) ─────────────────────────────────
const FD = FONTS.display
const FB = FONTS.body
const FM = FONTS.mono


// ─── Design tokens ────────────────────────────────────────────────────────────

// ─── Blog post data ────────────────────────────────────────────────────────────
const POSTS = [
  {
    slug:       'kra-etims-guide-2024',
    category:   'Tax & Compliance',
    title:      "KRA eTIMS: The Complete Guide for Kenyan Businesses in 2024",
    excerpt:    "Every Kenyan business issuing tax invoices is now required to integrate with KRA's Electronic Tax Invoice Management System. Here's exactly what you need to know, what it costs, and how to stay compliant.",
    readTime:   8,
    date:       '12 Jun 2024',
    image:      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&auto=format&fit=crop&q=80',
    author:     { name: 'Paul', role: 'Founder, NeuroSpark', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
    featured:   true,
    tags:       ['KRA', 'eTIMS', 'Tax Compliance', 'KODI Agent'],
    body: [
      { type: 'p', content: "eTIMS — the Electronic Tax Invoice Management System — is KRA's mandate that all VAT-registered businesses issue tax invoices through a KRA-approved system. The compliance window that many businesses have been waiting to close has now arrived. Here is everything you need to understand to get compliant without the drama." },
      { type: 'h2', content: 'What exactly is eTIMS?' },
      { type: 'p', content: "eTIMS is KRA's system for real-time or near-real-time validation of all tax invoices. Every invoice you issue as a VAT-registered business must carry a Control Unit Invoice Number (CUIN) — a code that proves KRA knows about this invoice. Without it, the invoice is technically invalid for VAT input claims by your customers." },
      { type: 'h2', content: 'Who is required to integrate?' },
      { type: 'p', content: "All VAT-registered persons as of July 2023. Turnover Tax (TOT) registrants are currently excluded but this is expected to expand. If you're VAT-registered and issuing invoices, you need eTIMS. There is no grace period remaining." },
      { type: 'h2', content: 'Integration options' },
      { type: 'p', content: "KRA offers three paths: (1) eTIMS Online Portal — web-based invoice generation directly on KRA's platform, suitable for low-volume businesses. (2) eTIMS Client — a locally installed application that integrates with your POS or billing system. (3) API Integration — direct system-to-system integration for businesses with accounting software. For most SMEs, option 1 or 2 is appropriate." },
      { type: 'h2', content: 'What happens if I\'m not compliant?' },
      { type: 'p', content: "From a compliance standpoint: non-eTIMS invoices are invalid for VAT input claims. This means your customers cannot claim back VAT on purchases from you — a significant commercial disadvantage that will affect your relationships with larger, VAT-registered buyers. KRA has also begun audit actions targeting businesses issuing non-compliant invoices." },
      { type: 'h2', content: 'How the KODI agent handles eTIMS compliance' },
      { type: 'p', content: "NeuroSpark's KODI agent monitors your eTIMS validation status, flags any invoices issued without valid CUIN codes, and alerts you when supplier invoices you've received are missing eTIMS validation — protecting your input VAT claims before a KRA audit can challenge them." },
    ],
  },
  {
    slug:       'mobile-money-reconciliation-kenya',
    category:   'AI Agents',
    title:      "Why M-Pesa Reconciliation Is Still Breaking Kenyan Finance Teams in 2024",
    excerpt:    "Most Kenyan businesses are reconciling mobile money manually — and losing 14+ hours per week doing it. We mapped the specific friction points and why a spreadsheet will never fix them.",
    readTime:   6,
    date:       '5 Jun 2024',
    image:      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&auto=format&fit=crop&q=80',
    author:     { name: 'Paul', role: 'Founder, NeuroSpark', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
    featured:   false,
    tags:       ['M-Pesa', 'Reconciliation', 'PESA Agent', 'Finance Automation'],
    body: [
      { type: 'p', content: "The M-Pesa Business API exists. The data is structured. The reconciliation problem is theoretically solvable. So why are we still watching finance teams spend Friday afternoons matching transaction IDs in Excel?" },
      { type: 'h2', content: 'The four structural friction points' },
      { type: 'p', content: "First: multi-platform fragmentation. Most Kenyan businesses accept M-Pesa, Airtel Money, and at least one bank card method. Each platform produces a different export format, with different transaction identifiers, different timestamp formats, and different reversal handling. A reconciliation script built for M-Pesa breaks the moment Airtel Money is added." },
      { type: 'p', content: "Second: reversal complexity. M-Pesa reversals create a parent-child transaction relationship that most spreadsheet-based approaches treat as two separate transactions — inflating both credits and debits and making the net figure wrong until someone manually catches the pair." },
      { type: 'p', content: "Third: float blind spots. Most businesses track float reactively — they discover a float shortfall when a transaction fails, not when it's developing. By then the operational damage (failed customer payments, delayed settlements) is already done." },
      { type: 'p', content: "Fourth: audit trail fragility. When KRA requests documentation for a VAT audit, businesses scramble to reconstruct transaction history from WhatsApp screenshots and export CSVs. A proper reconciliation system produces audit-ready outputs automatically, daily, without anyone thinking about it." },
      { type: 'h2', content: 'What a proper solution looks like' },
      { type: 'p', content: "The PESA agent addresses all four: native integration with M-Pesa Business API, Airtel Money, and T-Kash; reversal tracking with parent-child matching; real-time float position monitoring; and automated daily reconciliation reports in audit-ready format. It runs twice daily without any staff involvement." },
    ],
  },
  {
    slug:       'seo-nairobi-businesses-2024',
    category:   'SEO',
    title:      "The SEO Landscape for Nairobi Businesses in 2024: What's Actually Working",
    excerpt:    "Nairobi's search landscape has distinct characteristics from any Western market. This is what we've learned running SEO for 30+ Kenyan businesses across 8 sectors.",
    readTime:   10,
    date:       '28 May 2024',
    image:      'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=900&auto=format&fit=crop&q=80',
    author:     { name: 'Paul', role: 'Founder, NeuroSpark', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
    featured:   false,
    tags:       ['SEO', 'Nairobi', 'Local SEO', 'Content Strategy'],
    body: [
      { type: 'p', content: "Running SEO for Kenyan businesses has taught us that most of what Western SEO agencies teach is either irrelevant or actively counterproductive for the Nairobi market. Here's what we've actually found works across our client base." },
      { type: 'h2', content: 'Mobile-first is not optional — it\'s the entire game' },
      { type: 'p', content: "Over 80% of Kenyan internet users access the web exclusively via mobile. This isn't a 'mobile-first' consideration — it's the only consideration. Core Web Vitals performance on 4G and 3G connections, image compression for data-conscious users, and tap-target sizing for smaller screens are non-negotiable baseline requirements before any keyword work begins." },
      { type: 'h2', content: 'Neighbourhood modifiers dramatically change search intent' },
      { type: 'p', content: "'Interior designer Nairobi' and 'interior designer Kilimani' are different searches with different buyers at different stages. Westlands-based restaurants see significant traffic from 'restaurants open now Westlands' — a local, transactional search that a Westlands-only business should be dominating but rarely does." },
      { type: 'h2', content: 'Google Business Profile is disproportionately powerful here' },
      { type: 'p', content: "In markets where reviews are sparse and trust signals are thin, a well-maintained Google Business Profile — regular posts, response to all reviews, updated photos, accurate categories — can outrank an SEO-optimised website for local searches. We've seen clients jump from position 8 to position 2 for their primary keywords within 30 days of a GBP overhaul, with no other changes." },
      { type: 'h2', content: 'Content that references specific Kenyan context ranks differently' },
      { type: 'p', content: "Articles that reference specific Kenyan geography, regulation, market conditions, or cultural context outperform generic articles on the same topic. 'How to file VAT returns in Kenya' dramatically outranks 'How to file VAT returns' for Kenyan searchers — and the former ranks for a tighter, higher-intent query that actually converts." },
    ],
  },
  {
    slug:       'eac-trade-compliance-guide',
    category:   'Tax & Compliance',
    title:      "EAC Customs in Practice: The Mistakes Kenyan Importers Keep Making",
    excerpt:    "The East African Community promises seamless trade. The ground reality involves misclassified HS codes, wrong duty rates, and consignments held at Malaba for days. Here's how to avoid every common mistake.",
    readTime:   9,
    date:       '20 May 2024',
    image:      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&auto=format&fit=crop&q=80',
    author:     { name: 'Paul', role: 'Founder, NeuroSpark', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
    featured:   false,
    tags:       ['EAC', 'Trade Compliance', 'BIASHARA Agent', 'Import/Export'],
    body: [
      { type: 'p', content: "Most of the customs problems we see at NeuroSpark are entirely avoidable. They're not the result of bad faith or regulatory complexity — they're the result of outdated information, HS code misclassification, and documentation that was correct for one partner state but wrong for another. Let's fix that." },
      { type: 'h2', content: 'Mistake 1: Assuming the same HS code works across all EAC states' },
      { type: 'p', content: "The EAC Common External Tariff is harmonised in principle, but partner states apply different additional levies, excise duties, and import declaration fees on top of the CET rate. A product that carries an effective duty of 18% into Kenya may face a 27% effective rate into Uganda or Tanzania when all levies are included. Always calculate the all-in cost, not just the CET rate." },
      { type: 'h2', content: 'Mistake 2: Not confirming EAC preferential origin documentation' },
      { type: 'p', content: "EAC preferential tariffs (often 0% for goods with sufficient East African origin content) require a Form C Certificate of Origin issued by the relevant authority — KEBS in Kenya, URA in Uganda, TRA in Tanzania. A missing or invalid Form C means your shipment is assessed at the full CET rate, even if the goods genuinely qualify for preferential treatment. This is a straightforward and avoidable cost." },
      { type: 'h2', content: 'Mistake 3: Ignoring national standards bodies at the destination' },
      { type: 'p', content: "KEBS in Kenya, TBS in Tanzania, UBS in Uganda, and RBS in Rwanda each have their own conformity assessment requirements for specific product categories. A KEBS certificate of conformity doesn't automatically satisfy TBS requirements — and a consignment rejected at Dar es Salaam port for non-compliant labelling costs you the demurrage, not the shipping line." },
    ],
  },
  {
    slug:       'ai-agriculture-kenya',
    category:   'Agriculture',
    title:      "How AI Is Changing Agricultural Decision-Making for Kenyan Smallholders",
    excerpt:    "Commodity prices, weather forecasts, and pest alerts have always existed in Kenya. The problem was the last mile. Here's how AI bridges the information gap for 340 farmers at a time.",
    readTime:   7,
    date:       '14 May 2024',
    image:      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=900&auto=format&fit=crop&q=80',
    author:     { name: 'Paul', role: 'Founder, NeuroSpark', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
    featured:   false,
    tags:       ['Agriculture', 'AI Agents', 'SHAMBA Agent', 'Smallholders'],
    body: [
      { type: 'p', content: "The information asymmetry in Kenyan agriculture is not a data problem. EAGC publishes commodity prices. KMD produces weather forecasts. KEPHIS issues pest alerts. The data exists. The problem is that none of it reaches a smallholder farmer in Kirinyaga at 5:30 in the morning in a format they can act on." },
      { type: 'h2', content: 'WhatsApp as the last-mile delivery mechanism' },
      { type: 'p', content: "85%+ of Kenyan mobile internet users have WhatsApp installed. The smartphone penetration among farming cooperative leadership is high enough to make WhatsApp a viable delivery channel for agricultural intelligence. A brief that arrives at 05:30 EAT — readable in 3 minutes, requiring no app download — can change a planting decision made at 07:00." },
      { type: 'h2', content: 'What the SHAMBA agent actually delivers' },
      { type: 'p', content: "Daily commodity prices from EAGC and NCE for 15+ crops. KMD ward-level weather forecasts with agronomic interpretation (plant now / delay planting / harvest risk). KEPHIS regional pest and disease alerts filtered to the cooperative's county. NCE futures prices for timing storage vs. immediate sale decisions. All of this aggregated, interpreted, and delivered in 150 words by 06:00 EAT." },
      { type: 'h2', content: 'The Green Harvest case' },
      { type: 'p', content: "Green Harvest Cooperative's 340 members had been selling avocados at KES 25/kg when EU prices were equivalent to KES 120/kg — not because they didn't want better prices, but because nobody had told them EU market entry was achievable. The SHAMBA agent's daily pricing data made the discrepancy visible. The Bidhaa agent's export readiness assessment made the pathway clear. The cooperative achieved GlobalG.A.P. certification in 14 weeks and shipped their first EU order within five months." },
    ],
  },
  {
    slug:       'nairobi-real-estate-intelligence',
    category:   'Real Estate',
    title:      "Property Decisions Without Data: The Real Cost of Kenya's Opacity Problem",
    excerpt:    "There is no Kenyan equivalent of the UK Land Registry. Prices are opaque. Valuations diverge by 30%. Here's how data-driven property decisions are finally becoming possible.",
    readTime:   8,
    date:       '7 May 2024',
    image:      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=900&auto=format&fit=crop&q=80',
    author:     { name: 'Paul', role: 'Founder, NeuroSpark', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
    featured:   false,
    tags:       ['Real Estate', 'Ardhi Agent', 'Property Investment', 'Nairobi'],
    body: [
      { type: 'p', content: "The Kenyan property market transacts billions of shillings annually on the basis of asking prices, broker assurances, and valuations that can diverge from each other by 25-30%. There is no public transaction price registry. Yield data is anecdotal. Planning compliance information is buried in county records that most buyers have never accessed." },
      { type: 'h2', content: 'The three information gaps that cost property buyers most' },
      { type: 'p', content: "First, price benchmarking. Without access to actual transaction data — as opposed to asking prices — buyers have no way to know whether they are paying a fair price. Overpaying by 15% on a KES 50M property is a KES 7.5M error that could have been avoided with proper comparable analysis." },
      { type: 'h2', content: 'Planning compliance: the hidden risk most buyers ignore' },
      { type: 'p', content: "Riparian reserve encroachments (the 30m rule under WRMA), plot ratio violations, and building line breaches are common in Nairobi's property market — especially in rapidly developed areas like Kiambu Road, Ruiru, and parts of Westlands. A property transacting at KES 40M that has a riparian reserve encroachment affecting 20% of the developable land is functionally worth significantly less. This information is available; it's just not in the standard due diligence workflow." },
      { type: 'h2', content: 'How Ardhi closes the gap' },
      { type: 'p', content: "The Ardhi agent aggregates transaction data from court-filed transfers, bank-instructed valuations, and agent listing databases. It applies location scoring and comparable weighting to produce evidence-based market value estimates. It checks county planning records for zoning, plot ratio, riparian, and height restrictions. It delivers a structured property intelligence brief within 24 hours of request — at a fraction of the cost of a full KISM valuation." },
    ],
  },
]

const CATEGORIES = ['All', 'AI Agents', 'Tax & Compliance', 'SEO', 'Agriculture', 'Real Estate']

const CAT_COLOR = {
  'AI Agents':       '#3B82F6',
  'Tax & Compliance':'#10B981',
  'SEO':             '#F59E0B',
  'Agriculture':     '#22C55E',
  'Real Estate':     '#8B5CF6',
}

// ─── Shared ────────────────────────────────────────────────────────────────
function DotGrid({ opacity = 0.12 }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="blogDots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill={`rgba(201,168,76,${opacity})`} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blogDots)" />
      </svg>
    </div>
  )
}

function CategoryBadge({ cat, small }) {
  const color = CAT_COLOR[cat] || C.gold
  return (
    <span style={{
      fontFamily: FM, fontWeight: 700,
      fontSize: small ? '0.65rem' : '0.7rem',
      letterSpacing: '0.07em',
      color, background: `${color}14`,
      border: `1px solid ${color}35`,
      borderRadius: 999, padding: small ? '2px 9px' : '3px 11px',
      display: 'inline-block',
    }}>
      {cat.toUpperCase()}
    </span>
  )
}

// ─── NewsletterBlock ────────────────────────────────────────────────────────
function NewsletterBlock() {
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)
  const [ref, visible] = useInView()

  const submit = () => {
    if (!email.includes('@')) { alert('Please enter a valid email.'); return }
    window.open(`https://wa.me/254799644100?text=${encodeURIComponent(`Please subscribe ${email} to the NeuroSpark weekly digest.`)}`, '_blank')
    setSent(true)
  }

  return (
    <section ref={ref} style={{ background: C.sand, padding: 'clamp(64px,8vw,100px) 0' }}>
      <div className="max-w-[640px] mx-auto px-6 text-center">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-3`} style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: C.gold, fontWeight: 700 }}>
          WEEKLY DIGEST
        </p>
        <h2 className={visible ? 'animate-fade-up delay-100' : 'hidden-anim'} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.5rem,2.8vw,2rem)', color: C.navy, marginBottom: 10 }}>
          Get Kenya's Best Business Intelligence Weekly
        </h2>
        <p className={visible ? 'animate-fade-up delay-200' : 'hidden-anim'} style={{ fontFamily: FB, color: C.muted, lineHeight: 1.8, marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
          Join 2,000+ East African business owners. Tax deadlines, AI automation case studies, SEO strategies, and regulatory updates — every Friday morning.
        </p>

        {sent ? (
          <div className={visible ? 'animate-fade-up delay-300' : 'hidden-anim'} style={{ background: 'white', border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>✅</div>
            <p style={{ fontFamily: FB, fontWeight: 700, color: C.navy, fontSize: '0.95rem' }}>You're in. First edition arrives Friday.</p>
          </div>
        ) : (
          <div className={`${visible ? 'animate-fade-up delay-300' : 'hidden-anim'} flex flex-wrap gap-3 justify-center`} style={{ maxWidth: 460, margin: '0 auto' }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{
                flex: 1, minWidth: 200, border: `1.5px solid ${C.border}`,
                borderRadius: 999, padding: '12px 18px',
                fontFamily: FB, fontSize: '0.9rem', color: C.charcoal,
                background: 'white', outline: 'none',
              }}
            />
            <button
              onClick={submit}
              style={{
                background: C.gold, color: C.navy, border: 'none',
                borderRadius: 999, padding: '12px 22px',
                fontFamily: FB, fontWeight: 700, fontSize: '0.88rem',
                cursor: 'pointer', transition: 'all 0.3s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#b8943e'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,168,76,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.boxShadow = 'none' }}
            >
              Subscribe Free
            </button>
          </div>
        )}
        <p style={{ fontFamily: FB, fontSize: '0.76rem', color: '#94A3B8', marginTop: 12 }}>
          No spam. Unsubscribe anytime. 2,000+ subscribers.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LIST VIEW COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function ListHero({ query, setQuery, activeCategory, setActiveCategory }) {
  return (
    <section className="relative overflow-hidden" style={{
      background: C.navy,
      paddingTop:    'clamp(110px,13vw,150px)',
      paddingBottom: 'clamp(48px,6vw,72px)',
    }}>
      <DotGrid />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 80%, rgba(201,168,76,0.09) 0%, transparent 60%)',
      }} />

      <div className="max-w-[860px] mx-auto px-6 relative z-10">
        <div className="text-center mb-8">
          <p className="animate-fade-up mb-3" style={{ fontFamily: FB, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: C.gold, fontWeight: 700 }}>
            INSIGHTS & IDEAS
          </p>
          <h1 className="animate-fade-up delay-100" style={{
            fontFamily: FD, fontWeight: 700,
            fontSize: 'clamp(1.8rem,4vw,3rem)',
            color: 'white', lineHeight: 1.2, marginBottom: 6,
          }}>
            AI, Automation & Business in Kenya.
          </h1>
        </div>

        {/* Search bar */}
        <div className="animate-fade-up delay-200 mx-auto" style={{ maxWidth: 480, position: 'relative', marginBottom: 20 }}>
          <Search size={16} color="#64748B" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search articles…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%', border: '1.5px solid rgba(255,255,255,0.15)',
              borderRadius: 999, padding: '12px 40px 12px 42px',
              fontFamily: FB, fontSize: '0.9rem',
              background: 'rgba(255,255,255,0.1)', color: 'white',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="animate-fade-up delay-300 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: FB, fontWeight: 700, fontSize: '0.8rem',
                  padding: '7px 16px', borderRadius: 999,
                  border: `1.5px solid ${isActive ? C.gold : 'rgba(255,255,255,0.18)'}`,
                  background: isActive ? C.goldDim : 'transparent',
                  color: isActive ? C.gold : '#94A3B8',
                  cursor: 'pointer', transition: 'all 0.25s',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FeaturedPost({ post }) {
  const [hover, setHover] = useState(false)
  const [ref, visible] = useInView()

  return (
    <section ref={ref} style={{ background: C.bg, padding: 'clamp(48px,6vw,72px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-6`} style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: C.gold }}>
          FEATURED ARTICLE
        </p>
        <Link
          to={`/blog/${post.slug}`}
          className={`${visible ? 'animate-fade-up delay-100' : 'hidden-anim'} no-underline grid`}
          style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 0, border: `1.5px solid ${hover ? C.gold : C.border}`, borderRadius: 20, overflow: 'hidden', textDecoration: 'none', transition: 'all 0.35s', boxShadow: hover ? '0 16px 52px rgba(10,31,68,0.14)' : '0 4px 24px rgba(10,31,68,0.07)', transform: hover ? 'translateY(-4px)' : 'none' }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {/* Image */}
          <div style={{ overflow: 'hidden', minHeight: 280 }}>
            <img
              src={post.image} alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.6s ease', minHeight: 280 }}
            />
          </div>
          {/* Text */}
          <div style={{ background: 'white', padding: 'clamp(28px,4vw,44px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: 14 }}>
              <CategoryBadge cat={post.category} />
            </div>
            <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.3rem,2.4vw,1.8rem)', color: C.navy, lineHeight: 1.3, marginBottom: 14 }}>
              {post.title}
            </h2>
            <p style={{ fontFamily: FB, fontSize: '0.92rem', color: C.muted, lineHeight: 1.8, marginBottom: 20 }}>
              {post.excerpt}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={13} color={C.muted} />
                <span style={{ fontFamily: FB, fontSize: '0.78rem', color: C.muted }}>{post.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={13} color={C.muted} />
                <span style={{ fontFamily: FB, fontSize: '0.78rem', color: C.muted }}>{post.readTime} min read</span>
              </div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.gold, fontFamily: FB, fontWeight: 700, fontSize: '0.88rem' }}>
              Read Article <ArrowRight size={14} style={{ transition: 'transform 0.25s', transform: hover ? 'translateX(4px)' : 'none' }} />
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}

function BlogCard({ post, delay }) {
  const [hover, setHover] = useState(false)
  const [ref, visible] = useInView()

  return (
    <Link
      ref={ref}
      to={`/blog/${post.slug}`}
      className={`${visible ? `animate-fade-up ${delay}` : 'hidden-anim'} no-underline block`}
      style={{
        textDecoration: 'none', borderRadius: 16, overflow: 'hidden',
        border: `1.5px solid ${hover ? C.gold : 'transparent'}`,
        boxShadow: hover ? '0 12px 40px rgba(10,31,68,0.14)' : '0 2px 16px rgba(10,31,68,0.07)',
        transform: hover ? 'translateY(-5px)' : 'none',
        transition: 'all 0.3s ease',
        background: 'white',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Thumbnail */}
      <div style={{ overflow: 'hidden', aspectRatio: '16/9' }}>
        <img
          src={post.image} alt={post.title} loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hover ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s ease' }}
        />
      </div>
      {/* Body */}
      <div style={{ padding: '18px 20px 22px' }}>
        <div style={{ marginBottom: 10 }}><CategoryBadge cat={post.category} small /></div>
        <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: '1.02rem', color: C.navy, lineHeight: 1.35, marginBottom: 8 }}>
          {post.title}
        </h3>
        <p style={{ fontFamily: FB, fontSize: '0.84rem', color: C.muted, lineHeight: 1.65, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.excerpt}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={post.author.avatar} alt={post.author.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontFamily: FB, fontWeight: 700, fontSize: '0.76rem', color: C.navy }}>{post.author.name}</div>
              <div style={{ fontFamily: FB, fontSize: '0.7rem', color: C.muted }}>{post.date}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.muted }}>
            <Clock size={12} />
            <span style={{ fontFamily: FB, fontSize: '0.74rem' }}>{post.readTime}m</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE POST VIEW
// ─────────────────────────────────────────────────────────────────────────────

function PostHero({ post }) {
  return (
    <section style={{ paddingTop: 70 }}>
      <div style={{ position: 'relative', maxHeight: 480, overflow: 'hidden' }}>
        <img src={post.image} alt={post.title} style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,31,68,0.3) 0%, rgba(10,31,68,0.8) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(24px,4vw,48px)' }}>
          <div className="max-w-[860px] mx-auto">
            <CategoryBadge cat={post.category} />
            <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.6rem,3.5vw,2.6rem)', color: 'white', lineHeight: 1.2, marginTop: 12, marginBottom: 14, maxWidth: 700 }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={post.author.avatar} alt={post.author.name} style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${C.gold}`, objectFit: 'cover' }} />
                <div>
                  <div style={{ fontFamily: FB, fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>{post.author.name}</div>
                  <div style={{ fontFamily: FB, fontSize: '0.76rem', color: '#94A3B8' }}>{post.author.role}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: FB, fontSize: '0.78rem', color: '#94A3B8' }}><Calendar size={12} /> {post.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: FB, fontSize: '0.78rem', color: '#94A3B8' }}><Clock size={12} /> {post.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PostBody({ post }) {
  return (
    <section style={{ background: C.bg, padding: 'clamp(40px,6vw,72px) 0' }}>
      <div className="max-w-[720px] mx-auto px-6">
        {/* Back link */}
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.muted, fontFamily: FB, fontSize: '0.84rem', textDecoration: 'none', marginBottom: 32 }}
          onMouseEnter={e => e.currentTarget.style.color = C.gold}
          onMouseLeave={e => e.currentTarget.style.color = C.muted}
        >
          ← Back to Blog
        </Link>

        {/* Excerpt */}
        <p style={{ fontFamily: FD, fontStyle: 'italic', fontSize: '1.15rem', color: C.navy, lineHeight: 1.75, marginBottom: 32, paddingLeft: 20, borderLeft: `3px solid ${C.gold}` }}>
          {post.excerpt}
        </p>

        {/* Body blocks */}
        {post.body.map((block, i) => {
          if (block.type === 'h2') return (
            <h2 key={i} style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.2rem,2.2vw,1.55rem)', color: C.navy, lineHeight: 1.3, marginTop: 40, marginBottom: 14 }}>
              {block.content}
            </h2>
          )
          return (
            <p key={i} style={{ fontFamily: FB, fontSize: '1rem', color: C.charcoal, lineHeight: 1.9, marginBottom: 18 }}>
              {block.content}
            </p>
          )
        })}

        {/* Tags */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {post.tags.map(tag => (
            <span key={tag} style={{ fontFamily: FM, fontWeight: 600, fontSize: '0.74rem', color: C.navy, background: C.goldDim, border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 6, padding: '4px 11px' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Agent CTA */}
        <div style={{ background: C.navy, borderRadius: 16, padding: '28px 28px', marginTop: 36, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: FD, fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: 4 }}>Ready to put this into practice?</p>
            <p style={{ fontFamily: FB, fontSize: '0.84rem', color: '#94A3B8' }}>See the agent that handles this automatically.</p>
          </div>
          <Link to="/agents" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.gold, color: C.navy, borderRadius: 999, padding: '10px 20px', fontFamily: FB, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
            Browse Agents <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function SuggestedArticles({ current }) {
  const suggestions = POSTS.filter(p => p.slug !== current.slug).slice(0, 3)
  const [ref, visible] = useInView()

  return (
    <section ref={ref} style={{ background: C.sand, padding: 'clamp(48px,6vw,80px) 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <p className={`${visible ? 'animate-fade-up' : 'hidden-anim'} mb-4`} style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: C.gold }}>
          YOU MIGHT ALSO LIKE
        </p>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
          {suggestions.map((p, i) => (
            <BlogCard key={p.slug} post={p} delay={`delay-${(i + 1) * 100}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── BlogPage Root ────────────────────────────────────────────────────────────
export default function BlogPage() {
  const { slug }              = useParams()
  const navigate              = useNavigate()
  const [query,        setQuery]       = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  // ── Single post view ──────────────────────────────────────────────────────
  if (slug) {
    const post = POSTS.find(p => p.slug === slug)
    if (!post) {
      useEffect(() => { navigate('/blog', { replace: true }) }, [])
      return null
    }
    return (
      <>
        <PostHero post={post} />
        <PostBody post={post} />
        <SuggestedArticles current={post} />
        <NewsletterBlock />
      </>
    )
  }

  // ── List view ─────────────────────────────────────────────────────────────
  const featuredPost = POSTS.find(p => p.featured) || POSTS[0]

  const filtered = useMemo(() => {
    let list = POSTS.filter(p => !p.featured)
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      )
    }
    return list
  }, [activeCategory, query])

  return (
    <>
      <ListHero
        query={query} setQuery={setQuery}
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
      />
      {!query && activeCategory === 'All' && <FeaturedPost post={featuredPost} />}

      <section style={{ background: C.bg, padding: 'clamp(32px,4vw,60px) 0 clamp(60px,8vw,100px)' }}>
        <div className="max-w-[1100px] mx-auto px-6">
          {query || activeCategory !== 'All' ? (
            <p style={{ fontFamily: FB, fontSize: '0.84rem', color: C.muted, marginBottom: 24 }}>
              {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
              {query ? ` for "${query}"` : ''}
            </p>
          ) : (
            <p className="mb-6" style={{ fontFamily: FM, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: C.gold }}>
              ALL ARTICLES
            </p>
          )}

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: C.muted, fontFamily: FB }}>
              No articles found. Try a different search or category.
            </div>
          ) : (
            <div className="grid gap-7" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))' }}>
              {filtered.map((p, i) => (
                <BlogCard key={p.slug} post={p} delay={`delay-${(i % 3 + 1) * 100}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      <NewsletterBlock />
    </>
  )
}

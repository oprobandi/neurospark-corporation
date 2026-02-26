import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ChevronDown, ChevronRight, ArrowRight, Check,
  Bot, Globe, TrendingUp, Play, MapPin, Twitter,
  Linkedin, Instagram, Plus, Minus, Zap, Shield,
  Clock, Code2, Send, Phone, MessageCircle
} from "lucide-react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const PHONE_NUMBER = "254799644100";
const PHONE_DISPLAY = "(+254) 799 644 100";
const WA_LINK = `https://wa.me/${PHONE_NUMBER}`;
const TEL_LINK = `tel:+${PHONE_NUMBER}`;

const IMAGES = {
  hero:         "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80&auto=format&fit=crop",
  serviceAuto:  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80&auto=format&fit=crop",
  serviceWeb:   "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=700&q=80&auto=format&fit=crop",
  serviceSeo:   "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80&auto=format&fit=crop",
  collab:       "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80&auto=format&fit=crop",
  team1:        "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=120&q=80&auto=format&fit=crop",
  team2:        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&auto=format&fit=crop",
  team3:        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&q=80&auto=format&fit=crop",
  // Carousel slides
  slide1:       "https://images.unsplash.com/photo-1573165067541-4cd6d9837902?w=1600&q=85&auto=format&fit=crop",
  slide2:       "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85&auto=format&fit=crop",
  slide3:       "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1600&q=85&auto=format&fit=crop",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Inter:wght@400;500;600&display=swap');

  :root {
    --navy: #0A1F44;
    --navy-light: #0F2B5B;
    --gold: #C9A84C;
    --sky: #38BDF8;
    --wa-green: #25D366;
    --body: #374151;
    --muted: #6B7280;
    --border: #E5E7EB;
    --bg-alt: #F0F4FA;
    --slate: #94A3B8;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', sans-serif; color: var(--body); background: #fff; overflow-x: hidden; }
  h1, h2, h3, h4, h5 { font-family: 'Manrope', sans-serif; }

  .eyebrow {
    font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--gold);
  }
  .headline {
    font-family: 'Manrope', sans-serif; font-weight: 800;
    font-size: clamp(30px, 4vw, 54px); line-height: 1.1; color: var(--navy);
  }

  /* Navbar */
  .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: white; transition: border-bottom 0.3s, box-shadow 0.3s; }
  .navbar.scrolled { border-bottom: 1px solid var(--border); box-shadow: 0 2px 12px rgba(10,31,68,0.06); }

  /* Dropdown */
  .dropdown-menu { opacity: 0; transform: translateY(-8px); pointer-events: none; transition: opacity 0.2s ease, transform 0.2s ease; }
  .dropdown-trigger:hover .dropdown-menu, .dropdown-menu:hover { opacity: 1; transform: translateY(0); pointer-events: all; }

  /* Animations */
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  .float-card { animation: float 4s ease-in-out infinite; }

  @keyframes pulse-dot { 0%,100%{box-shadow:0 0 0 0 rgba(56,189,248,0.4)} 50%{box-shadow:0 0 0 6px rgba(56,189,248,0)} }
  .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }

  @keyframes wa-pulse { 0%,100%{box-shadow:0 4px 24px rgba(37,211,102,0.45)} 50%{box-shadow:0 4px 32px rgba(37,211,102,0.7)} }
  .wa-widget { animation: wa-pulse 2.5s ease-in-out infinite; }

  @keyframes tooltip-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .tooltip-in { animation: tooltip-in 0.3s ease-out forwards; }

  /* Fade up */
  .fade-up { opacity: 0; transform: translateY(16px); transition: opacity 0.4s ease-out, transform 0.4s ease-out; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }
  @media (prefers-reduced-motion: reduce) {
    .fade-up { opacity:1; transform:none; transition:none; }
    .float-card, .pulse-dot, .wa-widget { animation:none; }
  }

  /* Cards */
  .service-card { transition: transform 0.25s ease, box-shadow 0.25s ease; border-top: 3px solid transparent; }
  .service-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(10,31,68,0.12); }
  .service-card.gold:hover { border-top-color: var(--gold); }
  .service-card.sky:hover { border-top-color: var(--sky); }
  .service-card.gradient:hover { border-image: linear-gradient(90deg,var(--sky),var(--gold)) 1; }

  .result-card { transition: box-shadow 0.3s ease; border-top: 3px solid var(--gold); }
  .result-card:hover { box-shadow: 0 0 0 1px rgba(201,168,76,0.3), 0 8px 32px rgba(201,168,76,0.12); }

  /* Accordion */
  .step-content { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
  .step-content.open { max-height: 200px; }
  .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
  .faq-answer.open { max-height: 300px; }

  /* Drawer */
  .mobile-drawer { transform: translateX(100%); transition: transform 0.3s ease; }
  .mobile-drawer.open { transform: translateX(0); }

  /* ── Hero Carousel ── */
  @keyframes ken-burns   { 0%{transform:scale(1) translateX(0) translateY(0)} 100%{transform:scale(1.12) translateX(-2%) translateY(-1%)} }
  @keyframes ken-burns-2 { 0%{transform:scale(1) translateX(0) translateY(0)} 100%{transform:scale(1.1) translateX(2%) translateY(-1.5%)} }
  @keyframes ken-burns-3 { 0%{transform:scale(1.08) translateX(1%) translateY(0)} 100%{transform:scale(1) translateX(-1%) translateY(1%)} }
  .slide-bg-1 { animation: ken-burns   7s ease-out forwards; }
  .slide-bg-2 { animation: ken-burns-2 7s ease-out forwards; }
  .slide-bg-3 { animation: ken-burns-3 7s ease-out forwards; }

  @keyframes slide-text-in { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  .slide-eyebrow  { animation: slide-text-in 0.6s 0.2s  ease-out both; }
  .slide-headline { animation: slide-text-in 0.7s 0.45s ease-out both; }
  .slide-sub      { animation: slide-text-in 0.6s 0.7s  ease-out both; }
  .slide-ctas     { animation: slide-text-in 0.6s 0.9s  ease-out both; }
  .slide-badges   { animation: slide-text-in 0.5s 1.1s  ease-out both; }

  @keyframes progress-fill { from{width:0%} to{width:100%} }
  .progress-bar-fill { animation: progress-fill 6s linear forwards; }

  .carousel-arrow {
    width: 48px; height: 48px; border-radius: 50%;
    background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.25);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; backdrop-filter: blur(8px);
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
  }
  .carousel-arrow:hover { background: rgba(201,168,76,0.35); border-color: var(--gold); transform: scale(1.08); }

  .slide-dot {
    height: 3px; border-radius: 2px; cursor: pointer;
    background: rgba(255,255,255,0.3);
    transition: width 0.35s ease, background 0.35s ease;
  }
  .slide-dot.active { background: var(--gold); }

  @media (prefers-reduced-motion: reduce) {
    .slide-bg-1,.slide-bg-2,.slide-bg-3,.progress-bar-fill { animation: none; }
    .slide-eyebrow,.slide-headline,.slide-sub,.slide-ctas,.slide-badges { animation: none; opacity:1; transform:none; }
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f1f1f1; }
  ::-webkit-scrollbar-thumb { background: var(--navy); border-radius: 3px; }

  /* Footer border */
  .footer-border {
    height: 4px;
    background: repeating-linear-gradient(
      90deg, var(--gold) 0px, var(--gold) 8px, transparent 8px, transparent 16px,
      var(--sky) 16px, var(--sky) 24px, transparent 24px, transparent 32px
    );
  }

  /* Nav links */
  .nav-link { position: relative; color: var(--body); font-size: 14px; font-weight: 500; padding: 4px 0; text-decoration: none; transition: color 0.2s; }
  .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:2px; background:var(--gold); transform:scaleX(0); transition:transform 0.2s ease; }
  .nav-link:hover { color: var(--navy); }
  .nav-link:hover::after { transform: scaleX(1); }

  /* Buttons */
  .btn-navy {
    background: var(--navy); color: white;
    font-family: 'Inter',sans-serif; font-size: 14px; font-weight: 600;
    padding: 11px 22px; border-radius: 50px; border: none; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    display: inline-flex; align-items: center; gap: 7px;
    text-decoration: none; white-space: nowrap;
  }
  .btn-navy:hover { background: #0d2a5e; transform: translateY(-1px); }

  .btn-wa {
    background: var(--wa-green); color: white;
    font-family: 'Inter',sans-serif; font-size: 14px; font-weight: 600;
    padding: 11px 22px; border-radius: 50px; border: none; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    display: inline-flex; align-items: center; gap: 7px;
    text-decoration: none; white-space: nowrap;
  }
  .btn-wa:hover { background: #1ebc5a; transform: translateY(-1px); }

  .btn-gold {
    background: var(--gold); color: white;
    font-family: 'Inter',sans-serif; font-size: 15px; font-weight: 600;
    padding: 14px 36px; border-radius: 50px; border: none; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-gold:hover { background: #b8913a; transform: translateY(-1px); }

  /* Logo placeholder */
  .logo-placeholder {
    width: 44px; height: 44px; border-radius: 8px;
    border: 2px dashed #CBD5E1; background: #F8FAFC;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; cursor: pointer; transition: border-color 0.2s, background 0.2s;
    position: relative; overflow: hidden;
  }
  .logo-placeholder:hover { border-color: var(--gold); background: #FFF9EC; }
  .logo-placeholder input[type=file] { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }

  @media (max-width: 767px) { .btn-navy, .btn-wa, .btn-gold { width:100%; justify-content:center; } }
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const useFadeUp = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};

const useCountUp = (target, duration = 1600) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { ref, count };
};

const ClientLogos = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
    {["Equity Bank", "Safaricom", "KPLC", "Nation Media", "KenGen"].map(name => (
      <div key={name} style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#9CA3AF", textTransform: "uppercase" }}>{name}</div>
    ))}
  </div>
);

// Official WhatsApp SVG icon
const WhatsAppIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─── FLOATING WHATSAPP WIDGET ─────────────────────────────────────────────────
const FloatingWhatsApp = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: "fixed", bottom: "28px", right: "28px", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
      {showTooltip && (
        <div className="tooltip-in" style={{
          background: "white", borderRadius: "12px", padding: "10px 14px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: "1px solid var(--border)",
          fontSize: "13px", fontWeight: 600, color: "var(--navy)", whiteSpace: "nowrap", position: "relative"
        }}>
          💬 Chat with us on WhatsApp
          <div style={{ position: "absolute", bottom: "-6px", right: "22px", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid white" }} />
        </div>
      )}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-widget"
        title={`WhatsApp: ${PHONE_DISPLAY}`}
        style={{
          width: "60px", height: "60px", borderRadius: "50%",
          background: "var(--wa-green)",
          display: "flex", alignItems: "center", justifyContent: "center",
          textDecoration: "none", transition: "transform 0.2s"
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; setShowTooltip(true); }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        <WhatsAppIcon size={30} color="white" />
      </a>
    </div>
  );
};

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled]     = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoSrc, setLogoSrc]       = useState(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setLogoSrc(URL.createObjectURL(file));
  };

  const navLinks = ["Services", "How It Works", "Results", "Pricing", "Contact"];
  const services = [
    { icon: <Bot size={20} />,        name: "Task Automation", desc: "Autonomous agents for back-office operations" },
    { icon: <Code2 size={20} />,      name: "Web Development", desc: "Full-service websites built & maintained" },
    { icon: <TrendingUp size={20} />, name: "Managed SEO",     desc: "Data-driven SEO across East African markets" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>

          {/* ── Logo area ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Clickable logo placeholder */}
            <div className="logo-placeholder" title="Click to upload your logo">
              {logoSrc ? (
                <img src={logoSrc} alt="Company Logo" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "6px" }} />
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                  <span style={{ position: "absolute", bottom: "2px", left: 0, right: 0, textAlign: "center", fontSize: "6px", color: "#CBD5E1", letterSpacing: "0.03em" }}>LOGO</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleLogoUpload} />
            </div>

            {/* Full company name wordmark */}
            <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
              <div style={{ fontSize: "16px" }}>
                <span style={{ color: "var(--navy)" }}>Neurospark</span>
              </div>
              <div style={{ fontSize: "11px", letterSpacing: "0.06em", fontWeight: 700, color: "var(--gold)", textTransform: "uppercase" }}>
                Corporation
              </div>
            </div>
          </div>

          {/* ── Desktop nav ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }} className="desktop-nav">
            {navLinks.map(link =>
              link === "Services" ? (
                <div key={link} className="dropdown-trigger" style={{ position: "relative" }}>
                  <button style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer" }} className="nav-link">
                    {link} <ChevronDown size={13} />
                  </button>
                  <div className="dropdown-menu" style={{
                    position: "absolute", top: "calc(100% + 16px)", left: "-130px",
                    background: "white", borderRadius: "12px",
                    boxShadow: "0 8px 40px rgba(10,31,68,0.12)",
                    border: "1px solid var(--border)", padding: "20px",
                    width: "500px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", zIndex: 999
                  }}>
                    {services.map(s => (
                      <div key={s.name} style={{ padding: "12px", borderRadius: "8px", cursor: "pointer", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--bg-alt)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{ color: "var(--sky)", marginBottom: "8px" }}>{s.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--navy)", marginBottom: "4px" }}>{s.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <a key={link} href={`#${link.toLowerCase().replace(/\s+/g,"-")}`} className="nav-link">{link}</a>
              )
            )}
          </div>

          {/* ── CTA buttons ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <a href={TEL_LINK} className="btn-navy" style={{ padding: "9px 18px", fontSize: "13px" }}>
              <Phone size={13} /> Call Us
            </a>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ padding: "9px 18px", fontSize: "13px" }}>
              <WhatsAppIcon size={13} /> WhatsApp
            </a>
            <button onClick={() => setDrawerOpen(true)} className="hamburger-btn"
              style={{ background: "none", border: "none", cursor: "pointer", display: "none", padding: "4px" }}>
              <Menu size={22} color="var(--navy)" />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer overlay */}
      {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(10,31,68,0.6)", zIndex: 1001 }} />}

      {/* Mobile drawer */}
      <div className={`mobile-drawer${drawerOpen ? " open" : ""}`} style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "300px",
        background: "var(--navy)", zIndex: 1002, padding: "24px", display: "flex", flexDirection: "column"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" }}>
          <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800 }}>
            <span style={{ color: "white", fontSize: "15px" }}>Neurospark </span>
            <span style={{ color: "var(--gold)", fontSize: "15px" }}>Corporation</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={20} color="white" />
          </button>
        </div>
        {navLinks.map(link => (
          <a key={link} href={`#${link.toLowerCase().replace(/\s+/g,"-")}`} onClick={() => setDrawerOpen(false)} style={{
            color: "white", fontSize: "16px", fontWeight: 600, padding: "14px 0",
            borderBottom: "1px solid rgba(255,255,255,0.08)", textDecoration: "none",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            {link} <ChevronRight size={15} opacity={0.5} />
          </a>
        ))}
        <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <a href={TEL_LINK} className="btn-navy" style={{ justifyContent: "center" }}>
            <Phone size={15} /> Call {PHONE_DISPLAY}
          </a>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ justifyContent: "center" }}>
            <WhatsAppIcon size={15} /> WhatsApp Us
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 1020px) { .desktop-nav { display: none !important; } }
        @media (max-width: 640px)  { .btn-navy, .btn-wa { display: none !important; } }
        @media (max-width: 1020px) { .hamburger-btn { display: block !important; } }
      `}</style>
    </>
  );
};

// ─── HERO CAROUSEL ────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 0,
    img: "https://images.unsplash.com/photo-1573165067541-4cd6d9837902?w=1600&q=85&auto=format&fit=crop",
    kbClass: "slide-bg-1",
    // Deep navy + warm gold tint
    overlay: "linear-gradient(105deg, rgba(10,31,68,0.88) 0%, rgba(10,31,68,0.65) 55%, rgba(10,31,68,0.3) 100%)",
    eyebrow: "🇰🇪 Kenya's Autonomous AI Company",
    headline: ["Reclaim 12,000+", "Corporate Hours.", "Let Agents Work."],
    accentLine: 2,
    sub: "Deploy autonomous AI agents that process invoices, reconcile data, and manage back-office workflows 24/7 — with 99.4% accuracy and zero overtime.",
    stat1: { val: "60%", label: "Avg. Time Saved" },
    stat2: { val: "97%", label: "Client Retention" },
    tag: "Enterprise Automation",
    tagColor: "var(--gold)",
  },
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85&auto=format&fit=crop",
    kbClass: "slide-bg-2",
    overlay: "linear-gradient(105deg, rgba(10,31,68,0.92) 0%, rgba(15,43,91,0.7) 50%, rgba(10,31,68,0.25) 100%)",
    eyebrow: "Full-Service Web Development",
    headline: ["Your Digital Presence,", "Engineered to", "Convert."],
    accentLine: 1,
    sub: "Custom-built, blazing-fast websites that represent your brand at its global best — designed in Nairobi, built for the world. Fully maintained by us.",
    stat1: { val: "400+", label: "Sites Delivered" },
    stat2: { val: "99.9%", label: "Uptime SLA" },
    tag: "Web Development",
    tagColor: "var(--sky)",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1600&q=85&auto=format&fit=crop",
    kbClass: "slide-bg-3",
    overlay: "linear-gradient(105deg, rgba(10,31,68,0.90) 0%, rgba(10,31,68,0.60) 55%, rgba(10,31,68,0.2) 100%)",
    eyebrow: "Managed SEO Strategy",
    headline: ["2.8× More Traffic.", "Dominate Search", "Across East Africa."],
    accentLine: 0,
    sub: "Data-driven SEO built for Kenyan and regional markets. We rank your business where it matters most — and keep it there with monthly reporting you can act on.",
    stat1: { val: "2.8×", label: "Avg. Traffic Growth" },
    stat2: { val: "6 mo", label: "Avg. Time to Results" },
    tag: "Managed SEO",
    tagColor: "#A78BFA",
  },
];

const HeroCarousel = () => {
  const [active, setActive]     = useState(0);
  const [prev, setPrev]         = useState(null);
  const [fading, setFading]     = useState(false);
  const [progKey, setProgKey]   = useState(0);
  const timerRef                = useRef(null);
  const DURATION                = 6000;

  const goTo = (idx) => {
    if (idx === active || fading) return;
    setPrev(active);
    setActive(idx);
    setFading(true);
    setProgKey(k => k + 1);
    setTimeout(() => { setPrev(null); setFading(false); }, 700);
  };

  const next = () => goTo((active + 1) % SLIDES.length);
  const prev_ = () => goTo((active - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    timerRef.current = setInterval(next, DURATION);
    return () => clearInterval(timerRef.current);
  }, [active]);

  const slide = SLIDES[active];

  return (
    <section style={{ position: "relative", height: "100vh", minHeight: "640px", overflow: "hidden", marginTop: "72px" }}>

      {/* ── Background layers ── */}
      {SLIDES.map((s, i) => (
        <div key={s.id} style={{
          position: "absolute", inset: 0,
          opacity: i === active ? 1 : (i === prev ? 0 : 0),
          transition: "opacity 0.85s cubic-bezier(0.4,0,0.2,1)",
          zIndex: i === active ? 2 : (i === prev ? 1 : 0),
        }}>
          <img
            src={s.img}
            alt=""
            className={i === active ? s.kbClass : ""}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transformOrigin: "center center" }}
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div style={{ position: "absolute", inset: 0, background: s.overlay }} />
          {/* Bottom vignette */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to top, rgba(10,31,68,0.6) 0%, transparent 100%)" }} />
        </div>
      ))}

      {/* Decorative gold diagonal accent */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: "3px", height: "100%",
        background: "linear-gradient(to bottom, var(--gold), transparent 60%)",
        zIndex: 10, opacity: 0.7
      }} />

      {/* ── Slide content ── */}
      <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "1200px", margin: "0 auto", padding: "0 60px" }} className="carousel-content-pad">
        <div style={{ maxWidth: "680px" }}>

          {/* Service tag pill */}
          <div key={`tag-${active}`} className="slide-eyebrow" style={{ marginBottom: "20px", display: "flex", align: "center", gap: "12px", alignItems: "center" }}>
            <span style={{
              display: "inline-block", padding: "5px 14px", borderRadius: "50px",
              border: `1.5px solid ${slide.tagColor}`,
              color: slide.tagColor, fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              backdropFilter: "blur(6px)", background: "rgba(255,255,255,0.06)"
            }}>{slide.tag}</span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 500 }}>{slide.eyebrow}</span>
          </div>

          {/* Headline */}
          <h1 key={`h-${active}`} style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, lineHeight: 1.07, marginBottom: "24px", fontSize: "clamp(36px,5.5vw,72px)" }}>
            {slide.headline.map((line, li) => (
              <div key={li} className="slide-headline" style={{
                color: li === slide.accentLine ? "var(--gold)" : "white",
                animationDelay: `${0.45 + li * 0.12}s`
              }}>{line}</div>
            ))}
          </h1>

          {/* Sub-copy */}
          <p key={`sub-${active}`} className="slide-sub" style={{
            color: "rgba(255,255,255,0.82)", fontSize: "clamp(14px,1.6vw,18px)",
            lineHeight: 1.72, marginBottom: "36px", maxWidth: "560px"
          }}>{slide.sub}</p>

          {/* CTA buttons */}
          <div key={`cta-${active}`} className="slide-ctas" style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "40px" }}>
            <a href={TEL_LINK} style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "var(--navy)", color: "white",
              padding: "14px 28px", borderRadius: "50px", textDecoration: "none",
              fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: "15px",
              border: "2px solid rgba(255,255,255,0.15)",
              transition: "background 0.2s, border-color 0.2s, transform 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(10,31,68,0.9)"; e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--navy)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = ""; }}
            >
              <Phone size={16} /> Call Us
            </a>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "var(--wa-green)", color: "white",
              padding: "14px 28px", borderRadius: "50px", textDecoration: "none",
              fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: "15px",
              transition: "background 0.2s, transform 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1ebc5a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--wa-green)"; e.currentTarget.style.transform = ""; }}
            >
              <WhatsAppIcon size={16} /> WhatsApp Us
            </a>
            <a href="#how-it-works" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              color: "rgba(255,255,255,0.75)", fontSize: "14px", fontWeight: 600,
              textDecoration: "none", padding: "14px 4px",
              transition: "color 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.75)"}
            >
              <Play size={14} fill="currentColor" /> See How It Works
            </a>
          </div>

          {/* Stat badges */}
          <div key={`badges-${active}`} className="slide-badges" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[slide.stat1, slide.stat2].map(st => (
              <div key={st.label} style={{
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.16)", borderRadius: "12px",
                padding: "12px 20px", display: "flex", flexDirection: "column", gap: "2px"
              }}>
                <span style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: "22px", color: "white", lineHeight: 1 }}>{st.val}</span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{st.label}</span>
              </div>
            ))}
            <div style={{
              background: "rgba(255,255,255,0.06)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px",
              padding: "12px 20px", display: "flex", flexDirection: "column", gap: "2px"
            }}>
              <span style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--gold)", lineHeight: 1 }}>200+</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>East African Clients</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Arrow nav ── */}
      <button onClick={prev_} className="carousel-arrow" style={{ position: "absolute", left: "24px", top: "50%", transform: "translateY(-50%)", zIndex: 20, border: "none" }}>
        <ChevronRight size={20} color="white" style={{ transform: "rotate(180deg)" }} />
      </button>
      <button onClick={next} className="carousel-arrow" style={{ position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)", zIndex: 20, border: "none" }}>
        <ChevronRight size={20} color="white" />
      </button>

      {/* ── Bottom controls ── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20, padding: "0 60px 32px" }} className="carousel-content-pad">
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px" }}>

          {/* Slide dots + labels */}
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
            {SLIDES.map((s, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                display: "flex", flexDirection: "column", gap: "8px", alignItems: "center"
              }}>
                <span style={{
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: i === active ? "white" : "rgba(255,255,255,0.35)",
                  transition: "color 0.3s"
                }}>{String(i + 1).padStart(2, "0")}</span>
                <div className={`slide-dot${i === active ? " active" : ""}`} style={{ width: i === active ? "48px" : "24px" }} />
              </button>
            ))}
          </div>

          {/* Slide label */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
              {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{slide.tag}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ maxWidth: "1200px", margin: "16px auto 0" }}>
          <div style={{ height: "2px", background: "rgba(255,255,255,0.12)", borderRadius: "1px", overflow: "hidden" }}>
            <div key={progKey} className="progress-bar-fill" style={{ height: "100%", background: "var(--gold)", borderRadius: "1px" }} />
          </div>
        </div>
      </div>

      {/* Slide count watermark */}
      <div style={{ position: "absolute", top: "50%", right: "80px", transform: "translateY(-50%)", zIndex: 5, fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: "180px", color: "rgba(255,255,255,0.03)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
        {String(active + 1).padStart(2, "0")}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .carousel-content-pad { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
    </section>
  );
};

// ─── METRICS BAR ──────────────────────────────────────────────────────────────
const MetricsBar = () => {
  const stats = [
    { num: 12000, suffix: "+", label: "Corporate Hours Automated", sub: "Across enterprise clients" },
    { num: 400,   suffix: "+", label: "Websites Delivered",        sub: "Built & maintained" },
    { num: 28,    suffix: "×", label: "Avg. SEO Traffic Growth",   sub: "In 6 months (2.8×)" },
    { num: 97,    suffix: "%", label: "Client Retention",          sub: "Year over year" },
  ];
  const CountStat = ({ num, suffix, label, sub }) => {
    const { ref, count } = useCountUp(num);
    const display = num === 28 ? (count / 10).toFixed(1) : count.toLocaleString();
    return (
      <div ref={ref} style={{ textAlign: "center", padding: "36px 16px" }}>
        <div style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,46px)", color: "var(--gold)", lineHeight: 1 }}>{display}{suffix}</div>
        <div style={{ color: "white", fontWeight: 700, fontSize: "13px", marginTop: "8px" }}>{label}</div>
        <div style={{ color: "var(--sky)", fontSize: "11px", marginTop: "4px" }}>{sub}</div>
      </div>
    );
  };
  return (
    <section style={{ background: "var(--navy)", borderTop: "2px solid var(--gold)", borderBottom: "2px solid var(--gold)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }} className="metrics-grid">
          {stats.map((s, i) => (
            <div key={s.label} style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.09)" : "none" }}>
              <CountStat {...s} />
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 760px) { .metrics-grid { grid-template-columns: repeat(2,1fr) !important; } }`}</style>
    </section>
  );
};

// ─── SERVICE CARD ─────────────────────────────────────────────────────────────
const ServiceCard = ({ service, delay }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          el.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
          el.style.opacity = "1"; el.style.transform = "translateY(0)";
        }, delay);
        obs.disconnect();
      }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`service-card ${service.accent}`} style={{
      background: "white", borderRadius: "14px", border: "1px solid var(--border)",
      overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column"
    }}>
      {/* Image */}
      <div style={{ position: "relative", height: "210px", overflow: "hidden" }}>
        <img
          src={service.image} alt={service.title} loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", display: "block" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(10,31,68,0.1) 0%, rgba(10,31,68,0.6) 100%)",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "14px 16px"
        }}>
          {/* Eyebrow pill */}
          <span style={{
            background: service.accent === "gold" ? "var(--gold)" : service.accent === "sky" ? "var(--sky)" : "linear-gradient(90deg,var(--sky),var(--gold))",
            color: "white", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", padding: "4px 12px", borderRadius: "50px"
          }}>{service.eyebrow}</span>
          {/* Icon */}
          <div style={{
            width: "38px", height: "38px", borderRadius: "9px",
            background: "rgba(255,255,255,0.93)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "var(--navy)"
          }}>{service.icon}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "26px 26px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: "18px", color: "var(--navy)", marginBottom: "10px" }}>{service.title}</h3>
        <p style={{ fontSize: "14px", lineHeight: 1.72, color: "var(--body)", marginBottom: "18px" }}>{service.desc}</p>
        <ul style={{ listStyle: "none", marginBottom: "22px", flex: 1 }}>
          {service.capabilities.map(cap => (
            <li key={cap} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "7px", fontSize: "13px", color: "var(--body)" }}>
              <Check size={13} color="var(--sky)" style={{ flexShrink: 0, marginTop: "2px" }} />
              {cap}
            </li>
          ))}
        </ul>
        <a href="#contact" style={{ color: "var(--gold)", fontWeight: 700, fontSize: "13px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px", width: "fit-content", transition: "gap 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.gap = "10px"}
          onMouseLeave={e => e.currentTarget.style.gap = "5px"}
        >
          Get Started <ArrowRight size={13} />
        </a>
      </div>
    </div>
  );
};

const Services = () => {
  const ref = useFadeUp();
  const services = [
    {
      icon: <Bot size={20} />, accent: "gold", eyebrow: "Back-Office AI",
      title: "Task Automation", image: IMAGES.serviceAuto,
      desc: "Our autonomous agents eliminate manual, repetitive tasks across procurement, finance, HR, and operations — reducing processing time by an average of 60%.",
      capabilities: ["Invoice & purchase order processing","Automated reporting & dashboards","HR onboarding workflows","Multi-system data reconciliation"],
    },
    {
      icon: <Code2 size={20} />, accent: "sky", eyebrow: "Digital Presence",
      title: "Web Development", image: IMAGES.serviceWeb,
      desc: "From strategy to launch, Neurospark builds fast, modern, conversion-optimised websites — and maintains them so your team never worries about uptime or updates.",
      capabilities: ["Custom design & development","eCommerce & SaaS platforms","Continuous maintenance SLA","Performance & security audits"],
    },
    {
      icon: <TrendingUp size={20} />, accent: "gradient", eyebrow: "Search Growth",
      title: "Managed SEO", image: IMAGES.serviceSeo,
      desc: "We grow your search presence across Google East Africa with technical excellence, locally-resonant content, and authoritative link building. Average 2.8× traffic in two quarters.",
      capabilities: ["Technical SEO audit & fixes","Local & regional keyword strategy","AI-powered content production","Monthly performance reporting"],
    },
  ];

  return (
    <section id="services" style={{ background: "var(--bg-alt)", padding: "96px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div className="fade-up" ref={ref} style={{ textAlign: "center", marginBottom: "56px" }}>
          <div className="eyebrow" style={{ marginBottom: "14px" }}>Our Services</div>
          <h2 className="headline" style={{ marginBottom: "14px" }}>Three Ways We Drive<br />Enterprise Results</h2>
          <p style={{ color: "var(--muted)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
            Each service line is powered by proprietary AI agents, purpose-built for the East African business context.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px" }} className="services-grid">
          {services.map((s, i) => <ServiceCard key={s.title} service={s} delay={i * 110} />)}
        </div>
      </div>
      <style>{`
        @media (max-width: 1020px) { .services-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 640px)  { .services-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
};

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
const HowItWorks = () => {
  const [openStep, setOpenStep] = useState(0);
  const ref = useFadeUp();
  const steps = [
    { num: "01", title: "Discovery & Scoping", preview: "We audit your operations and digital presence across Kenyan and regional markets.", detail: "Our team conducts a comprehensive analysis of your existing workflows, technology stack, and competitive landscape. We identify automation opportunities, website gaps, and SEO whitespace — then deliver a prioritised action plan with projected ROI." },
    { num: "02", title: "Agent Architecture & Build", preview: "Engineers configure, train, and test autonomous agents tailored to your workflows.", detail: "We design custom agent pipelines using battle-tested frameworks. Each agent is trained on your specific data, integrated with your existing systems via API, and rigorously tested before deployment. Full visibility throughout the build process." },
    { num: "03", title: "Deployment & Optimisation", preview: "Agents go live with a 30-day sprint and ongoing monthly reporting.", detail: "Launch is just the beginning. We run a structured 30-day optimisation sprint, monitoring metrics and adjusting parameters in real time. Monthly executive reports give your leadership clear visibility into automation ROI and efficiency gains." },
  ];

  return (
    <section id="how-it-works" style={{ background: "white", padding: "96px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: "80px", alignItems: "start" }} className="hiw-grid">
          <div className="fade-up" ref={ref} style={{ position: "sticky", top: "100px" }}>
            <div className="eyebrow" style={{ marginBottom: "14px" }}>The Process</div>
            <h2 className="headline" style={{ marginBottom: "18px" }}>From Audit to<br /><span style={{ color: "var(--gold)" }}>Autonomous Impact</span></h2>
            <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted)", marginBottom: "28px" }}>
              A structured three-phase methodology developed across 200+ enterprise engagements in Kenya and across East Africa.
            </p>
            <img src={IMAGES.collab} alt="Neurospark Corporation team" style={{ width: "100%", borderRadius: "12px", aspectRatio: "4/3", objectFit: "cover" }} loading="lazy" />
          </div>
          <div>
            {steps.map((step, i) => (
              <div key={step.num} style={{ display: "flex", gap: "22px" }} onClick={() => setOpenStep(openStep === i ? -1 : i)}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: openStep === i ? "var(--navy)" : "white", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: "13px", color: openStep === i ? "var(--gold)" : "var(--navy)", transition: "background 0.25s", cursor: "pointer" }}>{step.num}</div>
                  {i < steps.length - 1 && <div style={{ flex: 1, width: "2px", borderLeft: "2px dashed var(--gold)", opacity: 0.45, minHeight: "60px", margin: "8px 0" }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: "36px", cursor: "pointer" }}>
                  <h3 style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: "17px", color: "var(--navy)", marginBottom: "7px", display: "flex", alignItems: "center", gap: "8px" }}>
                    {step.title}
                    <span style={{ color: "var(--gold)", display: "inline-block", transition: "transform 0.3s", transform: openStep === i ? "rotate(45deg)" : "rotate(0)" }}>
                      {openStep === i ? <Minus size={15}/> : <Plus size={15}/>}
                    </span>
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.7 }}>{step.preview}</p>
                  <div className={`step-content${openStep === i ? " open" : ""}`}>
                    <p style={{ fontSize: "14px", color: "var(--body)", lineHeight: 1.75, marginTop: "14px", borderLeft: "3px solid var(--sky)", paddingLeft: "14px" }}>{step.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .hiw-grid { grid-template-columns: 1fr !important; gap: 48px !important; } .hiw-grid > div:first-child { position: static !important; } }
      `}</style>
    </section>
  );
};

// ─── CASE STUDIES ─────────────────────────────────────────────────────────────
const CaseStudies = () => {
  const ref = useFadeUp();
  const cases = [
    { metric: "67%", metricSub: "Reduction in Manual Processing Time", context: "A Nairobi-based SACCO deployed our invoice agent across 14 branches, eliminating 3 manual roles and reducing month-end close from 5 days to 1.", tag: "Task Automation" },
    { metric: "3.1×", metricSub: "Organic Search Traffic in 6 Months", context: "East Africa's leading logistics firm saw a 3.1× increase in Google impressions after Neurospark restructured their technical SEO and content strategy.", tag: "Managed SEO" },
    { metric: "99.9%", metricSub: "Uptime SLA Maintained for 18 Months", context: "A regulated financial services client entrusted us with their full web stack. Sub-second load times and zero downtime across their 12-country operation.", tag: "Web Development" },
  ];
  return (
    <section id="results" style={{ background: "var(--navy)", padding: "96px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div className="fade-up" ref={ref} style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "white", marginBottom: "14px" }}>Real Results</div>
          <h2 className="headline" style={{ color: "white", marginBottom: "14px" }}>The Numbers Speak<br />for Themselves</h2>
          <p style={{ color: "var(--slate)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>Outcomes measured across engagements spanning Kenya, Uganda, Tanzania, and Rwanda.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px" }} className="cases-grid">
          {cases.map(c => (
            <div key={c.metric} className="result-card" style={{ background: "var(--navy-light)", borderRadius: "12px", padding: "34px 28px", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#132d63"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--navy-light)"}
            >
              <div style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: "clamp(34px,5vw,54px)", color: "white", lineHeight: 1, marginBottom: "8px" }}>{c.metric}</div>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--gold)", marginBottom: "14px", lineHeight: 1.4 }}>{c.metricSub}</div>
              <p style={{ fontSize: "13px", lineHeight: 1.75, color: "var(--slate)", marginBottom: "24px" }}>{c.context}</p>
              <span style={{ display: "inline-block", background: "var(--sky)", color: "var(--navy)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "50px" }}>{c.tag}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 1020px) { .cases-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 640px)  { .cases-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const testimonials = [
    { quote: "Neurospark Corporation didn't just build us a website — they built us a growth engine. Our Nairobi-based team now closes 40% more leads per quarter because of the SEO work alone.", name: "Amina Wanjiku", title: "Head of Digital", company: "Equity Ventures Ltd", avatar: IMAGES.team3 },
    { quote: "The automation agents transformed how we close our books each month. What used to take a week of painful manual work now happens overnight. The ROI was evident within 60 days.", name: "James Mwangi", title: "CFO", company: "TransAfrica Logistics", avatar: IMAGES.team2 },
    { quote: "Working with a Kenyan-built AI company that truly understands our market context was the differentiator. Neurospark's team speaks our business language — and delivers globally competitive work.", name: "Njeri Kamau", title: "CTO", company: "KenyaFin Group", avatar: IMAGES.team1 },
  ];
  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 6000);
    return () => clearInterval(timerRef.current);
  }, []);
  const t = testimonials[current];
  return (
    <section style={{ background: "white", padding: "96px 0" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <div className="eyebrow" style={{ marginBottom: "48px" }}>Client Stories</div>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: "140px", lineHeight: 1, color: "var(--border)", position: "absolute", top: "-32px", left: "50%", transform: "translateX(-50%)", fontFamily: "Georgia,serif", pointerEvents: "none", userSelect: "none" }}>"</div>
          <div style={{ position: "relative" }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontStyle: "italic", fontSize: "clamp(15px,2.5vw,19px)", color: "var(--gold)", lineHeight: 1.65, fontWeight: 600, maxWidth: "640px", margin: "0 auto", minHeight: "90px" }}>"{t.quote}"</p>
            <div style={{ marginTop: "32px", display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
              <img src={t.avatar} alt={t.name} style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--gold)" }} loading="lazy" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--navy)", fontFamily: "Manrope,sans-serif" }}>{t.name}</div>
                <div style={{ fontSize: "12px", color: "var(--muted)" }}>{t.title} · {t.company}</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "36px" }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === current ? "var(--navy)" : "var(--border)", border: "none", cursor: "pointer", transition: "width 0.3s,background 0.3s" }} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const ref = useFadeUp();
  const faqs = [
    { q: "How quickly can Neurospark Corporation deploy an automation agent?", a: "Most automation engagements go from signed agreement to live deployment in 3–6 weeks. Our discovery sprint in week one identifies all technical requirements upfront to avoid delays." },
    { q: "Do you work with SMEs or only large enterprises?", a: "We serve both. Our pricing tiers are designed for growth-stage companies as well as large enterprise clients. If your operation has recurring, high-volume tasks — you're a strong candidate for automation ROI." },
    { q: "How does Neurospark Corporation handle data security?", a: "All data is processed under strict access controls. For regulated clients we support on-premise deployment and work within existing compliance frameworks including CBK and CMA requirements." },
    { q: "What does the ongoing engagement look like after launch?", a: "Every client receives a dedicated account manager, monthly performance reports, and live dashboard access. We operate on a rolling monthly retainer — no long lock-ins." },
    { q: "Can Neurospark agents integrate with our existing software?", a: "Yes. We have pre-built connectors for SAP, Sage, QuickBooks, Salesforce, HubSpot, and most ERP systems used across East Africa. Custom API integrations are included in our enterprise tier." },
  ];
  return (
    <section style={{ background: "var(--bg-alt)", padding: "96px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "4fr 8fr", gap: "80px", alignItems: "start" }} className="faq-grid">
          <div className="fade-up" ref={ref} style={{ position: "sticky", top: "100px" }}>
            <div className="eyebrow" style={{ marginBottom: "14px" }}>FAQ</div>
            <h2 className="headline" style={{ marginBottom: "18px" }}>Common<br /><span style={{ color: "var(--gold)" }}>Questions</span></h2>
            <p style={{ fontSize: "14px", lineHeight: 1.75, color: "var(--muted)", marginBottom: "24px" }}>Can't find your answer? Our team is available Mon–Fri, 8AM–6PM EAT.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <a href={TEL_LINK} className="btn-navy" style={{ justifyContent: "center", fontSize: "13px" }}>
                <Phone size={14} /> Call {PHONE_DISPLAY}
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ justifyContent: "center", fontSize: "13px" }}>
                <WhatsAppIcon size={14} /> WhatsApp Us
              </a>
            </div>
          </div>
          <div>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", textAlign: "left" }}>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--navy)", fontFamily: "Manrope,sans-serif" }}>{faq.q}</span>
                  <ChevronDown size={17} color="var(--gold)" style={{ flexShrink: 0, transition: "transform 0.3s", transform: openIdx === i ? "rotate(180deg)" : "rotate(0)" }} />
                </button>
                <div className={`faq-answer${openIdx === i ? " open" : ""}`}>
                  <p style={{ fontSize: "14px", lineHeight: 1.75, color: "var(--body)", paddingBottom: "22px" }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .faq-grid { grid-template-columns: 1fr !important; gap: 48px !important; } .faq-grid > div:first-child { position: static !important; } }
      `}</style>
    </section>
  );
};

// ─── FINAL CTA ────────────────────────────────────────────────────────────────
const FinalCTA = () => {
  const ref = useFadeUp();
  return (
    <section id="contact" style={{ background: "white", padding: "96px 0 80px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ width: "80px", height: "3px", background: "var(--gold)", margin: "0 auto 48px", borderRadius: "2px" }} />
        <div className="fade-up" ref={ref}>
          <h2 className="headline" style={{ marginBottom: "14px" }}>Ready to Automate,<br />Scale, and Lead?</h2>
          <p style={{ color: "var(--sky)", fontSize: "16px", fontWeight: 500, marginBottom: "12px", lineHeight: 1.65 }}>
            Join 200+ East African businesses using Neurospark Corporation to outpace the competition.
          </p>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "36px" }}>Reach us directly — no forms, no waiting.</p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href={TEL_LINK} className="btn-navy" style={{ padding: "15px 32px", fontSize: "15px" }}>
              <Phone size={17} /> Call {PHONE_DISPLAY}
            </a>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ padding: "15px 32px", fontSize: "15px" }}>
              <WhatsAppIcon size={17} /> WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => {
  const [email, setEmail] = useState("");
  return (
    <footer>
      <div className="footer-border" />
      <div style={{ background: "var(--navy)", padding: "72px 0 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", gap: "48px", marginBottom: "64px" }} className="footer-grid">

            {/* Col 1 */}
            <div>
              <div style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, marginBottom: "14px" }}>
                <div style={{ color: "white", fontSize: "17px" }}>Neurospark</div>
                <div style={{ color: "var(--gold)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Corporation</div>
              </div>
              <p style={{ fontSize: "12px", color: "var(--slate)", lineHeight: 1.75, marginBottom: "16px", maxWidth: "220px" }}>
                Autonomous AI agents built in Nairobi, deployed across East Africa's most ambitious enterprises.
              </p>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "7px", marginBottom: "8px" }}>
                <MapPin size={13} color="var(--gold)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "12px", color: "var(--slate)", lineHeight: 1.6 }}>Westlands Business Park,<br />Nairobi, Kenya</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "16px" }}>
                <Phone size={13} color="var(--gold)" />
                <a href={TEL_LINK} style={{ fontSize: "12px", color: "var(--slate)", textDecoration: "none" }}>{PHONE_DISPLAY}</a>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <a key={i} href="#" style={{ width: "32px", height: "32px", borderRadius: "7px", background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--slate)", textDecoration: "none", transition: "color 0.2s,background 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.background = "rgba(201,168,76,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "var(--slate)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                  ><Icon size={13} /></a>
                ))}
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{ width: "32px", height: "32px", borderRadius: "7px", background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--slate)", textDecoration: "none", transition: "color 0.2s,background 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#25D366"; e.currentTarget.style.background = "rgba(37,211,102,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--slate)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                ><WhatsAppIcon size={13} /></a>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Services</div>
              {["Task Automation","Web Development","Managed SEO","Agent Consulting","API Integrations"].map(l => (
                <div key={l} style={{ marginBottom: "9px" }}>
                  <a href="#" style={{ color: "var(--slate)", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "white"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--slate)"}
                  >{l}</a>
                </div>
              ))}
            </div>

            {/* Col 3 */}
            <div>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Company</div>
              {["About Us","Case Studies","Careers","Blog","Press","Contact"].map(l => (
                <div key={l} style={{ marginBottom: "9px" }}>
                  <a href="#" style={{ color: "var(--slate)", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "white"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--slate)"}
                  >{l}</a>
                </div>
              ))}
            </div>

            {/* Col 4 */}
            <div>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Stay Ahead</div>
              <p style={{ fontSize: "13px", color: "var(--slate)", marginBottom: "16px", lineHeight: 1.65 }}>Monthly insights on AI, automation, and digital growth in East Africa. No spam.</p>
              <div style={{ display: "flex" }}>
                <input type="email" placeholder="your@company.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1, padding: "10px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRight: "none", borderRadius: "8px 0 0 8px", color: "white", fontSize: "13px", outline: "none" }} />
                <button style={{ background: "var(--gold)", border: "none", borderRadius: "0 8px 8px 0", padding: "10px 14px", cursor: "pointer", color: "white", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#b8913a"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--gold)"}
                ><Send size={14} /></button>
              </div>
              <p style={{ fontSize: "11px", color: "rgba(148,163,184,0.4)", marginTop: "10px", marginBottom: "20px" }}>Join 2,400+ East African business leaders.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <a href={TEL_LINK} style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--slate)", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "white"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--slate)"}
                ><Phone size={13} color="var(--gold)" /> {PHONE_DISPLAY}</a>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--slate)", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#25D366"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--slate)"}
                ><WhatsAppIcon size={13} color="#25D366" /> WhatsApp Us</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", maxWidth: "1200px", margin: "0 auto" }}>
          <span style={{ fontSize: "12px", color: "rgba(148,163,184,0.5)" }}>
            © {new Date().getFullYear()} Neurospark Corporation. All rights reserved. Incorporated in Nairobi, Kenya.
          </span>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy","Terms of Service","Cookie Policy"].map(l => (
              <a key={l} href="#" style={{ fontSize: "12px", color: "rgba(148,163,184,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "white"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(148,163,184,0.5)"}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 1020px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px)  { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
};

// ─── AGENT DASHBOARD STRIP (below carousel) ───────────────────────────────────
const DashboardStrip = () => {
  const ref = useFadeUp();
  return (
    <section style={{ background: "var(--bg-alt)", borderBottom: "1px solid var(--border)", padding: "0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div className="fade-up" ref={ref} style={{ display: "flex", alignItems: "stretch", gap: "0" }} className="dash-strip">

          {/* Live label */}
          <div style={{ padding: "20px 28px", borderRight: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <div className="pulse-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--sky)", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--navy)", fontFamily: "Manrope,sans-serif", letterSpacing: "0.04em" }}>LIVE AGENTS</div>
              <div style={{ fontSize: "10px", color: "var(--muted)" }}>Agent Console</div>
            </div>
          </div>

          {/* Scrolling agent items */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "0", width: "100%" }}>
              {[
                { name: "Invoice Processing Agent", task: "Processing Equity Bank batch #2847", progress: 78, status: "Running" },
                { name: "SEO Content Agent",        task: "12 articles queued — Nation Media",   progress: 45, status: "Running" },
                { name: "Web Maintenance Agent",    task: "Security scan complete — 0 issues",    progress: 100, status: "Idle"    },
              ].map((a, i) => (
                <div key={a.name} style={{ flex: 1, padding: "14px 20px", borderRight: i < 2 ? "1px solid var(--border)" : "none", minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: a.status === "Running" ? "rgba(56,189,248,0.12)" : "rgba(201,168,76,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Bot size={12} color={a.status === "Running" ? "var(--sky)" : "var(--gold)"} />
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--navy)", fontFamily: "Manrope,sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                    <span style={{ fontSize: "9px", fontWeight: 700, color: a.status === "Running" ? "var(--sky)" : "var(--gold)", textTransform: "uppercase", flexShrink: 0, marginLeft: "auto" }}>{a.status}</span>
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--muted)", marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.task}</div>
                  <div style={{ height: "3px", background: "rgba(10,31,68,0.1)", borderRadius: "2px" }}>
                    <div style={{ height: "100%", width: `${a.progress}%`, background: a.status === "Running" ? "var(--sky)" : "var(--gold)", borderRadius: "2px", transition: "width 1.5s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accuracy badge */}
          <div style={{ padding: "14px 24px", borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
            <div style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: "20px", color: "var(--navy)", lineHeight: 1 }}>99.4%</div>
            <div style={{ fontSize: "9px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "3px" }}>Accuracy</div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .dash-strip { flex-direction: column !important; } }
        @media (max-width: 640px) { .dash-strip > div:last-child { display: none !important; } }
      `}</style>
    </section>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div>
      <Navbar />
      <main>
        <HeroCarousel />
        <DashboardStrip />
        <MetricsBar />
        <Services />
        <HowItWorks />
        <CaseStudies />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

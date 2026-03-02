/**
 * Footer.jsx — v2.1
 *
 * Changes:
 *   • Brand logo now uses react-router Link to /
 *   • Navigate section uses Link for route pages, <a> only for #anchor (Results)
 *   • Added Projects link
 *   • Removed broken #blog anchor (now /blog route)
 *   • Terms / Privacy placeholder links left as # pending real pages
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Linkedin, Twitter, Instagram } from 'lucide-react'
import Wordmark from './ui/Wordmark'

const FONT_BODY = "'DM Sans', sans-serif"

// Internal route links
const NAV_LINKS = [
  { label: 'Services',  href: '/services',         route: true  },
  { label: 'Results',   href: '/?scroll=results',  route: true  },
  { label: 'About',     href: '/about',             route: true  },
  { label: 'Blog',      href: '/blog',              route: true  },
  { label: 'Projects',  href: '/projects',          route: true  },
  { label: 'Contact',   href: '/contact',           route: true  },
]

function FooterLink({ href, children, route = false, inline = false }) {
  const [hover, setHover] = useState(false)
  const style = {
    color: hover ? 'white' : '#94A3B8',
    fontSize: '0.9rem',
    textDecoration: 'none',
    transition: 'color 0.3s',
    display: inline ? 'inline' : 'block',
    marginBottom: inline ? 0 : 12,
    fontFamily: FONT_BODY,
  }

  if (route) {
    return (
      <Link
        to={href}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={style}
      >
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={style}
    >
      {children}
    </a>
  )
}

function SocialIcon({ Icon, href = '#' }) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 38, height: 38, borderRadius: '50%',
        border: `1px solid ${hover ? '#C9A84C' : '#1A3060'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hover ? '#C9A84C' : '#94A3B8',
        cursor: 'pointer', transition: 'all 0.3s', textDecoration: 'none',
      }}
    >
      <Icon size={16} />
    </a>
  )
}

export default function Footer() {
  return (
    <footer style={{ background: '#0A1F44', color: 'white', paddingBottom: 0 }}>
      <div className="geo-border" />

      <div className="max-w-[1100px] mx-auto px-6" style={{ paddingTop: 56, paddingBottom: 32 }}>
        <div className="grid gap-16 mb-12" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>

          {/* Brand */}
          <div>
            <Link to="/" className="no-underline">
              <Wordmark footer />
            </Link>
            <p className="flex items-center gap-1 mt-1" style={{ color: '#38BDF8', fontSize: '0.85rem' }}>
              <MapPin size={13} /> Nairobi, Kenya
            </p>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: 12, lineHeight: 1.65, maxWidth: 260 }}>
              Autonomous AI agents built for East African founders who are done wasting their best hours on work a machine should be doing.
            </p>
            <div className="flex gap-3 mt-5">
              <SocialIcon Icon={Linkedin} />
              <SocialIcon Icon={Twitter} />
              <SocialIcon Icon={Instagram} />
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94A3B8', marginBottom: 20 }}>
              Navigate
            </h4>
            {NAV_LINKS.map(l => (
              <FooterLink key={l.label} href={l.href} route={l.route}>{l.label}</FooterLink>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94A3B8', marginBottom: 20 }}>
              Get In Touch
            </h4>
            <FooterLink href="mailto:hello@neurosparkcorporation.ai">hello@neurosparkcorporation.ai</FooterLink>
            <FooterLink href="https://wa.me/254799644100">+254 799 644 100</FooterLink>
            <FooterLink href="#">Nairobi, Kenya</FooterLink>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1A3060', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>© 2025 Neurospark Corporation. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <FooterLink href="#" inline>Privacy Policy</FooterLink>
            <FooterLink href="#" inline>Terms of Service</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

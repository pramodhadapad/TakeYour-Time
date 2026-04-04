import React from 'react';
import { Link } from 'react-router-dom';


/* ───────────────────────── constants ───────────────────────── */
const HERO_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuD87xcUIgdv2VjVtuFEJ6LGZH7QhXk56Eqw55Jrd-yEY79g7Cyrrp26bKYrF2q0h_WhSzgSfdNaSRYmhfTz0iXnLSd7YxLUHFWhsEtpqfM9SIcCVxYnjUCquu6x8nK2KRxWtjexU83CIIml_-s0LXnMSXqXqWU6WXfKp6LtjIEWdjCSbUti50gfjybd4UVYtaOhfENPgD-AdfCeINxphTVSU1hnUiKNZojbuEo-0qSBBzHRSMxLq50Y7CpBCrO79IAmt87ly5TYHiY";
const MATCHING_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuAM7lPhHWUUhcSc0e4MYcSbSt9s7vIdvWGodVFet3HunYBDi2iP4tDmG9YxyK19bIKahoYL2jpS5VL6ckCSGuTw6Q0SN7wCSJ1dMfGT1i46VFtZ9A-7nVI_2mHkN50hIFtiA5ssjGqBdunJZEDpzw0jtlk5PTKShYl_tS-aMTyDNkfVIAuycyCmYIuYKWyLqQG3U3EFx5S7wL4A89md_IcgamtmgD2P8_vUN1f3JMeDGds6uHTGnX815_q1HANtKb8rGd1YRAQvnZo";
const CTA_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBwxR-RVk-usv4J-kEyBFFdPZ8N39ULdw6hfnk90J9a89BLJoDh04MrgF36yi1E4Rc86S5l_J8P_d26v3AK171GWBlC9s0bu-6Djr3UbirbABaHWT-QuczRt84cjk6z9alfbtvZIfMn-oyHrHEwCRQHkZm89HBZNxmJNOeOhBTGbtgLt57tuW3hJyltlYTtejG6HlCX7Ucnaaa8oOonEDEIfrUGAPxdDcjaFv-KqQE0Y9cxwYhGcWHY77BsnsZQr2mxyNstU5lkrck";


/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE  —  Editorial Luxury Design
   ═══════════════════════════════════════════════════════════════ */
export default function Landing() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased overflow-x-hidden min-h-screen">

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 border-b border-gold/15 shadow-none"
        style={{ background: 'rgba(253,252,248,0.88)', backdropFilter: 'blur(20px)' }}>
        <div className="flex justify-between items-center px-8 py-4 max-w-full">
          <div className="flex items-center gap-12">
            {/* Brand — spaced caps, DM Sans */}
            <Link
              to="/"
              className="text-sm font-medium tracking-[0.12em] uppercase text-ink"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Take Your Time
            </Link>

            <div className="hidden md:flex gap-8">
              <Link
                to="/browse"
                className="text-xs font-medium tracking-widest uppercase text-gold-dark border-b border-gold pb-0.5 transition-colors"
              >
                Find Tutors
              </Link>
              <a
                href="#how-it-works"
                className="text-xs font-medium tracking-widest uppercase text-ink-soft hover:text-gold-dark transition-colors"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="text-xs font-medium tracking-widest uppercase text-ink-soft hover:text-gold-dark transition-colors"
              >
                Pricing
              </a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-xs font-medium tracking-widest uppercase text-ink-soft hover:text-gold-dark transition-colors"
            >
              Sign In
            </Link>
            {/* Primary CTA — ink bg, gold text */}
            <Link
              to="/login"
              className="btn-primary active:scale-95"
            >
              Join as Tutor
            </Link>
          </div>
        </div>
      </nav>


      {/* ── Hero ────────────────────────────────────────────── */}
      <header
        className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden grain-overlay"
        style={{ background: 'linear-gradient(155deg, #FDFCF8 45%, #F5F0E8 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">

          <div className="md:col-span-6 z-10 animate-slide-up">
            {/* Badge */}
            <span className="badge-gold mb-8 inline-flex">Redefining Mastery</span>

            {/* H1 — Cormorant Garamond italic, ink color */}
            <h1 className="mb-8">
              Luxury is{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 300 }}>focus.</span>
              <br />
              Mastery is time.
            </h1>

            <p className="text-lg max-w-lg mb-10">
              Connect with world-class scholars and industry veterans through a curated,
              high-touch learning experience designed for those who value every second.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/browse" className="btn-primary">
                Begin Your Journey
              </Link>
              <a href="#philosophy" className="btn-ghost">
                ◎ &nbsp;View Philosophy
              </a>
            </div>
          </div>

          {/* Hero image card */}
          <div className="md:col-span-6 relative animate-fade-in delay-200">
            {/* Soft warm glow blob */}
            <div
              className="absolute -top-12 -left-12 w-64 h-64 rounded-full opacity-40 animate-float-soft"
              style={{ background: 'radial-gradient(circle, #E4CFA0 0%, transparent 70%)' }}
            />

            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl transform rotate-2"
              style={{ boxShadow: '0 32px 64px rgba(28,25,23,0.12)' }}>
              <img
                alt="Premium Tutor"
                className="w-full aspect-[4/5] object-cover"
                src={HERO_IMG}
              />
            </div>

            {/* Float card */}
            <div
              className="absolute -bottom-10 -right-4 glass-card p-6 rounded-2xl max-w-xs transform -rotate-2"
              style={{ boxShadow: '0 8px 32px rgba(28,25,23,0.08)' }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(201,169,110,0.15)', color: '#8B6914' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>
                </div>
                <p className="text-sm font-medium" style={{ color: '#8B6914' }}>Elite Certification</p>
              </div>
              <p className="text-xs leading-relaxed text-on-surface-variant">
                Top 1% of educators from global institutions and Fortune 500 leadership.
              </p>
            </div>
          </div>
        </div>
      </header>


      {/* ── Trusted By ──────────────────────────────────────── */}
      <section className="py-14" style={{ background: '#F5F0E8' }}>
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-xs tracking-[0.18em] uppercase mb-10"
            style={{ color: '#A8A29E', fontFamily: "'DM Sans', sans-serif" }}>
            Endorsed by Excellence
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 hover:opacity-70 transition-opacity duration-700">
            {['LUMINA', 'VANTAGE', 'ARBOR', 'VERTEX', 'AETHER'].map(brand => (
              <span
                key={brand}
                className="text-xl tracking-[0.16em]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  color: '#1C1917',
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* ── How It Works ────────────────────────────────────── */}
      <section id="how-it-works" className="py-32 px-8 overflow-hidden" style={{ background: '#FDFCF8' }}>
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="mb-6">
                A curated path to <br />absolute mastery.
              </h2>
              <p className="text-lg">
                We've refined the learning experience into an art form, focusing on
                precision, depth, and the luxury of unhurried focus.
              </p>
            </div>
            <div className="text-right">
              <span
                className="text-8xl"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'rgba(201,169,110,0.12)',
                  lineHeight: 1,
                  display: 'block',
                }}
              >
                01—03
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

            {/* Step 01 */}
            <div
              className="md:col-span-5 p-12 rounded-[2rem] group transition-all duration-300"
              style={{
                background: '#FFFFFF',
                boxShadow: '0 1px 4px rgba(28,25,23,0.05)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 40px rgba(28,25,23,0.10)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(28,25,23,0.05)'}
            >
              <span className="block text-xl mb-8" style={{ color: '#C9A96E', fontFamily: "'DM Sans'", fontWeight: 500 }}>01</span>
              <h3 className="mb-4">Precision Matching</h3>
              <p className="mb-12">
                Our proprietary algorithm doesn't just match skills; it aligns
                intellectual temperament and long-term vision.
              </p>
              <div className="rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                <img alt="Matching process" className="w-full h-48 object-cover" src={MATCHING_IMG} />
              </div>
            </div>

            {/* Step 02 — ink dark card */}
            <div
              className="md:col-span-7 md:mt-24 p-12 rounded-[2rem] relative overflow-hidden"
              style={{ background: '#1C1917', boxShadow: '0 16px 48px rgba(28,25,23,0.20)' }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="material-symbols-outlined" style={{ fontSize: 120, color: '#C9A96E' }}>auto_awesome</span>
              </div>
              <span className="block text-xl mb-8" style={{ color: '#C9A96E', fontFamily: "'DM Sans'", fontWeight: 500 }}>02</span>
              <h3 className="mb-4" style={{ color: '#FDFCF8', fontStyle: 'normal' }}>The Immersion Phase</h3>
              <p className="mb-12 max-w-md" style={{ color: 'rgba(253,252,248,0.6)' }}>
                Deep-dive sessions that prioritize conceptual clarity over rote learning.
                We provide the environment where complex ideas finally click.
              </p>
              <button
                className="flex items-center gap-2 text-xs tracking-widest uppercase transition-all group"
                style={{ color: '#C9A96E', fontFamily: "'DM Sans'", fontWeight: 500 }}
              >
                Explore Methodology
                <span
                  className="material-symbols-outlined group-hover:translate-x-1 transition-transform"
                  style={{ fontSize: 16 }}
                >
                  arrow_forward
                </span>
              </button>
            </div>

            {/* Step 03 */}
            <div
              className="md:col-span-12 mt-12 p-12 rounded-[2rem] flex flex-col md:flex-row items-center gap-12"
              style={{ background: '#F5F0E8' }}
            >
              <div className="md:w-1/2">
                <span className="block text-xl mb-8" style={{ color: '#C9A96E', fontFamily: "'DM Sans'", fontWeight: 500 }}>03</span>
                <h3 className="mb-4">Reflective Mastery</h3>
                <p>
                  Post-session synthesis and resource curation to ensure the knowledge
                  isn't just learned, but integrated into your identity.
                </p>
              </div>
              <div className="md:w-1/2 flex flex-col sm:flex-row gap-4">
                <div
                  className="w-full h-40 rounded-xl p-6"
                  style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(201,169,110,0.2)' }}
                >
                  <span className="material-symbols-outlined mb-2" style={{ color: '#C9A96E', fontSize: 22 }}>analytics</span>
                  <p className="text-sm font-medium" style={{ color: '#1C1917' }}>Progress Insights</p>
                </div>
                <div
                  className="w-full h-40 rounded-xl p-6 mt-0 sm:mt-8"
                  style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(201,169,110,0.2)' }}
                >
                  <span className="material-symbols-outlined mb-2" style={{ color: '#C9A96E', fontSize: 22 }}>auto_stories</span>
                  <p className="text-sm font-medium" style={{ color: '#1C1917' }}>Curated Library</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── Curated Session Types (Pricing) ─────────────────── */}
      <section id="pricing" className="py-32 relative overflow-hidden" style={{ background: '#1C1917' }}>
        {/* Subtle gold noise bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,169,110,0.07) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="badge-gold mb-6 inline-flex" style={{ borderColor: 'rgba(201,169,110,0.4)', color: '#C9A96E' }}>
              Curated Session Types
            </span>
            <h2 className="mb-6" style={{ color: '#FDFCF8' }}>
              Tailored for every stage<br />of the learning lifecycle.
            </h2>
            <p style={{ color: 'rgba(253,252,248,0.55)', maxWidth: 480, margin: '0 auto' }}>
              Choose the intensity that matches your ambition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1 — Strategic Spark */}
            <div
              className="flex flex-col p-10 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,169,110,0.12)',
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8"
                style={{ background: 'rgba(201,169,110,0.1)' }}
              >
                <span className="material-symbols-outlined" style={{ color: '#C9A96E', fontSize: 28 }}>lightbulb</span>
              </div>
              <h3 className="mb-4" style={{ color: '#FDFCF8', fontStyle: 'normal' }}>Strategic Spark</h3>
              <p className="text-sm leading-relaxed mb-10 flex-grow" style={{ color: 'rgba(253,252,248,0.5)' }}>
                A high-impact 60-minute session to unlock a specific challenge or gain
                immediate clarity on a complex topic.
              </p>
              <ul className="space-y-3 mb-10">
                {['Rapid problem-solving', 'One-on-one intensity'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(253,252,248,0.7)' }}>
                    <span className="material-symbols-outlined" style={{ color: '#C9A96E', fontSize: 16 }}>check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="btn-ghost w-full" style={{ borderColor: 'rgba(201,169,110,0.25)', color: 'rgba(253,252,248,0.7)' }}>
                Book Session
              </button>
            </div>

            {/* Card 2 — The Deep Dive (featured) */}
            <div
              className="flex flex-col p-10 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 relative"
              style={{
                background: '#FDFCF8',
                boxShadow: '0 0 0 1px rgba(201,169,110,0.3), 0 24px 64px rgba(28,25,23,0.25)',
              }}
            >
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 text-xs tracking-widest uppercase"
                style={{
                  background: '#C9A96E',
                  color: '#1C1917',
                  borderRadius: 2,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                }}
              >
                Most Immersive
              </div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8"
                style={{ background: 'rgba(201,169,110,0.12)' }}
              >
                <span className="material-symbols-outlined" style={{ color: '#8B6914', fontSize: 28 }}>diamond</span>
              </div>
              <h3 className="mb-4">The Deep Dive</h3>
              <p className="text-sm leading-relaxed mb-10 flex-grow">
                A comprehensive 4-hour immersion into a domain. Perfect for foundational
                shifts and intensive skill acquisition.
              </p>
              <ul className="space-y-3 mb-10">
                {['Extended mentorship', 'Custom resource pack', 'Collaborative roadmap'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined" style={{ color: '#C9A96E', fontSize: 16 }}>check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="btn-primary w-full">Select Tier</button>
            </div>

            {/* Card 3 — Legacy Retainer */}
            <div
              className="flex flex-col p-10 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,169,110,0.12)',
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8"
                style={{ background: 'rgba(201,169,110,0.1)' }}
              >
                <span className="material-symbols-outlined" style={{ color: '#C9A96E', fontSize: 28 }}>history_edu</span>
              </div>
              <h3 className="mb-4" style={{ color: '#FDFCF8', fontStyle: 'normal' }}>Legacy Retainer</h3>
              <p className="text-sm leading-relaxed mb-10 flex-grow" style={{ color: 'rgba(253,252,248,0.5)' }}>
                Ongoing, monthly guidance for those building lasting projects. Consistent
                access to world-class minds.
              </p>
              <ul className="space-y-3 mb-10">
                {['Priority scheduling', 'Direct messaging access'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(253,252,248,0.7)' }}>
                    <span className="material-symbols-outlined" style={{ color: '#C9A96E', fontSize: 16 }}>check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="btn-ghost w-full" style={{ borderColor: 'rgba(201,169,110,0.25)', color: 'rgba(253,252,248,0.7)' }}>
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="my-32 px-8">
        <div
          className="max-w-7xl mx-auto rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden"
          style={{ background: '#1C1917' }}
        >
          {/* BG image overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none rounded-[3rem] overflow-hidden">
            <img alt="Office" className="w-full h-full object-cover" src={CTA_IMG} />
          </div>
          {/* Gold radial glow */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[3rem]"
            style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 70%)' }}
          />

          <div className="relative z-10">
            <span className="badge-gold mb-8 inline-flex" style={{ borderColor: 'rgba(201,169,110,0.4)', color: '#C9A96E' }}>
              Exclusive Access
            </span>
            <h2 className="mb-8" style={{ color: '#FDFCF8' }}>
              Ready to elevate<br />your expertise?
            </h2>
            <p className="text-lg mb-12 max-w-xl mx-auto" style={{ color: 'rgba(253,252,248,0.55)' }}>
              Join an exclusive network of thinkers and builders. Limited sessions
              available monthly.
            </p>
            <p className="mb-8 max-w-2xl mx-auto font-medium" style={{ color: 'rgba(253,252,248,0.5)', fontSize: 14 }}>
              Ready to transform your expertise into a thriving business?
            </p>
            <Link to="/login" className="btn-gold inline-flex">
              Apply for Membership
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>


      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{ background: '#141210' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-12 py-20 w-full max-w-7xl mx-auto">

          <div className="col-span-2">
            <span
              className="text-sm tracking-[0.12em] uppercase mb-6 block"
              style={{ color: '#FDFCF8', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
            >
              Take Your Time
            </span>
            <p className="text-sm leading-relaxed max-w-xs mb-8" style={{ color: 'rgba(253,252,248,0.4)' }}>
              The world's most exclusive platform for expert-led mentorship and
              specialized knowledge acquisition.
            </p>
            <div className="flex gap-3">
              {['share', 'public'].map(icon => (
                <a
                  key={icon}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(253,252,248,0.5)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.15)'; e.currentTarget.style.color = '#C9A96E'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(253,252,248,0.5)'; }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6" style={{ color: 'rgba(253,252,248,0.3)', fontFamily: "'DM Sans'" }}>Company</h4>
            <ul className="space-y-4">
              <li><Link to="/login" className="text-sm transition-colors" style={{ color: 'rgba(253,252,248,0.5)' }} onMouseEnter={e => e.target.style.color = '#C9A96E'} onMouseLeave={e => e.target.style.color = 'rgba(253,252,248,0.5)'}>Join as Tutor</Link></li>
              <li><a href="#how-it-works" className="text-sm transition-colors" style={{ color: 'rgba(253,252,248,0.5)' }} onMouseEnter={e => e.target.style.color = '#C9A96E'} onMouseLeave={e => e.target.style.color = 'rgba(253,252,248,0.5)'}>How it Works</a></li>
              <li><a href="#pricing" className="text-sm transition-colors" style={{ color: 'rgba(253,252,248,0.5)' }} onMouseEnter={e => e.target.style.color = '#C9A96E'} onMouseLeave={e => e.target.style.color = 'rgba(253,252,248,0.5)'}>Pricing & Fees</a></li>
              <li><Link to="/admin" className="text-sm transition-colors" style={{ color: '#C9A96E' }}>Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6" style={{ color: 'rgba(253,252,248,0.3)', fontFamily: "'DM Sans'" }}>Support</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm" style={{ color: 'rgba(253,252,248,0.5)' }} onMouseEnter={e => e.target.style.color = '#C9A96E'} onMouseLeave={e => e.target.style.color = 'rgba(253,252,248,0.5)'}>Support</Link></li>
              <li><Link to="/terms" className="text-sm" style={{ color: 'rgba(253,252,248,0.5)' }} onMouseEnter={e => e.target.style.color = '#C9A96E'} onMouseLeave={e => e.target.style.color = 'rgba(253,252,248,0.5)'}>Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm" style={{ color: 'rgba(253,252,248,0.5)' }} onMouseEnter={e => e.target.style.color = '#C9A96E'} onMouseLeave={e => e.target.style.color = 'rgba(253,252,248,0.5)'}>Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto px-12 pb-12 flex justify-between flex-wrap gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 32 }}
        >
          <p className="text-xs" style={{ color: 'rgba(253,252,248,0.25)', fontFamily: "'DM Sans'" }}>
            © 2026 Take Your Time. Handcrafted for excellence.
          </p>
        </div>
      </footer>

    </div>
  );
}

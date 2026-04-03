import React from 'react';
import { Link } from 'react-router-dom';

/* ───────────────────────── constants ───────────────────────── */
const HERO_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuD87xcUIgdv2VjVtuFEJ6LGZH7QhXk56Eqw55Jrd-yEY79g7Cyrrp26bKYrF2q0h_WhSzgSfdNaSRYmhfTz0iXnLSd7YxLUHFWhsEtpqfM9SIcCVxYnjUCquu6x8nK2KRxWtjexU83CIIml_-s0LXnMSXqXqWU6WXfKp6LtjIEWdjCSbUti50gfjybd4UVYtaOhfENPgD-AdfCeINxphTVSU1hnUiKNZojbuEo-0qSBBzHRSMxLq50Y7CpBCrO79IAmt87ly5TYHiY";
const MATCHING_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuAM7lPhHWUUhcSc0e4MYcSbSt9s7vIdvWGodVFet3HunYBDi2iP4tDmG9YxyK19bIKahoYL2jpS5VL6ckCSGuTw6Q0SN7wCSJ1dMfGT1i46VFtZ9A-7nVI_2mHkN50hIFtiA5ssjGqBdunJZEDpzw0jtlk5PTKShYl_tS-aMTyDNkfVIAuycyCmYIuYKWyLqQG3U3EFx5S7wL4A89md_IcgamtmgD2P8_vUN1f3JMeDGds6uHTGnX815_q1HANtKb8rGd1YRAQvnZo";

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE (Premium SaaS Design)
   ═══════════════════════════════════════════════════════════════ */
export default function Landing() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased overflow-x-hidden min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-indigo-500/10 shadow-sm">
        <div className="flex justify-between items-center px-8 py-4 max-w-full">
          <div className="flex items-center gap-12">
            <Link className="text-xl font-bold tracking-tighter text-indigo-950 font-headline" to="/">Take Your Time</Link>
            <div className="hidden md:flex gap-8">
              <Link className="text-indigo-600 border-b-2 border-indigo-600 font-headline tracking-tight font-semibold" to="/browse">Find Tutors</Link>
              <a className="text-slate-600 hover:text-indigo-600 transition-colors duration-300 font-headline tracking-tight font-semibold" href="#how-it-works">How it Works</a>
              <a className="text-slate-600 hover:text-indigo-600 transition-colors duration-300 font-headline tracking-tight font-semibold" href="#pricing">Pricing</a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-slate-600 font-headline font-semibold text-sm hover:text-primary transition-all">Sign In</Link>
            <Link to="/login" className="bg-on-primary-container text-on-primary px-6 py-2.5 rounded-xl font-headline font-semibold text-sm shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">Join as Tutor</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 z-10 animate-slide-up">
            <span className="inline-block py-1 px-4 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold tracking-wider flex-shrink-0 uppercase mb-6">Redefining Mastery</span>
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary leading-[1.1] mb-8">
              Luxury is <span className="italic font-light">focus.</span> Mastery is time.
            </h1>
            <p className="text-lg text-on-surface-variant max-w-lg mb-10 leading-relaxed">
              Connect with world-class scholars and industry veterans through a curated, high-touch learning experience designed for those who value every second.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/browse" className="text-center bg-primary text-white px-8 py-4 rounded-xl font-headline font-bold text-base shadow-2xl shadow-primary/20 hover:translate-y-[-2px] transition-all">Begin Your Journey</Link>
              <a href="#philosophy" className="flex items-center justify-center gap-3 px-8 py-4 text-primary font-headline font-bold">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                View Philosophy
              </a>
            </div>
          </div>

          <div className="md:col-span-6 relative animate-fade-in delay-200">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl transform rotate-2">
              <img alt="Premium Tutor" className="w-full aspect-[4/5] object-cover" src={HERO_IMG} />
            </div>
            <div className="absolute -bottom-10 -right-4 glass-card p-6 rounded-2xl shadow-xl max-w-xs transform -rotate-2">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <p className="text-sm font-bold text-primary">Elite Certification</p>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">Top 1% of educators from global institutions and Fortune 500 leadership.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Trusted By Section */}
      <section className="py-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center font-label text-xs uppercase tracking-widest text-outline mb-10">Endorsed by Excellence</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            <span className="text-2xl font-headline font-bold text-primary">LUMINA</span>
            <span className="text-2xl font-headline font-bold text-primary">VANTAGE</span>
            <span className="text-2xl font-headline font-bold text-primary">ARBOR</span>
            <span className="text-2xl font-headline font-bold text-primary">VERTEX</span>
            <span className="text-2xl font-headline font-bold text-primary">AETHER</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-6">A curated path to <br />absolute mastery.</h2>
              <p className="text-on-surface-variant text-lg">We've refined the learning experience into an art form, focusing on precision, depth, and the luxury of unhurried focus.</p>
            </div>
            <div className="text-right">
              <span className="text-8xl font-headline font-extrabold text-indigo-500/10">01—03</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Step 1 */}
            <div className="md:col-span-5 bg-white p-12 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group">
              <span className="block text-indigo-600 font-headline font-bold text-xl mb-8">01</span>
              <h3 className="font-headline text-2xl font-bold mb-4">Precision Matching</h3>
              <p className="text-on-surface-variant mb-12">Our proprietary algorithm doesn't just match skills; it aligns intellectual temperament and long-term vision.</p>
              <div className="rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                <img alt="Matching process" className="w-full h-48 object-cover" src={MATCHING_IMG} />
              </div>
            </div>

            {/* Step 2 (Offset) */}
            <div className="md:col-span-7 md:mt-24 bg-primary text-white p-12 rounded-[2rem] shadow-2xl relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <span className="material-symbols-outlined text-9xl">auto_awesome</span>
              </div>
              <span className="block text-indigo-300 font-headline font-bold text-xl mb-8">02</span>
              <h3 className="font-headline text-2xl font-bold mb-4">The Immersion Phase</h3>
              <p className="text-slate-300 mb-12 max-w-md">Deep-dive sessions that prioritize conceptual clarity over rote learning. We provide the environment where complex ideas finally click.</p>
              <button className="text-white font-headline font-semibold flex items-center gap-2 group">
                Explore Methodology
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>

            {/* Step 3 */}
            <div className="md:col-span-12 mt-12 bg-indigo-50 p-12 rounded-[2rem] flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <span className="block text-indigo-600 font-headline font-bold text-xl mb-8">03</span>
                <h3 className="font-headline text-2xl font-bold mb-4">Reflective Mastery</h3>
                <p className="text-on-surface-variant">Post-session synthesis and resource curation to ensure the knowledge isn't just learned, but integrated into your identity.</p>
              </div>
              <div className="md:w-1/2 flex flex-col sm:flex-row gap-4">
                <div className="w-full h-40 rounded-xl bg-white/60 backdrop-blur-sm border border-indigo-200/50 p-6 shadow-sm">
                  <span className="material-symbols-outlined text-indigo-500 mb-2">analytics</span>
                  <p className="text-sm font-bold">Progress Insights</p>
                </div>
                <div className="w-full h-40 rounded-xl bg-white/60 backdrop-blur-sm border border-indigo-200/50 p-6 mt-0 sm:mt-8 shadow-sm">
                  <span className="material-symbols-outlined text-indigo-500 mb-2">auto_stories</span>
                  <p className="text-sm font-bold">Curated Library</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Session Types */}
      <section id="pricing" className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-1/2 h-1/2 bg-indigo-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-1/2 h-1/2 bg-indigo-700 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-6">Curated Session Types</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Tailored for different stages of the learning lifecycle. Choose the intensity that matches your ambition.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-items-stretch">
            {/* Card 1 */}
            <div className="glass flex flex-col p-10 rounded-[2.5rem] hover:translate-y-[-10px] transition-all duration-500">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8">
                <span className="material-symbols-outlined text-3xl">lightbulb</span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-white mb-4">Strategic Spark</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-10 flex-grow">A high-impact 60-minute session to unlock a specific challenge or gain immediate clarity on a complex topic.</p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-white text-sm"><span className="material-symbols-outlined text-indigo-400 text-sm">check_circle</span> Rapid problem-solving</li>
                <li className="flex items-center gap-3 text-white text-sm"><span className="material-symbols-outlined text-indigo-400 text-sm">check_circle</span> One-on-one intensity</li>
              </ul>
              <button className="w-full py-4 mt-auto rounded-xl border border-white/20 text-white font-headline font-bold hover:bg-white hover:text-primary transition-all">Book Session</button>
            </div>

            {/* Card 2 (Promoted) */}
            <div className="bg-white flex flex-col p-10 rounded-[2.5rem] relative transform md:scale-105 shadow-2xl">
              <div className="absolute -top-4 right-10 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Most Immersive</div>
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8">
                <span className="material-symbols-outlined text-3xl">diamond</span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-primary mb-4">The Deep Dive</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-10 flex-grow">A comprehensive 4-hour immersion into a domain. Perfect for foundational shifts and intensive skill acquisition.</p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-primary text-sm font-medium"><span className="material-symbols-outlined text-indigo-600 text-sm">check_circle</span> Extended mentorship</li>
                <li className="flex items-center gap-3 text-primary text-sm font-medium"><span className="material-symbols-outlined text-indigo-600 text-sm">check_circle</span> Custom resource pack</li>
                <li className="flex items-center gap-3 text-primary text-sm font-medium"><span className="material-symbols-outlined text-indigo-600 text-sm">check_circle</span> Collaborative roadmap</li>
              </ul>
              <button className="w-full py-4 mt-auto rounded-xl bg-primary text-white font-headline font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all">Select Tier</button>
            </div>

            {/* Card 3 */}
            <div className="glass flex flex-col p-10 rounded-[2.5rem] hover:translate-y-[-10px] transition-all duration-500">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8">
                <span className="material-symbols-outlined text-3xl">history_edu</span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-white mb-4">Legacy Retainer</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-10 flex-grow">Ongoing, monthly guidance for those building lasting projects. Consistent access to world-class minds.</p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-white text-sm"><span className="material-symbols-outlined text-indigo-400 text-sm">check_circle</span> Priority scheduling</li>
                <li className="flex items-center gap-3 text-white text-sm"><span className="material-symbols-outlined text-indigo-400 text-sm">check_circle</span> Direct messaging access</li>
              </ul>
              <button className="w-full mt-auto py-4 rounded-xl border border-white/20 text-white font-headline font-bold hover:bg-white hover:text-primary transition-all">Enquire Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="mb-32 mt-32 px-8">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-indigo-950 p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img alt="Office" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwxR-RVk-usv4J-kEyBFFdPZ8N39ULdw6hfnk90J9a89BLJoDh04MrgF36yi1E4Rc86S5l_J8P_d26v3AK171GWBlC9s0bu-6Djr3UbirbABaHWT-QuczRt84cjk6z9alfbtvZIfMn-oyHrHEwCRQHkZm89HBZNxmJNOeOhBTGbtgLt57tuW3hJyltlYTtejG6HlCX7Ucnaaa8oOonEDEIfrUGAPxdDcjaFv-KqQE0Y9cxwYhGcWHY77BsnsZQr2mxyNstU5lkrck" />
          </div>
          <div className="relative z-10">
            <h2 className="font-headline text-4xl md:text-6xl font-bold text-white mb-8">Ready to elevate <br />your expertise?</h2>
            <p className="text-indigo-200 text-lg mb-12 max-w-xl mx-auto">Join an exclusive network of thinkers and builders. Limited sessions available monthly.</p>
            <div className="mt-12 flex flex-col items-center">
            <p className="text-indigo-200 max-w-2xl mx-auto mb-8 font-medium">Ready to transform your expertise into a thriving business?</p>
            <Link to="/login" className="bg-white text-indigo-950 px-10 py-4 rounded-full font-headline font-bold text-lg shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2">
              Apply for Membership <span className="material-symbols-outlined text-xl transition-transform" style={{fontVariationSettings: "'FILL' 1"}}>arrow_forward</span>
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-950 w-full relative bottom-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-12 py-20 w-full max-w-7xl mx-auto">
          <div className="col-span-2">
            <span className="text-2xl font-headline font-bold text-white mb-6 block">Take Your Time</span>
            <p className="text-slate-400 font-body text-sm leading-relaxed max-w-xs mb-8">The world's most exclusive platform for expert-led mentorship and specialized knowledge acquisition.</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-indigo-500 transition-all" href="#"><span className="material-symbols-outlined">share</span></a>
              <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-indigo-500 transition-all" href="#"><span className="material-symbols-outlined">public</span></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
                <ul className="space-y-4">
                  <li><Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">Join as Tutor</Link></li>
                  <li><a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">How it Works</a></li>
                  <li><a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">Pricing & Fees</a></li>
                  <li><Link to="/admin" className="text-sm text-indigo-400 hover:text-white transition-colors font-medium">Admin Login</Link></li>
                </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link className="text-slate-400 hover:text-white transition-colors font-body text-sm" to="/">Support</Link></li>
              <li><Link className="text-slate-400 hover:text-white transition-colors font-body text-sm" to="/terms">Terms of Service</Link></li>
              <li><Link className="text-slate-400 hover:text-white transition-colors font-body text-sm" to="/privacy">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-12 pb-12 border-t border-white/5 pt-8 flex justify-between flex-wrap">
          <p className="text-slate-400 font-body text-sm text-center">© 2026 Take Your Time. Handcrafted for excellence.</p>
        </div>
      </footer>
    </div>
  );
}

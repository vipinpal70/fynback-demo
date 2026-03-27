"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';

/* --- FONT INJECTIONS & GLOBAL STYLES --- */
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=DM+Mono:wght@400;500;600&display=swap');

    .fynback-landing {
      --black:   #08090c;
      --ink:     #0e1014;
      --surface: #141619;
      --line:    #1f2228;
      --line-hi: #2a2f38;
      --white:   #f2f3f5;
      --silver:  #8a919e;
      --steel:   #3d4450;
      --ghost:   #232830;

      --green:      #00e878;
      --green-dim:  rgba(0,232,120,0.08);
      --green-glow: rgba(0,232,120,0.20);
      --green-line: rgba(0,232,120,0.25);

      --red:    #ff4d4d;
      --amber:  #ffb224;
      --blue:   #4d9fff;

      --razorpay: #3395ff;
      --stripe:   #635bff;
      --cashfree: #00c274;
      --payu:     #ff6b35;

      background: var(--black);
      color: var(--white);
      font-family: 'DM Sans', sans-serif;
      font-size: 1.05rem;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .font-heading { font-family: 'Clash Display', 'Syne', sans-serif; }
    .font-body { font-family: 'DM Sans', sans-serif; }
    .font-mono { font-family: 'DM Mono', monospace; }

    /* Utilities */
    .bg-black { background-color: var(--black); }
    .bg-ink { background-color: var(--ink); }
    .bg-surface { background-color: var(--surface); }
    .bg-green { background-color: var(--green); }
    .bg-green-dim { background-color: var(--green-dim); }
    .bg-red { background-color: var(--red); }
    .bg-amber { background-color: var(--amber); }
    .text-white { color: var(--white); }
    .text-silver { color: var(--silver); }
    .text-steel { color: var(--steel); }
    .text-green { color: var(--green); }
    .text-amber { color: var(--amber); }
    .text-red { color: var(--red); }
    .border-line { border-color: var(--line); }
    .border-green { border-color: var(--green); }
    .border-green-line { border-color: var(--green-line); }

    /* Animations */
    @keyframes ticker {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .ticker-content {
      display: flex;
      width: max-content;
      animation: ticker 30s linear infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .animate-blink { animation: blink 1s step-end infinite; }

    .animate-on-scroll {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 600ms ease, transform 600ms ease;
    }
    .animate-on-scroll.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .slide-left-on-scroll {
      opacity: 0;
      transform: translateX(-16px);
      transition: opacity 400ms ease, transform 400ms ease;
    }
    .slide-left-on-scroll.visible {
      opacity: 1;
      transform: translateX(0);
    }

    @media (prefers-reduced-motion: reduce) {
      .animate-on-scroll, .slide-left-on-scroll { 
        opacity: 1; transform: none; transition: none; 
      }
    }

    /* WhatsApp UI */
    @keyframes rowEnter {
      from { transform: translateY(-100%); opacity: 0; margin-top: -44px; }
      to { transform: translateY(0); opacity: 1; margin-top: 0; }
    }
    @keyframes rowExit {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    .animate-row-enter {
      animation: rowEnter 300ms ease forwards;
    }
    .animate-row-exit {
      animation: rowExit 300ms ease forwards;
    }
    @keyframes borderPulseAmber {
      0%, 100% { border-color: rgba(255, 178, 36, 0.4); }
      50% { border-color: rgba(255, 178, 36, 1); }
    }
    .amber-pulse-border {
      border-left: 2px solid var(--amber) !important;
      animation: borderPulseAmber 2s infinite;
    }
    @keyframes successPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.01); }
      100% { transform: scale(1); }
    }

    .wa-message-bubble {
       position: relative;
    }
    .wa-message-bubble::after {
       content: '';
       position: absolute;
       top: 0;
       left: -8px;
       width: 0;
       height: 0;
       border: 8px solid transparent;
       border-top-color: #1f2c34;
       border-left: 0;
       margin-top: 0;
    }

    @keyframes messagePop {
      0% { transform: scale(0.95); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-message-pop {
      opacity: 0;
      animation: messagePop 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes delayedFadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .animate-fade-in-delayed {
      opacity: 0;
      animation: delayedFadeIn 400ms ease forwards 4000ms;
    }

    .bar-email, .bar-wa { width: 0; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-on-scroll.visible .bar-email { width: 22%; }
    .animate-on-scroll.visible .bar-wa { width: 95%; transition-delay: 200ms; }
  `}} />
);

/* --- HOOKS --- */
function useIntersectionObserver(options = {}) {
  const [elements, setElements] = useState([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if ((entry.target as HTMLElement).dataset.typewriter === 'true') {
            entry.target.dispatchEvent(new CustomEvent('startTypewriter'));
          }
        }
      });
    }, { threshold: 0.1, ...options });

    const targets = document.querySelectorAll('.animate-on-scroll, .slide-left-on-scroll, [data-typewriter="true"]');
    targets.forEach(t => observer.observe(t));

    return () => observer.disconnect();
  }, []);
}

/* --- COMPONENTS --- */

// SECTION 1 — NAVBAR
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <nav className="sticky top-0 z-50 h-[60px] bg-[#08090c]/85 backdrop-blur-[16px] border-b border-line px-6 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
            <line x1="12" y1="9" x2="12" y2="21"></line>
          </svg>
          <span className="font-heading font-semibold text-[20px] text-white tracking-[-0.5px]">Fynback</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[16px] text-silver font-body">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#integrations" className="hover:text-white transition-colors">Integrations</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#blog" className="hover:text-white transition-colors">Blog</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="text-[16px] text-silver hover:text-white font-body">Sign in</Link>
          <span className="text-steel">|</span>
          <Link href="/dashboard" className="text-[16px] font-medium text-green bg-[var(--green-dim)] border border-[var(--green-line)] px-4 py-1.5 rounded-[6px] hover:bg-[rgba(0,232,120,0.15)] transition-colors font-body">
            Get started free
          </Link>
        </div>

        <button className="md:hidden text-silver" onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black z-[100] transition-transform duration-200 ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex justify-end p-6">
          <button onClick={() => setIsOpen(false)} className="text-silver"><X size={32} /></button>
        </div>
        <div className="flex flex-col items-center justify-center h-full gap-8 font-heading font-semibold text-[32px] text-white pb-20">
          <a href="#how-it-works" onClick={() => setIsOpen(false)}>How it works</a>
          <a href="#integrations" onClick={() => setIsOpen(false)}>Integrations</a>
          <a href="#pricing" onClick={() => setIsOpen(false)}>Pricing</a>
          <a href="#blog" onClick={() => setIsOpen(false)}>Blog</a>
          <Link href="/dashboard" className="mt-4 text-green" onClick={() => setIsOpen(false)}>Sign in</Link>
        </div>
      </div>
    </>
  );
};

// SECTION 2 — HERO
const TerminalFeed = () => {
  const [rows, setRows] = useState<any[]>([
    { id: 1, status: 'RCVD', amount: '₹8,500',  gate: 'Razorpay', reason: 'card_expired', email: 'meera@te...', time: '2m ago' },
    { id: 2, status: 'RCVD', amount: '₹12,800', gate: 'Stripe',   reason: 'insufficient', email: 'priya@star...', time: '4m ago' },
    { id: 3, status: 'RTRY', amount: '₹3,299',  gate: 'Cashfree', reason: 'upi_failure',  email: 'raj@exampl...', time: 'retry 4h' },
    { id: 4, status: 'RCVD', amount: '₹22,000', gate: 'Stripe',   reason: 'do_not_honor', email: 'karthik@sa...', time: '11m ago' },
    { id: 5, status: 'RCVD', amount: '₹4,999',  gate: 'Razorpay', reason: 'card_expired', email: 'rohan@te...', time: '14m ago' },
    { id: 6, status: 'RTRY', amount: '₹6,499',  gate: 'Razorpay', reason: 'insufficient', email: 'nisha@br...', time: 'retry 2h' },
    { id: 7, status: 'RCVD', amount: '₹49,999', gate: 'Razorpay', reason: 'do_not_honor', email: 'vikram@e...', time: '28m ago' },
    { id: 8, status: 'RCVD', amount: '₹2,999',  gate: 'Cashfree', reason: 'upi_failure',  email: 'ankita@br...', time: '31m ago' },
  ]);

  const [totalRecovered, setTotalRecovered] = useState(240000);

  useEffect(() => {
    const rowPool = [
      { status: 'RCVD', amount: '₹14,500', gate: 'PayU', reason: 'insufficient', email: 'arjun@te...', time: 'just now' },
      { status: 'RCVD', amount: '₹9,900',  gate: 'Razorpay', reason: 'card_expired', email: 'divya@co...', time: 'just now' },
      { status: 'RTRY', amount: '₹1,200',  gate: 'Stripe', reason: 'bank_decline', email: 'suresh@ap...', time: 'retry 3h' },
      { status: 'RCVD', amount: '₹3,400', gate: 'Razorpay', reason: 'insufficient', email: 'karan@te...', time: 'just now' },
      { status: 'RCVD', amount: '₹5,500', gate: 'Stripe', reason: 'card_expired', email: 'sneha@co...', time: 'just now' },
      { status: 'RTRY', amount: '₹2,100', gate: 'Cashfree', reason: 'upi_failure', email: 'rohit@ap...', time: 'retry 2h' },
      { status: 'RCVD', amount: '₹18,000', gate: 'PayU', reason: 'insufficient', email: 'pooja@st...', time: 'just now' },
      { status: 'RTRY', amount: '₹7,500', gate: 'Razorpay', reason: 'bank_decline', email: 'manish@te...', time: 'retry 1h' },
      { status: 'RCVD', amount: '₹11,200', gate: 'Stripe', reason: 'do_not_honor', email: 'simran@co...', time: 'just now' },
      { status: 'RCVD', amount: '₹4,800', gate: 'Cashfree', reason: 'card_expired', email: 'varun@ap...', time: 'just now' },
      { status: 'RTRY', amount: '₹6,300', gate: 'PayU', reason: 'upi_failure', email: 'neha@st...', time: 'retry 5h' },
      { status: 'RCVD', amount: '₹25,000', gate: 'Razorpay', reason: 'insufficient', email: 'amit@te...', time: 'just now' },
      { status: 'RCVD', amount: '₹8,900', gate: 'Stripe', reason: 'bank_decline', email: 'shikha@co...', time: 'just now' },
      { status: 'RTRY', amount: '₹3,800', gate: 'Cashfree', reason: 'do_not_honor', email: 'rahul@ap...', time: 'retry 4h' },
      { status: 'RCVD', amount: '₹15,600', gate: 'PayU', reason: 'card_expired', email: 'arti@st...', time: 'just now' },
      { status: 'RCVD', amount: '₹1,900', gate: 'Razorpay', reason: 'upi_failure', email: 'vikas@te...', time: 'just now' },
      { status: 'RTRY', amount: '₹9,200', gate: 'Stripe', reason: 'insufficient', email: 'kajal@co...', time: 'retry 6h' },
      { status: 'RCVD', amount: '₹6,700', gate: 'Cashfree', reason: 'bank_decline', email: 'pranav@ap...', time: 'just now' },
      { status: 'RCVD', amount: '₹21,000', gate: 'PayU', reason: 'do_not_honor', email: 'swati@st...', time: 'just now' },
      { status: 'RTRY', amount: '₹4,500', gate: 'Razorpay', reason: 'card_expired', email: 'aditya@te...', time: 'retry 3h' },
      { status: 'RCVD', amount: '₹13,400', gate: 'Stripe', reason: 'upi_failure', email: 'jyoti@co...', time: 'just now' }
    ];

    const interval = setInterval(() => {
      setRows(prev => {
        const next = [...prev];
        const randItem = rowPool[Math.floor(Math.random() * rowPool.length)];
        
        if (next.length >= 8) {
          next[7] = { ...next[7], isExiting: true };
        }
        
        next.unshift({ ...randItem, id: Date.now(), isNew: true });
        return next;
      });
      
      setTimeout(() => {
        setRows(current => {
          return current.filter(r => !r.isExiting).map(r => ({ ...r, isNew: false })).slice(0, 8);
        });
      }, 300);
      
    }, 6000);

    const amountInterval = setInterval(() => {
      setTotalRecovered(prev => prev + (Math.floor(Math.random() * 401) + 100) / 100);
    }, 3000);

    return () => { clearInterval(interval); clearInterval(amountInterval); };
  }, []);

  return (
    <div className="bg-[var(--ink)] border border-[var(--line-hi)] rounded-[12px] overflow-hidden flex flex-col h-[460px]">
      <div className="h-[40px] bg-surface border-b border-line flex items-center justify-between px-4 sticky top-0 z-20 shrink-0">
        <div className="flex gap-[6px]">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="font-mono text-[14px] text-steel">fynback.in/dashboard · live</div>
        <div className="font-mono text-green animate-blink">▮</div>
      </div>
      
      <div className="flex-1 overflow-y-auto flex flex-col relative no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="px-5 py-3 font-mono text-[12px] text-steel flex justify-between border-b border-line bg-[var(--ink)] sticky top-0 z-10 shrink-0">
          <span>RECOVERY FEED  ·  LIVE  ·  MARCH 2025</span>
          <span className="text-green">● 3 active retries</span>
        </div>
        
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-x-0 px-5 flex flex-col pt-2">
            {rows.map((row, i) => (
              <div 
                key={row.id || i} 
                className={`flex items-center h-[44px] hover:bg-[var(--ghost)] transition-colors shrink-0
                  ${row.isNew ? 'animate-row-enter' : ''} 
                  ${row.isExiting ? 'animate-row-exit' : ''} 
                  ${row.status === 'RCVD' ? 'border-l-2 border-[var(--green-dim)] pl-2 -ml-2' : ''} 
                  ${row.status === 'RTRY' ? 'amber-pulse-border pl-2 -ml-2' : ''}`}
              >
                <div className={`w-[60px] font-mono text-[12px] ${row.status === 'RCVD' ? 'text-green font-medium' : row.status === 'RTRY' ? 'text-amber' : 'text-red'}`}>
                  {row.status}
                </div>
                <div className={`w-[110px] font-mono text-[17px] font-medium ${row.status === 'RCVD' ? 'text-green' : row.status === 'RTRY' ? 'text-amber' : 'text-red'}`}>
                  {row.amount}
                </div>
                <div className="flex-1 font-body text-[14px] text-silver truncate pr-4">
                  <span className={`text-[10px] ${row.gate.toLowerCase() === 'stripe' ? 'text-[#635bff]' : row.gate.toLowerCase() === 'razorpay' ? 'text-[#3395ff]' : row.gate.toLowerCase() === 'cashfree' ? 'text-[#00c274]' : 'text-[#ff6b35]'}`}>{row.gate}</span>
                  <span className="text-steel"> · </span>{row.reason}<span className="text-steel"> · </span>{row.email}
                </div>
                <div className="w-[60px] text-right font-mono text-[12px] text-steel shrink-0">{row.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="h-[36px] bg-surface border-t border-line flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-2 font-mono text-[12px] text-steel">
          <div className="w-2 h-2 rounded-full bg-green animate-[pulse_2s_infinite]" />
          live sync · razorpay · stripe · cashfree
        </div>
        <div className="font-mono text-[14px] text-green font-medium">
          ₹{totalRecovered.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} recovered today
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <>
      <section className="min-h-[100svh] flex items-center px-6 md:px-20 py-14">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full md:w-[50%] animate-on-scroll visible">
            <div className="font-mono text-[15px] text-green tracking-[0.05em] mb-6">
              India's first intelligent payment recovery platform
            </div>
            <h1 className="font-heading font-bold text-[44px] md:text-[58px] lg:text-[78px] text-white leading-[1.05] tracking-[-2px]">
              Your Razorpay<br/>
              failures are<br/>
              <span className="text-green relative inline-block">
                recoverable.
                <div className="absolute bottom-[4px] left-0 right-0 h-[2px] bg-green opacity-90" style={{ marginBottom: '-6px' }}></div>
              </span>
            </h1>
            <p className="font-body text-[16px] text-silver max-w-[460px] leading-[1.7] mt-6">
              78% of failed payments can be recovered with the right retry timing and the right message. fynback does both — automatically, for Razorpay, Stripe, Cashfree, and PayU.
            </p>
            
            <div className="mt-8 flex flex-wrap items-center gap-[12px]">
              <Link href="/dashboard" className="bg-green text-black font-body font-bold text-[17px] px-[28px] py-[12px] rounded-[6px] hover:bg-[#00ff88] hover:-translate-y-[1px] transition-all">
                Start recovering for free
              </Link>
              <button className="text-silver font-body text-[17px] px-4 py-2 hover:text-white transition-colors group flex items-center gap-2">
                See a live demo <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            <div className="mt-[20px] font-body text-[15px] text-steel">
              No credit card · 14-day trial · Setup in 8 minutes · SOC2 compliant
            </div>

            <div className="mt-[28px] flex items-center gap-[40px]">
              <div>
                <div className="font-mono font-semibold text-[32px] text-green">₹12.4Cr</div>
                <div className="font-body text-[14px] text-steel leading-tight mt-1">recovered<br/>this month</div>
              </div>
              <div className="w-[1px] h-[40px] bg-line"></div>
              <div>
                <div className="font-mono font-semibold text-[32px] text-green">78%</div>
                <div className="font-body text-[14px] text-steel leading-tight mt-1">avg rate</div>
              </div>
              <div className="w-[1px] h-[40px] bg-line"></div>
              <div>
                <div className="font-mono font-semibold text-[32px] text-green">&lt; 8 min</div>
                <div className="font-body text-[14px] text-steel leading-tight mt-1">setup time</div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-[50%] h-full animate-on-scroll visible" style={{ transitionDelay: '200ms' }}>
            <TerminalFeed />
          </div>
        </div>
      </section>

      {/* Ticker Tape */}
      <div className="h-[48px] bg-ink border-y border-line overflow-hidden flex items-center">
        <div className="ticker-content font-mono text-[12px] text-steel whitespace-nowrap">
          {Array(8).fill("Razorpay · subscription.halted · recovered · Stripe · invoice.payment_failed · recovered · Cashfree · PAYMENT_FAILED · recovered · PayU · transfer_failed · recovered · ").map((text, i) => (
             <span key={i} className="pr-4">{text}</span>
          ))}
        </div>
      </div>
    </>
  );
};

// SECTION 3 — THE PROBLEM
const ProblemStatement = () => {
  return (
    <section className="py-[120px] px-6 md:px-20 bg-black">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row gap-20">
        <div className="w-full md:w-[60%] animate-on-scroll">
          <div className="font-mono font-bold text-[60px] md:text-[90px] text-red leading-none mb-4">₹1,300 Cr</div>
          <div className="font-heading font-medium text-[32px] md:text-[36px] text-white leading-[1.2] mb-8">
            lost to failed payments<br/>by Indian SaaS companies<br/>every year.
          </div>
          
          <div className="font-body text-[17px] text-silver max-w-[520px] leading-[1.8] space-y-5">
            <p>Your payment gateway sends you a webhook when a payment fails. Then it tries once more, maybe twice, then gives up.</p>
            <p>That's it. That's all Razorpay does for you by default.</p>
            <p>Meanwhile, 68% of those failures were recoverable. Someone's card expired. Someone's UPI balance was low on the 18th but full on the 25th. Someone just needed a message.</p>
            <p className="text-white font-medium">fynback is the layer that should have been built into your gateway but wasn't.</p>
          </div>
        </div>
        
        <div className="w-full md:w-[40%] animate-on-scroll" style={{ transitionDelay: '200ms' }}>
          <div className="grid grid-cols-2 gap-0 font-mono">
            <div className="pr-6 border-r border-line pb-8">
               <div className="text-[12px] text-steel uppercase tracking-[0.1em] font-medium mb-3">WITHOUT fynback</div>
               <div className="h-[1px] w-full bg-line mb-4"></div>
               
               <div className="mb-6"><div className="text-red text-[15px] mb-1">1 retry attempt</div><div className="text-steel text-[15px]"></div></div>
               <div className="mb-6"><div className="text-red text-[15px] mb-1">38%</div><div className="text-steel text-[15px]">recovery rate</div></div>
               <div className="mb-6"><div className="text-red text-[15px] mb-1">₹0 WhatsApp</div><div className="text-steel text-[15px]">no WA outreach</div></div>
               <div className="mb-6"><div className="text-red text-[15px] mb-1">Stripe only</div><div className="text-steel text-[15px]"></div></div>
               <div><div className="text-red text-[15px] mb-1">₹61,600</div><div className="text-steel text-[15px]">monthly recovered</div></div>
            </div>
            <div className="pl-6 pb-8">
               <div className="text-[12px] text-steel uppercase tracking-[0.1em] font-medium mb-3">WITH fynback</div>
               <div className="h-[1px] w-full bg-line mb-4"></div>
               
               <div className="mb-6"><div className="text-green text-[15px] mb-1">Smart retry engine</div><div className="text-silver text-[15px]">payday-cycle aware</div></div>
               <div className="mb-6"><div className="text-green text-[15px] mb-1">78%</div><div className="text-silver text-[15px]">recovery rate</div></div>
               <div className="mb-6"><div className="text-green text-[15px] mb-1">₹1,00,800/mo</div><div className="text-silver text-[15px]">recovered via WhatsApp</div></div>
               <div className="mb-6"><div className="text-[15px] text-green mb-1 mb-1">Razorpay + Stripe</div><div className="text-silver text-[15px]">+ Cashfree + PayU</div></div>
               <div><div className="text-green text-[15px] mb-1">₹2,40,000</div><div className="text-silver text-[15px]">monthly recovered</div></div>
            </div>
          </div>
          <div className="mt-4 font-mono font-medium text-[17px] text-green">
            +₹1,78,400/month. That's what the gap costs.
          </div>
        </div>
      </div>
    </section>
  );
};

// SECTION 4 — HOW IT ACTUALLY WORKS
const ProcessLog = () => {
  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState({ block: 0, token: 0, chars: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleStart = () => setStarted(true);
    const el = containerRef.current;
    if (el) {
      el.addEventListener('startTypewriter', handleStart);
      if (el.classList.contains('visible')) setStarted(true);
    }
    return () => {
      if (el) el.removeEventListener('startTypewriter', handleStart);
    };
  }, []);

  const reset = () => {
    setStarted(false);
    setRevealed({ block: 0, token: 0, chars: 0 });
    setIsComplete(false);
    setTimeout(() => setStarted(true), 10);
  };

  const PROCESS_BLOCKS = [
    [
      { text: "[09:42:14]", className: "text-steel", speed: 8 },
      { text: " webhook received from razorpay", className: "text-silver" },
      { text: "\n", className: "" },
      { text: "event:", className: "text-steel pl-[90px]" },
      { text: " subscription.halted", className: "text-white" },
      { text: "\n", className: "" },
      { text: "customer:", className: "text-steel pl-[90px]" },
      { text: " priya@startup.in", className: "text-white" },
      { text: " | amount:", className: "text-steel" },
      { text: " ₹12,800", className: "text-white" }
    ],
    [
      { text: "[09:42:14]", className: "text-steel", speed: 8 },
      { text: " classifying decline code:", className: "text-silver" },
      { text: " card_expired", className: "text-white" },
      { text: "\n", className: "" },
      { text: "verdict:", className: "text-steel pl-[90px]" },
      { text: " SOFT_DECLINE", className: "text-green uppercase" },
      { text: " → retryable", className: "text-steel" }
    ],
    [
      { text: "[09:42:15]", className: "text-steel", speed: 8 },
      { text: " campaign triggered:", className: "text-silver" },
      { text: " 7-day-aggressive", className: "text-white" },
      { text: "\n", className: "" },
      { text: "step 1:", className: "text-steel pl-[90px]" },
      { text: " email #1 queued (delay: 0ms)", className: "text-silver" },
      { text: "\n", className: "" },
      { text: "step 2:", className: "text-steel pl-[90px]" },
      { text: " retry attempt 1 scheduled (delay: 48h)", className: "text-silver" }
    ],
    [
      { text: "[09:42:15]", className: "text-steel", speed: 8 },
      { text: " email sent:", className: "text-silver" },
      { text: " \"Payment issue with your subscription\"", className: "text-white" },
      { text: "\n", className: "" },
      { text: "delivered: ✓  opened: ✓ (09:51)  clicked: ✗", className: "text-steel pl-[90px]" }
    ],
    [
      { text: "[Mar 22, 10:00]", className: "text-steel", speed: 8 },
      { text: " retry attempt 1 fired", className: "text-silver" },
      { text: "\n", className: "" },
      { text: "result:", className: "text-steel pl-[125px]" },
      { text: " declined again (card_expired)", className: "text-amber" },
      { text: "\n", className: "" },
      { text: "note: retrying after payday window (Mar 25)", className: "text-steel pl-[125px] italic" }
    ],
    [
      { text: "[Mar 25, 09:00]", className: "text-steel", speed: 8 },
      { text: " retry attempt 2 fired — post-salary timing", className: "text-silver" },
      { text: "\n", className: "" },
      { text: "result:", className: "text-steel pl-[125px]" },
      { text: " ✓ SUCCESS", className: "text-green uppercase" }
    ],
    [
      { text: "[Mar 25, 09:00]", className: "text-steel", speed: 8 },
      { text: " ₹12,800 RECOVERED", className: "text-green font-medium text-[17px]", speed: 40 },
      { text: "\n", className: "" },
      { text: "time elapsed:", className: "text-steel pl-[125px]" },
      { text: " 2.8 days", className: "text-silver" },
      { text: "\n", className: "" },
      { text: "channel:", className: "text-steel pl-[125px]" },
      { text: " auto-retry + email sequence", className: "text-silver" }
    ]
  ];

  useEffect(() => {
    if (!started || isComplete) return;

    let { block, token, chars } = revealed;
    if (block >= PROCESS_BLOCKS.length) {
      setIsComplete(true);
      return;
    }

    const currentToken = PROCESS_BLOCKS[block][token];
    const fullText = currentToken.text;
    
    if (chars < fullText.length) {
      const speed = currentToken.speed || 20;
      const timer = setTimeout(() => {
        setRevealed({ block, token, chars: chars + 1 });
      }, speed);
      return () => clearTimeout(timer);
    } else {
      if (token + 1 < PROCESS_BLOCKS[block].length) {
        setRevealed({ block, token: token + 1, chars: 0 });
      } else {
        setRevealed({ block: block + 1, token: 0, chars: 0 });
      }
    }
  }, [started, revealed, isComplete]);

  return (
    <section id="how-it-works" className="py-[120px] px-6 md:px-20 bg-black">
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="font-mono text-[15px] text-steel mb-4">// process.log</div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="font-heading font-semibold text-[44px] md:text-[54px] text-white leading-[1.1]">
            What happens when<br/>a payment fails
          </h2>
          <div className="font-mono text-[17px] text-green mb-2">With fynback running.</div>
        </div>

        <div className="bg-ink border border-line rounded-[10px] p-8 md:p-10 font-mono text-[15px] md:text-[16px] max-w-[760px] relative overflow-hidden" ref={containerRef} data-typewriter="true">
          <div className="space-y-6">
            {PROCESS_BLOCKS.map((tokens, bIdx) => {
              if (bIdx > revealed.block) return null;
              
              const isLastBlock = bIdx === 6;
              const applySuccessClass = isLastBlock && isComplete;

              return (
                <div 
                  key={bIdx} 
                  className={isLastBlock ? `transition-all duration-500 origin-center -mx-4 px-4 py-2 border-l-[3px] border-transparent rounded bg-transparent ${applySuccessClass ? '!bg-[var(--green-dim)] !border-green animate-[successPop_400ms_ease_forwards]' : ''}` : ''}
                >
                  {tokens.map((tok, tIdx) => {
                    if (bIdx === revealed.block && tIdx > revealed.token) return null;
                    
                    const isCurrent = bIdx === revealed.block && tIdx === revealed.token;
                    const textToShow = isCurrent ? tok.text.slice(0, revealed.chars) : tok.text;
                    
                    if (tok.text === '\n') return <br key={tIdx} />;
                    
                    return (
                      <span key={tIdx} className={tok.className}>{textToShow}</span>
                    );
                  })}
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={reset}
            className="absolute bottom-6 right-6 font-mono text-[11px] text-steel hover:text-white transition-colors border-none bg-transparent cursor-pointer"
          >
            ↺ replay
          </button>
        </div>

        <div className="max-w-[760px] text-right mt-4 font-body text-[17px] italic text-steel animate-on-scroll">
          This happened automatically. You were asleep.
        </div>
      </div>
    </section>
  );
};

// SECTION 5 — INDIA-FIRST
const IndiaFirst = () => {
  return (
    <section className="py-[120px] px-6 md:px-20 bg-ink">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row gap-16 md:gap-20 items-center">
        
        <div className="w-full md:w-[50%] animate-on-scroll">
          <div className="font-mono text-[12px] text-green tracking-[0.1em] mb-4">// made for India</div>
          <h2 className="font-heading font-bold text-[40px] md:text-[58px] text-white leading-[1.05] mb-8">
            Built around<br/>how India<br/>actually pays.
          </h2>
          
          <p className="font-body text-[18px] text-silver mb-8 leading-[1.7]">
            Western dunning tools retry payments on Monday at 9am PST.<br/>
            Your customers get paid on the 1st and the 25th — not on Mondays.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="font-body text-[18px] text-white">fynback's retry engine knows:</div>
            <div className="font-mono text-[16px] text-silver flex gap-3"><span className="text-green">→</span>Government employees: paid on the 1st</div>
            <div className="font-mono text-[16px] text-silver flex gap-3"><span className="text-green">→</span>Private sector: paid on the 25th–28th</div>
            <div className="font-mono text-[16px] text-silver flex gap-3"><span className="text-green">→</span><span>UPI AutoPay: NPCI mandates max 4 attempts,<br/>non-peak timing windows only</span></div>
            <div className="font-mono text-[16px] text-silver flex gap-3"><span className="text-green">→</span><span>Card failures: retry 3 days after decline,<br/>not 24 hours after</span></div>
          </div>

          <div className="font-body font-medium text-[17px] text-white mb-8">
            This is not a setting you configure. It's built in.
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="border border-[rgba(51,149,255,0.3)] bg-[rgba(51,149,255,0.08)] text-[#3395ff] rounded-[4px] font-mono font-medium text-[14px] px-[10px] py-[4px] flex items-center gap-2"><span className="text-[10px]">●</span> Razorpay</div>
            <div className="border border-[rgba(99,91,255,0.3)] bg-[rgba(99,91,255,0.08)] text-[#635bff] rounded-[4px] font-mono font-medium text-[14px] px-[10px] py-[4px] flex items-center gap-2"><span className="text-[10px]">●</span> Stripe</div>
            <div className="border border-[rgba(0,194,116,0.3)] bg-[rgba(0,194,116,0.08)] text-[#00c274] rounded-[4px] font-mono font-medium text-[14px] px-[10px] py-[4px] flex items-center gap-2"><span className="text-[10px]">●</span> Cashfree</div>
            <div className="border border-[rgba(255,107,53,0.3)] bg-[rgba(255,107,53,0.08)] text-[#ff6b35] rounded-[4px] font-mono font-medium text-[14px] px-[10px] py-[4px] flex items-center gap-2"><span className="text-[10px]">●</span> PayU</div>
          </div>
        </div>

        <div className="w-full md:w-[50%] animate-on-scroll" style={{ transitionDelay: '200ms' }}>
          <div className="bg-surface border border-line rounded-[10px] p-6 max-w-[480px] ml-auto">
            <div className="font-mono text-[14px] text-steel mb-4 uppercase tracking-[0.1em]">March 2025</div>
            <div className="grid grid-cols-7 gap-2 mb-6">
              {['M','T','W','T','F','S','S'].map((d,i) => <div key={i} className="text-center font-mono text-[12px] text-steel">{d}</div>)}
              {Array.from({length: 31}).map((_, i) => {
                const day = i + 1;
                const isPayday = [1,2,3,25,26,27,28].includes(day);
                return (
                  <div key={i} className={`h-[36px] w-full rounded-[6px] flex items-center justify-center font-mono text-[12px] relative ${isPayday ? 'bg-[var(--green-dim)] border border-[var(--green-line)] text-green cursor-help group' : 'text-steel'}`}>
                    {day}
                    {isPayday && <span className="absolute top-[2px] right-[2px] text-[8px]">↑</span>}
                    {isPayday && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[200px] bg-ink border border-line text-silver p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-[12px] text-center">
                        {day <= 3 ? "Govt salary credited · Best retry window" : "Private sector salary · Best retry window"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="font-mono text-[14px] text-silver space-y-2">
              <p>fynback scheduled 47 retries<br/>around payday windows this month.</p>
              <p className="text-green text-[15px] mt-4">₹38,200 in additional recovery<br/>vs random retry scheduling.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

// SECTION 6 — WHATSAPP
const WhatsAppSpotlight = () => {
  return (
    <section className="py-[120px] px-6 bg-black text-center box-border">
      <div className="w-full max-w-[800px] mx-auto animate-on-scroll">
        <div className="font-mono text-[15px] text-steel mb-4">// channel performance</div>
        <h2 className="font-heading font-semibold text-[32px] md:text-[42px] text-white leading-[1.2] mb-6">
          Email open rate in India: 22%.<br/>
          WhatsApp open rate: <span className="text-green">95%</span>.
        </h2>
        
        <p className="font-body text-[17px] text-silver max-w-[600px] mx-auto mb-16">
          fynback sends pre-approved WhatsApp Business messages with direct UPI re-authentication links. No login. One tap.<br/><br/>
          Your customer gets a message that looks like this:
        </p>

        {/* iPhone Frame */}
        <div className="w-[280px] h-[560px] bg-[#1a1a1a] rounded-[44px] mx-auto relative p-[8px] shadow-2xl flex flex-col border border-[#333] mb-12">
          {/* Notch */}
          <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[80px] h-[24px] bg-[#0a0a0a] rounded-b-[16px] rounded-t-[34px] z-20 flex justify-center items-center">
             <div className="w-[36px] h-[4px] rounded-full bg-[#1a1a1a]"></div>
          </div>
          
          {/* Screen */}
          <div className="flex-1 bg-[#0b1117] rounded-[36px] overflow-hidden flex flex-col relative w-full h-full border border-black">
            {/* Status Bar */}
            <div className="h-[44px] bg-[#1f2c34] flex justify-between items-end px-6 pb-2 text-[11px] font-medium text-white z-10 font-mono">
              <div>9:42</div>
              <div className="flex gap-1.5 items-center">
                <div className="flex items-end gap-[1px] h-[10px] pb-[1px]">
                  <div className="w-[2.5px] h-[4px] bg-white"></div>
                  <div className="w-[2.5px] h-[6px] bg-white"></div>
                  <div className="w-[2.5px] h-[8px] bg-white"></div>
                  <div className="w-[2.5px] h-[10px] bg-white/40"></div>
                </div>
                <div className="w-[18px] h-[10px] rounded-[3px] border border-white/60 p-[1px] flex relative ml-0.5">
                  <div className="bg-white w-[12px] h-full rounded-[1px]"></div>
                  <div className="absolute right-[-2.5px] top-1/2 -translate-y-1/2 w-[1.5px] h-[4px] bg-white/60 rounded-r-full"></div>
                </div>
              </div>
            </div>

            {/* WA Header */}
            <div className="bg-[#1f2c34] px-4 py-2 flex gap-3 items-center border-b border-[#2a3942] z-10 shrink-0">
              <div className="w-[36px] h-[36px] rounded-full bg-[#00a884] flex items-center justify-center text-white font-semibold text-[14px]">
                AS
              </div>
              <div className="flex-1 text-left">
                <div className="text-[15px] text-white font-medium flex items-center gap-1 leading-tight">
                  AcmeSaaS Billing
                  <div className="w-3 h-3 rounded-full bg-[#00a884] flex items-center justify-center shrink-0">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
                <div className="text-[12px] text-[#8696a0] mt-0.5">Official Business Account</div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="bg-[#0b1117] flex-1 p-4 relative flex flex-col z-0 overflow-hidden isolate" style={{ backgroundImage: "url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')", backgroundSize: '400px', opacity: 0.95 }}>
              <div className="mt-8">
                <div className="wa-message-bubble bg-[#1f2c34] rounded-[8px] rounded-tl-[0] p-[12px] shadow-sm animate-message-pop origin-top-left text-left max-w-[95%]">
                  <div className="font-body text-[13px] text-[#e9edef] leading-[1.4] space-y-2">
                    <div className="font-semibold text-white">Billing update from AcmeSaaS</div>
                    <p>Hi Priya 👋, there was an issue processing your ₹12,800 payment for the Growth plan.</p>
                    <p>Your access continues until Mar 28. Please update your payment method to avoid interruption.</p>
                    <button className="w-full bg-[#00a884] text-black font-medium text-[13px] py-1.5 rounded-[6px] mt-2 border-none">
                      Update payment →
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 px-1 animate-fade-in-delayed text-left">
                  <span className="text-silver text-[11px] font-body">Opened in 4 minutes</span>
                  <span className="text-[#53bdeb] text-[15px] tracking-[-4px]">✓✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Bars */}
        <div className="max-w-[560px] mx-auto text-left">
          <div className="mb-6">
            <div className="flex justify-between font-mono text-[14px] mb-2">
              <span className="text-steel">Email</span>
              <span className="text-white">22% open rate</span>
            </div>
            <div className="h-[6px] bg-[#1a1a1a] rounded-full overflow-hidden w-full relative">
              <div className="h-full bg-steel rounded-full bar-email"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-mono text-[14px] mb-2">
              <span className="text-green">WhatsApp</span>
              <span className="text-white">95% open rate</span>
            </div>
            <div className="h-[6px] bg-[#1a1a1a] rounded-full overflow-hidden w-full relative">
              <div className="h-full bg-green rounded-full bar-wa"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// SECTION 7 — SOCIAL PROOF
const Testimonials = () => {
  return (
    <section className="py-[120px] px-6 md:px-20 bg-ink">
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="font-mono text-[15px] text-steel mb-4">// founders.log</div>
        <h2 className="font-heading font-semibold text-[32px] md:text-[42px] text-white leading-[1.2] mb-12">
          What recovery looks like in practice.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-surface border border-line rounded-[8px] p-6 lg:p-7 font-mono animate-on-scroll">
            <div className="text-steel text-[14px] lg:text-[15px] mb-6">// rahul-mehta · edtech-saas.in · growth-plan</div>
            <div className="text-[14px] lg:text-[15px] space-y-1 mb-8">
              <div><span className="text-silver inline-block w-[70px]">before:</span><span className="text-red">₹18,400/mo recovered</span>  <span className="text-steel">(razorpay default only)</span></div>
              <div><span className="text-silver inline-block w-[70px]">after:</span><span className="text-green">₹62,700/mo recovered</span>  <span className="text-steel">(with fynback, month 1)</span></div>
              <div><span className="text-silver inline-block w-[70px]">delta:</span><span className="text-green font-medium">+₹44,300/mo</span></div>
            </div>
            <p className="font-body text-[16px] lg:text-[17px] text-silver italic leading-[1.6] mb-6">
              "We were losing money to failed payments for 14 months without knowing how much. fynback showed us the real number in the first 5 minutes."
            </p>
            <div className="text-[14px] lg:text-[15px]">
              <div className="text-steel">— Rahul M., Co-founder</div>
              <div className="text-green pl-4 mt-1">recovered: ₹5.3L in 4 months</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface border border-line rounded-[8px] p-6 lg:p-7 font-mono animate-on-scroll" style={{ transitionDelay: '100ms' }}>
            <div className="text-steel text-[14px] lg:text-[15px] mb-6">// anjali-s · hrms-platform.in · scale-plan</div>
            <div className="text-[14px] lg:text-[15px] space-y-1 mb-8">
              <div><span className="text-silver inline-block w-[70px]">before:</span><span className="text-red">₹42,000/mo recovered</span>  <span className="text-steel">(stripe default + manual)</span></div>
              <div><span className="text-silver inline-block w-[70px]">after:</span><span className="text-green">₹1,85,000/mo recovered</span> <span className="text-steel">(with fynback, month 3)</span></div>
              <div><span className="text-silver inline-block w-[70px]">delta:</span><span className="text-green font-medium">+₹1,43,000/mo</span></div>
            </div>
            <p className="font-body text-[16px] lg:text-[17px] text-silver italic leading-[1.6] mb-6">
              "The WhatsApp integration changed everything. We stopped sending emails entirely. Pre-approved UPI links via WhatsApp convert at 80% for us now."
            </p>
            <div className="text-[14px] lg:text-[15px]">
              <div className="text-steel">— Anjali S., VP Finance</div>
              <div className="text-green pl-4 mt-1">recovered: ₹18L in 10 months</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface border border-line rounded-[8px] p-6 lg:p-7 font-mono animate-on-scroll" style={{ transitionDelay: '200ms' }}>
            <div className="text-steel text-[14px] lg:text-[15px] mb-6">// deepak-v · developer-api.co · growth-plan</div>
            <div className="text-[14px] lg:text-[15px] space-y-1 mb-8">
              <div><span className="text-silver inline-block w-[70px]">before:</span><span className="text-red">₹8,200/mo recovered</span>   <span className="text-steel">(cashfree default)</span></div>
              <div><span className="text-silver inline-block w-[70px]">after:</span><span className="text-green">₹38,000/mo recovered</span>  <span className="text-steel">(with fynback, month 2)</span></div>
              <div><span className="text-silver inline-block w-[70px]">delta:</span><span className="text-green font-medium">+₹29,800/mo</span></div>
            </div>
            <p className="font-body text-[16px] lg:text-[17px] text-silver italic leading-[1.6] mb-6">
              "Setup took exactly 8 minutes. Connected the Razorpay integration and it instantly found ₹2.2L at risk. Paid for itself on day 1."
            </p>
            <div className="text-[14px] lg:text-[15px]">
              <div className="text-steel">— Deepak V., Founder</div>
              <div className="text-green pl-4 mt-1">recovered: ₹1.4L in 2 months</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// SECTION 8 — INTEGRATIONS
const Integrations = () => {
  return (
    <section id="integrations" className="py-[120px] px-6 md:px-20 bg-black">
      <div className="w-full max-w-[1440px] mx-auto animate-on-scroll">
        <h2 className="font-heading font-semibold text-[44px] md:text-[54px] text-white leading-[1.1] mb-12">
          Connect in 5 minutes.<br/>No engineering needed.
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { name: 'Razorpay', style: 'text-[#3395ff]', desc: 'OAuth connect' },
            { name: 'Stripe', style: 'text-[#635bff]', desc: 'Stripe Connect' },
            { name: 'Cashfree', style: 'text-[#00c274]', desc: 'API keys' },
            { name: 'PayU', style: 'text-[#ff6b35]', desc: 'API keys' },
          ].map((item, i) => (
            <div key={i} className="bg-ink border border-line rounded-[10px] p-6 h-[100px] flex flex-col justify-between hover:border-[var(--line-hi)] hover:-translate-y-[2px] transition-all cursor-default">
              <div className="flex items-start justify-between">
                <div className={`font-mono font-semibold text-[18px] ${item.style}`}>{item.name}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-body text-[14px] text-steel">{item.desc}</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green"></div>
                  <span className="font-mono text-[12px] text-green">Supported</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center font-body text-[15px] text-steel">
          Also sends via: WhatsApp Business · Email (Resend/SES) · SMS (MSG91)
        </div>
      </div>
    </section>
  );
};

// SECTION 9 — PRICING
const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  
  return (
    <section id="pricing" className="py-[120px] px-8 bg-ink text-center">
      <div className="w-full max-w-[1100px] mx-auto">
        <div className="animate-on-scroll">
          <div className="font-mono text-[15px] text-steel mb-4">// pricing.config</div>
          <h2 className="font-heading font-semibold text-[44px] md:text-[54px] text-white leading-[1.1] mb-4">
            Pays for itself on day one.
          </h2>
          <p className="font-body text-[18px] text-silver mb-10">
            Every plan includes a 14-day free trial. No credit card.
          </p>
          
          <div className="inline-flex items-center bg-surface border border-line rounded-full p-1 mb-16 relative z-[60]">
            <button 
              className={`px-6 py-2 rounded-full font-body text-[16px] font-medium transition-colors cursor-pointer ${!isAnnual ? 'bg-line text-white' : 'text-silver hover:text-white'}`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
            <button 
              className={`px-6 py-2 rounded-full font-body text-[16px] font-medium transition-colors flex items-center gap-2 cursor-pointer ${isAnnual ? 'bg-line text-white' : 'text-silver hover:text-white'}`}
              onClick={() => setIsAnnual(true)}
            >
              Annual <span className="bg-[var(--green-dim)] text-green text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 text-left">
          
          {/* Starter */}
          <div className="flex-1 bg-surface border border-line rounded-[10px] p-8 animate-on-scroll transition-all duration-300">
             <div className="font-mono font-semibold text-[15px] text-steel uppercase tracking-[0.1em] mb-4">STARTER</div>
             <div className="font-heading font-bold text-[54px] text-white flex items-center mb-[20px] mt-2 h-[76px]">
                {isAnnual && <span className="text-steel line-through decoration-red/60 text-[26px] mr-3 font-medium transition-opacity duration-300 animate-fade-in self-center mt-2">₹2,999</span>}
                <span className="font-mono text-[24px] text-silver mr-1 self-start mt-4">₹</span>
                <div className="relative overflow-hidden h-full inline-block">
                  <div className={`transition-transform duration-500 ease-in-out flex flex-col ${isAnnual ? '-translate-y-1/2' : 'translate-y-0'}`}>
                    <div className="h-[76px] flex items-center justify-center leading-none">2,999</div>
                    <div className="h-[76px] flex items-center justify-center leading-none text-green">2,399</div>
                  </div>
                </div>
                <span className="font-body text-[18px] font-normal text-steel ml-1 self-end mb-3">/mo</span>
             </div>
             <div className="font-mono text-[14px] text-steel mb-8">Up to ₹2L MRR</div>
             
             <div className="font-body text-[16px] text-silver leading-[2] space-y-1 mb-8">
               <div className="flex gap-3"><span className="text-green">→</span> Razorpay + Stripe</div>
               <div className="flex gap-3"><span className="text-green">→</span> 3-email dunning sequence</div>
               <div className="flex gap-3"><span className="text-green">→</span> Smart retry scheduling</div>
               <div className="flex gap-3"><span className="text-green">→</span> Basic analytics</div>
               <div className="flex gap-3"><span className="text-green">→</span> Email support</div>
             </div>
             
             <button className="w-full bg-transparent border border-[var(--line-hi)] text-silver font-body font-medium rounded-[6px] py-3 mt-[32px] hover:text-white hover:border-silver transition-colors">
               Start free trial
             </button>
          </div>

          {/* Growth */}
          <div className="flex-1 rounded-[10px] p-8 relative border border-[var(--green-line)] bg-gradient-to-b from-[rgba(0,232,120,0.04)] to-[var(--surface)] hover:border-[#4d9fff] hover:shadow-[0_0_30px_rgba(77,159,255,0.15)] transition-all duration-300 animate-on-scroll" style={{ transitionDelay: '100ms' }}>
             <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 font-mono font-medium text-[12px] text-green border border-[var(--green-line)] bg-black rounded-[20px] px-3 py-1">
               Most popular
             </div>
             <div className="font-mono font-semibold text-[15px] text-steel uppercase tracking-[0.1em] mb-4">GROWTH</div>
             <div className="font-heading font-bold text-[54px] text-white flex items-center mb-[20px] mt-2 h-[76px]">
                {isAnnual && <span className="text-steel line-through decoration-red/60 text-[26px] mr-3 font-medium transition-opacity duration-300 animate-fade-in self-center mt-2">₹6,999</span>}
                <span className="font-mono text-[24px] text-silver mr-1 self-start mt-4">₹</span>
                <div className="relative overflow-hidden h-full inline-block">
                  <div className={`transition-transform duration-500 ease-in-out flex flex-col ${isAnnual ? '-translate-y-1/2' : 'translate-y-0'}`}>
                    <div className="h-[76px] flex items-center justify-center leading-none">6,999</div>
                    <div className="h-[76px] flex items-center justify-center leading-none text-green">5,599</div>
                  </div>
                </div>
                <span className="font-body text-[18px] font-normal text-steel ml-1 self-end mb-3">/mo</span>
             </div>
             <div className="font-mono text-[14px] text-steel mb-8">Up to ₹10L MRR</div>
             
             <div className="font-body text-[16px] text-silver leading-[2] space-y-1 mb-8">
               <div className="flex gap-3"><span className="text-green">→</span> Everything in Starter</div>
               <div className="flex gap-3"><span className="text-green font-bold">→</span> <span className="text-white font-medium">WhatsApp Business recovery</span></div>
               <div className="flex gap-3"><span className="text-green">→</span> SMS via MSG91</div>
               <div className="flex gap-3"><span className="text-green">→</span> Cashfree + PayU</div>
               <div className="flex gap-3"><span className="text-green">→</span> Campaign editor + A/B test</div>
               <div className="flex gap-3"><span className="text-green">→</span> Subscription pause flow</div>
               <div className="flex gap-3"><span className="text-green">→</span> Priority support</div>
             </div>
             
             <button className="w-full bg-green text-black font-body font-bold rounded-[6px] py-3 mt-auto hover:bg-[#00ff88] transition-colors">
               Start free trial
             </button>
          </div>

          {/* Scale */}
          <div className="flex-1 bg-surface border border-line rounded-[10px] p-8 animate-on-scroll transition-all duration-300" style={{ transitionDelay: '200ms' }}>
             <div className="font-mono font-semibold text-[15px] text-steel uppercase tracking-[0.1em] mb-4">SCALE</div>
             <div className="font-heading font-bold text-[54px] text-white flex items-center mb-[20px] mt-2 h-[76px]">
                {isAnnual && <span className="text-steel line-through decoration-red/60 text-[26px] mr-3 font-medium transition-opacity duration-300 animate-fade-in self-center mt-2">₹14,999</span>}
                <span className="font-mono text-[24px] text-silver mr-1 self-start mt-4">₹</span>
                <div className="relative overflow-hidden h-full inline-block">
                  <div className={`transition-transform duration-500 ease-in-out flex flex-col ${isAnnual ? '-translate-y-1/2' : 'translate-y-0'}`}>
                    <div className="h-[76px] flex items-center justify-center leading-none">14,999</div>
                    <div className="h-[76px] flex items-center justify-center leading-none text-green">11,999</div>
                  </div>
                </div>
                <span className="font-body text-[18px] font-normal text-steel ml-1 self-end mb-3">/mo</span>
             </div>
             <div className="font-mono text-[14px] text-steel mb-8">Unlimited MRR</div>
             
             <div className="font-body text-[16px] text-silver leading-[2] space-y-1 mb-8">
               <div className="flex gap-3"><span className="text-green">→</span> Everything in Growth</div>
               <div className="flex gap-3"><span className="text-green">→</span> AI email copy variants</div>
               <div className="flex gap-3"><span className="text-green">→</span> Customer segmentation</div>
               <div className="flex gap-3"><span className="text-green">→</span> Dedicated Slack channel</div>
               <div className="flex gap-3"><span className="text-green">→</span> White-label emails</div>
               <div className="flex gap-3"><span className="text-green">→</span> SLA guarantee</div>
               <div className="flex gap-3"><span className="text-green">→</span> Quarterly strategy call</div>
             </div>
             
             <button className="w-full bg-transparent border border-[var(--line-hi)] text-silver font-body font-medium rounded-[6px] py-3 mt-[32px] hover:text-white hover:border-silver transition-colors">
               Talk to us
             </button>
          </div>
        </div>

        <div className="mt-16 font-body text-[16px] italic text-steel">
          All plans recover what they cost — or we give you a month free.
        </div>
      </div>
    </section>
  );
};

// SECTION 10 — FAQ
const FAQ = () => {
  const faqs = [
    { q: "How does fynback connect to Razorpay?", a: "Through Razorpay's OAuth partner API. You approve once. We never see your password." },
    { q: "Do customers know their payment failed before I do?", a: "No. All emails and WhatsApp messages come from your brand." },
    { q: "What about UPI AutoPay?", a: "NPCI allows max 4 attempts with timing rules. We follow them. Plus we send a WhatsApp re-auth link." },
    { q: "Is my customers' data safe?", a: "We never store card numbers, UPI IDs, or CVVs. Zero payment instrument data." },
    { q: "What if the payment recovers without fynback?", a: "Only recoveries triggered by fynback retries or outreach are attributed to us." },
    { q: "Can I customise the messages?", a: "Yes. The Campaign editor lets you edit copy, timing, and A/B test subject lines." },
  ];

  return (
    <section className="py-[120px] px-6 md:px-20 bg-black">
      <div className="w-full max-w-[1000px] mx-auto animate-on-scroll">
        <div className="font-mono text-[15px] text-steel mb-4">// faq</div>
        <h2 className="font-heading font-semibold text-[44px] md:text-[54px] text-white leading-[1.1] mb-12">
          Questions.
        </h2>

        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <div key={i} className="flex flex-col md:flex-row border-t border-[var(--line)] py-8 hover:bg-[var(--ghost)] transition-colors px-4 -mx-4 group">
              <div className="w-full md:w-1/2 flex items-start gap-6 pr-8 mb-4 md:mb-0">
                 <div className="font-mono text-[15px] text-steel pt-1">0{i+1}</div>
                 <div className="font-body font-medium text-[17px] text-white pt-1">{faq.q}</div>
              </div>
              <div className="hidden md:block w-[1px] bg-[var(--line)] group-hover:bg-[var(--line-hi)] transition-colors self-stretch mx-4"></div>
              <div className="w-full md:w-1/2 pl-0 md:pl-8 font-body text-[17px] text-silver leading-[1.7] pt-1">
                 {faq.a}
              </div>
            </div>
          ))}
          <div className="border-t border-[var(--line)]"></div>
        </div>
      </div>
    </section>
  );
};

// SECTION 11 — FINAL CTA
const FinalCTA = () => {
  const [started, setStarted] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [showLine2, setShowLine2] = useState(false);
  const [spinner1, setSpinner1] = useState('');
  const [showLine3, setShowLine3] = useState(false);
  const [spinner2, setSpinner2] = useState('');
  const [line4Text, setLine4Text] = useState('');
  const [line5Text, setLine5Text] = useState('');
  const [showHighlight, setShowHighlight] = useState(false);
  const [showReady, setShowReady] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    if (!started) return;
    let isActive = true;

    const runSequence = async () => {
      const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
      const typeText = async (full: string, setter: React.Dispatch<React.SetStateAction<string>>, speed = 40) => {
        let current = '';
        for (let i = 0; i < full.length; i++) {
          if (!isActive) break;
          current += full[i];
          setter(current);
          await sleep(speed);
        }
      };
      
      const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
      const spinTimer = async (setter: React.Dispatch<React.SetStateAction<string>>, duration: number) => {
        const start = Date.now();
        let i = 0;
        while (Date.now() - start < duration) {
          if (!isActive) break;
          setter(spinnerFrames[i % spinnerFrames.length]);
          i++;
          await sleep(80);
        }
        if (isActive) setter('');
      };

      await sleep(300);
      await typeText(">_ fynback connect --gateway razorpay", setPromptText, 40);
      
      if (!isActive) return;
      await sleep(500);
      setShowLine2(true);
      await spinTimer(setSpinner1, 1500);
      
      if (!isActive) return;
      setShowLine3(true);
      await spinTimer(setSpinner2, 1000);

      if (!isActive) return;
      await typeText("Found: 143 failed payments · ₹3,08,000 at risk", setLine4Text, 25);
      
      if (!isActive) return;
      await sleep(200);
      await typeText("Recovery potential: ₹2,40,000 (78%)", setLine5Text, 25);
      if (isActive) setShowHighlight(true);

      if (!isActive) return;
      await sleep(500);
      if (isActive) setShowReady(true);

      if (!isActive) return;
      await sleep(400);
      if (isActive) setShowCTA(true);
    };

    runSequence();
    return () => { isActive = false; };
  }, [started]);

  return (
    <section 
      className="py-[140px] px-6 bg-ink border-t border-line" 
      ref={(el) => {
        if (el && !el.dataset.observed) {
          el.dataset.observed = 'true';
          const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setStarted(true); observer.disconnect(); }
          }, { threshold: 0.5 });
          observer.observe(el);
        }
      }}
    >
      <div className="w-full max-w-[800px] mx-auto text-center flex flex-col items-center">
        
        <div className="font-mono text-[20px] md:text-[28px] text-green mb-8 flex items-center justify-center font-medium min-h-[40px]">
           {started && <span>{promptText}</span>}
           {started && !showCTA && <span className="animate-blink ml-1 leading-none text-[24px]">▮</span>}
        </div>

        <div className="font-mono text-[15px] md:text-[16px] text-silver mb-12 flex flex-col items-start gap-3 min-h-[180px] w-full max-w-[480px] mx-auto text-left">
           {showLine2 && <div className="flex items-center gap-2">Connecting to Razorpay API... <span className="text-green w-[1em]">{spinner1}</span></div>}
           {showLine3 && <div className="flex items-center gap-2">Scanning last 30 days... <span className="text-green w-[1em]">{spinner2}</span></div>}
           {line4Text.length > 0 && <div>
              <span>{line4Text.split('·')[0]}</span>
              {line4Text.includes('·') && <span>· <span className="text-green">{line4Text.split('·')[1]}</span></span>}
           </div>}
           {line5Text.length > 0 && (
             <div className={`mt-1 transition-all duration-500 origin-center rounded p-1 -ml-1 ${showHighlight ? 'bg-[var(--green-dim)] border-l-[3px] border-green text-green animate-[successPop_400ms_ease_forwards]' : 'text-silver border-transparent'}`}>
               {line5Text}
             </div>
           )}
           {showReady && <div className="font-body font-medium text-white text-[18px] mt-6 w-full text-center animate-[delayedFadeIn_500ms_ease_forwards]">Ready. Start your free trial...</div>}
        </div>

        <div className={`transition-all duration-700 transform ${showCTA ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
          <button className="bg-green text-black font-body font-bold text-[18px] px-10 py-4 rounded-[6px] hover:bg-[#00ff88] transition-colors mb-4 flex items-center gap-2 group mx-auto border-none cursor-pointer">
            Connect Razorpay and start recovering <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <div className="font-mono text-[14px] text-steel tracking-tight mt-4">
            Free for 14 days · No credit card · Takes 8 minutes
          </div>
        </div>
      </div>
    </section>
  );
};

// SECTION 12 — FOOTER
const Footer = () => {
  return (
    <footer className="bg-black border-t border-line py-[60px] md:py-[80px] px-6 md:px-20">
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
           <div className="col-span-1 border-b md:border-b-0 border-line pb-8 md:pb-0">
              <div className="font-heading font-semibold text-[20px] text-white tracking-[-0.5px] mb-4">fynback</div>
              <p className="font-body text-[15px] text-steel leading-[1.6] mb-8">
                India's first intelligent<br/>payment recovery platform.
              </p>
              <div className="font-body text-[15px] text-steel leading-[1.5]">
                Made in India · Gurugram, Haryana<br/>
                GST: 07XXXXX1234X1ZX
              </div>
           </div>

           <div className="col-span-1">
             <div className="font-body text-[15px] text-white font-medium mb-4">Product</div>
             <ul className="space-y-3 font-body text-[15px] text-steel">
               <li><a href="#" className="hover:text-silver transition-colors">Features</a></li>
               <li><a href="#" className="hover:text-silver transition-colors">Integrations</a></li>
               <li><a href="#pricing" className="hover:text-silver transition-colors">Pricing</a></li>
               <li><a href="#" className="hover:text-silver transition-colors">Changelog</a></li>
               <li><a href="#" className="hover:text-silver transition-colors">API docs</a></li>
             </ul>
           </div>

           <div className="col-span-1">
             <div className="font-body text-[15px] text-white font-medium mb-4">Company</div>
             <ul className="space-y-3 font-body text-[15px] text-steel">
               <li><a href="#" className="hover:text-silver transition-colors">About</a></li>
               <li><a href="#" className="hover:text-silver transition-colors">Blog</a></li>
               <li><a href="#" className="hover:text-silver transition-colors">Careers</a></li>
               <li><a href="#" className="hover:text-silver transition-colors">Privacy Policy</a></li>
               <li><a href="#" className="hover:text-silver transition-colors">Terms of Service</a></li>
               <li><a href="#" className="hover:text-silver transition-colors">Security</a></li>
             </ul>
           </div>

           <div className="col-span-1">
             <div className="font-body text-[15px] text-white font-medium mb-4">Integrations</div>
             <ul className="space-y-3 font-body text-[15px] text-steel">
               <li><a href="#" className="hover:text-silver transition-colors flex items-center gap-1 group">Razorpay recovery <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
               <li><a href="#" className="hover:text-silver transition-colors flex items-center gap-1 group">Stripe recovery <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
               <li><a href="#" className="hover:text-silver transition-colors flex items-center gap-1 group">Cashfree recovery <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
               <li><a href="#" className="hover:text-silver transition-colors flex items-center gap-1 group">PayU recovery <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
               <li><a href="#" className="hover:text-silver transition-colors flex items-center gap-1 group">WhatsApp Business <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
             </ul>
           </div>
        </div>

        <div className="pt-8 border-t border-line flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="font-body text-[15px] text-steel">© 2025 fynback Technologies Pvt. Ltd.</div>
           <div className="flex gap-4">
             <a href="#" className="text-steel hover:text-silver transition-colors">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
             </a>
             <a href="#" className="text-steel hover:text-silver transition-colors">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
             </a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default function fynbackLandingPage() {
  useIntersectionObserver();
  return (
    <div className="fynback-landing">
      <GlobalStyles />
      <Navbar />
      <Hero />
      <ProblemStatement />
      <ProcessLog />
      <IndiaFirst />
      <WhatsAppSpotlight />
      <Testimonials />
      <Integrations />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

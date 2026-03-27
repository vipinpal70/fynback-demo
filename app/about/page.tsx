"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";

/* ─── GLOBAL STYLES (mirrors landing page design system exactly) ─── */
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=DM+Mono:wght@400;500;600&display=swap');

    .about-page {
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

    .about-page .font-heading { font-family: 'Clash Display', sans-serif; }
    .about-page .font-body    { font-family: 'DM Sans', sans-serif; }
    .about-page .font-mono    { font-family: 'DM Mono', monospace; }

    /* Dot grid */
    .about-page .dot-grid {
      background-image: radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 24px 24px;
    }

    /* Scroll animations */
    .about-page .animate-on-scroll {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 600ms ease, transform 600ms ease;
    }
    .about-page .animate-on-scroll.visible {
      opacity: 1;
      transform: translateY(0);
    }
    @media (prefers-reduced-motion: reduce) {
      .about-page .animate-on-scroll { opacity: 1; transform: none; transition: none; }
    }

    /* Blinking cursor */
    @keyframes about-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
    .about-page .animate-blink { animation: about-blink 1s step-end infinite; }

    /* Typewriter CTA lines */
    @keyframes about-fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
    }



    /* JSON values stagger */
    .about-page .json-block {
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 500ms ease, transform 500ms ease;
    }
    .about-page .json-block.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── Our Story paragraph animations ── */

    /* P1 — slide from left */
    .about-page .story-p1 {
      opacity: 0;
      transform: translateX(-16px);
      transition: opacity 600ms ease, transform 600ms ease;
    }
    .about-page .story-p1.visible {
      opacity: 1;
      transform: translateX(0);
    }

    /* P2 — slide from right */
    .about-page .story-p2 {
      opacity: 0;
      transform: translateX(16px);
      transition: opacity 600ms ease, transform 600ms ease;
    }
    .about-page .story-p2.visible {
      opacity: 1;
      transform: translateX(0);
    }

    /* P3 — scale-in */
    .about-page .story-p3 {
      opacity: 0;
      transform: scale(0.98);
      transition: opacity 550ms ease, transform 550ms ease;
    }
    .about-page .story-p3.visible {
      opacity: 1;
      transform: scale(1);
    }

    /* P3 green border: the wrapper uses position:relative and a ::before
       that scaleY-animates from 0→1 when .border-visible class is added */
    .about-page .story-p3-wrap {
      position: relative;
      padding-left: 20px;
    }
    .about-page .story-p3-wrap::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--green);
      transform: scaleY(0);
      transform-origin: top center;
      transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    .about-page .story-p3-wrap.border-visible::before {
      transform: scaleY(1);
    }

    /* P4 — fade-up */
    .about-page .story-p4 {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 600ms ease, transform 600ms ease;
    }
    .about-page .story-p4.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── Comparison Table Interactions ── */
    .about-page .cmp-row {
      transition: background-color 200ms ease, opacity 200ms ease, transform 400ms ease;
    }
    .about-page .cmp-row:hover {
      background-color: rgba(255, 255, 255, 0.02) !important;
    }
    .about-page .col-global {
      transition: opacity 200ms ease, filter 200ms ease;
    }
    .about-page .col-recova {
      transition: filter 200ms ease, color 200ms ease;
    }
    .about-page .cmp-row:hover .col-global {
      opacity: 0.4;
      filter: grayscale(1);
    }
    .about-page .cmp-row:hover .col-recova {
      filter: brightness(1.2);
    }

    @media (prefers-reduced-motion: reduce) {
      .about-page .story-p1,
      .about-page .story-p2,
      .about-page .story-p3,
      .about-page .story-p4 {
        opacity: 1;
        transform: none;
        transition: none;
      }
      .about-page .story-p3-wrap::before {
        transform: scaleY(1);
        transition: none;
      }
    }

    /* Mobile Accordion for Values */
    .about-page .values-accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease;
      opacity: 0;
    }
    .about-page .values-accordion-content.expanded {
      max-height: 400px;
      opacity: 1;
    }

    /* Final CTA Button Scale */
    .about-page .cta-button-anim {
      animation: about-cta-scale 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes about-cta-scale {
      from { transform: scale(0.95); opacity: 0; }
      to   { transform: scale(1); opacity: 1; }
    }

  `}} />
);

/* ─── INTERSECTION OBSERVER HOOK ─── */
function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08 }
    );

    const targets = document.querySelectorAll(
      ".animate-on-scroll, .json-block"
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
}

/* ─── NAVBAR ─── */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <nav className="sticky top-0 z-50 h-[60px] bg-[#08090c]/85 backdrop-blur-[16px] border-b border-[var(--line)] px-6 md:px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
            <line x1="12" y1="9" x2="12" y2="21"></line>
          </svg>
          <span className="font-heading font-semibold text-[20px] text-[var(--white)] tracking-[-0.5px]">Recova</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[15px] text-[var(--silver)] font-body">
          <a href="/#how-it-works" className="hover:text-[var(--white)] transition-colors">How it works</a>
          <a href="/#integrations" className="hover:text-[var(--white)] transition-colors">Integrations</a>
          <a href="/#pricing" className="hover:text-[var(--white)] transition-colors">Pricing</a>
          <Link href="/about" className="text-[var(--green)] hover:text-[var(--green)]">About</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="text-[15px] text-[var(--silver)] hover:text-[var(--white)] font-body transition-colors">Sign in</Link>
          <span className="text-[var(--steel)]">|</span>
          <Link href="/dashboard" className="text-[15px] font-medium text-[var(--green)] bg-[var(--green-dim)] border border-[var(--green-line)] px-4 py-1.5 rounded-[6px] hover:bg-[rgba(0,232,120,0.15)] transition-colors font-body">
            Get started free
          </Link>
        </div>

        <button className="md:hidden text-[var(--silver)]" onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      </nav>

      <div className={`fixed inset-0 bg-[var(--black)] z-[100] transition-transform duration-200 ${isOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex justify-end p-6">
          <button onClick={() => setIsOpen(false)} className="text-[var(--silver)]"><X size={32} /></button>
        </div>
        <div className="flex flex-col items-center justify-center h-full gap-8 font-heading font-semibold text-[32px] text-[var(--white)] pb-20">
          <a href="/#how-it-works" onClick={() => setIsOpen(false)}>How it works</a>
          <a href="/#integrations" onClick={() => setIsOpen(false)}>Integrations</a>
          <a href="/#pricing" onClick={() => setIsOpen(false)}>Pricing</a>
          <Link href="/about" className="text-[var(--green)]" onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/dashboard" className="mt-4 text-[var(--green)]" onClick={() => setIsOpen(false)}>Sign in</Link>
        </div>
      </div>
    </>
  );
};

/* ─── SECTION 1 — HERO ─── */
const Hero = () => (
  <section className="py-20 md:py-28 px-6 md:px-20 dot-grid border-b border-[var(--line)]">
    <div className="w-full max-w-[1280px] mx-auto flex flex-col md:flex-row items-start gap-12 lg:gap-20">
      {/* Left */}
      <div className="w-full md:w-[58%] animate-on-scroll">
        <div className="font-mono text-[12px] text-[var(--steel)] uppercase tracking-[0.15em] mb-6">
          // about.recova.in
        </div>
        <h1 className="font-heading font-bold text-[38px] md:text-[56px] text-[var(--white)] leading-[1.05] tracking-[-1.5px] mb-6">
          Built because we lost{" "}
          <span
            className="font-mono font-bold text-[var(--green)]"
            style={{ textDecoration: "underline", textDecorationColor: "var(--green)" }}
          >
            ₹3,40,000
          </span>{" "}
          in one month<br />to failed payments.
        </h1>
        <p className="font-body text-[18px] text-[var(--silver)] max-w-[520px] leading-[1.8]">
          We were running a SaaS. Razorpay was retrying once, twice, then giving up.
          Nobody told us. No email. No alert. Just silent churn.
          <br /><br />
          We built Recova so that never happens to another founder.
        </p>
      </div>

      {/* Right — terminal card */}
      <div className="w-full md:w-[42%] animate-on-scroll" style={{ transitionDelay: "500ms" }}>
        <div className="bg-[var(--ink)] border border-[var(--line-hi)] rounded-[12px] p-6 font-mono text-[12px]">
          {/* Desktop full view */}
          <div className="hidden md:block">
            <div className="text-[var(--silver)] mb-4">$ recova audit --gateway razorpay --days 30</div>
            <div className="text-[var(--steel)] mb-1">Connecting to Razorpay API...</div>
            <div className="text-[var(--steel)] mb-4">Scanning 30 days of subscription events...</div>
            <div className="h-px bg-[var(--line)] mb-4" />
            <div className="text-[var(--steel)] uppercase tracking-widest text-[11px] mb-4">AUDIT COMPLETE</div>
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between"><span className="text-[var(--silver)]">Total subscriptions:</span><span className="text-[var(--white)]">847</span></div>
              <div className="flex justify-between"><span className="text-[var(--silver)]">Failed payments:</span><span className="text-[var(--white)]">143 <span className="text-[var(--steel)]">(16.9%)</span></span></div>
              <div className="flex justify-between"><span className="text-[var(--silver)]">Recovered by Razorpay:</span><span className="text-[var(--white)]">54 <span className="text-[var(--steel)]">(37.8%)</span></span></div>
              <div className="flex justify-between"><span className="text-[var(--silver)]">Permanently lost:</span><span className="text-[var(--white)]">89 <span className="text-[var(--steel)]">(62.2%)</span></span></div>
            </div>
            <div className="h-px bg-[var(--line)] mb-4" />
          </div>

          {/* Mobile condensed view */}
          <div className="md:hidden mb-4">
            <div className="text-[var(--steel)] uppercase tracking-widest text-[10px] mb-3">// AUDIT: 30-DAY IMPACT</div>
            <div className="flex justify-between mb-1"><span className="text-[var(--silver)] text-[11px]">Failed payments:</span><span className="text-[var(--white)]">143</span></div>
            <div className="flex justify-between mb-4"><span className="text-[var(--silver)] text-[11px]">Success rate:</span><span className="text-[var(--red)]">37.8%</span></div>
            <div className="h-px bg-[var(--line)]" />
          </div>

          <div className="mb-2 mt-4 md:mt-0">
            <div className="text-[var(--silver)] text-[11px] mb-1">Revenue lost this month:</div>
            <div className="text-[var(--green)] font-bold text-[20px]">₹3,40,000</div>
          </div>
          <div className="mb-4">
            <div className="text-[var(--silver)] text-[11px] mb-1">Recoverable with Recova:</div>
            <div className="text-[var(--green)] font-medium text-[15px]">₹2,65,200 <span className="text-[var(--steel)]">(78%)</span></div>
          </div>
          <div className="h-px bg-[var(--line)] mb-3" />
          <div className="text-[var(--steel)]">Ready. <span className="text-[var(--green)]">recova.in/connect</span></div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── SECTION 2 — THE NUMBER ─── */
const BigNumber = () => (
  <section className="py-[80px] md:py-[100px] px-6 md:px-20 bg-[var(--ink)] border-b border-[var(--line)] text-center">
    <div className="w-full max-w-[960px] mx-auto animate-on-scroll">
      <h2 className="font-heading font-bold text-[72px] md:text-[96px] text-[var(--white)] leading-none tracking-[-3px] mb-4">
        ₹1,300 Cr
      </h2>
      <p className="font-body text-[18px] text-[var(--silver)] mb-8">
        Lost by Indian subscription businesses to failed payments every year.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono text-[14px] mb-6">
        <span><span className="text-[var(--green)]">68%</span> <span className="text-[var(--steel)]">recoverable</span></span>
        <span className="text-[var(--steel)] hidden md:inline">|</span>
        <span><span className="text-[var(--green)]">47%</span> <span className="text-[var(--steel)]">never alerted</span></span>
        <span className="text-[var(--steel)] hidden md:inline">|</span>
        <span><span className="text-[var(--green)]">Zero</span> <span className="text-[var(--steel)]">India-native tools</span></span>
      </div>
      <div className="font-mono text-[11px] text-[var(--steel)] italic">
        // Source estimates: RBI Payment System Report 2024, NPCI UPI AutoPay data, industry research
      </div>
    </div>
  </section>
);

/* ─── SECTION 3 — OUR STORY ─── */
const OurStory = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const p1Ref     = useRef<HTMLParagraphElement>(null);
  const p2Ref     = useRef<HTMLParagraphElement>(null);
  const p3Ref     = useRef<HTMLParagraphElement>(null);
  const p3Wrap    = useRef<HTMLDivElement>(null);
  const p4Ref     = useRef<HTMLParagraphElement>(null);
  const headRef   = useRef<HTMLDivElement>(null);
  const fired     = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fired.current) return;
        fired.current = true;
        observer.disconnect();

        // Headline — immediate
        headRef.current?.classList.add("visible");

        // P1 — left slide, no delay
        p1Ref.current?.classList.add("visible");

        // P2 — right slide, 200ms after P1
        setTimeout(() => p2Ref.current?.classList.add("visible"), 200);

        // P3 — scale-in + border grow, 440ms (200 + a beat)
        setTimeout(() => {
          p3Ref.current?.classList.add("visible");
          p3Wrap.current?.classList.add("border-visible");
        }, 440);

        // P4 — fade-up, 100ms after P3 starts
        setTimeout(() => p4Ref.current?.classList.add("visible"), 540);
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-[100px] md:py-[120px] px-6 md:px-20 bg-[var(--black)] border-b border-[var(--line)]"
    >
      <div className="w-full max-w-[680px]">
        {/* Label + headline — simple fade-up reusing animate-on-scroll via ref */}
        <div ref={headRef} className="animate-on-scroll">
          <div className="font-mono text-[11px] text-[var(--steel)] uppercase tracking-[0.15em] mb-5">
            // founders.log
          </div>
          <h2 className="font-heading font-semibold text-[36px] md:text-[44px] text-[var(--white)] leading-[1.1] mb-8 tracking-[-1px]">
            We are SaaS founders<br />who got tired of<br />losing our own money.
          </h2>
        </div>

        <div className="font-body text-[17px] text-[var(--silver)] leading-[1.8] space-y-6">
          {/* P1 — slide from left */}
          <p ref={p1Ref} className="story-p1">
            In 2024, we were running a B2B SaaS product on Razorpay. Every month,
            a small chunk of our customers would silently disappear — not because
            they wanted to leave, but because their UPI balance was low on the 18th,
            or their card expired and nobody told them.
            <br /><br />
            Razorpay tried once. Maybe twice. Then it gave up.
          </p>

          {/* P2 — slide from right */}
          <p ref={p2Ref} className="story-p2">
            We looked for a tool to handle this automatically. Churnkey works for
            Stripe. Churn Buster works for Stripe. Every dunning tool we found
            was built for American credit cards and Stripe subscriptions.
            <br /><br />
            Nobody had built this for Razorpay. Nobody had built this for UPI AutoPay.
            Nobody respected the fact that Indian salaries arrive on the 1st and the 25th,
            not on random American Mondays.
          </p>

          {/* P3 — scale-in + animated green border */}
          <div ref={p3Wrap} className="story-p3-wrap">
            <p ref={p3Ref} className="story-p3 text-[var(--white)]">
              So we built Recova. India{"'"}s first payment recovery platform that actually
              understands how Indian payments work — the payday cycles, the UPI mandate
              rules, the WhatsApp-first communication preference, the four gateways
              that power Indian commerce.
            </p>
          </div>

          {/* P4 — fade-up */}
          <p ref={p4Ref} className="story-p4">
            We are based in Gurugram. We process recovery campaigns for SaaS companies,
            D2C subscription brands, EdTech platforms, and OTT services across India.
            Every feature in Recova exists because we or one of our merchants needed it.
          </p>
        </div>
      </div>
    </section>
  );
};

/* ─── SECTION 4 — DIFFERENTIATION ─── */
const COMPARISON_DATA: Record<string, { label: string; global: string; recova: string }[]> = {
  churnkey: [
    { label: "Gateways", global: "Stripe only", recova: "Razorpay · Stripe · Cashfree · PayU" },
    { label: "Retry Timing", global: "Retry on Monday 9am PST", recova: "Retry on payday: 1st and 25th of month" },
    { label: "Channels", global: "Email + SMS", recova: "Email + WhatsApp + SMS" },
    { label: "Decline Handling", global: "4 decline types handled", recova: "14 decline codes classified + handled" },
    { label: "UPI Support", global: "No UPI support", recova: "NPCI-compliant UPI AutoPay retry logic" },
    { label: "Pricing", global: "USD pricing", recova: "₹ pricing, India billing" },
    { label: "Support", global: "American support timezone", recova: "Indian timezone (IST) support" },
    { label: "Focus", global: "Built for Stripe billing", recova: "Built for Razorpay subscriptions" },
  ],
  stripe: [
    { label: "Gateways", global: "Stripe only", recova: "Razorpay · Stripe · Cashfree · PayU" },
    { label: "Retry Timing", global: "Fixed intervals (Global)", recova: "Payday-aware (India-specific)" },
    { label: "Channels", global: "Email only", recova: "Email + WhatsApp + SMS" },
    { label: "Decline Handling", global: "Standard Stripe codes", recova: "Unified India-gateway normalization" },
    { label: "UPI Support", global: "Limited UPI logic", recova: "Deep NPCI mandate integration" },
    { label: "Pricing", global: "Standard Stripe fees", recova: "SaaS-friendly flat monthly ₹" },
    { label: "Support", global: "Global support", recova: "Direct WhatsApp support (Indian)" },
    { label: "Implementation", global: "Self-serve docs", recova: "White-glove India onboarding" },
  ],
};

const Differentiation = () => {
  const [competitor, setCompetitor] = useState("churnkey");
  const [showFull, setShowFull] = useState(false);
  const rows = COMPARISON_DATA[competitor];

  return (
    <section className="py-[100px] md:py-[120px] px-6 md:px-20 bg-[var(--ink)] border-b border-[var(--line)]">
      <div className="w-full max-w-[1280px] mx-auto">
        <div className="font-mono text-[11px] text-[var(--steel)] uppercase tracking-[0.15em] mb-5 animate-on-scroll">
          // differentiation.log
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <h2 className="font-heading font-semibold text-[36px] md:text-[44px] text-[var(--white)] leading-[1.1] tracking-[-1px] animate-on-scroll">
            What every other tool<br />does. What we do instead.
          </h2>

          {/* Competitor Toggle */}
          <div className="flex bg-[var(--black)] p-1 rounded-[8px] border border-[var(--line)] animate-on-scroll" style={{ transitionDelay: "150ms" }}>
            <button
              onClick={() => { setCompetitor("churnkey"); setShowFull(false); }}
              className={`px-4 py-1.5 rounded-[6px] font-body text-[13px] transition-all ${
                competitor === "churnkey"
                  ? "bg-[var(--line)] text-[var(--white)]"
                  : "text-[var(--steel)] hover:text-[var(--silver)]"
              }`}
            >
              Show Churnkey
            </button>
            <button
              onClick={() => { setCompetitor("stripe"); setShowFull(false); }}
              className={`px-4 py-1.5 rounded-[6px] font-body text-[13px] transition-all ${
                competitor === "stripe"
                  ? "bg-[var(--line)] text-[var(--white)]"
                  : "text-[var(--steel)] hover:text-[var(--silver)]"
              }`}
            >
              Show Stripe Billing
            </button>
          </div>
        </div>

        {/* Desktop View / Expanded Mobile View */}
        <div className={`${!showFull ? "hidden md:block" : "block"} border border-[var(--line)] rounded-[10px] overflow-hidden bg-[var(--ink)] animate-on-scroll`}>
          {/* Header row */}
          <div className="flex border-b border-[var(--line)] bg-[var(--black)]/50">
            <div className="w-[50%] px-6 py-4 font-mono text-[12px] text-[var(--red)] uppercase tracking-[0.1em] border-r border-[var(--line)]">
              {competitor === "churnkey" ? "Churnkey (Global)" : "Stripe Billing"}
            </div>
            <div className="w-[50%] px-6 py-4 font-mono text-[12px] text-[var(--green)] uppercase tracking-[0.1em]">
              Recova
            </div>
          </div>

          <div className="divide-y divide-[var(--line)]">
            {rows.map((row, i) => (
              <div
                key={`${competitor}-${i}`}
                className={`cmp-row flex items-stretch transition-all ${i % 2 === 0 ? "bg-[var(--ghost)]/30" : ""}`}
              >
                <div className="col-global w-[50%] px-6 py-4 font-body text-[14px] text-[var(--silver)] border-r border-[var(--line)] flex flex-col justify-center">
                  <div className="text-[10px] font-mono text-[var(--steel)] uppercase mb-1 opacity-50">{row.label}</div>
                  <div className="line-through decoration-[var(--red)]/30">{row.global}</div>
                </div>
                <div className="col-recova w-[50%] px-6 py-4 font-body text-[14px] text-[var(--white)] flex flex-col justify-center">
                  <div className="text-[10px] font-mono text-[var(--green)]/50 uppercase mb-1">{row.label}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--green)] text-[10px] shrink-0">●</span>
                    <span className="font-medium">{row.recova}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Filtered List View (default) */}
        {!showFull && (
          <div className="md:hidden space-y-4 animate-on-scroll">
            <div className="font-mono text-[11px] text-[var(--steel)] uppercase tracking-[0.1em] mb-4">// recova vs competitors</div>
            <div className="space-y-3">
              {rows.map((row, i) => (
                <div key={i} className="bg-[var(--black)]/40 border border-[var(--line)] rounded-[8px] p-5">
                  <div className="font-mono text-[10px] text-[var(--green)] mb-1.5 uppercase tracking-wider opacity-60">{row.label}</div>
                  <div className="font-body text-[15px] text-[var(--white)] font-medium mb-2 leading-snug">
                    {row.recova}
                  </div>
                  <div className="font-body text-[12px] text-[var(--steel)] italic border-t border-[var(--line)]/50 pt-2 mt-2">
                    Global standard: <span className="line-through decoration-[var(--red)]/20">{row.global}</span>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowFull(true)}
              className="w-full py-4 mt-6 border border-[var(--line-hi)] rounded-[10px] font-body text-[14px] text-[var(--silver)] hover:text-[var(--white)] hover:bg-[var(--ghost)]/20 transition-all bg-[var(--ink)]"
            >
              See full comparison side-by-side ↓
            </button>
          </div>
        )}

        <div className="mt-8 flex justify-center animate-on-scroll" style={{ transitionDelay: "300ms" }}>
          <div className="bg-[var(--green-dim)] border border-[var(--green-line)] px-4 py-2 rounded-full flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--green)] animate-[pulse_2s_infinite]" />
            <span className="font-mono text-[12px] text-[var(--green)]">
              Recova has {rows.length} advantages over {competitor === "churnkey" ? "Churnkey" : "Stripe Billing"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};


/* ─── SECTION 5 — TEAM ─── */
const teamMembers = [
  {
    initials: "RM",
    avatarBg: "#3395ff",
    name: "Rahul Mehta",
    role: "Co-founder & CEO",
    bio: "Previously built and scaled a B2B SaaS to ₹40L ARR. Spent 3 years watching Razorpay's retry logic lose us money.",
    stat: "// 7 years in Indian SaaS",
    delay: 0,
  },
  {
    initials: "PS",
    avatarBg: "#6366f1",
    name: "Priya Sharma",
    role: "Co-founder & CTO",
    bio: "Ex-Razorpay engineer. Knows the webhook infrastructure from the inside. Designed Recova's normaliser architecture.",
    stat: "// Built payment infra for 3 startups",
    delay: 100,
  },
  {
    initials: "AK",
    avatarBg: "#00c274",
    name: "Arjun Kapoor",
    role: "Head of Growth",
    bio: "Former founder of a D2C subscription box. Lost ₹12L to failed payments before finding Recova. Joined to stop it from happening to others.",
    stat: "// 200+ SaaS founders interviewed",
    delay: 200,
  },
];

const Team = () => (
  <section className="py-[100px] md:py-[120px] px-6 md:px-20 bg-[var(--black)] border-b border-[var(--line)]">
    <div className="w-full max-w-[1280px] mx-auto">
      <div className="font-mono text-[11px] text-[var(--steel)] uppercase tracking-[0.15em] mb-5 animate-on-scroll">
        // team.config
      </div>
      <h2 className="font-heading font-semibold text-[36px] md:text-[44px] text-[var(--white)] leading-[1.1] mb-3 tracking-[-1px] animate-on-scroll">
        Small team.<br />Outsized focus.
      </h2>
      <p className="font-body text-[16px] text-[var(--silver)] mb-12 max-w-[560px] animate-on-scroll leading-[1.7]" style={{ transitionDelay: "100ms" }}>
        We are a small team of engineers and founders. Every person here
        has built and run a subscription business. We are our own customer.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {teamMembers.map((m) => (
          <div
            key={m.initials}
            className="animate-on-scroll bg-[var(--ink)] border border-[var(--line)] rounded-[10px] p-6 flex flex-col"
            style={{ transitionDelay: `${m.delay}ms` }}
          >
            <div
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center font-body font-bold text-[18px] text-white mb-4 shrink-0"
              style={{ background: m.avatarBg }}
            >
              {m.initials}
            </div>
            <div className="font-body font-medium text-[16px] text-[var(--white)]">{m.name}</div>
            <div className="font-mono text-[12px] text-[var(--steel)] mt-[2px]">{m.role}</div>
            <p className="font-body text-[13px] text-[var(--silver)] mt-[10px] leading-[1.6] flex-1">{m.bio}</p>
            <div className="font-mono text-[11px] text-[var(--green)] mt-4">{m.stat}</div>
          </div>
        ))}
      </div>

      {/* Hiring bar */}
      <div className="bg-[var(--ghost)] border border-[var(--line)] rounded-[8px] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-on-scroll">
        <span className="font-body font-medium text-[14px] text-[var(--white)]">
          We{"'"}re hiring engineers who have built with Razorpay.
        </span>
        <a href="#" className="font-body text-[14px] text-[var(--green)] hover:underline whitespace-nowrap">
          See open roles →
        </a>
      </div>
    </div>
  </section>
);

/* ─── SECTION 6 — TRACTION STATS ─── */
const stats = [
  { value: "₹12.4 Cr", label: "recovered to date", green: true },
  { value: "78%", label: "avg recovery rate", green: true },
  { value: "4", label: "gateways supported", green: false },
  { value: "143", label: "merchants in recovery", green: false },
];

const TractionStats = () => (
  <section className="py-[80px] md:py-[100px] px-6 md:px-20 bg-[var(--ink)] border-b border-[var(--line)]">
    <div className="w-full max-w-[1280px] mx-auto animate-on-scroll">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[var(--line)] border border-[var(--line)] rounded-[10px] overflow-hidden">
        {stats.map((s) => (
          <div key={s.label} className="px-6 py-8 text-center">
            <div className={`font-mono font-bold text-[40px] md:text-[48px] leading-none mb-2 ${s.green ? "text-[var(--green)]" : "text-[var(--white)]"}`}>
              {s.value}
            </div>
            <div className="font-body text-[13px] text-[var(--steel)]">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 font-mono text-[11px] text-[var(--steel)] italic text-center">
        // Updated March 2025 · Recova internal data
      </div>
    </div>
  </section>
);

/* ─── SECTION 6.5 — PRESS ─── */
const pressMentions = [
  {
    pub: "Inc42",
    date: "Feb 2025",
    quote: "The India-first dunning tool that Razorpay doesn't want you to need",
    link: "#",
  },
  {
    pub: "YourStory",
    date: "Jan 2025",
    quote: "How two founders built a ₹1Cr ARR SaaS by solving Indian payment failures",
    link: "#",
  },
  {
    pub: "The Ken",
    date: "Dec 2024",
    quote: "Inside the payment recovery gap that India's gateways ignore",
    link: "#",
  },
];

const Press = () => (
  <section className="py-[100px] md:py-[120px] px-6 md:px-20 bg-[var(--black)] border-b border-[var(--line)]">
    <div className="w-full max-w-[1280px] mx-auto">
      <div className="font-mono text-[11px] text-[var(--steel)] uppercase tracking-[0.15em] mb-5 animate-on-scroll">
        // press.mentions
      </div>
      <h2 className="font-heading font-semibold text-[36px] md:text-[44px] text-[var(--white)] leading-[1.1] mb-12 tracking-[-1px] animate-on-scroll">
        Recova in the news.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {pressMentions.map((p, i) => (
          <div
            key={p.pub}
            className="animate-on-scroll bg-[var(--ink)] border border-[var(--line)] rounded-[12px] p-6 flex flex-col group hover:border-[var(--line-hi)] transition-colors"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            {/* Logo Placeholder */}
            <div className="bg-[var(--line)] rounded-[4px] px-3 py-1.5 inline-block w-fit mb-6 font-mono text-[12px] text-[var(--silver)]">
              {p.pub}
            </div>
            
            <blockquote className="font-body text-[14px] italic text-[var(--silver)] leading-[1.6] mb-6 flex-1">
              "{p.quote}"
            </blockquote>

            <div className="mt-auto">
              <div className="font-mono text-[11px] text-[var(--steel)] uppercase tracking-wider mb-3">
                {p.pub} • {p.date}
              </div>
              <a href={p.link} className="font-body text-[13px] text-[var(--green)] hover:underline flex items-center gap-1 group/link">
                Read full article <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center animate-on-scroll" style={{ transitionDelay: "300ms" }}>
        <p className="font-body text-[14px] text-[var(--steel)]">
          Press enquiries: <a href="mailto:press@recova.in" className="text-[var(--silver)] hover:text-[var(--white)] hover:underline">press@recova.in</a>
        </p>
      </div>
    </div>
  </section>
);

/* ─── SECTION 7 — VALUES (JSON format) ─── */
const values = [
  {
    key: "india_first",
    belief: "Indian payments are not a subset of global payments.",
    practice: "Every feature is designed for UPI, Razorpay, and Indian payday cycles before it is designed for anything else.",
  },
  {
    key: "merchants_not_metrics",
    belief: "We measure success in rupees recovered, not DAUs.",
    practice: "Our dashboard shows ₹ recovered on the first screen. Everything else is secondary.",
  },
  {
    key: "boring_reliability",
    belief: "Payment recovery must be boring. It must just work.",
    practice: "We do not ship features that impress at demos. We ship features that work at 3 AM when a UPI mandate fails.",
  },
  {
    key: "transparent_attribution",
    belief: "We only take credit for what we actually recovered.",
    practice: "Our analytics tracks exactly which recovery was triggered by Recova vs what would have recovered anyway.",
  },
];

const Values = () => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  return (
    <section className="py-[100px] md:py-[120px] px-6 md:px-20 bg-[var(--black)] border-b border-[var(--line)]">
      <div className="w-full max-w-[1280px] mx-auto">
        <div className="font-mono text-[11px] text-[var(--steel)] uppercase tracking-[0.15em] mb-5 animate-on-scroll">
          // values.json
        </div>
        <h2 className="font-heading font-semibold text-[36px] md:text-[44px] text-[var(--white)] leading-[1.1] mb-10 tracking-[-1px] animate-on-scroll">
          What we believe.
        </h2>

        {/* Desktop View */}
        <div className="hidden md:block bg-[var(--ink)] border border-[var(--line-hi)] rounded-[12px] p-8 max-w-[720px] font-mono text-[14px]">
          <div className="text-[var(--steel)] mb-3">{"{"}</div>
          {values.map((v, i) => (
            <div
              key={v.key}
              className="json-block ml-4 mb-6 last:mb-0"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="text-[var(--amber)] mb-1">"{v.key}": {"{"}</div>
              <div className="ml-4 mb-1">
                <span className="text-[var(--blue)]">"belief"</span>
                <span className="text-[var(--steel)]">: </span>
                <span className="text-[var(--silver)]">"{v.belief}"</span>
                <span className="text-[var(--steel)]">,</span>
              </div>
              <div className="ml-4">
                <span className="text-[var(--blue)]">"practice"</span>
                <span className="text-[var(--steel)]">: </span>
                <span className="text-[var(--silver)]">"{v.practice}"</span>
              </div>
              <div className="text-[var(--steel)] mt-1">{"}"}{i < values.length - 1 ? "," : ""}</div>
            </div>
          ))}
          <div className="text-[var(--steel)]">{"}"}</div>
        </div>

        {/* Mobile Accordion View */}
        <div className="md:hidden space-y-4">
          {values.map((v, i) => (
            <div 
              key={v.key} 
              className="bg-[var(--ink)] border border-[var(--line-hi)] rounded-[12px] p-5 animate-on-scroll"
              style={{ transitionDelay: `${i * 100}ms` }}
              onClick={() => setExpandedKey(expandedKey === v.key ? null : v.key)}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="font-mono text-[10px] text-[var(--amber)] mb-1.5 uppercase tracking-widest">"{v.key}"</div>
                  <div className="font-body text-[16px] text-[var(--white)] font-medium leading-snug">
                    {v.belief}
                  </div>
                </div>
                <div className={`mt-1 text-[var(--steel)] transition-transform duration-300 ${expandedKey === v.key ? "rotate-180" : ""}`}>
                  <ChevronDown size={20} />
                </div>
              </div>
              
              <div className={`values-accordion-content ${expandedKey === v.key ? "expanded" : ""}`}>
                <div className="font-body text-[14px] text-[var(--silver)] leading-[1.6] border-t border-[var(--line)] pt-4 mt-1">
                  <span className="text-[var(--blue)] font-mono text-[11px] block mb-2 uppercase tracking-tight">"practice":</span>
                  {v.practice}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── SECTION 8 — BUILT IN INDIA ─── */
const compliancePills = [
  "GST Registered",
  "DLT Registered (TRAI)",
  "DPDP Act compliant",
  "NPCI UPI mandate rules",
  "PCI DSS aware",
  "SOC2 in progress",
];

const BuiltInIndia = () => (
  <section className="py-[100px] md:py-[120px] px-6 md:px-20 bg-[var(--ink)] border-b border-[var(--line)]">
    <div className="w-full max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* HQ Card */}
        <div className="animate-on-scroll bg-[var(--ink)] border border-[var(--line)] rounded-[10px] p-6">
          <div className="font-mono text-[11px] text-[var(--steel)] uppercase tracking-[0.15em] mb-4">Headquarters</div>
          <div className="font-body text-[14px] text-[var(--silver)] leading-[1.8]">
            <div className="text-[var(--white)] font-medium mb-1">Recova Technologies Pvt. Ltd.</div>
            <div>Gurugram, Haryana, India 🇮🇳 — 122001</div>
            <div className="font-mono text-[13px] text-[var(--steel)] mt-2">GST: 07XXXXX1234X1ZX</div>
            <div className="font-mono text-[13px] text-[var(--steel)]">CIN: U72900HR2024PTC000001</div>
          </div>
        </div>

        {/* Compliance Card */}
        <div className="animate-on-scroll bg-[var(--ink)] border border-[var(--line)] rounded-[10px] p-6" style={{ transitionDelay: "100ms" }}>
          <div className="font-mono text-[11px] text-[var(--steel)] uppercase tracking-[0.15em] mb-4">Regulatory compliance</div>
          <div className="flex flex-wrap gap-2">
            {compliancePills.map((pill) => (
              <span
                key={pill}
                className="font-mono text-[11px] text-[var(--silver)] bg-[var(--ghost)] border border-[var(--line-hi)] rounded-[4px] px-[10px] py-[3px]"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── SECTION 9 — FINAL CTA (typewriter) ─── */
const FinalCTA = () => {
  const [phase, setPhase] = useState(0);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [line3, setLine3] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const L1 = "Scanning for failed payments...";
  const L2 = "Found: your money is waiting to be recovered.";
  const L3 = "Start your free 14-day trial. No credit card.";

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          if (window.innerWidth < 768) {
            setLine1(L1);
            setLine2(L2);
            setLine3(L3);
            setPhase(4);
            setShowButton(true);
          } else {
            setPhase(1);
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isMobile || phase === 0 || phase === 4) return;
    
    if (phase === 1) {
      let i = 0;
      const t = setInterval(() => {
        i++;
        setLine1(L1.slice(0, i));
        if (i >= L1.length) { clearInterval(t); setTimeout(() => setPhase(2), 300); }
      }, 28);
      return () => clearInterval(t);
    }
    if (phase === 2) {
      let i = 0;
      const t = setInterval(() => {
        i++;
        setLine2(L2.slice(0, i));
        if (i >= L2.length) { clearInterval(t); setTimeout(() => setPhase(3), 300); }
      }, 24);
      return () => clearInterval(t);
    }
    if (phase === 3) {
      let i = 0;
      const t = setInterval(() => {
        i++;
        setLine3(L3.slice(0, i));
        if (i >= L3.length) { clearInterval(t); setTimeout(() => setShowButton(true), 400); }
      }, 24);
      return () => clearInterval(t);
    }
  }, [phase, isMobile]);

  return (
    <section className="py-[100px] md:py-[120px] px-6 md:px-20 bg-[var(--black)] text-center">
      <div ref={sectionRef} className="w-full max-w-[720px] mx-auto">
        {/* Terminal prompt */}
        <div className="font-mono font-medium text-[20px] md:text-[24px] text-[var(--green)] mb-6 flex items-center justify-center gap-2">
          <span>&gt;_ recova connect --your-razorpay-account</span>
          <span className="animate-blink">|</span>
        </div>

        {/* Typewriter lines */}
        <div className="font-mono text-[14px] md:text-[15px] text-[var(--silver)] space-y-2 mb-10 min-h-[80px] text-left max-w-[560px] mx-auto">
          <div className={isMobile ? "animate-[about-fadein_0.5s_ease_forwards]" : ""}>{line1}</div>
          <div className={isMobile ? "animate-[about-fadein_0.5s_ease_0.2s_forwards] opacity-0" : ""}>{line2}</div>
          <div className={isMobile ? "text-[var(--white)] animate-[about-fadein_0.5s_ease_0.4s_forwards] opacity-0" : "text-[var(--white)]"}>{line3}</div>
        </div>

        {/* CTA Button */}
        <div
          className={`${showButton ? (isMobile ? "cta-button-anim" : "opacity-100 translate-y-0") : "opacity-0 translate-y-3"} transition-all duration-700`}
        >
          <Link
            href="/dashboard"
            className="inline-block bg-[var(--green)] text-[#08090c] font-body font-bold text-[15px] px-8 py-4 rounded-[6px] hover:bg-[#00ff88] transition-colors mb-6 shadow-[0_0_20px_rgba(0,232,120,0.2)]"
          >
            Connect Razorpay and recover →
          </Link>
          <div className="flex items-center justify-center gap-6">
            <a href="#" className="font-body text-[13px] text-[var(--steel)] hover:text-[var(--silver)] transition-colors">
              Privacy policy
            </a>
            <a href="#" className="font-body text-[13px] text-[var(--steel)] hover:text-[var(--silver)] transition-colors">
              Changelog
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── FOOTER ─── */
const Footer = () => (
  <footer className="bg-[var(--black)] border-t border-[var(--line)] py-[60px] md:py-[80px] px-6 md:px-20">
    <div className="w-full max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 border-b md:border-b-0 border-[var(--line)] pb-8 md:pb-0">
          <div className="font-heading font-semibold text-[20px] text-[var(--white)] tracking-[-0.5px] mb-3">Recova</div>
          <p className="font-body text-[15px] text-[var(--steel)] leading-[1.6] mb-6">
            India{"'"}s first intelligent<br />payment recovery platform.
          </p>
          <div className="font-body text-[15px] text-[var(--steel)] leading-[1.5]">
            Made in India 🇮🇳 · Gurugram, Haryana<br />
            GST: 07XXXXX1234X1ZX
          </div>
        </div>

        <div>
          <div className="font-body text-[15px] text-[var(--white)] font-medium mb-4">Product</div>
          <ul className="space-y-3 font-body text-[15px] text-[var(--steel)]">
            {["Features", "Integrations", "Pricing", "Changelog", "API docs"].map((l) => (
              <li key={l}><a href="#" className="hover:text-[var(--silver)] transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-body text-[15px] text-[var(--white)] font-medium mb-4">Company</div>
          <ul className="space-y-3 font-body text-[15px] text-[var(--steel)]">
            {["About", "Blog", "Careers", "Privacy Policy", "Terms of Service", "Security"].map((l) => (
              <li key={l}><a href={l === "About" ? "/about" : "#"} className="hover:text-[var(--silver)] transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-body text-[15px] text-[var(--white)] font-medium mb-4">Integrations</div>
          <ul className="space-y-3 font-body text-[15px] text-[var(--steel)]">
            {["Razorpay recovery", "Stripe recovery", "Cashfree recovery", "PayU recovery", "WhatsApp Business"].map((l) => (
              <li key={l}>
                <a href="#" className="hover:text-[var(--silver)] transition-colors flex items-center gap-1 group">
                  {l} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-[var(--line)] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-body text-[15px] text-[var(--steel)]">
          © 2025 Recova Technologies Pvt. Ltd. | Made in India 🇮🇳
        </div>
        <div className="flex gap-4">
          <a href="#" className="text-[var(--steel)] hover:text-[var(--silver)] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="#" className="text-[var(--steel)] hover:text-[var(--silver)] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

/* ─── PAGE EXPORT ─── */
export default function AboutPage() {
  useScrollAnimations();

  return (
    <div className="about-page">
      <GlobalStyles />
      <Navbar />
      <Hero />
      <BigNumber />
      <OurStory />
      <Differentiation />
      <Team />
      <TractionStats />
      <Press />
      <Values />
      <BuiltInIndia />
      <FinalCTA />
      <Footer />
    </div>
  );
}

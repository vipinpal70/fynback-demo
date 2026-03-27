"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp, AlertCircle, Zap, Percent, Activity, CalendarDays, Download, ArrowUpRight, ArrowDownRight, X, Mail, MessageSquare, RefreshCw, Pause, Play, Unplug, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";

// ─── Data ────────────────────────────────────────────────────────
const recoveryData = [
  { date: "Mar 1", failed: 1850, recovered: 1280 },
  { date: "Mar 3", failed: 2200, recovered: 1716 },
  { date: "Mar 5", failed: 950, recovered: 789 },
  { date: "Mar 7", failed: 3100, recovered: 2542 },
  { date: "Mar 9", failed: 1750, recovered: 1400 },
  { date: "Mar 11", failed: 2600, recovered: 1980 },
  { date: "Mar 13", failed: 1450, recovered: 1160 },
  { date: "Mar 15", failed: 3800, recovered: 3040 },
  { date: "Mar 17", failed: 2100, recovered: 1680 },
  { date: "Mar 19", failed: 2900, recovered: 2262 },
  { date: "Mar 21", failed: 1550, recovered: 1240 },
  { date: "Mar 23", failed: 3250, recovered: 2600 },
  { date: "Mar 25", failed: 1980, recovered: 1604 },
  { date: "Mar 27", failed: 4150, recovered: 3320 },
  { date: "Mar 29", failed: 2700, recovered: 2133 },
];

const channelData = [
  { name: "WhatsApp", value: 42, amount: "₹1,00,800", trend: "+8%", color: "hsl(var(--accent-green))" },
  { name: "Email", value: 31, amount: "₹74,400", trend: "flat", color: "hsl(var(--accent-blue))" },
  { name: "Retry only", value: 19, amount: "₹45,600", trend: "-3%", color: "#8b5cf6" },
  { name: "Self-service", value: 8, amount: "₹19,200", trend: "+2%", color: "hsl(var(--accent-amber))" },
];

const gateways = [
  { name: "Razorpay", color: "hsl(var(--razorpay))", status: "Connected", recovered: "₹1,42,000", webhook: "2m ago" },
  { name: "Stripe", color: "hsl(var(--stripe))", status: "Connected", recovered: "₹68,400", webhook: "8m ago" },
  { name: "Cashfree", color: "hsl(var(--cashfree))", status: "Connected", recovered: "₹29,600", webhook: "15m ago" },
  { name: "PayU", color: "hsl(var(--payu))", status: "Token expiring", recovered: "₹0", webhook: "Reconnect" },
];

const failedPayments = [
  { email: "alex.kumar@fintech.io", amount: "₹24,500", gateway: "Razorpay", reason: "Insufficient funds", status: "Retrying in 2h", statusType: "retrying" as const, action: "Retry now", time: "2m ago" },
  { email: "sara@designstudio.in", amount: "₹8,999", gateway: "Stripe", reason: "Bank downtime", status: "Email sent (OTP)", statusType: "email" as const, action: "View", time: "8m ago" },
  { email: "rohit@quickcommerce.in", amount: "₹1,200", gateway: "Cashfree", reason: "UPI timeout", status: "WA reminder sent", statusType: "wa" as const, action: "View", time: "14m ago" },
  { email: "lisa@globaltrade.co", amount: "₹45,000", gateway: "PayU", reason: "Expired card", status: "Scheduled for 10PM", statusType: "scheduled" as const, action: "View", time: "28m ago" },
  { email: "karan@web3.dev", amount: "₹12,499", gateway: "Razorpay", reason: "Authentication required", status: "Recovered ✓", statusType: "recovered" as const, action: "View", time: "1h ago" },
  { email: "ananya@organic.in", amount: "₹3,250", gateway: "Stripe", reason: "Incorrect CVC", status: "Hard decline ✗", statusType: "hard_decline" as const, action: "View", time: "2h ago" },
  // { email: "vikas@logistics.co", amount: "₹18,700", gateway: "Razorpay", reason: "Insufficient funds", status: "Retrying in 4h", statusType: "retrying" as const, action: "Retry now", time: "3h ago" },
  // { email: "neha@edtech.in", amount: "₹5,499", gateway: "Cashfree", reason: "Do not honor", status: "Link sent", statusType: "email" as const, action: "View", time: "5h ago" },
];

type ActivityType = "recovered" | "email" | "whatsapp" | "scheduled" | "hard_decline" | "new_failure";

interface ActivityItem {
  id: number;
  text: string;
  createdAt: number;
  type: ActivityType;
  isNew?: boolean;
}

const activityTypeConfig: Record<ActivityType, { icon: typeof ArrowUpRight; iconClass: string; dotClass: string }> = {
  recovered: { icon: ArrowUpRight, iconClass: "text-rx-green", dotClass: "bg-rx-green" },
  email: { icon: Mail, iconClass: "text-rx-blue", dotClass: "bg-rx-blue" },
  whatsapp: { icon: MessageSquare, iconClass: "text-rx-green", dotClass: "bg-rx-green" },
  scheduled: { icon: RefreshCw, iconClass: "text-rx-amber", dotClass: "bg-rx-amber" },
  hard_decline: { icon: X, iconClass: "text-rx-red", dotClass: "bg-rx-red" },
  new_failure: { icon: AlertCircle, iconClass: "text-rx-red", dotClass: "bg-rx-red" },
};

const initialActivityItems: Omit<ActivityItem, "id" | "createdAt">[] = [
  { text: "₹4,299 recovered — Razorpay retry #2 succeeded", type: "recovered" },
  { text: "Email #2 sent to priya@startup.in", type: "email" },
  { text: "WhatsApp reminder sent to raj@example.com", type: "whatsapp" },
  { text: "₹8,500 recovered — Customer updated card via portal", type: "recovered" },
  { text: "New failed payment: amit@venture.com ₹19,999", type: "new_failure" },
  { text: "Hard decline detected — skipping retries", type: "hard_decline" },
  { text: 'Campaign "7-day aggressive" triggered for nisha@...', type: "scheduled" },
  { text: "₹6,499 scheduled for retry on Mar 26", type: "scheduled" },
];

const incomingActivities: Omit<ActivityItem, "id" | "createdAt">[] = [
  { text: "₹7,200 recovered — Stripe retry #3 succeeded", type: "recovered" },
  { text: "WhatsApp payment link sent to dev@saas.io", type: "whatsapp" },
  { text: "Email #1 sent to finance@corp.in", type: "email" },
  { text: "₹3,499 recovered — UPI mandate renewed", type: "recovered" },
  { text: "New failed payment: ops@startup.co ₹15,000", type: "new_failure" },
  { text: "Retry scheduled for kiran@app.dev on Mar 28", type: "scheduled" },
  { text: "₹11,200 recovered — Card updated via portal", type: "recovered" },
  { text: "Hard decline: bank rejected — no retries", type: "hard_decline" },
  { text: "WhatsApp reminder sent to cfo@enterprise.in", type: "whatsapp" },
  { text: "Email #3 sent to billing@store.com", type: "email" },
  { text: "₹9,800 recovered — Customer used self-service portal", type: "recovered" },
  { text: "New failed payment: marketing@growth.io ₹6,700", type: "new_failure" },
];

const formatRelativeTime = (timestamp: number) => {
  const diffS = Math.floor((Date.now() - timestamp) / 1000);
  if (diffS < 60) return "just now";
  const diffM = Math.floor(diffS / 60);
  if (diffM < 60) return `${diffM}m ago`;
  const diffH = Math.floor(diffM / 60);
  return `${diffH}h ago`;
};

const performanceData = [
  { type: "Insufficient funds", fynback: 82, baseline: 41 },
  { type: "Card expired", fynback: 71, baseline: 8 },
  { type: "UPI mandate failed", fynback: 68, baseline: 35 },
  { type: "Do not honor", fynback: 54, baseline: 28 },
  { type: "Network error", fynback: 91, baseline: 75 },
  { type: "Bank decline", fynback: 49, baseline: 22 },
];

// ─── Helpers ─────────────────────────────────────────────────────
const formatRupee = (v: number) => `₹${v.toLocaleString("en-IN")}`;

const statusStyles: Record<string, string> = {
  retrying: "bg-rx-amber-dim text-rx-amber",
  email: "bg-rx-blue-dim text-rx-blue",
  wa: "bg-rx-green-dim text-rx-green",
  recovered: "bg-rx-green text-background",
  hard_decline: "bg-rx-red-dim text-rx-red",
  scheduled: "bg-rx-overlay text-rx-text-secondary",
};

const gatewayPillStyles: Record<string, string> = {
  Razorpay: "bg-rx-blue-dim text-rx-blue",
  Stripe: "bg-[hsl(239_84%_67%/0.15)] text-rx-stripe",
  Cashfree: "bg-rx-green-dim text-rx-green",
  PayU: "bg-rx-amber-dim text-rx-amber",
};

// ─── Custom chart tooltip ────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-rx-elevated border border-border rounded-lg px-3.5 py-2.5 shadow-2xl">
      <p className="text-xs font-body text-rx-text-muted mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-sm font-mono">
          <span className={p.dataKey === "recovered" ? "text-rx-green-text" : "text-rx-red"}>
            {formatRupee(p.value)}
          </span>
          <span className="text-rx-text-muted ml-2 text-xs font-body">{p.dataKey === "recovered" ? "Recovered" : "Failed"}</span>
        </p>
      ))}
    </div>
  );
};

const BarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-rx-elevated border border-border rounded-lg px-3.5 py-2.5 shadow-2xl">
      <p className="text-xs font-body text-rx-text-muted mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-sm font-mono">
          <span className={p.dataKey === "fynback" ? "text-rx-green-text" : "text-rx-text-muted"}>
            {p.value}%
          </span>
          <span className="text-rx-text-muted ml-2 text-xs font-body">{p.dataKey === "fynback" ? "FynBack" : "Baseline"}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Component ───────────────────────────────────────────────────
export default function DashboardPage() {
  // ─── Live Activity Feed State ──────────────────────────────────
  const now = useRef(Date.now());
  const nextId = useRef(9);
  const incomingIdx = useRef(0);

  const [activities, setActivities] = useState<ActivityItem[]>(() =>
    initialActivityItems.map((item, i) => ({
      ...item,
      id: i + 1,
      createdAt: now.current - [120, 300, 480, 720, 1080, 1080, 1440, 1860][i] * 1000,
    }))
  );
  const [isPaused, setIsPaused] = useState(false);
  const [, setTick] = useState(0);

  // ─── UX States ─────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [isGatewayConnected, setIsGatewayConnected] = useState(true);
  const [hasFailedPayments, setHasFailedPayments] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-prepend new activity every 8s
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const incoming = incomingActivities[incomingIdx.current % incomingActivities.length];
      incomingIdx.current++;
      const newItem: ActivityItem = {
        ...incoming,
        id: nextId.current++,
        createdAt: Date.now(),
        isNew: true,
      };
      setActivities((prev) => {
        const updated = [newItem, ...prev.slice(0, 7)];
        // Clear isNew flag after animation
        setTimeout(() => {
          setActivities((curr) => curr.map((a) => (a.id === newItem.id ? { ...a, isNew: false } : a)));
        }, 350);
        return updated;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Update relative timestamps every 30s
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Pull to refresh hint (Mobile only) */}
      <div className="md:hidden flex items-center justify-center -mt-2 pb-2 text-[10px] text-rx-text-muted font-body animate-pulse">
        <RefreshCw size={12} className="mr-1.5" /> Pull down to refresh
      </div>

      {(!isLoading && !isGatewayConnected) ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-rx-surface border border-border rounded-xl mt-6">
          <div className="w-16 h-16 rounded-2xl bg-rx-overlay flex items-center justify-center mb-6">
            <Unplug size={32} className="text-rx-text-muted" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-heading font-bold text-rx-text-primary mb-2">Connect your first gateway to start recovering payments</h2>
          <p className="text-sm font-body text-rx-text-muted mb-8 max-w-md">FynBack needs to connect to your payment processor to detect failed payments and automatically trigger recovery flows.</p>
          <button 
            onClick={() => setIsGatewayConnected(true)} 
            className="px-6 py-2.5 rounded-lg bg-rx-blue text-sm font-heading font-semibold text-white btn-glow hover:opacity-90 transition-opacity flex items-center gap-2 mb-4"
          >
            Connect Razorpay <ArrowUpRight size={16} />
          </button>
          <p className="text-xs font-body text-rx-text-muted">Also supports: Stripe · Cashfree · PayU</p>
        </div>
      ) : (
        <>
          {/* 3A — Header */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-up" style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl font-heading font-bold text-rx-text-primary">Good morning, Rahul</h1>
          <p className="text-sm font-body text-rx-text-muted mt-1">Here's your recovery summary for today · March 21, 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-rx-surface text-sm font-body text-rx-text-secondary hover:border-rx-text-muted/30 transition-colors">
            <CalendarDays size={14} /> Last 30 days
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body text-rx-text-muted hover:text-rx-text-secondary transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </section>

      {/* 3B — KPI Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
        {/* Card 1: Recovered MRR */}
        <div className="kpi-card bg-rx-surface border border-border rounded-xl p-3.5 sm:p-5 relative overflow-hidden">
          <div className="kpi-noise" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-rx-green-dim flex items-center justify-center">
                <TrendingUp size={16} className="text-rx-green sm:w-5 sm:h-5" />
              </div>
              <span className="text-[11px] sm:text-[13px] font-body text-rx-text-muted">Recovered this month</span>
            </div>
            {isLoading ? (
              <>
                <div className="h-8 sm:h-10 w-32 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite] mt-1 mb-2" />
                <div className="h-4 w-24 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite]" />
              </>
            ) : (
              <>
                <p className="text-[24px] sm:text-[32px] font-heading font-bold text-rx-green-text font-mono animate-money-shimmer">₹2,40,000</p>
                <div className="hidden sm:flex items-center gap-1.5 mt-2 text-xs">
                  <span className="flex items-center gap-0.5 text-rx-green font-mono"><ArrowUpRight size={12} /> +₹18,400</span>
                  <span className="text-rx-text-muted font-body">vs last month</span>
                </div>
                <div className="mt-3 h-[3px] rounded-full bg-rx-overlay overflow-hidden">
                  <div className="h-full rounded-full bg-rx-green" style={{ width: `${(240000 / 308000) * 100}%` }} />
                </div>
                <p className="hidden sm:block text-[11px] text-rx-text-muted font-body mt-1.5">
                  <span className="font-mono text-rx-green-text">₹2,40,000</span> of <span className="font-mono">₹3,08,000</span> failed
                </p>
              </>
            )}
          </div>
        </div>

        {/* Card 2: Failed MRR at risk */}
        <div className="kpi-card bg-rx-surface border border-border rounded-xl p-3.5 sm:p-5 relative overflow-hidden">
          <div className="kpi-noise" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-rx-amber-dim flex items-center justify-center">
                <AlertCircle size={16} className="text-rx-amber sm:w-5 sm:h-5" />
              </div>
              <span className="text-[11px] sm:text-[13px] font-body text-rx-text-muted">Currently at risk</span>
            </div>
            {isLoading ? (
              <>
                <div className="h-8 sm:h-10 w-24 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite] mt-1 mb-2" />
                <div className="h-4 w-20 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite]" />
              </>
            ) : (
              <>
                <p className="text-[24px] sm:text-[32px] font-heading font-bold text-rx-amber font-mono">₹52,800</p>
                <div className="hidden sm:flex items-center gap-1.5 mt-2 text-xs">
                  <span className="flex items-center gap-0.5 text-rx-green font-mono"><ArrowDownRight size={12} /> -₹4,200</span>
                  <span className="text-rx-text-muted font-body">vs last month</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Card 3: Active campaigns */}
        <div className="kpi-card bg-rx-surface border border-border rounded-xl p-3.5 sm:p-5 relative overflow-hidden">
          <div className="kpi-noise" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-rx-blue-dim flex items-center justify-center">
                <Zap size={16} className="text-rx-blue sm:w-5 sm:h-5" />
              </div>
              <span className="text-[11px] sm:text-[13px] font-body text-rx-text-muted">Active campaigns</span>
            </div>
            {isLoading ? (
              <>
                <div className="h-8 sm:h-10 w-12 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite] mt-1 mb-2" />
                <div className="h-4 w-28 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite]" />
              </>
            ) : (
              <>
                <p className="text-[24px] sm:text-[32px] font-heading font-bold text-rx-text-primary">3</p>
                <p className="hidden sm:block text-xs text-rx-text-muted font-body mt-2">143 customers in flow</p>
              </>
            )}
          </div>
        </div>

        {/* Card 4: Recovery rate — Arc meter */}
        <div className="kpi-card bg-rx-surface border border-border rounded-xl p-3.5 sm:p-5 relative overflow-hidden">
          <div className="kpi-noise" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-rx-green-dim flex items-center justify-center">
                <Percent size={16} className="text-rx-green sm:w-5 sm:h-5" />
              </div>
              <span className="text-[11px] sm:text-[13px] font-body text-rx-text-muted">Overall recovery rate</span>
            </div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center mt-2">
                <div className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] rounded-full bg-rx-overlay animate-[skeleton-pulse_2s_ease-in-out_infinite]" />
                <div className="h-4 w-24 bg-rx-overlay rounded mt-4 animate-[skeleton-pulse_2s_ease-in-out_infinite]" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center my-1 sm:my-2">
                  <div className="arc-meter relative w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] rounded-full" style={{ "--arc-target": "78%" } as React.CSSProperties}>
                    <div className="absolute inset-[10px] sm:inset-[14px] rounded-full bg-rx-surface z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <span className="text-[18px] sm:text-[28px] font-heading font-bold text-rx-green-text font-mono">78%</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center justify-center gap-1.5 text-xs">
                  <span className="flex items-center gap-0.5 text-rx-green font-mono"><ArrowUpRight size={12} /> +12%</span>
                  <span className="text-rx-text-muted font-body">vs Razorpay baseline</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Card 5: Payments processed */}
        <div className="kpi-card bg-rx-surface border border-border rounded-xl p-3.5 sm:p-5 relative overflow-hidden col-span-2 xl:col-span-1">
          <div className="kpi-noise" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-rx-blue-dim flex items-center justify-center">
                <Activity size={16} className="text-rx-blue sm:w-5 sm:h-5" />
              </div>
            <span className="text-[11px] sm:text-[13px] font-body text-rx-text-muted">Payments processed</span>
            </div>
            {isLoading ? (
              <>
                <div className="h-8 sm:h-10 w-24 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite] mt-1 mb-2" />
                <div className="h-4 w-20 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite]" />
              </>
            ) : (
              <>
                <p className="text-[24px] sm:text-[32px] font-heading font-bold text-rx-text-primary font-mono">1,847</p>
                <p className="hidden sm:block text-xs text-rx-text-muted font-body mt-2">This billing cycle</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3C — Charts Row */}
      <section className="relative grid grid-cols-1 lg:grid-cols-5 gap-4 animate-fade-up" style={{ animationDelay: "160ms" }}>
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "rgba(59,130,246,0.04)", filter: "blur(120px)" }} />
        {/* Area Chart — Recovery Trend */}
        <div className="lg:col-span-3 bg-rx-surface border border-border rounded-xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-4 gap-2">
            <h2 className="text-base font-heading font-semibold text-rx-text-primary">Recovery trend</h2>
            <div className="flex flex-wrap gap-1 text-[10px] sm:text-xs font-body">
              {["All", "Razorpay", "Stripe", "Cashfree"].map((t, i) => (
                <button key={t} className={cn("px-2 py-1 sm:px-2.5 rounded-md transition-colors", i === 0 ? "bg-rx-overlay text-rx-text-primary" : "text-rx-text-muted hover:text-rx-text-secondary")}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile Sparkline Chart */}
          <div className="md:hidden mt-2">
            <div className="mb-2">
              <span className="text-[28px] font-heading font-bold text-rx-green-text font-mono leading-none">₹2,40,000</span>
              <span className="text-xs text-rx-text-muted font-body ml-2">Total Recovered</span>
            </div>
            {isLoading ? (
              <div className="w-full h-[80px] bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite]" />
            ) : (
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={recoveryData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRecoveredMob" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent-green))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--accent-green))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="recovered" stroke="hsl(var(--accent-green))" fill="url(#gradRecoveredMob)" strokeWidth={2} dot={false} isAnimationActive />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Desktop Full Chart */}
          <div className="hidden md:block">
            {isLoading ? (
              <div className="w-full h-[260px] bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite]" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={recoveryData}>
                  <defs>
                    <linearGradient id="gradFailed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent-red))" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="hsl(var(--accent-red))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradRecovered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent-green))" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(var(--accent-green))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-default))" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(var(--text-muted))", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--text-muted))", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                  <ReTooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="failed" stroke="hsl(var(--accent-red))" fill="url(#gradFailed)" strokeWidth={2} dot={false} isAnimationActive />
                  <Area type="monotone" dataKey="recovered" stroke="hsl(var(--accent-green))" fill="url(#gradRecovered)" strokeWidth={2} dot={false} isAnimationActive />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Donut — Recovery by channel */}
        <div className="lg:col-span-2 bg-rx-surface border border-border rounded-xl p-5">
          <h2 className="text-base font-heading font-semibold text-rx-text-primary mb-4">Recovery by channel</h2>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-[200px] h-[200px] rounded-full bg-rx-overlay animate-[skeleton-pulse_2s_ease-in-out_infinite] mb-6" />
              <div className="w-full space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center w-full">
                    <div className="h-4 w-24 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite]" />
                    <div className="h-4 w-16 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite]" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <div className="relative">
                  <PieChart width={200} height={200}>
                    <Pie data={channelData} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={2} isAnimationActive>
                      {channelData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[28px] font-mono font-bold text-rx-green-text">78%</span>
                    <span className="text-[11px] font-body text-rx-text-muted">recovery rate</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {channelData.map((ch) => (
                  <div key={ch.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: ch.color }} />
                      <span className="font-body text-rx-text-secondary">{ch.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-rx-text-secondary">{ch.value}%</span>
                      <span className="font-mono text-rx-green-text text-xs">{ch.amount}</span>
                      <span className={cn("text-[11px] font-mono", ch.trend.startsWith("+") ? "text-rx-green" : ch.trend.startsWith("-") ? "text-rx-red" : "text-rx-text-muted")}>
                        {ch.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 3D — Gateway Status */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: "240ms" }}>
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-rx-surface border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-rx-overlay animate-[skeleton-pulse_2s_ease-in-out_infinite] shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite]" />
                <div className="h-3 w-16 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite]" />
              </div>
            </div>
          ))
        ) : (
          gateways.map((gw) => {
            const isWarning = gw.status === "Token expiring";
          return (
            <div key={gw.name} className={cn("bg-rx-surface border rounded-xl p-4 card-hover flex items-center gap-4", isWarning ? "border-rx-amber" : "border-border")}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-heading font-bold shrink-0" style={{ background: gw.color, color: "#fff" }}>
                {gw.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-semibold text-sm text-rx-text-primary">{gw.name}</span>
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-md font-body", isWarning ? "bg-rx-amber-dim text-rx-amber" : "bg-rx-green-dim text-rx-green")}>
                    {isWarning && <span className="inline-block w-1.5 h-1.5 rounded-full bg-rx-amber animate-amber-pulse mr-1" />}
                    {gw.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-mono text-rx-green-text">{gw.recovered}</span>
                  <span className="text-[11px] font-body text-rx-text-muted">{gw.webhook}</span>
                </div>
              </div>
            </div>
          );
          })
        )}
      </section>

      {/* 3E — Failed Payments Table + Live Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4 animate-fade-up" style={{ animationDelay: "320ms" }}>
        {/* Table */}
        <div className="lg:col-span-3 bg-rx-surface border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-heading font-semibold text-rx-text-primary">Recent failed payments</h2>
            <a href="/dashboard/payments" className="text-xs font-body text-rx-blue hover:underline">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-body text-rx-text-muted">
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Gateway</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Reason</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-rx-overlay/50 transition-colors">
                      <td className="px-5 py-4"><div className={`h-4 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite] ${i % 3 === 0 ? "w-[80%]" : i % 3 === 1 ? "w-[60%]" : "w-[40%]"}`} /></td>
                      <td className="px-4 py-4"><div className="h-4 w-16 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite] ml-auto" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-20 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite]" /></td>
                      <td className="px-4 py-4 hidden md:table-cell"><div className={`h-4 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite] ${i % 2 === 0 ? "w-[70%]" : "w-[50%]"}`} /></td>
                      <td className="px-4 py-4"><div className="h-4 w-24 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite]" /></td>
                      <td className="px-5 py-4"><div className="h-6 w-16 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite] ml-auto" /></td>
                    </tr>
                  ))
                ) : !hasFailedPayments ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <CheckCircle size={32} className="text-rx-green mb-4" strokeWidth={1.5} />
                        <h3 className="text-base font-heading font-medium text-rx-text-primary mb-1">No failed payments matching your filters</h3>
                        <p className="text-sm font-body text-rx-text-muted mb-4">Try adjusting the date range or gateway filter</p>
                        <button className="text-sm font-body text-rx-blue hover:underline">Clear filters</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  failedPayments.map((p, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-rx-overlay/50 transition-colors cursor-pointer">
                      <td className="px-5 py-3">
                        <div className="flex flex-col">
                          <span className="font-body text-rx-text-secondary truncate max-w-[140px] md:max-w-none">{p.email}</span>
                          <span className="text-[10px] text-rx-text-muted font-body">{(p as any).time}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-rx-text-primary">{p.amount}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-[11px] px-1.5 py-0.5 rounded-md font-body", gatewayPillStyles[p.gateway])}>
                          {p.gateway}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-body text-rx-text-muted hidden md:table-cell">{p.reason}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-[11px] px-2 py-1 rounded-md font-body inline-flex items-center gap-1", statusStyles[p.statusType])}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {p.action === "Retry now" ? (
                          <button className="text-xs px-2.5 py-1 rounded-md border border-rx-blue text-rx-blue hover:bg-rx-blue-dim transition-colors font-body">
                            Retry now
                          </button>
                        ) : (
                          <button className="text-xs text-rx-text-muted hover:text-rx-text-secondary font-body transition-colors">View</button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-2 bg-rx-surface border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rx-green animate-live-pulse" />
              <h2 className="text-base font-heading font-semibold text-rx-text-primary">Live activity</h2>
            </div>
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-body text-rx-text-muted hover:text-rx-text-secondary hover:bg-rx-overlay transition-colors"
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              {isPaused ? "Resume" : "Pause"}
            </button>
          </div>
          <div className="relative">
            <div className="max-h-[400px] overflow-y-auto">
              {isLoading ? (
                [...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-4 border-b border-border last:border-0">
                    <div className="w-4 h-4 rounded-md bg-rx-overlay animate-[skeleton-pulse_2s_ease-in-out_infinite] shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2.5">
                      <div className={`h-3 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite] ${i % 2 === 0 ? "w-[90%]" : "w-[75%]"}`} />
                      <div className="h-2.5 w-12 bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite]" />
                    </div>
                  </div>
                ))
              ) : (
                activities.map((item) => {
                  const config = activityTypeConfig[item.type];
                  const IconComp = config.icon;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-start gap-3 px-5 py-3 border-b border-border last:border-0 transition-colors",
                        item.isNew && "animate-slide-in-top"
                      )}
                    >
                      <div className={cn("mt-0.5 shrink-0", config.iconClass)}>
                        <IconComp size={14} />
                      </div>
                      <p className="flex-1 text-sm font-body text-rx-text-secondary leading-snug">
                        {item.text.split(/(₹[\d,]+)/).map((part, j) =>
                          part.match(/₹[\d,]+/) ? <span key={j} className="font-mono text-rx-green-text">{part}</span> : part
                        )}
                      </p>
                      <span className="text-[11px] font-body text-rx-text-muted whitespace-nowrap">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
            {/* Fade-to-dark gradient at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none bg-gradient-to-t from-rx-surface to-transparent" />
          </div>
        </div>
      </section>

      {/* 3F — Performance Bar Chart */}
      <section className="bg-rx-surface border border-border rounded-xl p-5 animate-fade-up" style={{ animationDelay: "400ms" }}>
        <div className="mb-1">
          <h2 className="text-base font-heading font-semibold text-rx-text-primary">Recovery performance by decline type</h2>
          <p className="text-xs font-body text-rx-text-muted mt-1">How FynBack handles each failure reason vs Razorpay baseline</p>
        </div>
        {isLoading ? (
          <div className="w-full h-[300px] bg-rx-overlay rounded animate-[skeleton-pulse_2s_ease-in-out_infinite] mt-4" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData} layout="vertical" margin={{ left: 20, right: 20, top: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-default))" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--text-muted))", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis dataKey="type" type="category" width={130} tick={{ fontSize: 12, fill: "hsl(var(--text-secondary))", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
              <ReTooltip content={<BarTooltip />} />
              <Bar dataKey="baseline" fill="hsl(var(--bg-overlay))" stroke="hsl(var(--border-strong))" radius={[0, 4, 4, 0]} barSize={10} isAnimationActive name="Baseline" />
              <Bar dataKey="fynback" fill="hsl(var(--accent-green))" radius={[0, 4, 4, 0]} barSize={10} isAnimationActive name="FynBack" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
        </>
      )}
    </div>
  );
}
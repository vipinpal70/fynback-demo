'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart3,
  Mail,
  FileText,
  Download,
  TrendingUp,
  Percent,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Activity,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  MoreHorizontal,
  MessageCircle,
  Flag,
  X,
  PieChart as PieChartIcon,
  Printer,
  Calendar,
  Link as LinkIcon
} from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, BarChart as RechartsBarChart, LineChart as RechartsLineChart,
  RadialBarChart, RadialBar, PieChart, Pie, Cell, Brush,
  Bar, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ReferenceLine
} from 'recharts';

type TimePeriod = '7d' | '30d' | '90d' | '6m' | '1y';
type Gateway = 'razorpay' | 'stripe' | 'cashfree' | 'payu' | 'all';
type RecoveryChannel = 'retry' | 'email' | 'whatsapp' | 'sms' | 'portal';

interface KPIStat {
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'flat';
  subtext: string;
}

interface CohortMonth {
  month: string;
  retry: number;
  email: number;
  whatsapp: number;
  recovering: number;
  lost: number;
}

interface DeclineCodeRow {
  code: string;
  label: string;
  count: number;
  failedAmount: number;
  recoveredAmount: number;
  rate: number;
  avgAttempts: number;
  trend: 'up' | 'down' | 'flat';
  trendPct: number;
}

const formatINR = (paise: number): string =>
  '₹' + (paise / 100).toLocaleString('en-IN');

const formatINRLakh = (paise: number): string => {
  const rupees = paise / 100;
  if (rupees >= 100000) return '₹' + (rupees / 100000).toFixed(1) + 'L';
  return formatINR(paise);
};

const timelineData = [
  { date: 'Mar 1',  failed: 185000,  recovered: 152700 },
  { date: 'Mar 2',  failed: 92000,   recovered: 78200  },
  { date: 'Mar 3',  failed: 245000,  recovered: 196000 },
  { date: 'Mar 4',  failed: 138000,  recovered: 109600 },
  { date: 'Mar 5',  failed: 310000,  recovered: 254200 },
  { date: 'Mar 6',  failed: 76000,   recovered: 64600  },
  { date: 'Mar 7',  failed: 198000,  recovered: 158400 },
  { date: 'Mar 8',  failed: 422000,  recovered: 337600 },
  { date: 'Mar 9',  failed: 165000,  recovered: 129000 },
  { date: 'Mar 10', failed: 289000,  recovered: 231200 },
  { date: 'Mar 11', failed: 108000,  recovered: 86400  },
  { date: 'Mar 12', failed: 195000,  recovered: 152100 },
  { date: 'Mar 13', failed: 347000,  recovered: 277600 },
  { date: 'Mar 14', failed: 212000,  recovered: 169600 },
  { date: 'Mar 15', failed: 488000,  recovered: 390400 },
  { date: 'Mar 16', failed: 143000,  recovered: 115800 },
  { date: 'Mar 17', failed: 267000,  recovered: 213600 },
  { date: 'Mar 18', failed: 91000,   recovered: 72800  },
  { date: 'Mar 19', failed: 334000,  recovered: 267200 },
  { date: 'Mar 20', failed: 178000,  recovered: 142400 },
  { date: 'Mar 21', failed: 256000,  recovered: 204800 },
  { date: 'Mar 22', failed: 122000,  recovered: 97600  },
  { date: 'Mar 23', failed: 389000,  recovered: 311200 },
  { date: 'Mar 24', failed: 201000,  recovered: 160800 },
  { date: 'Mar 25', failed: 445000,  recovered: 382700 },
  { date: 'Mar 26', failed: 318000,  recovered: 280000 },
  { date: 'Mar 27', failed: 234000,  recovered: 196000 },
  { date: 'Mar 28', failed: 167000,  recovered: 133600 },
  { date: 'Mar 29', failed: 298000,  recovered: 238400 },
  { date: 'Mar 30', failed: 143000,  recovered: 111500 },
];

const cohortData: CohortMonth[] = [
  { month: 'Oct 2024', retry: 41, email: 18, whatsapp: 14, recovering: 0,  lost: 27 },
  { month: 'Nov 2024', retry: 38, email: 20, whatsapp: 16, recovering: 0,  lost: 26 },
  { month: 'Dec 2024', retry: 43, email: 19, whatsapp: 15, recovering: 0,  lost: 23 },
  { month: 'Jan 2025', retry: 40, email: 22, whatsapp: 17, recovering: 2,  lost: 19 },
  { month: 'Feb 2025', retry: 39, email: 24, whatsapp: 19, recovering: 4,  lost: 14 },
  { month: 'Mar 2025', retry: 35, email: 18, whatsapp: 14, recovering: 22, lost: 11 },
];

const declineCodes: DeclineCodeRow[] = [
  { code: 'insufficient_funds', label: 'Insufficient funds', count: 52, failedAmount: 1240000, recoveredAmount: 1017600, rate: 82, avgAttempts: 2.1, trend: 'up', trendPct: 8 },
  { code: 'card_expired', label: 'Card expired', count: 34, failedAmount: 890000, recoveredAmount: 631900, rate: 71, avgAttempts: 1.8, trend: 'flat', trendPct: 0 },
  { code: 'upi_mandate_failed', label: 'UPI mandate failed', count: 29, failedAmount: 720000, recoveredAmount: 489600, rate: 68, avgAttempts: 1.4, trend: 'up', trendPct: 5 },
  { code: 'do_not_honor', label: 'Do not honor', count: 23, failedAmount: 610000, recoveredAmount: 329400, rate: 54, avgAttempts: 2.8, trend: 'down', trendPct: 3 },
  { code: 'network_error', label: 'Network/timeout', count: 18, failedAmount: 380000, recoveredAmount: 345800, rate: 91, avgAttempts: 1.1, trend: 'up', trendPct: 12 },
  { code: 'bank_decline', label: 'Generic bank decline', count: 15, failedAmount: 290000, recoveredAmount: 142100, rate: 49, avgAttempts: 3.2, trend: 'down', trendPct: 6 },
  { code: 'insufficient_upi_balance', label: 'UPI balance low', count: 12, failedAmount: 198000, recoveredAmount: 158400, rate: 80, avgAttempts: 1.6, trend: 'up', trendPct: 15 },
  { code: 'stolen_card', label: 'Stolen/fraud', count: 8, failedAmount: 380000, recoveredAmount: 0, rate: 0, avgAttempts: 0, trend: 'flat', trendPct: 0 },
];

const campaigns = [
  { name: '7-Day Aggressive', description: 'Razorpay · 3 retries + 3 emails + 2 WA', status: 'active', customers: 87, recoveredAmount: 1420000, rate: 82, emailsSent: 261, emailOpenRate: 71, waSent: 87, waReadRate: 91, avgDaysToRecover: 1.8, trend: 'up' },
  { name: 'Standard Recovery', description: 'Stripe + Cashfree · 2 retries + 2 emails', status: 'active', customers: 43, recoveredAmount: 684000, rate: 71, emailsSent: 86, emailOpenRate: 64, waSent: 0, waReadRate: 0, avgDaysToRecover: 2.9, trend: 'flat' },
  { name: 'Gentle Follow-up', description: 'All gateways · 1 retry + 1 email + 1 WA', status: 'paused', customers: 13, recoveredAmount: 136000, rate: 61, emailsSent: 13, emailOpenRate: 58, waSent: 13, waReadRate: 84, avgDaysToRecover: 4.2, trend: 'down' },
];

const topRecoveries = [
  { rank: 1, email: 'vikram@enterprise.in', company: 'Enterprise Ltd', gateway: 'razorpay', amount: 4999900, channel: 'Auto-retry + WA', daysToRecover: 2.1, date: 'Mar 27' },
  { rank: 2, email: 'harsh@fintech.in', company: 'FinTech Co', gateway: 'razorpay', amount: 2999900, channel: 'Email → portal', daysToRecover: 1.3, date: 'Mar 22' },
  { rank: 3, email: 'arjun@edtech.co', company: 'EdTech Co', gateway: 'stripe', amount: 1499900, channel: 'WhatsApp', daysToRecover: 0.8, date: 'Mar 25' },
  { rank: 4, email: 'karthik@saasco.in', company: 'SaaSCo', gateway: 'stripe', amount: 1280000, channel: 'Auto-retry', daysToRecover: 3.2, date: 'Mar 20' },
  { rank: 5, email: 'sunita@startup.co', company: 'Startup Co', gateway: 'stripe', amount: 999900, channel: 'Email #3 + retry', daysToRecover: 4.7, date: 'Mar 19' },
  { rank: 6, email: 'nisha@brand.co', company: 'Brand Co', gateway: 'razorpay', amount: 820000, channel: 'Portal link', daysToRecover: 1.9, date: 'Mar 26' },
  { rank: 7, email: 'meera@techstartup.in', company: 'TechStartup', gateway: 'razorpay', amount: 650000, channel: 'Auto-retry', daysToRecover: 2.4, date: 'Mar 23' },
  { rank: 8, email: 'rohan@techco.in', company: 'TechCo', gateway: 'razorpay', amount: 499900, channel: 'WhatsApp', daysToRecover: 0.5, date: 'Mar 28' },
  { rank: 9, email: 'ankita@brand.co', company: 'Brand Co', gateway: 'cashfree', amount: 429900, channel: 'Auto-retry', daysToRecover: 1.1, date: 'Mar 24' },
  { rank: 10, email: 'amit@venture.com', company: 'Venture Labs', gateway: 'razorpay', amount: 299900, channel: 'Email click', daysToRecover: 3.8, date: 'Mar 21' },
];

const trendData = [
  { month: 'Oct', actual: 66, projected: null },
  { month: 'Nov', actual: 68, projected: null },
  { month: 'Dec', actual: 70, projected: null },
  { month: 'Jan', actual: 73, projected: null },
  { month: 'Feb', actual: 76, projected: null },
  { month: 'Mar', actual: 78, projected: 78 },
  { month: 'Apr', actual: null, projected: 81 },
  { month: 'May', actual: null, projected: 83 },
  { month: 'Jun', actual: null, projected: 85 },
];

const timeBlocks = ['12am-3am', '3am-6am', '6am-9am', '9am-12pm', '12pm-3pm', '3pm-6pm', '6pm-9pm', '9pm-12am'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const heatmapData = days.flatMap(day => timeBlocks.map((time, timeIndex) => {
  let failures = Math.floor(Math.random() * 5);
  let recoveryRate = 60 + Math.floor(Math.random() * 30);
  if (['Mon', 'Tue', 'Wed', 'Thu'].includes(day) && [3, 4, 5].includes(timeIndex)) { failures += Math.floor(Math.random() * 40) + 15; }
  if (['Mon', 'Tue', 'Wed'].includes(day) && timeIndex === 2) { recoveryRate = 88 + Math.floor(Math.random() * 10); failures += 10; }
  return { day, time, failures, recoveryRate };
}));

const pageStyles = `
  .analytics-theme {
    --bg-base:        #080c14;
    --bg-surface:     #0d1117;
    --bg-elevated:    #131a24;
    --bg-overlay:     rgba(255, 255, 255, 0.03);
    
    --border-default: rgba(255, 255, 255, 0.08);
    --border-strong:  rgba(255, 255, 255, 0.15);
    
    --text-primary:   #f3f4f6;
    --text-secondary: #9ca3af;
    --text-muted:     #6b7280;
    
    --accent-blue:       #3b82f6;
    --accent-blue-dim:   rgba(59, 130, 246, 0.15);
    --accent-green:      #10b981;
    --accent-green-text: #34d399;
    --accent-green-dim:  rgba(16, 185, 129, 0.15);
    --accent-amber:      #fbbf24;
    --accent-amber-dim:  rgba(251, 191, 36, 0.15);
    --accent-red:        #ef4444;
    --accent-red-dim:    rgba(239, 68, 68, 0.15);
  }

  @keyframes money-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .money-shimmer {
    background: linear-gradient(90deg, currentColor 25%, rgba(255,255,255,0.8) 50%, currentColor 75%);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: money-shimmer 3s linear infinite;
    display: inline-block;
  }
  @keyframes skeleton-pulse {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.5; }
  }
  .skeleton {
    background: var(--bg-overlay);
    animation: skeleton-pulse 1.5s ease infinite;
    border-radius: 4px;
  }
  .animated-arc {
    transition: background 1.2s ease-out;
  }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  @media print {
    @page { margin: 1cm; size: a4 portrait; }
    body { background: #ffffff !important; color: #111827 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    :root {
      --bg-base: #ffffff;
      --bg-surface: #f9fafb;
      --bg-elevated: #f3f4f6;
      --border-default: #e5e7eb;
      --border-strong: #d1d5db;
      --text-primary: #111827;
      --text-secondary: #374151;
      --text-muted: #6b7280;
    }
  }
  .print-only { display: none; }
  .hide-y-mobile { display: block; }
  @media (max-width: 768px) {
    .hide-y-mobile { display: none; }
  }
`;

const MobileSummaryCarousel = ({ activeIndex }: { activeIndex: number }) => {
  const views = [
    { title: "₹2,40,000 recovered", sub: "78% overall recovery rate", color: "var(--accent-green-text)" },
    { title: "Best channel: WhatsApp", sub: "88% recovery on WhatsApp", color: "#10b981" },
    { title: "Best day: Mar 25", sub: "Payday boost · 92% rate", color: "var(--accent-amber)" }
  ];

  return (
    <div className="md:hidden px-8 mt-4">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl p-5 relative overflow-hidden min-h-[100px] flex flex-col justify-center">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent-blue)]"></div>
        {views.map((v, i) => (
          <div key={i} className={`absolute inset-0 p-5 flex flex-col justify-center transition-all duration-500 transform ${i === activeIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
             <div className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[20px]" style={{ color: v.color }}>{v.title}</div>
             <div className="font-['DM_Sans',sans-serif] text-[14px] text-[var(--text-secondary)] mt-1">{v.sub}</div>
          </div>
        ))}
        {/* Indicators */}
        <div className="absolute bottom-3 right-5 flex gap-1.5">
          {views.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeIndex ? 'bg-[var(--accent-blue)] w-3' : 'bg-[var(--border-strong)]'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MoneyText = ({ amount, shimmer = false, className = '' }: { amount: number, shimmer?: boolean, className?: string }) => {
  const formatted = formatINRLakh(amount * 100);
  return (
    <span className={`font-['JetBrains_Mono',monospace] ${shimmer ? 'money-shimmer text-[var(--accent-green-text)]' : ''} ${className}`}>
      {formatted}
    </span>
  );
};

const ArcMeter = ({ value, className = '' }: { value: number, className?: string }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setVal(value), 100);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className={`relative w-20 h-20 rounded-full flex items-center justify-center animated-arc ${className}`}
      style={{ background: `conic-gradient(var(--accent-green) ${val}%, var(--bg-overlay) ${val}%)` }}>
      <div className="absolute inset-[4px] rounded-full bg-[var(--bg-surface)] flex items-center justify-center">
        <span className="font-['JetBrains_Mono',monospace] font-bold text-lg text-[var(--accent-green-text)]">{value}%</span>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon: Icon, trend, subtext, iconColor, valueColor = 'var(--text-primary)', isArc = false, isSparkline = false, isAmount = false, isLoading = false }: any) => {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-[16px_20px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:-translate-y-[1px] hover:border-[var(--border-strong)] transition-all">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: iconColor }}>
          <Icon size={18} />
        </div>
        <span className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-muted)]">{title}</span>
      </div>
      <div className="mb-3 h-[40px] flex items-center">
        {isLoading ? (
           <div className="w-24 h-8 skeleton"></div>
        ) : isArc ? (
           <div className="-mt-8"><ArcMeter value={parseInt(value)} /></div>
        ) : isSparkline ? (
           <div className="w-full flex items-end justify-between">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[28px]" style={{ color: valueColor }}>{value}</span>
              <div className="w-20 h-9">
                 <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={[{v:10},{v:15},{v:12},{v:22},{v:18},{v:30},{v:28}]}>
                       <Line type="monotone" dataKey="v" stroke="var(--accent-blue)" strokeWidth={2} dot={false} />
                    </RechartsLineChart>
                 </ResponsiveContainer>
              </div>
           </div>
        ) : isAmount ? (
           <span className="font-['JetBrains_Mono',monospace] font-bold text-[28px] money-shimmer text-[var(--accent-green-text)]">{value}</span>
        ) : (
           <span className="font-['JetBrains_Mono',monospace] font-bold text-[28px]" style={{ color: valueColor }}>{value}</span>
        )}
      </div>
      <div className="flex flex-col gap-1.5 mt-auto">
        <div className="flex items-center">
           {trend.includes('↑') && trend.includes('green') ? (
             <span className="inline-block bg-[var(--accent-green-dim)] text-[var(--accent-green-text)] px-2 py-0.5 rounded text-[11px] font-medium font-['DM_Sans',sans-serif]">{trend.replace('green|','')}</span>
           ) : trend.includes('↓') && trend.includes('green') ? (
             <span className="inline-block bg-[var(--accent-green-dim)] text-[var(--accent-green-text)] px-2 py-0.5 rounded text-[11px] font-medium font-['DM_Sans',sans-serif]">{trend.replace('green|','')}</span>
           ) : (
             <span className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-secondary)]">{trend}</span>
           )}
        </div>
        {subtext && (
           typeof subtext === 'string' ? (
             <span className="font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-muted)]">{subtext}</span>
           ) : (
             subtext
           )
        )}
      </div>
    </div>
  );
};

const ChartTooltip = ({ active, payload, label, isTimeline = false }: any) => {
  if (active && payload && payload.length) {
    if (isTimeline) {
      const failed = payload.find((p: any) => p.dataKey === 'failed')?.value || 0;
      const recovered = payload.find((p: any) => p.dataKey === 'recovered')?.value || 0;
      const rate = failed > 0 ? Math.round((recovered / failed) * 100) : 0;
      const gap = failed - recovered;
      return (
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-[10px] p-[12px_16px] shadow-[0_8px_40px_rgba(0,0,0,0.5)] font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-primary)] min-w-[180px]">
          <p className="mb-3 font-medium">{label}, 2025</p>
          <div className="flex justify-between gap-6 py-0.5">
            <span className="text-[var(--text-muted)]">Failed:</span>
            <span className="font-['JetBrains_Mono',monospace] text-[var(--accent-red)]">{formatINR(failed * 100)}</span>
          </div>
          <div className="flex justify-between gap-6 py-0.5">
            <span className="text-[var(--text-muted)]">Recovered:</span>
            <span className="font-['JetBrains_Mono',monospace] text-[var(--accent-green-text)]">{formatINR(recovered * 100)}</span>
          </div>
          <div className="flex justify-between gap-6 py-0.5 mt-1 border-t border-[var(--border-strong)] pt-1">
            <span className="text-[var(--text-muted)]">Rate:</span>
            <span className="font-['JetBrains_Mono',monospace] text-[var(--accent-green-text)]">{rate}%</span>
          </div>
          <div className="flex justify-between gap-6 py-0.5">
            <span className="text-[var(--text-muted)]">Gap:</span>
            <span className="font-['JetBrains_Mono',monospace] text-[var(--text-muted)]">{formatINR(gap * 100)}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-[10px] p-[12px_16px] shadow-[0_8px_40px_rgba(0,0,0,0.5)] font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-primary)]">
        <p className="mb-2 font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between gap-4 py-0.5">
            <span className="text-[var(--text-muted)]">{entry.name}:</span>
            <span className="font-['JetBrains_Mono',monospace] ml-4" style={{ color: entry.color }}>
               {entry.name.toLowerCase().includes('rate') || entry.name.toLowerCase().includes('open') ? `${entry.value}%` : entry.name === 'Count' ? entry.value : formatINR(entry.value * 100)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CohortTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const hovered = payload[0];
    const key = hovered.dataKey;
    const value = hovered.value;
    const channelMapping: Record<string, { label: string, short: string, color: string, time: string, amount: number }> = {
      retry: { label: 'Automated retry', short: 'retry', color: 'var(--accent-green)', time: '4.2 hours', amount: 82000 },
      email: { label: 'Email follow-up', short: 'email', color: 'var(--accent-blue)', time: '2.1 days', amount: 54000 },
      whatsapp: { label: 'WhatsApp recovery', short: 'WhatsApp', color: '#10b981', time: '1.3 hours', amount: 42800 },
      recovering: { label: 'Still in recovery', short: 'recovery', color: 'var(--accent-amber)', time: '-', amount: 64000 },
      lost: { label: 'Lost (unrecoverable)', short: 'lost', color: 'var(--accent-red)', time: '-', amount: 18000 }
    };
    const info = channelMapping[key];
    if (!info) return null;
    
    return (
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-[10px] p-[14px_16px] shadow-[0_12px_40px_rgba(0,0,0,0.6)] font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-primary)] min-w-[240px]">
        <p className="mb-3 font-medium text-[14px]">{label} · {info.label}</p>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: info.color }}></div>
            <span className="font-['JetBrains_Mono',monospace] text-[var(--text-primary)] font-medium">{value}%</span> of total failures
          </div>
          {key !== 'recovering' && key !== 'lost' && (
            <>
               <div className="flex items-center gap-2 text-[var(--text-muted)] mt-1">
                 <span className="font-['JetBrains_Mono',monospace] text-[var(--accent-green-text)] font-medium">{formatINR(info.amount * 100)}</span> recovered via {info.short}
               </div>
               <div className="flex justify-between items-center gap-4 mt-2 border-t border-[var(--border-strong)] pt-3">
                 <span className="text-[var(--text-muted)]">Avg response time:</span>
                 <span className="font-medium text-[var(--text-primary)]">{info.time}</span>
               </div>
            </>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const HeatmapCell = ({ day, time, cell, onClick, onMouseEnter, onMouseLeave, isHoveredRow, isHoveredCol, viewBy, isSelected }: any) => {
  const count = cell?.failures || 0;
  const rate = cell?.recoveryRate || 0;
  const amount = count * 8200; // Mock revenue at risk calculation

  let bg = 'var(--bg-overlay)';
  if (viewBy === 'failures') {
    if (count > 0 && count <= 5) bg = 'rgba(239,68,68,0.15)';
    else if (count <= 15) bg = 'rgba(239,68,68,0.30)';
    else if (count <= 30) bg = 'rgba(239,68,68,0.50)';
    else if (count <= 50) bg = 'rgba(239,68,68,0.70)';
    else if (count > 50) bg = 'rgba(239,68,68,0.90)';
  } else if (viewBy === 'recovery') {
    if (rate >= 85) bg = 'rgba(16,185,129,0.80)';       // Strong green
    else if (rate >= 75) bg = 'rgba(16,185,129,0.40)';  // Med green
    else if (rate >= 60) bg = 'rgba(245,158,11,0.50)';  // Amber
    else if (rate > 0) bg = 'rgba(239,68,68,0.60)';     // Red
  } else if (viewBy === 'revenue') {
    if (amount > 0 && amount <= 50000) bg = 'rgba(239,68,68,0.15)';
    else if (amount <= 150000) bg = 'rgba(239,68,68,0.30)';
    else if (amount <= 300000) bg = 'rgba(239,68,68,0.50)';
    else if (amount > 300000) bg = 'rgba(239,68,68,0.80)';
  }

  const highlightClass = (isHoveredRow || isHoveredCol) && !isSelected ? ' brightness-125 saturate-150 border-[var(--border-strong)]' : '';
  const selectedClass = isSelected ? ' ring-2 ring-[var(--accent-blue)] border-transparent z-20 scale-110' : ' border-[var(--border-default)]';

  return (
    <div 
      className={`relative group cursor-pointer w-full aspect-square md:w-10 md:h-10 shrink-0 rounded-[4px] border transition-all ${highlightClass} ${selectedClass} hover:scale-110 z-0 hover:z-30`}
      style={{ backgroundColor: bg }}
      onClick={() => onClick(day, time, cell)}
      onMouseEnter={() => onMouseEnter(day, time)}
      onMouseLeave={onMouseLeave}
    >
      <div className="absolute opacity-0 group-hover:opacity-100 pointer-events-none z-40 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-lg p-3 shadow-xl w-40 transition-opacity">
         <div className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-primary)] mb-1 font-medium">{day} {time}</div>
         <div className="flex justify-between font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-muted)]">Failures: <span className="text-[var(--text-primary)] font-['JetBrains_Mono',monospace]">{count}</span></div>
         <div className="flex justify-between font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-muted)]">Recovery: <span className="text-[var(--accent-green-text)] font-['JetBrains_Mono',monospace]">{rate}%</span></div>
         {viewBy === 'revenue' && <div className="flex justify-between font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-muted)] mt-0.5">Risk: <span className="text-[var(--accent-red)] font-['JetBrains_Mono',monospace]">{formatINR(amount * 100)}</span></div>}
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [activePeriod, setActivePeriod] = useState<TimePeriod>('30d');
  const [compareMode, setCompareMode] = useState(false);
  const [activeGateways, setActiveGateways] = useState<Gateway[]>(['all']);
  const [isLoading, setIsLoading] = useState(false);

  const [annotationMode, setAnnotationMode] = useState(false);
  const [annotations, setAnnotations] = useState<{date: string, text: string}[]>([]);
  const [selectedDateInfo, setSelectedDateInfo] = useState<any | null>(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage("Link copied!");
    setTimeout(() => setToastMessage(null), 2000);
  };

  const [heatmapView, setHeatmapView] = useState<'failures' | 'recovery' | 'revenue'>('failures');
  const [selectedCell, setSelectedCell] = useState<{ day: string, time: string, cell: any } | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);
  const [isCohortExpanded, setIsCohortExpanded] = useState(false);
  
  // Mobile specific state
  const [activeSummaryIndex, setActiveSummaryIndex] = useState(0);
  const [activeKPIIndex, setActiveKPIIndex] = useState(0);
  const [activeInsightIndex, setActiveInsightIndex] = useState(0);

  // Auto-rotate mobile summary
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSummaryIndex(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const downloadHeatmapCSV = () => {
    const header = "Day,Time,Failures,Recovery Rate,Revenue at Risk\n";
    const rows = heatmapData.map(h => `${h.day},${h.time},${h.failures},${h.recoveryRate}%,${h.failures * 8200}`).join("\n");
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'heatmap_data.csv';
    document.body.appendChild(a); // required for firefox
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePeriodChange = (p: TimePeriod) => {
    setActivePeriod(p);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  const enhancedTimelineData = useMemo(() => {
    return timelineData.map(d => ({
      ...d,
      failedPrev: compareMode ? d.failed * 0.85 : undefined,
      recoveredPrev: compareMode ? d.recovered * 0.82 : undefined,
    }));
  }, [compareMode]);

  const toggleGateway = (gw: Gateway) => {
    if (gw === 'all') {
      setActiveGateways(['all']);
    } else {
      let next: Gateway[] = activeGateways.filter((g: Gateway) => g !== 'all');
      if (next.includes(gw)) next = next.filter(g => g !== gw);
      else next.push(gw);
      if (next.length === 0) next = ['all'];
      setActiveGateways(next);
    }
  };

  return (
    <div className="analytics-theme min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-['DM_Sans',sans-serif] pb-24">
      <style>{pageStyles}</style>

      {/* MOBILE-ONLY SUMMARY CAROUSEL */}
      <MobileSummaryCarousel activeIndex={activeSummaryIndex} />

      {/* SECTION A — PAGE HEADER + TIME CONTROLS */}
      <div className="px-8 py-6 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)] mb-1">
              Dashboard <span className="mx-1">/</span> Analytics
            </div>
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[26px] leading-tight text-[var(--text-primary)]">Analytics</h1>
            <p className="font-['DM_Sans',sans-serif] text-[14px] text-[var(--text-muted)] mt-1">
              Revenue recovery intelligence · Updated 2 minutes ago
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] p-1">
              {(['7d', '30d', '90d', '6m', '1y'] as TimePeriod[]).map(p => (
                <button key={p} onClick={() => handlePeriodChange(p)}
                  className={`px-[14px] py-[6px] text-[13px] font-medium font-['DM_Sans',sans-serif] rounded-[6px] transition-all duration-150 ${activePeriod === p ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                  {p.toUpperCase()}
                </button>
              ))}
              <button className="px-[14px] py-[6px] text-[13px] font-medium font-['DM_Sans',sans-serif] rounded-[6px] transition-all duration-150 text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1">
                Custom <ChevronDown size={14} />
              </button>
            </div>

            <label className="flex items-center gap-2 cursor-pointer ml-2">
              <input type="checkbox" checked={compareMode} onChange={(e) => setCompareMode(e.target.checked)} className="rounded border-[var(--border-default)] bg-[var(--bg-surface)] accent-[var(--accent-blue)] w-4 h-4 cursor-pointer" />
              <span className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-secondary)]">Compare to previous period</span>
            </label>

            <div className="flex items-center gap-2 border-l border-[var(--border-default)] pl-4">
              <button onClick={() => setIsScheduleModalOpen(true)} className="w-[34px] h-[34px] flex items-center justify-center rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="Schedule report"><Calendar size={16} /></button>
              <button className="w-[34px] h-[34px] flex items-center justify-center rounded-md border border-[var(--border-default)] hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="Export CSV"><FileText size={16} /></button>
              <button onClick={() => window.print()} className="w-[34px] h-[34px] flex items-center justify-center rounded-md border border-[var(--border-default)] hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="Export PDF"><Printer size={16} /></button>
            </div>
          </div>
        </div>

        {compareMode && (
          <div className="mt-4 inline-flex items-center bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-md px-4 py-2 font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-secondary)]">
            Comparing March 2025 vs February 2025
          </div>
        )}

        <div className="mt-6 flex gap-2 overflow-x-auto hide-scrollbar">
          <button onClick={() => toggleGateway('all')} className={`px-3 py-1.5 rounded-full text-[13px] border whitespace-nowrap flex items-center ${activeGateways.includes('all') ? 'bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[var(--text-primary)]' : 'border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'}`}>All gateways <ChevronDown size={14} className="ml-1" /></button>
          <button onClick={() => toggleGateway('razorpay')} className={`px-3 py-1.5 rounded-full text-[13px] border whitespace-nowrap flex items-center gap-1.5 ${activeGateways.includes('razorpay') ? 'bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[var(--text-primary)]' : 'border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'}`}><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div> Razorpay</button>
          <button onClick={() => toggleGateway('stripe')} className={`px-3 py-1.5 rounded-full text-[13px] border whitespace-nowrap flex items-center gap-1.5 ${activeGateways.includes('stripe') ? 'bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[var(--text-primary)]' : 'border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'}`}><div className="w-2 h-2 rounded-full bg-[#6366f1]"></div> Stripe</button>
          <button onClick={() => toggleGateway('cashfree')} className={`px-3 py-1.5 rounded-full text-[13px] border whitespace-nowrap flex items-center gap-1.5 ${activeGateways.includes('cashfree') ? 'bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[var(--text-primary)]' : 'border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'}`}><div className="w-2 h-2 rounded-full bg-[#f97316]"></div> Cashfree</button>
          <button onClick={() => toggleGateway('payu')} className={`px-3 py-1.5 rounded-full text-[13px] border whitespace-nowrap flex items-center gap-1.5 ${activeGateways.includes('payu') ? 'bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[var(--text-primary)]' : 'border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'}`}><div className="w-2 h-2 rounded-full bg-[#10b981]"></div> PayU</button>
        </div>
      </div>

      {/* SECTION B — EXECUTIVE SUMMARY STRIP */}
      <div className="px-8 mt-6 overflow-hidden">
        <div 
          className="flex md:grid md:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2"
          onScroll={(e: any) => {
            const scrollLeft = e.target.scrollLeft;
            const width = e.target.offsetWidth;
            const index = Math.round(scrollLeft / 180); // 160px width + 16px gap
            if (index !== activeKPIIndex) setActiveKPIIndex(index);
          }}
        >
          <div className="min-w-[160px] md:min-w-0 snap-center shrink-0">
            <KPICard title="Total recovered (30d)" value={formatINRLakh(24000000)} icon={TrendingUp} trend="↑ +₹18,400 vs last month" subtext={<div className="flex items-center gap-2 mt-1"><div className="flex-1 h-[3px] bg-[var(--bg-overlay)] rounded-full overflow-hidden"><div className="h-full bg-[var(--accent-green)] w-[78%]"></div></div><span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap">78% of ₹3.08L risk</span></div>} iconColor="var(--accent-green-dim)" isAmount={true} isLoading={isLoading} />
          </div>
          <div className="min-w-[160px] md:min-w-0 snap-center shrink-0">
            <KPICard title="Recovery rate (30d)" value="78" icon={Percent} trend="+12% vs Razorpay baseline (38%)" iconColor="rgba(16,185,129,0.15)" isArc={true} isLoading={isLoading} />
          </div>
          <div className="min-w-[160px] md:min-w-0 snap-center shrink-0">
            <KPICard title="Currently at risk" value={formatINRLakh(6800000)} icon={AlertTriangle} trend="green|↓ -₹4,200 vs last month" subtext="28 payments · active recovery running" iconColor="var(--accent-amber-dim)" valueColor="var(--accent-amber)" isLoading={isLoading} />
          </div>
          <div className="min-w-[160px] md:min-w-0 snap-center shrink-0">
            <KPICard title="fynback ROI" value="34.3×" icon={ArrowUpRight} trend="green|↑ from 28.1× last month" subtext="₹2,40,000 recovered / ₹6,999 plan cost" iconColor="rgba(59,130,246,0.15)" isLoading={isLoading} />
          </div>
          <div className="min-w-[160px] md:min-w-0 snap-center shrink-0">
            <KPICard title="Avg recovery time" value="2.4 days" icon={Clock} trend="↓ 0.3 days faster than last month" subtext="Fastest: 4h · Slowest: 11d" iconColor="rgba(139,92,246,0.15)" isLoading={isLoading} />
          </div>
          <div className="min-w-[160px] md:min-w-0 snap-center shrink-0">
            <KPICard title="Payments processed" value="1,847" icon={Activity} trend="↑ +143 vs last month" iconColor="rgba(59,130,246,0.15)" isSparkline={true} isLoading={isLoading} />
          </div>
        </div>
        {/* Mobile Dot Indicators */}
        <div className="flex md:hidden justify-center gap-1.5 mt-3">
          {[0,1,2,3,4,5].map(i => (
            <div key={i} className={`w-1 h-1 rounded-full ${i === activeKPIIndex ? 'bg-[var(--accent-blue)] scale-125' : 'bg-[var(--border-strong)]'}`}></div>
          ))}
        </div>
      </div>

      {/* SECTION C — PRIMARY CHART */}
      <div className="px-8 mt-6 relative">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[14px] p-[24px_28px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[16px] text-[var(--text-primary)]">Revenue recovery timeline</h2>
              <p className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)]">Daily failed payments vs recovered revenue</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setAnnotationMode(!annotationMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-['DM_Sans',sans-serif] text-[13px] transition-colors ${annotationMode ? 'border-[var(--accent-blue)] bg-[var(--accent-blue-dim)] text-[var(--accent-blue)]' : 'border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'}`}
              >
                <Flag size={14} /> {annotationMode ? 'Click chart to add' : 'Add annotation'}
              </button>
              <button onClick={handleCopyLink} className="flex items-center justify-center w-[30px] h-[30px] rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="Copy shareable link"><LinkIcon size={14} /></button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-default)] font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors no-print">Area <ChevronDown size={14} /></button>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-[2px] bg-[var(--accent-red)] opacity-60"></div><span className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-secondary)]">Failed</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-[2px] bg-[var(--accent-green)]"></div><span className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-secondary)]">Recovered</span></div>
                {compareMode && <div className="flex items-center gap-1.5"><div className="w-4 border-t-2 border-dashed border-[rgba(148,163,184,0.5)]"></div><span className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-secondary)]">Previous period</span></div>}
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"><Download size={16} /></button>
            </div>
          </div>

          <div className="w-full h-[200px] md:h-[320px]">
            {isLoading ? <div className="w-full h-full skeleton rounded-lg"></div> : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={enhancedTimelineData} 
                  margin={{ top: 20, right: 10, bottom: 0, left: 0 }}
                  onClick={(e) => {
                    if (e && e.activeLabel) {
                      if (annotationMode) {
                        const text = window.prompt(`Enter annotation for ${e.activeLabel}:`);
                        if (text) setAnnotations([...annotations, { date: String(e.activeLabel), text }]);
                        setAnnotationMode(false);
                      } else {
                        const payload = e.activePayload?.[0]?.payload;
                        if (payload) setSelectedDateInfo(payload);
                      }
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontFamily: 'DM Sans' }} minTickGap={20} />
                  <YAxis className="hide-y-mobile" tickLine={false} axisLine={false} tickFormatter={(val) => formatINRLakh(val * 100)} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontFamily: 'JetBrains Mono' }} />
                  <RechartsTooltip content={<ChartTooltip isTimeline={true} />} cursor={{ fill: 'var(--bg-elevated)', opacity: 0.4 }} />
                  {compareMode && <Area type="monotone" dataKey="recoveredPrev" stroke="rgba(148,163,184,0.3)" fill="none" strokeDasharray="5 5" strokeWidth={2} isAnimationActive={true} animationDuration={800} />}
                  <Bar dataKey="failed" fill="var(--accent-red)" fillOpacity={0.6} radius={[2,2,0,0]} isAnimationActive={true} animationDuration={800} />
                  <Area type="monotone" dataKey="recovered" stroke="var(--accent-green)" strokeWidth={2} fill="var(--accent-green-dim)" isAnimationActive={true} animationDuration={800} />
                  
                  {/* Default reference lines */}
                  <ReferenceLine x="Mar 15" stroke="var(--accent-amber)" strokeDasharray="3 3" label={{ position: 'top', value: 'Monthly peak', fill: 'var(--accent-amber)', fontSize: 11 }} />
                  <ReferenceLine x="Mar 25" stroke="var(--accent-green)" strokeDasharray="3 3" label={{ position: 'top', value: 'Payday ↑', fill: 'var(--accent-green-text)', fontSize: 11 }} />
                  
                  {/* Active highlight line if selected */}
                  {selectedDateInfo && <ReferenceLine x={selectedDateInfo.date} stroke="var(--accent-blue)" strokeWidth={2} />}

                  {/* Annotations */}
                  {annotations.map((ann, i) => (
                    <ReferenceLine key={i} x={ann.date} stroke="transparent" label={({ viewBox }: any) => (
                      <g transform={`translate(${viewBox.x}, ${viewBox.y - 10})`}>
                        <foreignObject width="100" height="30" x="-10" y="-20" className="overflow-visible">
                          <div className="group relative">
                            <Flag size={14} className="text-[var(--accent-blue)] cursor-pointer drop-shadow-md" />
                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[11px] text-[var(--text-primary)] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-['DM_Sans',sans-serif] pointer-events-none z-10 shadow-lg">
                              {ann.text}
                            </div>
                          </div>
                        </foreignObject>
                      </g>
                    )} />
                  ))}

                   <Brush dataKey="date" height={30} stroke="var(--accent-blue-dim)" fill="var(--bg-overlay)" tickFormatter={() => ''} travellerWidth={10} startIndex={Math.max(0, timelineData.length - 14)} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--border-default)] flex flex-wrap gap-8">
            <div>
              <div className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-muted)] mb-1">Total failed</div>
              <div className="font-['JetBrains_Mono',monospace] text-[15px]">{formatINR(30800000)}</div>
            </div>
            <div>
              <div className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-muted)] mb-1">Total recovered</div>
              <div className="font-['JetBrains_Mono',monospace] text-[15px] text-[var(--accent-green-text)]">{formatINR(24000000)}</div>
            </div>
            <div>
              <div className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-muted)] mb-1">Best day</div>
              <div className="font-['JetBrains_Mono',monospace] text-[15px]">Mar 15 · {formatINR(39040000)} <span className="text-[var(--text-muted)] text-[12px] font-['DM_Sans',sans-serif] ml-2">80% rate</span></div>
            </div>
            <div>
              <div className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-muted)] mb-1">Recovery gap</div>
              <div className="font-['JetBrains_Mono',monospace] text-[15px]">{formatINR(6800000)}</div>
            </div>
          </div>
        </div>

        {/* Slider Panel for Data Point Click */}
        <div className={`fixed top-0 right-0 h-full w-[360px] bg-[var(--bg-surface)] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] border-l border-[var(--border-strong)] z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${selectedDateInfo ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedDateInfo && (
            <>
              <div className="p-6 border-b border-[var(--border-default)] flex items-center justify-between">
                <div>
                   <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[18px] text-[var(--text-primary)]">{selectedDateInfo.date}</h3>
                   <span className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)]">Daily Breakdown</span>
                </div>
                <button onClick={() => setSelectedDateInfo(null)} className="p-2 hover:bg-[var(--bg-elevated)] rounded-full transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X size={18} /></button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-6">
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-[var(--bg-elevated)] p-4 rounded-[10px] border border-[var(--border-default)]">
                      <div className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-muted)] mb-1">Total failed</div>
                      <div className="font-['JetBrains_Mono',monospace] text-[16px] text-[var(--accent-red)]">{formatINR(selectedDateInfo.failed * 100)}</div>
                   </div>
                   <div className="bg-[var(--bg-elevated)] p-4 rounded-[10px] border border-[var(--border-default)]">
                      <div className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-muted)] mb-1">Recovered</div>
                      <div className="font-['JetBrains_Mono',monospace] text-[16px] text-[var(--accent-green-text)]">{formatINR(selectedDateInfo.recovered * 100)}</div>
                   </div>
                </div>

                <div className="flex items-center gap-4 bg-[var(--bg-elevated)] p-4 rounded-[10px] border border-[var(--border-default)]">
                   <div className="w-[60px] h-[60px] relative shrink-0">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[{name:'Recovered', value: selectedDateInfo.recovered}, {name:'Failed', value: selectedDateInfo.failed - selectedDateInfo.recovered}]}
                            innerRadius={20}
                            outerRadius={30}
                            dataKey="value"
                            stroke="none"
                            startAngle={90}
                            endAngle={-270}
                            isAnimationActive={false}
                          >
                             <Cell fill="var(--accent-green)" />
                             <Cell fill="var(--accent-red)" opacity={0.4} />
                          </Pie>
                        </PieChart>
                     </ResponsiveContainer>
                   </div>
                   <div>
                      <div className="font-['JetBrains_Mono',monospace] text-[20px] text-[var(--accent-green-text)] font-semibold">
                         {Math.round((selectedDateInfo.recovered / selectedDateInfo.failed) * 100)}%
                      </div>
                      <div className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-muted)]">Recovery rate</div>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   <h4 className="font-['DM_Sans',sans-serif] font-medium text-[13px] text-[var(--text-muted)] uppercase tracking-wider">Top Drivers</h4>
                   <div className="flex justify-between items-center py-2 border-b border-[var(--border-default)]">
                     <span className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-primary)] flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-amber)]"></div>Insufficient funds</span>
                     <span className="font-['JetBrains_Mono',monospace] text-[13px] text-[var(--text-muted)]">31 events</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-[var(--border-default)]">
                     <span className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-primary)] flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>Razorpay</span>
                     <span className="font-['JetBrains_Mono',monospace] text-[13px] text-[var(--text-muted)]">{formatINR(29200000)}</span>
                   </div>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                   <h4 className="font-['DM_Sans',sans-serif] font-medium text-[13px] text-[var(--text-muted)] uppercase tracking-wider">Outreach Activity</h4>
                   <div className="bg-[var(--bg-elevated)] rounded-[8px] p-4 text-[13px] font-['DM_Sans',sans-serif] flex flex-col gap-3">
                      <div className="flex justify-between">
                         <span className="text-[var(--text-secondary)]">Active campaigns</span>
                         <span className="font-['JetBrains_Mono',monospace] text-[var(--text-primary)]">31 triggered</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-[var(--text-secondary)] flex items-center gap-1.5"><MessageCircle size={14} className="text-[#10b981]" /> WhatsApp</span>
                         <span className="font-['JetBrains_Mono',monospace] text-[var(--text-primary)]">28 sent · 26 opened</span>
                      </div>
                   </div>
                </div>

              </div>
              <div className="p-4 border-t border-[var(--border-default)]">
                 <button className="w-full py-2.5 bg-[var(--accent-blue-dim)] text-[var(--accent-blue)] rounded-[8px] font-['DM_Sans',sans-serif] text-[13px] font-medium hover:bg-opacity-80 transition-colors">View full daily log &rarr;</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SECTION D — SECOND ROW: Cohort Analysis + MRR Impact */}
      <div className="px-8 mt-6">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Card D1 — Monthly Cohort Recovery Analysis (55%) */}
          <div className="xl:w-[55%] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[14px] p-[24px_28px]">
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[16px] text-[var(--text-primary)] mb-1">Recovery cohort analysis</h2>
            <p className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)] mb-6">How each month's failures ultimately resolved</p>
            <div className="h-[260px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={cohortData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" horizontal={false} />
                     <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 12, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                     <YAxis type="category" dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} width={80} />
                     <RechartsTooltip cursor={{ fill: 'var(--bg-elevated)', opacity: 0.4 }} shared={false} content={<CohortTooltip />} />
                     <Bar dataKey="retry" name="Recovered via retry" stackId="a" fill="var(--accent-green)" isAnimationActive={true} animationDuration={600} animationBegin={0} />
                     <Bar dataKey="email" name="Recovered via email" stackId="a" fill="var(--accent-blue)" isAnimationActive={true} animationDuration={600} animationBegin={80} />
                     <Bar dataKey="whatsapp" name="Recovered via WhatsApp" stackId="a" fill="#10b981" fillOpacity={0.7} isAnimationActive={true} animationDuration={600} animationBegin={160} />
                     <Bar dataKey="recovering" name="Still recovering" stackId="a" fill="var(--accent-amber)" fillOpacity={0.6} isAnimationActive={true} animationDuration={600} animationBegin={240} />
                     <Bar dataKey="lost" name="Lost (unrecoverable)" stackId="a" fill="var(--accent-red)" fillOpacity={0.4} isAnimationActive={true} animationDuration={600} animationBegin={320} />
                  </RechartsBarChart>
               </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 mb-4">
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-[2px] bg-[var(--accent-green)]"></div><span className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-secondary)]">Retry</span></div>
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-[2px] bg-[var(--accent-blue)]"></div><span className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-secondary)]">Email</span></div>
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-[2px] bg-[#10b981] opacity-70"></div><span className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-secondary)]">WhatsApp</span></div>
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-[2px] bg-[var(--accent-amber)] opacity-60"></div><span className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-secondary)]">Recovering</span></div>
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-[2px] bg-[var(--accent-red)] opacity-40"></div><span className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-secondary)]">Lost</span></div>
            </div>

            <div className="mt-6 border-t border-[var(--border-strong)] pt-4">
               <h3 className="font-['DM_Sans',sans-serif] text-[13px] font-medium text-[var(--text-primary)] mb-3">Channel Contribution Trend</h3>
               <div className="overflow-x-auto hide-scrollbar">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-[var(--border-default)]">
                       <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] pb-2 pr-4 font-normal">Channel</th>
                       {cohortData.map(d => <th key={d.month} className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] pb-2 px-2 font-normal text-right">{d.month}</th>)}
                       <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] pb-2 pl-4 font-normal text-right">Δ</th>
                     </tr>
                   </thead>
                   <tbody className="font-['JetBrains_Mono',monospace] text-[12px] text-[var(--text-secondary)]">
                     <tr className="border-b border-[var(--border-overlay)] hover:bg-[var(--bg-elevated)] transition-colors">
                       <td className="font-['DM_Sans',sans-serif] py-2.5 pr-4 text-[var(--text-primary)] flex items-center gap-1.5"><div className="w-2 h-2 rounded-[2px] bg-[var(--accent-green)]"></div> Auto-retry</td>
                       {cohortData.map((d: any) => <td key={d.month} className="py-2.5 px-2 text-right">{d.retry}%</td>)}
                       <td className="py-2.5 pl-4 text-right text-[var(--accent-red)]">-6%</td>
                     </tr>
                     <tr className="border-b border-[var(--border-overlay)] hover:bg-[var(--bg-elevated)] transition-colors">
                       <td className="font-['DM_Sans',sans-serif] py-2.5 pr-4 text-[var(--text-primary)] flex items-center gap-1.5"><div className="w-2 h-2 rounded-[2px] bg-[var(--accent-blue)]"></div> Email</td>
                       {cohortData.map((d: any) => <td key={d.month} className="py-2.5 px-2 text-right">{d.email}%</td>)}
                       <td className="py-2.5 pl-4 text-right text-[var(--text-muted)]">+0%</td>
                     </tr>
                     <tr className="hover:bg-[var(--bg-elevated)] transition-colors">
                       <td className="font-['DM_Sans',sans-serif] py-2.5 pr-4 text-[var(--text-primary)] flex items-center gap-1.5"><div className="w-2 h-2 rounded-[2px] bg-[#10b981]"></div> WhatsApp</td>
                       {cohortData.map((d: any) => <td key={d.month} className="py-2.5 px-2 text-right">{d.whatsapp}%</td>)}
                       <td className="py-2.5 pl-4 text-right text-[var(--accent-green-text)]">+5%</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </div>

            <div className="mt-4 border border-[var(--border-default)] rounded-[8px] overflow-hidden">
               <button 
                 onClick={() => setIsCohortExpanded(!isCohortExpanded)}
                 className="w-full flex items-center justify-between p-3 bg-[var(--bg-elevated)] hover:bg-[var(--bg-overlay)] transition-colors font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-primary)] font-medium text-left"
               >
                 <span>What does this mean?</span>
                 <ChevronDown size={14} className={`transform transition-transform ${isCohortExpanded ? 'rotate-180' : ''}`} />
               </button>
               <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCohortExpanded ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                 <div className="p-4 bg-[var(--bg-surface)] font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-default)]">
                   This cohort analysis tracks the ultimate fate of failed payments starting from the month they originated. We can see that recovery via WhatsApp has grown from 14% to 19% over the last 6 months, contributing significantly to a higher overall recovery rate. Meanwhile, standard auto-retries are slowly losing effectiveness (dropping by 6%), highlighting the importance of our multi-channel outreach.
                 </div>
               </div>
            </div>
          </div>

          {/* Card D2 — MRR Impact Analysis (45%) */}
          <div className="xl:w-[45%] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[14px] p-[24px_28px] flex flex-col">
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[16px] text-[var(--text-primary)] mb-1">MRR impact</h2>
            <p className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)] mb-6">What fynback contributes to your monthly revenue</p>
            
            <div className="flex flex-col items-center justify-center my-4">
              <span className="font-['JetBrains_Mono',monospace] font-bold text-[32px] text-[var(--accent-green-text)] money-shimmer">{formatINRLakh(24000000)}</span>
              <span className="font-['DM_Sans',sans-serif] text-[14px] text-[var(--text-primary)] font-medium mt-1">Recovered MRR</span>
              <span className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)]">(effectively your real MRR protection)</span>
            </div>

            <div className="flex flex-col gap-3 mt-6 flex-1">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-end"><span className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)]">Starting MRR at risk</span><span className="font-['JetBrains_Mono',monospace] text-[13px] text-[var(--text-primary)]">{formatINR(30800000)}</span></div>
                <div className="w-full h-2 bg-[var(--bg-overlay)] rounded-full overflow-hidden flex"><div className="h-full bg-[var(--accent-red)] w-[100%] transition-all duration-1000"></div></div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-end"><span className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)]">− Hard declines</span><span className="font-['JetBrains_Mono',monospace] text-[13px] text-[var(--accent-red)]">-{formatINR(2800000)}</span></div>
                <div className="w-full h-2 bg-[var(--bg-overlay)] rounded-full overflow-hidden flex justify-end"><div className="h-full bg-[var(--accent-red)] w-[9%] transition-all duration-1000"></div></div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-end"><span className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)]">− Campaign recovered</span><span className="font-['JetBrains_Mono',monospace] text-[13px] text-[var(--accent-green-text)]">+{formatINR(21200000)}</span></div>
                <div className="w-full h-2 bg-[var(--bg-overlay)] rounded-full overflow-hidden flex justify-end"><div className="h-full bg-[var(--accent-green)] w-[68%] transition-all duration-1000"></div></div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-end"><span className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)]">− Payday timing boost</span><span className="font-['JetBrains_Mono',monospace] text-[13px] text-[var(--accent-green-text)]">+{formatINR(2800000)}</span></div>
                <div className="w-full h-2 bg-[var(--bg-overlay)] rounded-full overflow-hidden flex justify-end"><div className="h-full bg-[var(--accent-green)] w-[9%] transition-all duration-1000"></div></div>
              </div>
              <div className="flex flex-col gap-1.5 mt-2 border-t border-[var(--border-default)] pt-3">
                <div className="flex justify-between items-end"><span className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-primary)] font-medium">Net recovered</span><span className="font-['JetBrains_Mono',monospace] text-[13px] text-[var(--accent-green-text)] font-bold">{formatINR(24000000)}</span></div>
                <div className="w-full h-2 bg-[var(--bg-overlay)] rounded-full overflow-hidden flex justify-end"><div className="h-full bg-[var(--accent-green)] w-[78%] transition-all duration-1000"></div></div>
              </div>
            </div>

            <div className="bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-[8px] p-[12px_16px] mt-6 flex flex-col gap-1 font-['JetBrains_Mono',monospace] text-[13px]">
               <div className="text-[var(--text-muted)] font-['DM_Sans',sans-serif] mb-1">At current rate:</div>
               <div className="text-[var(--text-primary)]">{formatINR(288000000)} / year protected by fynback</div>
               <div className="text-[var(--text-secondary)]">vs {formatINR(4560000)} / year plan cost</div>
               <div className="text-[var(--accent-green-text)] font-bold mt-1">= 63.2× annual ROI</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION F — DECLINE CODE INTELLIGENCE */}
      <div className="px-8 mt-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[14px] p-[24px_28px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[16px] text-[var(--text-primary)]">Decline code intelligence</h2>
              <p className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)]">When and why payments fail</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-default)] font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors">All codes <ChevronDown size={14} /></button>
              <span onClick={downloadHeatmapCSV} className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--accent-blue)] cursor-pointer hover:underline">Export data</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-['DM_Sans',sans-serif] font-medium text-[14px] text-[var(--text-primary)] mb-1">Failure frequency heatmap · March 2025</h3>
                <p className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-muted)]">Day of week × time of day · {heatmapView === 'recovery' ? 'green = best time to retry' : 'color = intensity'}</p>
              </div>
              <div className="flex items-center bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] p-1">
                <button onClick={() => setHeatmapView('failures')} className={`px-3 py-1.5 text-[12px] font-medium font-['DM_Sans',sans-serif] rounded-[6px] transition-colors ${heatmapView === 'failures' ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Failure count ▾</button>
                <button onClick={() => setHeatmapView('recovery')} className={`px-3 py-1.5 text-[12px] font-medium font-['DM_Sans',sans-serif] rounded-[6px] transition-colors ${heatmapView === 'recovery' ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Recovery rate</button>
                <button onClick={() => setHeatmapView('revenue')} className={`px-3 py-1.5 text-[12px] font-medium font-['DM_Sans',sans-serif] rounded-[6px] transition-colors ${heatmapView === 'revenue' ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Revenue at risk</button>
              </div>
            </div>
            
            <div className="hidden md:block w-full overflow-x-auto hide-scrollbar pb-4" onMouseLeave={() => { setHoveredRow(null); setHoveredCol(null); }}>
               <div className="grid grid-cols-[80px_repeat(7,minmax(40px,1fr))] gap-1 min-w-[400px]">
                 <div className="col-start-2 col-end-9 grid grid-cols-7 gap-1">
                   {days.map(d => <div key={d} className={`text-center font-['DM_Sans',sans-serif] text-[11px] pb-2 transition-colors ${hoveredCol === d ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-muted)]'}`} onMouseEnter={() => setHoveredCol(d)}>{d}</div>)}
                 </div>
                 {timeBlocks.map((time) => (
                   <React.Fragment key={time}>
                     <div onMouseEnter={() => setHoveredRow(time)} className={`flex items-center justify-end pr-3 font-['DM_Sans',sans-serif] text-[11px] whitespace-nowrap transition-colors ${hoveredRow === time ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-muted)]'}`}>{time}</div>
                     <div className="grid grid-cols-7 gap-1">
                        {days.map(day => {
                           const cell = heatmapData.find(h => h.day === day && h.time === time);
                           const isSelected = selectedCell?.day === day && selectedCell?.time === time;
                           return <HeatmapCell key={day} day={day} time={time} cell={cell} 
                                      onClick={(d: string, t: string, c: any) => setSelectedCell(isSelected ? null : {day: d, time: t, cell: c})} 
                                      onMouseEnter={(d: string, t: string) => { setHoveredCol(d); setHoveredRow(t); }} 
                                      onMouseLeave={() => { setHoveredCol(null); setHoveredRow(null); }} 
                                      isHoveredRow={hoveredRow === time} isHoveredCol={hoveredCol === day}
                                      viewBy={heatmapView} isSelected={isSelected} />;
                        })}
                     </div>
                   </React.Fragment>
                 ))}
               </div>
            </div>

            {/* Mobile Heatmap Fallback */}
            <div className="md:hidden flex flex-col gap-3">
               <h4 className="font-['DM_Sans',sans-serif] font-medium text-[13px] text-[var(--accent-red)] mb-1">Top 5 Critical Failure Windows</h4>
               {[
                 { time: "Thu 9am–12pm", failures: 47, rate: 71, color: "var(--accent-red)" },
                 { time: "Mon 2pm–5pm", failures: 38, rate: 68, color: "#f97316" },
                 { time: "Wed 6pm–9pm", failures: 32, rate: 74, color: "#f97316" },
                 { time: "Fri 10am–1pm", failures: 29, rate: 76, color: "var(--accent-amber)" },
                 { time: "Tue 3pm–6pm", failures: 25, rate: 79, color: "var(--accent-amber)" }
               ].map((slot, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg">
                    <div className="flex flex-col">
                       <span className="font-['DM_Sans',sans-serif] font-medium text-[14px] text-[var(--text-primary)]">{slot.time}</span>
                       <span className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-muted)]">{slot.failures} failures · {slot.rate}% recovery</span>
                    </div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: slot.color }}></div>
                 </div>
               ))}
            </div>

            <div className="hidden md:flex items-center gap-3 mt-4">
               <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">{heatmapView === 'recovery' ? '0%' : '0'}</span>
               <div className="w-[120px] h-2 rounded-full" style={{ background: heatmapView === 'recovery' ? 'linear-gradient(90deg, rgba(239,68,68,0.6), rgba(245,158,11,0.5), rgba(16,185,129,0.8))' : 'linear-gradient(90deg, rgba(239,68,68,0.1), rgba(239,68,68,0.9))' }}></div>
               <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">{heatmapView === 'recovery' ? '100%' : heatmapView === 'revenue' ? 'High exposure' : '50+'}</span>
            </div>
          </div>

          <div className="w-full overflow-x-auto hide-scrollbar">
            <h3 className="font-['DM_Sans',sans-serif] font-medium text-[14px] text-[var(--text-primary)] mb-4">Decline code breakdown</h3>
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-[var(--border-strong)]">
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3">Decline code</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 text-right">Count</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 text-right">Failure ₹</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 text-right">Recovered ₹</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 pl-6 w-[140px]">Rate</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 text-right">Avg attempts</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="font-['DM_Sans',sans-serif] text-[13px]">
                {declineCodes.map(row => (
                  <tr key={row.code} className={`border-b border-[var(--border-default)] hover:bg-[var(--bg-elevated)] transition-colors ${row.code === 'stolen_card' ? 'opacity-50' : ''}`}>
                    <td className="py-3 pr-4">
                      <div className="font-['JetBrains_Mono',monospace] text-[12px] text-[var(--text-muted)] mb-0.5">{row.code}</div>
                      <div className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-primary)]">{row.label}</div>
                    </td>
                    <td className="py-3 font-['JetBrains_Mono',monospace] text-[var(--text-primary)] text-right">{row.count}</td>
                    <td className="py-3 font-['JetBrains_Mono',monospace] text-[var(--accent-red)] text-right">{formatINR(row.failedAmount * 100)}</td>
                    <td className="py-3 font-['JetBrains_Mono',monospace] text-[var(--accent-green-text)] text-right">{formatINR(row.recoveredAmount * 100)}</td>
                    <td className="py-3 pl-6">
                      {row.code === 'stolen_card' ? (
                         <span className="inline-block bg-[rgba(239,68,68,0.15)] text-[var(--accent-red)] px-1.5 py-0.5 rounded text-[11px] font-medium">Hard decline</span>
                      ) : (
                         <>
                           <span className={`font-['JetBrains_Mono',monospace] ${row.rate > 70 ? 'text-[var(--accent-green)]' : row.rate > 50 ? 'text-[var(--accent-blue)]' : row.rate > 30 ? 'text-[var(--accent-amber)]' : 'text-[var(--accent-red)]'}`}>{row.rate}%</span>
                           <div className="w-full h-1 bg-[var(--bg-overlay)] mt-1 rounded-sm overflow-hidden"><div className="h-full transition-all duration-1000" style={{ backgroundColor: row.rate > 70 ? 'var(--accent-green)' : row.rate > 50 ? 'var(--accent-blue)' : row.rate > 30 ? 'var(--accent-amber)' : 'var(--accent-red)', width: `${row.rate}%` }}></div></div>
                         </>
                      )}
                    </td>
                    <td className="py-3 font-['JetBrains_Mono',monospace] text-right">
                       <span className={row.avgAttempts < 2 ? 'text-[var(--accent-green)]' : row.avgAttempts < 3 ? 'text-[var(--accent-amber)]' : 'text-[var(--accent-red)]'}>{row.avgAttempts.toFixed(1)}</span>
                    </td>
                    <td className="py-3 text-right">
                       <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium ${row.trend === 'up' && row.code!=='stolen_card' ? 'bg-[rgba(239,68,68,0.15)] text-[var(--accent-red)]' : row.trend === 'down' ? 'bg-[var(--accent-green-dim)] text-[var(--accent-green-text)]' : 'text-[var(--text-muted)]'}`}>
                          {row.trend === 'up' ? '↑' : row.trend === 'down' ? '↓' : '→'} {row.trendPct}%
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION G — CAMPAIGN PERFORMANCE TABLE */}
      <div className="px-8 mt-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[14px] p-[24px_28px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[16px] text-[var(--text-primary)]">Campaign performance</h2>
            <div className="flex items-center gap-4">
              <span className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--accent-blue)] cursor-pointer hover:underline">New campaign &rarr;</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-default)] font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors">30D <ChevronDown size={14} /></button>
            </div>
          </div>
          
          <div className="w-full overflow-x-auto hide-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-[var(--border-strong)]">
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3">Campaign name</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3">Status</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 text-right">Customers</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 text-right">Recovered ₹</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 pl-6 w-[120px]">Rate</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 text-right">Emails sent</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 text-right">WA sent</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="font-['DM_Sans',sans-serif] text-[13px]">
                {campaigns.map(c => (
                  <tr key={c.name} className="border-b border-[var(--border-default)] hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="py-4 pr-4">
                      <div className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[14px] text-[var(--text-primary)] mb-0.5">{c.name}</div>
                      <div className="font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-muted)]">{c.description}</div>
                    </td>
                    <td className="py-4">
                       <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${c.status === 'active' ? 'bg-[var(--accent-green-dim)] text-[var(--accent-green-text)]' : 'bg-[var(--accent-amber-dim)] text-[var(--accent-amber)]'}`}>{c.status === 'active' ? 'Active' : 'Paused'}</span>
                    </td>
                    <td className="py-4 font-['JetBrains_Mono',monospace] text-[var(--text-primary)] text-right">{c.customers}</td>
                    <td className="py-4 font-['JetBrains_Mono',monospace] text-[var(--accent-green-text)] text-right money-shimmer">{formatINRLakh(c.recoveredAmount * 100)}</td>
                    <td className="py-4 pl-6 flex items-center gap-2 h-full min-h-[56px]">
                       <span className={`font-['JetBrains_Mono',monospace] ${c.rate > 70 ? 'text-[var(--accent-green)]' : c.rate > 50 ? 'text-[var(--accent-blue)]' : 'text-[var(--accent-amber)]'}`}>{c.rate}%</span>
                       <div className="w-6 h-6 rounded-full flex items-center justify-center animated-arc shrink-0" style={{ background: `conic-gradient(${c.rate > 70 ? 'var(--accent-green)' : c.rate > 50 ? 'var(--accent-blue)' : 'var(--accent-amber)'} ${c.rate}%, var(--bg-overlay) ${c.rate}%)` }}>
                         <div className="w-4 h-4 rounded-full bg-[var(--bg-surface)]"></div>
                       </div>
                    </td>
                    <td className="py-4 text-right">
                       <div className="font-['JetBrains_Mono',monospace] text-[13px] text-[var(--text-primary)]">{c.emailsSent}</div>
                       <div className="font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-muted)]">{c.emailOpenRate}% open</div>
                    </td>
                    <td className="py-4 text-right">
                       <div className="font-['JetBrains_Mono',monospace] text-[13px] text-[var(--text-primary)]">{c.waSent}</div>
                       <div className="font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-muted)]">{c.waReadRate}% read</div>
                    </td>
                    <td className="py-4 text-center">
                       <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 rounded hover:bg-[var(--bg-overlay)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="Edit"><FileText size={15} /></button>
                          <button className="p-1.5 rounded hover:bg-[var(--bg-overlay)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="View details"><Activity size={15} /></button>
                          <button className="p-1.5 rounded hover:bg-[var(--bg-overlay)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="More"><MoreHorizontal size={15} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-[var(--accent-amber-dim)] border-l-[3px] border-[var(--accent-amber)] rounded-r-md p-[10px_14px] font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-secondary)] leading-relaxed mt-4">
             The 7-Day Aggressive campaign outperforms Standard Recovery by 11 points (82% vs 71%). Consider applying its retry schedule to Stripe customers.
          </div>
        </div>
      </div>

      {/* SECTION H — CUSTOMER RECOVERY LEADERBOARD */}
      <div className="px-8 mt-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[14px] p-[24px_28px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[16px] text-[var(--text-primary)]">Top recovered customers</h2>
              <p className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)]">Highest-value recoveries this month</p>
            </div>
            <span className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--accent-blue)] cursor-pointer hover:underline">View all customers &rarr;</span>
          </div>

          <div className="hidden md:block w-full overflow-x-auto hide-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-[var(--border-strong)]">
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 w-[60px] text-right pr-4">Rank</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3">Customer</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3">Gateway</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 text-right">Amount</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 pl-8">Recovered via</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 text-right">Time to recover</th>
                  <th className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[var(--text-muted)] uppercase pb-3 text-right">Recovery date</th>
                </tr>
              </thead>
              <tbody className="font-['DM_Sans',sans-serif] text-[13px]">
                {topRecoveries.map(t => (
                  <tr key={t.rank} className="border-b border-[var(--border-default)] hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className={`py-3 pr-4 font-['JetBrains_Mono',monospace] font-semibold text-[16px] text-right ${t.rank === 1 ? 'text-[var(--accent-amber)] font-bold' : t.rank === 2 ? 'text-[var(--text-secondary)]' : t.rank === 3 ? 'text-[#b45309]' : 'text-[var(--text-muted)]'}`}>#{t.rank}</td>
                    <td className="py-3 flex items-center gap-3">
                       <div className="w-7 h-7 rounded-full bg-[var(--bg-overlay)] flex items-center justify-center font-medium text-[11px] text-[var(--text-secondary)] shrink-0">{t.email.substring(0,2).toUpperCase()}</div>
                       <div>
                         <div className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-primary)]">{t.email}</div>
                         <div className="font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-muted)]">{t.company}</div>
                       </div>
                    </td>
                    <td className="py-3">
                       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--bg-overlay)] text-[11px] capitalize text-[var(--text-secondary)]"><div className={`w-1.5 h-1.5 rounded-full ${t.gateway === 'razorpay' ? 'bg-[#3b82f6]' : t.gateway === 'stripe' ? 'bg-[#6366f1]' : 'bg-[#f97316]'}`}></div>{t.gateway}</span>
                    </td>
                    <td className={`py-3 font-['JetBrains_Mono',monospace] font-bold text-right ${t.rank <= 3 ? 'text-[18px] text-[var(--accent-green-text)] money-shimmer' : 'text-[15px] text-[var(--accent-green-text)]'}`}>
                       {formatINRLakh(t.amount * 100)}
                    </td>
                    <td className="py-3 pl-8">
                       <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                          {t.channel.includes('WA') || t.channel.includes('WhatsApp') ? <MessageCircle size={14} className="text-[#10b981]" /> : t.channel.includes('Email') ? <Mail size={14} className="text-[#3b82f6]" /> : t.channel.includes('retry') ? <RefreshCw size={14} className="text-[var(--accent-amber)]" /> : <ExternalLink size={14} className="text-[var(--text-muted)]" />}
                          <span className="text-[13px]">{t.channel}</span>
                       </div>
                    </td>
                    <td className="py-3 font-['JetBrains_Mono',monospace] text-right">
                       <span className={t.daysToRecover < 1 ? 'text-[var(--accent-green)]' : t.daysToRecover <= 3 ? 'text-[var(--accent-blue)]' : 'text-[var(--text-muted)]'}>{t.daysToRecover.toFixed(1)}d</span>
                    </td>
                    <td className="py-3 font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-muted)] text-right">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile-only Top 5 list */}
          <div className="md:hidden flex flex-col gap-4">
            {topRecoveries.slice(0, 5).map(t => (
              <div key={t.rank} className="flex items-center justify-between py-3 border-b border-[var(--border-default)] last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`font-['JetBrains_Mono',monospace] font-semibold text-[14px] ${t.rank === 1 ? 'text-[var(--accent-amber)]' : 'text-[var(--text-muted)]'}`}>#{t.rank}</div>
                  <div className="w-7 h-7 rounded-full bg-[var(--bg-overlay)] flex items-center justify-center font-medium text-[11px] text-[var(--text-secondary)] shrink-0">{t.email.substring(0,2).toUpperCase()}</div>
                  <div>
                    <div className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-primary)]">{t.email}</div>
                    <div className="font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-muted)]">{t.company}</div>
                  </div>
                </div>
                <div className={`font-['JetBrains_Mono',monospace] font-bold text-right text-[var(--accent-green-text)]`}>
                  {formatINRLakh(t.amount * 100)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--border-default)] flex justify-end">
             <div className="flex flex-col items-end">
                <div className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)] mb-1">Total recovered from top 10 customers: <span className="font-['JetBrains_Mono',monospace] text-[var(--accent-green-text)]">{formatINR(134770000)}</span></div>
                <div className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)]">As % of monthly recovery: <span className="font-['JetBrains_Mono',monospace] text-[var(--accent-green-text)]">56.1%</span></div>
             </div>
          </div>
        </div>
      </div>

      {/* SECTION I — PREDICTIVE INSIGHTS */}
      <div className="px-8 mt-6">
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[16px] text-[var(--text-primary)] mb-6">Predictive intelligence</h2>
        <div 
          className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
          onScroll={(e: any) => {
            const scrollLeft = e.target.scrollLeft;
            const width = e.target.offsetWidth;
            const index = Math.round(scrollLeft / (width * 0.85)); 
            if (index !== activeInsightIndex) setActiveInsightIndex(index);
          }}
        >
          {[
            { 
              icon: Clock, color: "var(--accent-blue)", title: "Optimal Retry Window",
              text: "Our model predicts that retrying failed payments from Mar 25–27 (payday cycle) will yield a 14.2% higher conversion."
            },
            { 
              icon: TrendingUp, color: "#10b981", title: "Churn Risk Alert",
              text: "14 high-value accounts (totaling ₹1.2L MRR) have failed 2+ times this week. High probability of intentional churn."
            },
            { 
              icon: Activity, color: "var(--accent-amber)", title: "Gateway Health",
              text: "Razorpay API latency is spiking (avg 1.4s). Shifting 15% of retry volume to Stripe could improve instant success rates."
            }
          ].map((insight, i) => (
            <div key={i} className="min-w-[280px] w-[85vw] md:w-auto snap-center shrink-0">
               <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[14px] p-6 h-full flex flex-col">
                 <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${insight.color}15`, color: insight.color }}><insight.icon size={20} /></div>
                 <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[15px] text-[var(--text-primary)] mb-2">{insight.title}</h3>
                 <p className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-muted)] leading-relaxed flex-1">{insight.text}</p>
                 <button className="mt-4 text-[13px] font-medium transition-colors hover:underline text-left" style={{ color: insight.color }}>Action &rarr;</button>
               </div>
            </div>
          ))}
        </div>
        <div className="flex md:hidden justify-center gap-1.5 mt-2">
          {[0,1,2].map(i => (
            <div key={i} className={`w-1 h-1 rounded-full ${i === activeInsightIndex ? 'bg-[var(--accent-blue)] scale-125' : 'bg-[var(--border-strong)]'}`}></div>
          ))}
        </div>
      </div>

      {/* SECTION J — RECOVERY FORECAST */}
      <div className="px-8 mt-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[14px] p-[24px_28px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[16px] text-[var(--text-primary)]">Recovery forecast</h2>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-default)] font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors">30D <ChevronDown size={14} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[10px] p-[18px]">
               <div className="font-['DM_Sans',sans-serif] font-medium text-[13px] text-[var(--text-muted)] mb-2">Next month's recovery</div>
               <div className="font-['JetBrains_Mono',monospace] font-semibold text-[20px] text-[var(--accent-green-text)] mb-2">₹2.5 Cr</div>
               <div className="font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-muted)] mb-3">Confidence: 84% · Based on current pipeline</div>
               <div className="inline-block bg-[var(--accent-green-dim)] text-[var(--accent-green-text)] px-1.5 py-0.5 rounded text-[11px] font-medium font-['DM_Sans',sans-serif]">↑ +7–14% vs this month</div>
            </div>
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[10px] p-[18px]">
               <div className="font-['DM_Sans',sans-serif] font-medium text-[13px] text-[var(--text-muted)] mb-2">Apr 1 payday window (4 days away)</div>
               <div className="font-['JetBrains_Mono',monospace] font-semibold text-[20px] text-[var(--accent-amber)] mb-2">₹42,000 eligible</div>
               <div className="font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-muted)] mb-3">17 insufficient-funds payments primed for retry</div>
               <button className="border border-[var(--accent-amber)] text-[var(--accent-amber)] rounded-md px-3 py-1 font-['DM_Sans',sans-serif] text-[12px] hover:bg-[var(--accent-amber-dim)] transition-colors">Pre-schedule retries &rarr;</button>
            </div>
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[10px] p-[18px]">
               <div className="font-['DM_Sans',sans-serif] font-medium text-[13px] text-[var(--text-muted)] mb-2">Untapped WhatsApp revenue</div>
               <div className="font-['JetBrains_Mono',monospace] font-semibold text-[20px] text-[var(--accent-green-text)] mb-2">₹37,200/mo potential</div>
               <div className="font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-muted)] mb-3">31 customers on email-only recovery</div>
               <button className="border border-[var(--accent-green)] text-[var(--accent-green-text)] rounded-md px-3 py-1 font-['DM_Sans',sans-serif] text-[12px] hover:bg-[var(--accent-green-dim)] transition-colors">Add WhatsApp &rarr;</button>
            </div>
          </div>

          <div className="w-full h-[160px] mb-4">
             <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontFamily: 'DM Sans' }} />
                   <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: 'var(--bg-elevated)', opacity: 0.4 }} />
                   <Line type="monotone" dataKey="actual" stroke="var(--accent-green)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent-green)' }} isAnimationActive={false} />
                   <Line type="monotone" dataKey="projected" stroke="var(--accent-green)" strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 3, fill: 'var(--bg-surface)', stroke: 'var(--accent-green)' }} isAnimationActive={false} />
                   <ReferenceLine x="Mar" stroke="var(--border-strong)" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: 'var(--text-muted)', fontSize: 11 }} />
                   <ReferenceLine x="Jun" stroke="transparent" label={{ position: 'top', value: '85% target', fill: 'var(--accent-green-text)', fontSize: 11 }} />
                </ComposedChart>
             </ResponsiveContainer>
          </div>
          
          <div className="font-['DM_Sans',sans-serif] text-[14px] text-[var(--text-secondary)]">
             Based on current trajectory, fynback will reach <span className="text-[var(--accent-green)] font-medium">85%</span> recovery rate by June 2025 — up from <span className="text-[var(--accent-green)] font-medium">66%</span> when you started in October.
          </div>
        </div>
      </div>

      {/* Schedule Report Modal */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isScheduleModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
         <div className={`bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all duration-300 ${isScheduleModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)]">
               <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[18px] text-[var(--text-primary)]">Schedule automated report</h2>
               <button onClick={() => setIsScheduleModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 font-['DM_Sans',sans-serif]">
               <div className="mb-5">
                  <label className="block text-[13px] font-medium text-[var(--text-primary)] mb-1.5">Frequency</label>
                  <select className="w-full bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-md px-3 py-2.5 text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] transition-colors">
                     <option>Weekly (Every Monday)</option>
                     <option>Monthly (1st of month)</option>
                     <option>Quarterly</option>
                  </select>
               </div>

               <div className="mb-5">
                  <label className="block text-[13px] font-medium text-[var(--text-primary)] mb-1.5">Recipients</label>
                  <input type="text" placeholder="e.g. cfo@acmesaas.com, team@acmesaas.com" className="w-full bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-md px-3 py-2.5 text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] transition-colors placeholder:text-[var(--text-muted)]" />
               </div>

               <div className="mb-5">
                  <label className="block text-[13px] font-medium text-[var(--text-primary)] mb-2">Include sections</label>
                  <div className="space-y-2.5">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-[var(--border-default)] bg-[var(--bg-elevated)] accent-[var(--accent-blue)] w-4 h-4 cursor-pointer" />
                        <span className="text-[13px] text-[var(--text-secondary)]">Executive Summary (KPIs)</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-[var(--border-default)] bg-[var(--bg-elevated)] accent-[var(--accent-blue)] w-4 h-4 cursor-pointer" />
                        <span className="text-[13px] text-[var(--text-secondary)]">Revenue Recovery Timeline</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-[var(--border-default)] bg-[var(--bg-elevated)] accent-[var(--accent-blue)] w-4 h-4 cursor-pointer" />
                        <span className="text-[13px] text-[var(--text-secondary)]">Decline & Gateway Intelligence</span>
                     </label>
                  </div>
               </div>

               <div className="mb-6">
                  <label className="block text-[13px] font-medium text-[var(--text-primary)] mb-1.5">Format</label>
                  <div className="flex gap-4">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="format" defaultChecked className="accent-[var(--accent-blue)] w-4 h-4 cursor-pointer" />
                        <span className="text-[13px] text-[var(--text-secondary)]">PDF Report</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="format" className="accent-[var(--accent-blue)] w-4 h-4 cursor-pointer" />
                        <span className="text-[13px] text-[var(--text-secondary)]">Raw CSV</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="format" className="accent-[var(--accent-blue)] w-4 h-4 cursor-pointer" />
                        <span className="text-[13px] text-[var(--text-secondary)]">Both</span>
                     </label>
                  </div>
               </div>

               <button onClick={() => setIsScheduleModalOpen(false)} className="w-full bg-[var(--accent-blue)] text-white font-medium text-[14px] rounded-md py-2.5 hover:bg-[rgba(59,130,246,0.8)] transition-colors shadow-sm">
                  Schedule
               </button>
               
               <div className="mt-4 text-center">
                  <span className="text-[12px] text-[var(--accent-blue)] cursor-pointer hover:underline">Preview next report</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

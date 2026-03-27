'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  RefreshCw, Mail, FileDown, FileText, AlertTriangle, Zap, Activity,
  TrendingUp, Search, CalendarDays, Table2, LayoutGrid, Columns,
  FastForward, CheckCircle, XCircle, Wallet, CreditCard, Smartphone,
  ShieldX, AlertOctagon, Building, Loader2, Eye, MoreHorizontal, Download, StarIcon,
  Copy, Send, Clock
} from 'lucide-react';
import {
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['500', '600', '700'] });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500'] });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['500', '700'] });

type PaymentStatus =
  | 'just_failed'
  | 'retry_scheduled'
  | 'retrying'
  | 'email_sequence'
  | 'whatsapp_sent'
  | 'card_updated'
  | 'hard_decline'
  | 'final_attempt'
  | 'recovered';

type Gateway = 'razorpay' | 'stripe' | 'cashfree' | 'payu';

type PaymentMethod =
  | 'Credit card'
  | 'Debit card'
  | 'UPI AutoPay'
  | 'Net banking'
  | 'Savings account'
  | 'Visa debit'
  | 'Mastercard'
  | 'Visa credit'
  | 'Amex credit'
  | 'Corporate card'
  | 'Rupay debit';

interface FailedPayment {
  id: string;
  email: string;
  company: string;
  amount: number;          // in paise
  gateway: Gateway;
  declineCode: string;
  declineLabel: string;
  method: PaymentMethod;
  attempts: number;
  maxAttempts: number;
  probability: number;     // 0-100
  status: PaymentStatus;
  lastAction: string;
  lastActionTime: string;
  nextAction: string;
  failedAt: string;
  recoveryDays: number | null;
}

const failedPayments: FailedPayment[] = [
  {
    id: 'fp_001', email: 'meera@techstartup.in', company: 'TechStartup', amount: 850000, 
    gateway: 'razorpay', declineCode: 'card_expired', declineLabel: 'Card expired', method: 'Credit card',
    attempts: 2, maxAttempts: 5, probability: 71, status: 'email_sequence',
    lastAction: 'Email #2 sent', lastActionTime: '3h ago', nextAction: 'Retry in 4h',
    failedAt: 'Mar 21, 09:14', recoveryDays: 0.8,
  },
  {
    id: 'fp_002', email: 'priya@startup.in', company: 'StartupCo', amount: 1280000,
    gateway: 'stripe', declineCode: 'card_expired', declineLabel: 'Card expired', method: 'Visa debit',
    attempts: 2, maxAttempts: 5, probability: 68, status: 'retry_scheduled',
    lastAction: 'Retry #1 failed', lastActionTime: '8h ago', nextAction: 'Retry in 3h 42m',
    failedAt: 'Mar 20, 14:22', recoveryDays: 1.2,
  },
  {
    id: 'fp_003', email: 'raj@example.com', company: 'Example Pvt Ltd', amount: 299900,
    gateway: 'cashfree', declineCode: 'upi_mandate_failed', declineLabel: 'UPI mandate failed', method: 'UPI AutoPay',
    attempts: 1, maxAttempts: 4, probability: 81, status: 'whatsapp_sent',
    lastAction: 'WA sent · read', lastActionTime: '2h ago', nextAction: 'Retry attempt 2',
    failedAt: 'Mar 21, 11:00', recoveryDays: 0.5,
  },
  {
    id: 'fp_004', email: 'amit@venture.com', company: 'Venture Labs', amount: 820000,
    gateway: 'razorpay', declineCode: 'do_not_honor', declineLabel: 'Do not honor', method: 'Credit card',
    attempts: 3, maxAttempts: 5, probability: 54, status: 'retrying',
    lastAction: 'Retry #2 fired', lastActionTime: '1h ago', nextAction: 'Await result',
    failedAt: 'Mar 19, 16:45', recoveryDays: 2.1,
  },
  {
    id: 'fp_005', email: 'karthik@saasco.in', company: 'SaaSCo', amount: 2200000,
    gateway: 'stripe', declineCode: 'insufficient_funds', declineLabel: 'Insufficient funds', method: 'Mastercard',
    attempts: 1, maxAttempts: 5, probability: 82, status: 'retry_scheduled',
    lastAction: 'Email #1 sent', lastActionTime: '6h ago', nextAction: 'Retry Mar 25',
    failedAt: 'Mar 20, 08:30', recoveryDays: 1.8,
  },
  {
    id: 'fp_006', email: 'ankita@brand.co', company: 'Brand Co', amount: 429900,
    gateway: 'cashfree', declineCode: 'upi_failure', declineLabel: 'UPI failure', method: 'UPI AutoPay',
    attempts: 1, maxAttempts: 4, probability: 76, status: 'whatsapp_sent',
    lastAction: 'WA queued', lastActionTime: '1h ago', nextAction: 'WA delivery pending',
    failedAt: 'Mar 21, 12:15', recoveryDays: 0.3,
  },
  {
    id: 'fp_007', email: 'nisha@brand.co', company: 'Brand Co', amount: 649900,
    gateway: 'razorpay', declineCode: 'insufficient_funds', declineLabel: 'Insufficient funds', method: 'Savings account',
    attempts: 2, maxAttempts: 5, probability: 88, status: 'card_updated',
    lastAction: 'Card updated via portal', lastActionTime: '4h ago', nextAction: 'Charge on renewal',
    failedAt: 'Mar 18, 09:00', recoveryDays: 3.2,
  },
  {
    id: 'fp_008', email: 'dev@company.in', company: 'Company Inc', amount: 1999900,
    gateway: 'stripe', declineCode: 'stolen_card', declineLabel: 'Stolen card', method: 'Visa credit',
    attempts: 0, maxAttempts: 0, probability: 0, status: 'hard_decline',
    lastAction: 'Stopped (fraud)', lastActionTime: '5h ago', nextAction: 'Manual review required',
    failedAt: 'Mar 21, 07:45', recoveryDays: null,
  },
  {
    id: 'fp_009', email: 'rohan@techco.in', company: 'TechCo', amount: 499900,
    gateway: 'razorpay', declineCode: 'insufficient_funds', declineLabel: 'Insufficient funds', method: 'UPI AutoPay',
    attempts: 0, maxAttempts: 4, probability: 84, status: 'just_failed',
    lastAction: 'Campaign triggered', lastActionTime: '15m ago', nextAction: 'Email #1 in queue',
    failedAt: 'Mar 21, 13:45', recoveryDays: 0.1,
  },
  {
    id: 'fp_010', email: 'sunita@startup.co', company: 'Startup Co', amount: 999900,
    gateway: 'stripe', declineCode: 'card_expired', declineLabel: 'Card expired', method: 'Amex credit',
    attempts: 4, maxAttempts: 5, probability: 41, status: 'email_sequence',
    lastAction: 'Email #3 sent', lastActionTime: '12h ago', nextAction: 'Final retry tomorrow',
    failedAt: 'Mar 15, 10:00', recoveryDays: 6.2,
  },
  {
    id: 'fp_011', email: 'vikram@enterprise.in', company: 'Enterprise Ltd', amount: 4999900,
    gateway: 'razorpay', declineCode: 'do_not_honor', declineLabel: 'Do not honor', method: 'Corporate card',
    attempts: 2, maxAttempts: 5, probability: 62, status: 'retry_scheduled',
    lastAction: 'Retry #1 failed', lastActionTime: '1d ago', nextAction: 'Retry in 2h',
    failedAt: 'Mar 19, 11:00', recoveryDays: 2.4,
  },
  {
    id: 'fp_012', email: 'pooja@b2bsaas.in', company: 'B2B SaaS', amount: 299900,
    gateway: 'cashfree', declineCode: 'bank_decline', declineLabel: 'Bank decline', method: 'Net banking',
    attempts: 3, maxAttempts: 5, probability: 49, status: 'retrying',
    lastAction: 'Retry #3 pending', lastActionTime: '30m ago', nextAction: 'Result in 10m',
    failedAt: 'Mar 17, 14:00', recoveryDays: 4.1,
  },
  {
    id: 'fp_013', email: 'arjun@edtech.co', company: 'EdTech Co', amount: 1499900,
    gateway: 'stripe', declineCode: 'insufficient_funds', declineLabel: 'Insufficient funds', method: 'Rupay debit',
    attempts: 1, maxAttempts: 5, probability: 79, status: 'whatsapp_sent',
    lastAction: 'WA sent', lastActionTime: '5h ago', nextAction: 'Retry Mar 25 (payday)',
    failedAt: 'Mar 20, 16:00', recoveryDays: 1.5,
  },
  {
    id: 'fp_014', email: 'kavya@d2c.in', company: 'D2C Brand', amount: 79900,
    gateway: 'razorpay', declineCode: 'upi_mandate_failed', declineLabel: 'UPI mandate failed', method: 'UPI AutoPay',
    attempts: 3, maxAttempts: 4, probability: 33, status: 'final_attempt',
    lastAction: 'WA #2 sent', lastActionTime: '3h ago', nextAction: 'Final retry (last chance)',
    failedAt: 'Mar 16, 09:00', recoveryDays: 5.3,
  },
  {
    id: 'fp_015', email: 'harsh@fintech.in', company: 'FinTech Co', amount: 2999900,
    gateway: 'razorpay', declineCode: 'network_error', declineLabel: 'Network error', method: 'Credit card',
    attempts: 1, maxAttempts: 5, probability: 91, status: 'retry_scheduled',
    lastAction: 'Auto-retry queued', lastActionTime: '20m ago', nextAction: 'Retry in 1h (network)',
    failedAt: 'Mar 21, 13:00', recoveryDays: 0.4,
  },
];

const declineTypesData = [
  { name: 'Insufficient funds', value: 34, color: '#f59e0b' },
  { name: 'Card expired',       value: 22, color: '#ef4444' },
  { name: 'UPI failure',        value: 19, color: '#8b5cf6' },
  { name: 'Do not honor',       value: 15, color: '#3b82f6' },
  { name: 'Other',              value: 10, color: '#475569' },
];

const failuresOverTimeData = [
  { day: '08', failed: 42000, recovered: 31000 },
  { day: '09', failed: 45000, recovered: 35000 },
  { day: '10', failed: 38000, recovered: 38000 },
  { day: '11', failed: 32000, recovered: 29000 },
  { day: '12', failed: 41000, recovered: 33000 },
  { day: '13', failed: 55000, recovered: 31000 },
  { day: '14', failed: 60000, recovered: 42000 },
  { day: '15', failed: 48000, recovered: 45000 },
  { day: '16', failed: 39000, recovered: 48000 },
  { day: '17', failed: 43000, recovered: 51000 },
  { day: '18', failed: 46000, recovered: 42000 },
  { day: '19', failed: 62000, recovered: 40000 },
  { day: '20', failed: 58000, recovered: 51000 },
  { day: '21', failed: 65000, recovered: 55000 }
];

const gatewayData = [
  { name: 'Razorpay', amount: 182000, color: '#2563eb', maxAmount: 200000, status: 'connected' },
  { name: 'Stripe', amount: 89000, color: '#6366f1', maxAmount: 200000, status: 'connected' },
  { name: 'Cashfree', amount: 37000, color: '#059669', maxAmount: 200000, status: 'connected' },
  { name: 'PayU', amount: 0, color: 'var(--bg-overlay)', maxAmount: 200000, status: 'disconnected' },
];
// --- UTILS ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const HighlightMatch = ({ text, match }: { text: string; match: string }) => {
  if (!match) return <>{text}</>;
  const parts = text.split(new RegExp(`(${match})`, 'gi'));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === match.toLowerCase() ? (
          <span key={i} className="font-bold text-[var(--text-primary)]">{p}</span>
        ) : (
          p
        )
      )}
    </>
  );
};

const formatINR = (paise: number): string => 
  '₹' + (paise / 100).toLocaleString('en-IN');

const getProbabilityColor = (score: number) => {
  if (score >= 80) return { bg: 'var(--accent-green-dim)', text: 'var(--accent-green-text)', squares: 5 };
  if (score >= 60) return { bg: 'var(--accent-blue-dim)', text: 'var(--accent-blue)', squares: 4 };
  if (score >= 40) return { bg: 'var(--accent-amber-dim)', text: 'var(--accent-amber)', squares: 3 };
  if (score >= 1) return { bg: 'var(--accent-red-dim)', text: 'var(--accent-red)', squares: 1 };
  return { bg: 'var(--bg-overlay)', text: 'var(--text-muted)', squares: 0 };
};

const getStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case 'just_failed': return { label: 'Just failed', color: 'var(--accent-red)', bg: 'var(--accent-red-dim)', outline: false };
    case 'retry_scheduled': return { label: 'Retry scheduled', color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)', outline: false };
    case 'retrying': return { label: 'Retrying...', color: 'var(--accent-blue)', bg: 'var(--accent-blue-dim)', outline: false };
    case 'email_sequence': return { label: 'Email sequence', color: 'var(--accent-blue)', bg: 'var(--accent-blue-dim)', outline: false };
    case 'whatsapp_sent': return { label: 'WhatsApp sent', color: 'var(--accent-green-text)', bg: 'var(--accent-green-dim)', outline: false };
    case 'card_updated': return { label: 'Card updated', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)', outline: false };
    case 'hard_decline': return { label: 'Hard decline ✗', color: '#991b1b', bg: '#fee2e2', outline: false };
    case 'final_attempt': return { label: 'Final attempt', color: 'var(--accent-red)', bg: 'transparent', outline: true };
    case 'recovered': return { label: 'Recovered', color: 'var(--accent-green-text)', bg: 'var(--accent-green-dim)', outline: false };
    default: return { label: status, color: 'var(--text-muted)', bg: 'var(--bg-overlay)', outline: false };
  }
};

const getGatewayStyling = (gateway: Gateway) => {
  switch (gateway) {
    case 'razorpay': return { label: 'Razorpay', color: '#60a5fa', bg: 'rgba(59,130,246,0.15)' }; // Adjusted for dark theme contrast
    case 'stripe': return { label: 'Stripe', color: '#818cf8', bg: 'rgba(99,102,241,0.15)' };
    case 'cashfree': return { label: 'Cashfree', color: '#34d399', bg: 'rgba(16,185,129,0.15)' };
    case 'payu': return { label: 'PayU', color: '#fbbf24', bg: 'rgba(245,158,11,0.15)' };
    default: return { label: gateway, color: 'var(--text-muted)', bg: 'var(--bg-overlay)' };
  }
};

const getEmailHashColor = (email: string) => {
  const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899'];
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const getMethodIcon = (method: string) => {
  if (method.includes('card') || method.includes('Card') || method.includes('debit') || method.includes('credit')) return <CreditCard className="w-3 h-3 text-[var(--text-muted)] mt-[1px]" />;
  if (method.includes('UPI')) return <Smartphone className="w-3 h-3 text-[#a855f7] mt-[1px]" />;
  return <Building className="w-3 h-3 text-[var(--text-muted)] mt-[1px]" />;
};

const getDeclineIcon = (code: string) => {
  if (code.includes('fund')) return <Wallet className="w-3 h-3 text-[var(--accent-amber)]" />;
  if (code.includes('expired')) return <CreditCard className="w-3 h-3 text-[var(--accent-red)]" />;
  if (code.includes('upi')) return <Smartphone className="w-3 h-3 text-[#c084fc]" />;
  if (code.includes('honor')) return <ShieldX className="w-3 h-3 text-[#f97316]" />;
  if (code.includes('stolen')) return <AlertOctagon className="w-3 h-3 text-[var(--accent-red)]" />;
  return <AlertTriangle className="w-3 h-3 text-[var(--text-muted)]" />;
};

// --- TOAST SYSTEM ---
type ToastMessage = { id: string; message: string; type: 'blue' | 'green' | 'gray' | 'amber' };
let toastIdCounter = 0;

export const useToasts = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastMessage['type']) => {
    const id = `toast-${toastIdCounter++}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return { toasts, addToast, removeToast };
};

const ToastContainer = ({ toasts, removeToast }: { toasts: ToastMessage[], removeToast: (id:string) => void }) => {
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => {
        let borderColor = '';
        let Icon = AlertTriangle;
        let iconColor = '';
        if (t.type === 'blue') { borderColor = 'var(--accent-blue)'; Icon = RefreshCw; iconColor = 'text-[var(--accent-blue)]'; }
        else if (t.type === 'green') { borderColor = 'var(--accent-green)'; Icon = TrendingUp; iconColor = 'text-[var(--accent-green-text)]'; }
        else if (t.type === 'amber') { borderColor = 'var(--accent-amber)'; Icon = AlertTriangle; iconColor = 'text-[var(--accent-amber)]'; }
        else { borderColor = 'var(--text-muted)'; Icon = Download; iconColor = 'text-[var(--text-muted)]'; }

        return (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 bg-[var(--bg-elevated)] text-[var(--text-primary)] px-4 py-3 rounded-lg shadow-lg border-l-[3px] animate-in slide-in-from-right-8 fade-in duration-300`} style={{ borderLeftColor: borderColor }}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
            <span className={dmSans.className + " text-[13px] font-medium"}>{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="ml-2 text-[var(--text-muted)] hover:text-white transition-colors">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
// --- SUB-COMPONENTS ---
const AttemptBar = ({ used, max, isHardDecline, isUPI }: { used: number, max: number, isHardDecline?: boolean, isUPI?: boolean }) => {
  if (isHardDecline) return <div className="flex justify-center"><XCircle className="w-4 h-4 text-[var(--accent-red)]" /></div>;
  const total = isUPI ? 4 : max;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-[2px]">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-[1px] ${i < used ? 'bg-[var(--accent-blue)]' : 'bg-[var(--bg-overlay)] border border-[var(--border-default)]'}`} />
        ))}
      </div>
      <span className={`${jetbrains.className} text-[11px] text-[var(--text-muted)]`}>{used}/{total}</span>
    </div>
  );
};

const ProbabilityBadge = ({ score, isHardDecline, index = 0 }: { score: number, isHardDecline?: boolean, index?: number }) => {
  const { bg, text, squares } = getProbabilityColor(score);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100 + (index * 50));
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="group inline-flex items-center gap-2 px-2 py-1 rounded-md cursor-help" style={{ backgroundColor: bg }}>
            {isHardDecline ? (
              <span className={`${jetbrains.className} text-[12px] font-medium text-[var(--text-muted)]`}>Hard decline</span>
            ) : (
              <>
                <div className="flex gap-[1px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-[6px] h-[8px] rounded-[1px] transition-transform duration-[800ms] ease-out ${i < squares ? '' : 'opacity-20'}`} 
                      style={{ 
                        backgroundColor: i < squares ? text : 'var(--text-muted)',
                        transform: mounted ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'left'
                      }} 
                    />
                  ))}
                </div>
                <span className={`${jetbrains.className} text-[12px] font-medium`} style={{ color: text }}>{score}%</span>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          sideOffset={8}
          className="bg-[var(--bg-elevated)] border-[var(--border-strong)] rounded-[10px] p-[14px] shadow-[0_8px_40px_rgba(0,0,0,0.6)] w-[240px] z-[100]"
        >
          <div className={`${dmSans.className} text-[13px] font-semibold text-[var(--text-primary)] mb-2`}>Recovery probability: {score}%</div>
          <div className="h-px w-full bg-[var(--border-strong)] mb-2" />
          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between items-start"><span className="text-[var(--accent-green-text)]">✓ Soft decline</span><span className={`${jetbrains.className} text-[var(--text-muted)]`}>+20</span></div>
            <div className="flex justify-between items-start"><span className="text-[var(--accent-green-text)]">✓ Card expired (fixable)</span><span className={`${jetbrains.className} text-[var(--text-muted)]`}>+15</span></div>
            <div className="flex justify-between items-start"><span className="text-[var(--accent-green-text)]">✓ Opened email #2</span><span className={`${jetbrains.className} text-[var(--text-muted)]`}>+18</span></div>
            <div className="flex justify-between items-start"><span className="text-[var(--accent-green-text)]">✓ 8-month customer</span><span className={`${jetbrains.className} text-[var(--text-muted)]`}>+12</span></div>
            <div className="flex justify-between items-start"><span className="text-[var(--accent-red)]">↓ Attempt 2 used</span><span className={`${jetbrains.className} text-[var(--text-muted)]`}>-8</span></div>
            <div className="flex justify-between items-start"><span className="text-[var(--accent-red)]">↓ 6 days elapsed</span><span className={`${jetbrains.className} text-[var(--text-muted)]`}>-5</span></div>
          </div>
          <div className="h-px w-full bg-[var(--border-strong)] mt-2.5 mb-2.5" />
          <div className={`${dmSans.className} text-[11px] text-[var(--text-muted)] mb-1`}>Best next action:</div>
          <div className={`${dmSans.className} text-[12px] font-medium text-[var(--accent-blue)] bg-[var(--accent-blue-dim)] rounded p-2`}>
            → Send portal link
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const MiniSparkline = ({ data }: { data: any[] }) => {
  return (
    <div className="h-10 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="recovered" stroke="var(--accent-green)" fillOpacity={1} fill="url(#colorGreen)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const CountdownTimer = ({ initialMinutes }: { initialMinutes: number }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');
  
  return <span className={`${jetbrains.className} text-[12px] text-[var(--accent-amber)]`}>{m}:{s}</span>;
};

const EMAIL_TEMPLATES: Record<string, {subject: string, body: string}> = {
  'template_1': { subject: 'Action required: Payment failed for your subscription', body: 'Hi there,\nWe noticed that your recent payment for ₹12,800 failed.\nPlease update your payment method to avoid service interruption.' },
  'template_2': { subject: 'Second notice: Subscription at risk', body: 'Hi there,\nThis is our second attempt to process your payment.\nYour account will be suspended in 3 days if not resolved.' },
  'template_3': { subject: 'Final notice: Account suspension imminent', body: 'Hi there,\nYour payment has failed multiple times.\nTo keep your access, please update your billing details immediately.' },
  'custom':     { subject: '', body: '' }
};

const ExpandedRowPanel = ({ payment, addToast }: { payment: FailedPayment, addToast: (msg: string, type: 'blue'|'green'|'amber'|'gray') => void }) => {
  const [isComposing, setIsComposing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('template_1');
  const [copied, setCopied] = useState(false);
  const [expandedTimelineId, setExpandedTimelineId] = useState<number | null>(null);

  const handleCopy = () => {
    const text = `Payment: ${formatINR(payment.amount)} · ${payment.email} · ${getGatewayStyling(payment.gateway).label} · ${payment.declineLabel}\nStatus: ${getStatusBadge(payment.status).label} · Probability: ${payment.probability}% · Attempts: ${payment.attempts}/${payment.maxAttempts}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 py-5 pr-5 pl-[60px] bg-[var(--bg-subtle)] border-t border-[var(--border-default)]">
      {/* Left: Timeline */}
      <div className="w-full md:w-[45%] relative">
        <div className="absolute left-[3px] top-2 bottom-2 w-px bg-[var(--border-strong)] z-0" />
        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex gap-4 animate-in slide-in-from-left-4 fade-in duration-300 fill-mode-both" style={{ animationDelay: '0ms' }}>
            <div className="w-2 h-2 rounded-full bg-[var(--accent-red)] mt-1.5 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className={`${dmSans.className} text-[13px] font-medium text-[var(--text-primary)]`}>Payment failed</span>
                <span className={`${jetbrains.className} text-[11px] text-[var(--text-muted)]`}>{payment.failedAt}</span>
              </div>
              <div className={`${dmSans.className} text-[12px] text-[var(--text-muted)] mt-0.5`}>
                {formatINR(payment.amount)} · {getGatewayStyling(payment.gateway).label} · {payment.declineLabel}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 animate-in slide-in-from-left-4 fade-in duration-300 fill-mode-both" style={{ animationDelay: '60ms' }}>
            <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] mt-1.5 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className={`${dmSans.className} text-[13px] font-medium text-[var(--text-primary)]`}>Classified: {payment.probability === 0 ? 'HARD_DECLINE' : 'SOFT_DECLINE'}</span>
                <span className={`${jetbrains.className} text-[11px] text-[var(--text-muted)]`}>{payment.failedAt}</span>
              </div>
              <div className={`${dmSans.className} text-[12px] text-[var(--text-muted)] mt-0.5`}>
                {payment.probability === 0 ? 'No recovery attempts will be made' : '7-Day Aggressive campaign triggered'}
              </div>
            </div>
          </div>

          {payment.attempts > 0 && (
            <div className="flex gap-4 animate-in slide-in-from-left-4 fade-in duration-300 fill-mode-both cursor-pointer group/timeline" style={{ animationDelay: '120ms' }} onClick={() => setExpandedTimelineId(expandedTimelineId === 1 ? null : 1)}>
              <div className="w-2 h-2 rounded-full bg-[var(--accent-blue)] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover/timeline:scale-125 transition-transform" />
              <div className="flex-1 bg-transparent group-hover/timeline:bg-[var(--bg-overlay)] -m-2 p-2 rounded-lg transition-colors">
                <div className="flex justify-between items-start">
                  <span className={`${dmSans.className} text-[13px] font-medium text-[var(--accent-blue)]`}>{payment.lastAction}</span>
                  <span className={`${jetbrains.className} text-[11px] text-[var(--text-muted)]`}>{payment.lastActionTime}</span>
                </div>
                
                {expandedTimelineId === 1 ? (
                  <div className="mt-2 text-[12px] bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-md p-3 shadow-sm cursor-default" onClick={(e) => e.stopPropagation()}>
                    <div className="font-medium text-[var(--text-primary)] mb-1">Subject: Action required: Payment failed</div>
                    <div className="text-[var(--text-muted)] mb-3 line-clamp-1 italic">"Hi there, we noticed that your recent payment..."</div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="text-[var(--text-secondary)]">Delivered · Opened 14:51 · Clicked 10:24</span>
                      <span className="px-1.5 py-0.5 rounded bg-[var(--bg-overlay)] text-[var(--text-primary)] border border-[var(--border-default)]">Mobile · Gmail</span>
                    </div>
                  </div>
                ) : (
                  <div className={`${dmSans.className} text-[12px] text-[var(--text-muted)] mt-0.5 flex items-center gap-1 group-hover/timeline:text-[var(--text-secondary)] transition-colors`}>
                    Delivered ✓ · Opened ✓ <span className="opacity-0 group-hover/timeline:opacity-100 ml-2 text-[10px] text-[var(--accent-blue)]">Click to view stats</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex gap-4 animate-in slide-in-from-left-4 fade-in duration-300 fill-mode-both" style={{ animationDelay: '180ms' }}>
            <div className="w-2 h-2 rounded-full border border-[var(--border-strong)] bg-transparent mt-1.5 shrink-0 border-dashed" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className={`${dmSans.className} text-[13px] font-medium text-[var(--text-primary)]`}>Next: {payment.nextAction}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Details Grid */}
      <div className="w-full md:w-[30%]">
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[13px]">
          <div className="text-[var(--text-muted)]">Payment ID</div>
          <div className={`text-[var(--text-primary)] text-right font-medium ${jetbrains.className} cursor-pointer hover:text-[var(--accent-blue)]`}>{payment.id}abc</div>
          
          <div className="text-[var(--text-muted)]">Gateway</div>
          <div className="text-[var(--text-primary)] text-right font-medium">{getGatewayStyling(payment.gateway).label}</div>
          
          <div className="text-[var(--text-muted)]">Customer</div>
          <div className="text-[var(--text-primary)] text-right font-medium truncate" title={payment.email}>{payment.email}</div>
          
          <div className="text-[var(--text-muted)]">Failed at</div>
          <div className="text-[var(--text-primary)] text-right font-medium">{payment.failedAt}</div>
          
          <div className="text-[var(--text-muted)]">Decline code</div>
          <div className={`text-[var(--text-primary)] text-right font-medium ${jetbrains.className}`}>{payment.declineCode}</div>
          
          <div className="text-[var(--text-muted)]">Attempts used</div>
          <div className="text-[var(--text-primary)] text-right font-medium">{payment.attempts} of {payment.maxAttempts}</div>
          
          <div className="text-[var(--text-muted)]">Recovery prob.</div>
          <div className="text-[var(--text-primary)] text-right font-medium">{payment.probability}%</div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="w-full md:w-[25%] bg-[var(--bg-elevated)] rounded-[10px] p-4 border border-[var(--border-default)] relative min-h-[250px]">
        <div className="absolute top-3.5 right-4 z-10">
          <Button variant="ghost" size="sm" onClick={handleCopy} className={`h-6 px-2 text-[11px] font-medium transition-colors ${copied ? 'text-[var(--accent-green-text)] bg-[var(--accent-green-dim)] hover:bg-[var(--accent-green-dim)] hover:text-[var(--accent-green-text)]' : 'text-[var(--text-muted)] hover:text-white bg-[var(--bg-overlay)]'}`}>
            {copied ? ( <><CheckCircle className="w-3 h-3 mr-1" /> Copied!</> ) : ( <><Copy className="w-3 h-3 mr-1" /> Copy details</> )}
          </Button>
        </div>

        {isComposing ? (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <div className={`${plusJakarta.className} text-[13px] font-semibold text-[var(--text-primary)] mb-3`}>Compose Email</div>
            
            <div className="mb-3">
              <select 
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className={`${dmSans.className} w-full bg-[var(--bg-base)] border border-[var(--border-strong)] rounded-md h-8 px-2 text-[12px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]`}
              >
                <option value="template_1">Email #1: Soft notice</option>
                <option value="template_2">Email #2: Warning</option>
                <option value="template_3">Email #3: Final notice</option>
                <option value="custom">Custom message</option>
              </select>
            </div>
            
            <div className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-md p-2.5 mb-4">
              <div className={`${dmSans.className} text-[11px] font-medium text-[var(--text-primary)] mb-1 truncate`}>Subject: {EMAIL_TEMPLATES[selectedTemplate]?.subject || '...'}</div>
              <div className={`${dmSans.className} text-[11px] text-[var(--text-muted)] whitespace-pre-line line-clamp-2`}>
                {EMAIL_TEMPLATES[selectedTemplate]?.body || 'Type your custom message here...'}
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5 mb-2">
              <Button size="sm" className="w-full justify-center h-8 bg-[var(--accent-blue)] hover:bg-blue-600 text-white border-0 text-[12px]" onClick={() => { setIsComposing(false); addToast('Manual email queued successfully', 'green'); }}>
                <Send className="w-3.5 h-3.5 mr-2" /> Send now
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-center h-8 bg-transparent border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-overlay)] hover:text-white text-[12px]" onClick={() => { setIsComposing(false); addToast('Email scheduled for tomorrow 9:00 AM', 'blue'); }}>
                <Clock className="w-3.5 h-3.5 mr-2" /> Schedule 9:00 AM
              </Button>
            </div>
            
            <button className={`${dmSans.className} w-full text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-center py-1 mt-1 cursor-pointer`} onClick={() => setIsComposing(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <div className={`${plusJakarta.className} text-[13px] font-semibold text-[var(--text-secondary)] mb-3 pt-1`}>Quick actions</div>
            <div className="flex flex-col gap-1.5 mb-4">
              <Button size="sm" className="w-full justify-start h-8 bg-[var(--accent-blue)] hover:bg-blue-600 text-white border-0 text-[12px]">
                <RefreshCw className="w-3.5 h-3.5 mr-2" /> Retry now
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start h-8 bg-transparent border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-overlay)] hover:text-white text-[12px]" onClick={() => setIsComposing(true)}>
                <Mail className="w-3.5 h-3.5 mr-2" /> Send email manually
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start h-8 bg-transparent border-[var(--accent-green-dim)] text-[var(--accent-green-text)] hover:bg-[var(--accent-green-dim)] hover:text-[var(--accent-green-text)] text-[12px]">
                <Smartphone className="w-3.5 h-3.5 mr-2" /> Send WhatsApp
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start h-8 bg-transparent border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-overlay)] hover:text-white text-[12px]">
                <CheckCircle className="w-3.5 h-3.5 mr-2" /> Mark as resolved
              </Button>
            </div>
            
            <div className="pt-3 border-t border-[var(--border-default)]">
              <div className="text-[12px] text-[var(--text-muted)] mb-1.5 mt-1">Add note:</div>
              <textarea 
                className="w-full bg-[var(--bg-base)] border border-[var(--border-strong)] rounded-md p-2 text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] resize-none"
                rows={2}
                placeholder="Add internal note about this payment..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function FailedPaymentsPage() {
  const { toasts, addToast, removeToast } = useToasts();
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [globalSearch, setGlobalSearch] = useState('');
  
  const [searchInput, setSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchInput = useDebounce(searchInput, 200);
  
  const activeSearchQuery = globalSearch || debouncedSearchInput;
  const [hoverDeclineFilter, setHoverDeclineFilter] = useState<string | null>(null);
  
  const [chartPeriod, setChartPeriod] = useState<'this_month' | 'last_month'>('this_month');
  const [isPaydayModalOpen, setIsPaydayModalOpen] = useState(false);
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [h1InView, setH1InView] = useState(false);
  const h1Ref = useRef<HTMLDivElement>(null);

  // keyboard shortcut Cmd+F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Simulated incoming recovery toast
  useEffect(() => {
    const timer = setTimeout(() => {
      addToast('₹8,500 recovered — meera@techstartup.in', 'green');
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setH1InView(true); },
      { threshold: 0.1 }
    );
    if (h1Ref.current) observer.observe(h1Ref.current);
    return () => observer.disconnect();
  }, []);

  const filteredPayments = useMemo(() => {
    let result = [...failedPayments];
    if (globalSearch) {
      const q = globalSearch.toLowerCase();
      result = result.filter(p => 
        p.email.toLowerCase().includes(q) || 
        p.id.toLowerCase().includes(q) || 
        p.declineLabel.toLowerCase().includes(q) ||
        formatINR(p.amount).includes(q)
      );
    }
    if (hoverDeclineFilter) {
      result = result.filter(p => p.declineLabel === hoverDeclineFilter);
    }
    return result;
  }, [globalSearch, hoverDeclineFilter]);

  const sortedPayments = useMemo(() => {
    return [...filteredPayments].sort((a, b) => b.probability - a.probability);
  }, [filteredPayments]);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;
  const isAllSelected = selectedCount === failedPayments.length && failedPayments.length > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < failedPayments.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows({});
    } else {
      const newSelected: Record<string, boolean> = {};
      failedPayments.forEach(p => newSelected[p.id] = true);
      setSelectedRows(newSelected);
    }
  };

  return (
    <div className="min-h-screen pb-20 select-none bg-cover bg-center" style={{ 
      backgroundColor: 'var(--bg-base)', 
      backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      '--bg-base': '#080c14',
      '--bg-surface': '#0d1117',
      '--bg-elevated': '#131a24',
      '--bg-overlay': '#1a2332',
      '--bg-subtle': '#0f1520',
      '--border-default': 'rgba(255,255,255,0.06)',
      '--border-strong': 'rgba(255,255,255,0.12)',
      '--accent-blue': '#3b82f6',
      '--accent-blue-dim': 'rgba(59,130,246,0.15)',
      '--accent-green': '#10b981',
      '--accent-green-dim': 'rgba(16,185,129,0.12)',
      '--accent-green-text': '#34d399',
      '--accent-amber': '#f59e0b',
      '--accent-amber-dim': 'rgba(245,158,11,0.12)',
      '--accent-red': '#ef4444',
      '--accent-red-dim': 'rgba(239,68,68,0.12)',
      '--text-primary': '#f1f5f9',
      '--text-secondary': '#94a3b8',
      '--text-muted': '#475569',
    } as React.CSSProperties}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes risk-shimmer {
          0%, 100% { text-shadow: 0 0 0px rgba(239,68,68,0); }
          50% { text-shadow: 0 0 18px rgba(239,68,68,0.35); }
        }
        @keyframes money-shimmer {
          0%, 100% { text-shadow: 0 0 0px rgba(52,211,153,0); }
          50% { text-shadow: 0 0 18px rgba(52,211,153,0.35); }
        }
        .animate-risk-shimmer { animation: risk-shimmer 4s ease-in-out infinite; }
        .animate-money-shimmer { animation: money-shimmer 4s ease-in-out infinite; }
      `}} />

      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="max-w-[1400px] mx-auto px-6 pt-8 flex flex-col gap-6">
        
        {/* SECTION A — PAGE HEADER */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <div className={`${dmSans.className} text-[13px] text-[var(--text-muted)] mb-1`}>
                Dashboard / <span className="text-[var(--text-primary)]">Failed Payments</span>
              </div>
              <h1 className={`${plusJakarta.className} text-[26px] font-bold text-[var(--text-primary)] tracking-tight`}>Failed Payments</h1>
              <p className={`${dmSans.className} text-[14px] text-[var(--text-muted)] mt-1`}>Monitor, investigate, and act on every payment failure</p>
            </div>
            
            <div className="flex items-center gap-2.5">
              <Button variant="ghost" size="icon" className="w-[34px] h-[34px] text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)] hover:text-white" title="Pull latest from all gateways">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-[34px] h-[34px] text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)] hover:text-white">
                <Mail className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="h-[34px] px-3 bg-transparent border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]">
                <FileDown className="w-4 h-4 mr-2" /> Export CSV
              </Button>
              <Button className="h-[34px] px-3 bg-[var(--accent-blue)] hover:bg-blue-600 text-white border-0">
                <FileText className="w-4 h-4 mr-2" /> Export PDF
              </Button>
            </div>
          </div>
          
          <div className={`${dmSans.className} flex items-center gap-1.5 text-[12px] text-[var(--text-muted)]`}>
            <span>Last synced: 2 minutes ago</span>
            <span className="mx-1">·</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Razorpay ✓</span>
            <span className="mx-1">·</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Stripe ✓</span>
            <span className="mx-1">·</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Cashfree ✓</span>
            <span className="mx-1">·</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> PayU ⚠</span>
            <a href="#" className="text-[var(--accent-amber)] hover:underline ml-1">Reconnect</a>
          </div>
        </section>

        {/* SECTION B — AT-RISK SUMMARY STRIP */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl py-[18px] px-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-red-dim)] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-[var(--accent-red)]" />
              </div>
              <div>
                <div className={`${dmSans.className} text-[13px] text-[var(--text-muted)]`}>Total MRR at risk</div>
                <div className={`${jetbrains.className} text-[30px] font-bold text-[var(--accent-red)] leading-none mt-1 animate-risk-shimmer`}>₹3,08,000</div>
              </div>
            </div>
            <div className="flex justify-between mt-4 mb-2">
              <span className={`${dmSans.className} text-[12px] text-[var(--text-secondary)]`}>143 active failures</span>
              <span className={`${dmSans.className} text-[12px] text-[var(--accent-green-text)]`}>₹2,40,000 already recovering</span>
            </div>
            <div className="w-full h-1 bg-[var(--bg-overlay)] rounded-full overflow-hidden flex">
              <div className="h-full bg-[var(--accent-green)]" style={{ width: '78%' }} />
              <div className="h-full bg-[var(--accent-red)]" style={{ width: '22%' }} />
            </div>
            <div className={`${dmSans.className} text-[11px] text-[var(--text-muted)] mt-1.5`}>78% in active recovery</div>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl py-[18px] px-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-amber-dim)] flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-[var(--accent-amber)]" />
              </div>
              <div>
                <div className={`${dmSans.className} text-[13px] text-[var(--text-muted)]`}>Needs your attention</div>
                <div className={`${plusJakarta.className} text-[30px] font-bold text-[var(--accent-amber)] leading-none mt-1`}>23</div>
              </div>
            </div>
            <div className={`${dmSans.className} text-[13px] text-[var(--text-muted)] mb-3`}>payments require manual review</div>
            <div className="flex flex-col gap-1.5 mb-3">
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-amber)]" /><span className={`${dmSans.className} text-[12px] text-[var(--text-secondary)]`}>8 hard declines — verify</span></div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-amber)]" /><span className={`${dmSans.className} text-[12px] text-[var(--text-secondary)]`}>11 exhausted attempts</span></div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-amber)]" /><span className={`${dmSans.className} text-[12px] text-[var(--text-secondary)]`}>4 WhatsApp/email bounced</span></div>
            </div>
            <a href="#" className={`${plusJakarta.className} text-[13px] text-[var(--accent-amber)] hover:underline font-medium`}>Review now →</a>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl py-[18px] px-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-blue-dim)] flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-[var(--accent-blue)]" />
              </div>
              <div>
                <div className={`${dmSans.className} text-[13px] text-[var(--text-muted)]`}>Actively recovering</div>
                <div className={`${plusJakarta.className} text-[30px] font-bold text-[var(--accent-blue)] leading-none mt-1`}>112</div>
              </div>
            </div>
            <div className="flex justify-between mt-4 mb-2">
              <span className={`${dmSans.className} text-[12px] text-[var(--accent-amber)]`}>54 retry scheduled</span>
              <span className={`${dmSans.className} text-[12px] text-[var(--accent-blue)]`}>51 contact sent</span>
              <span className={`${dmSans.className} text-[12px] text-[var(--accent-green-text)]`}>7 obj resp</span>
            </div>
            <div className="w-full h-2 bg-[var(--bg-overlay)] rounded-full overflow-hidden flex mb-2">
              <div className="h-full bg-[var(--accent-amber)]" style={{ width: '48%' }} />
              <div className="h-full bg-[var(--accent-blue)]" style={{ width: '45%' }} />
              <div className="h-full bg-[var(--accent-green)]" style={{ width: '7%' }} />
            </div>
            <div className={`${dmSans.className} text-[12px] text-[var(--text-muted)] mt-2`}>
              Next retry fires in <CountdownTimer initialMinutes={23} />
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl py-[18px] px-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-green-dim)] flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-[var(--accent-green-text)]" />
              </div>
              <div>
                <div className={`${dmSans.className} text-[13px] text-[var(--text-muted)]`}>Recovered today</div>
                <div className={`${jetbrains.className} text-[30px] font-bold text-[var(--accent-green-text)] leading-none mt-1 animate-money-shimmer`}>₹38,400</div>
              </div>
            </div>
            <div className={`${dmSans.className} text-[12px] text-[var(--text-muted)] mb-1`}>8 payments · avg ₹4,800 each</div>
            <MiniSparkline data={failuresOverTimeData.slice(7)} />
            <div className="mt-2 text-[12px] font-medium px-2 py-0.5 rounded-full bg-[var(--accent-green-dim)] text-[var(--accent-green-text)] inline-block">↑ ₹9,200 more than yesterday</div>
          </div>
        </section>

        {/* SECTION C — MINI CHARTS ROW */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl py-[18px] px-[22px] h-[200px] flex flex-col">
            <div>
              <h3 className={`${plusJakarta.className} text-[14px] font-semibold text-[var(--text-primary)]`}>By decline type</h3>
              <p className={`${dmSans.className} text-[12px] text-[var(--text-muted)]`}>What's causing failures</p>
            </div>
            <div className="flex-1 flex items-center -ml-4">
              <div className="w-[140px] h-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={declineTypesData} innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value" stroke="none">
                      {declineTypesData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-strong)', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`${jetbrains.className} text-[13px] text-[var(--text-primary)] pl-4`}>5 types</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1.5 justify-center">
                {declineTypesData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: d.color }} /><span className={`${dmSans.className} text-[11px] text-[var(--text-primary)] leading-none line-clamp-1 truncate block max-w-[80px]`}>{d.name}</span></div>
                    <span className={`${jetbrains.className} text-[11px] text-[var(--text-muted)]`}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl py-[18px] px-[22px] h-[200px] flex flex-col">
            <div>
              <h3 className={`${plusJakarta.className} text-[14px] font-semibold text-[var(--text-primary)]`}>This month trend</h3>
              <p className={`${dmSans.className} text-[12px] text-[var(--text-muted)]`}>Daily new failures vs recoveries</p>
            </div>
            <div className="flex-1 mt-4 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={failuresOverTimeData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickMargin={5} minTickGap={20} />
                  <RechartsTooltip cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1, strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-strong)', borderRadius: '8px', fontSize: '12px', padding: '8px 12px' }} />
                  <Area type="monotone" dataKey="failed" stroke="var(--accent-red)" fill="var(--accent-red)" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="recovered" stroke="var(--accent-green-text)" fill="var(--accent-green-text)" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl py-[18px] px-[22px] h-[200px] flex flex-col">
            <div>
              <h3 className={`${plusJakarta.className} text-[14px] font-semibold text-[var(--text-primary)]`}>By gateway</h3>
              <p className={`${dmSans.className} text-[12px] text-[var(--text-muted)]`}>Failed amount per provider</p>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-3 mt-4">
              {gatewayData.map((g, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`${dmSans.className} text-[13px] text-[var(--text-primary)] w-16`}>{g.name}</div>
                  <div className="flex-1 h-[8px] rounded-full bg-[var(--bg-overlay)] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${(g.amount / g.maxAmount) * 100}%`, backgroundColor: g.color }} />
                  </div>
                  <div className={`${jetbrains.className} text-[12px] text-[var(--text-secondary)] w-[70px] text-right`}>{g.status === 'disconnected' ? 'Offline' : formatINR(g.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION D — SMART FILTER BAR & SECTION E — BULK ACTION BAR */}
        <section className="flex flex-col gap-3 relative z-20">
          <div className="flex flex-wrap lg:flex-nowrap justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative group/search" 
                onFocus={() => setIsSearchFocused(true)} 
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setTimeout(() => setIsSearchFocused(false), 150); }}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input 
                  ref={searchInputRef}
                  placeholder="Search by email, ID..." 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchInput.trim()) {
                      setGlobalSearch(searchInput.trim());
                      setSearchInput('');
                      searchInputRef.current?.blur();
                    }
                  }}
                  className="w-full lg:w-[240px] focus:w-full lg:focus:w-[400px] transition-all duration-300 ease-out h-[36px] bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-lg pl-9 pr-8 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:border-[var(--accent-blue)]"
                />
                <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-[var(--text-muted)] font-mono px-1 border border-[var(--border-default)] rounded hidden lg:block">⌘F</kbd>
                
                {isSearchFocused && (
                  <div className="absolute top-full mt-2 left-0 w-full bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-[10px] shadow-[0_8px_40px_rgba(0,0,0,0.6)] z-[60] overflow-hidden flex flex-col">
                    {debouncedSearchInput ? (
                      <div className="p-2 w-full text-[13px]">
                        <div className="px-2 py-1 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Customers</div>
                        <button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-[var(--bg-overlay)] flex gap-2 items-center text-[var(--text-primary)]" onMouseDown={() => { setGlobalSearch('priya@startup.in'); setSearchInput(''); setIsSearchFocused(false); }}>
                           <span className="w-1.5 h-1.5 rounded-full border border-[var(--text-muted)] shrink-0" /> <span className="truncate">priya@startup.in · ₹12,800</span>
                        </button>
                        <div className="px-2 py-1 mt-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Decline codes</div>
                        <div className="px-2 py-1 text-[var(--text-muted)] italic text-[12px]">(no match)</div>
                        <div className="px-2 py-1 mt-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Amounts</div>
                        <button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-[var(--bg-overlay)] flex gap-2 items-center text-[var(--text-primary)]" onMouseDown={() => { setGlobalSearch(debouncedSearchInput); setSearchInput(''); setIsSearchFocused(false); }}>
                           <span className="w-1.5 h-1.5 rounded-full border border-[var(--text-muted)] shrink-0" /> <span className="truncate">All payments ≈ {debouncedSearchInput}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 w-full text-[13px]">
                        <div className="px-2 py-1 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Recent searches</div>
                        <button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-[var(--bg-overlay)] text-[var(--text-primary)]" onMouseDown={() => { setGlobalSearch('priya@startup.in'); setSearchInput(''); setIsSearchFocused(false); }}>· priya@startup.in</button>
                        <button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-[var(--bg-overlay)] text-[var(--text-primary)]" onMouseDown={() => { setGlobalSearch('card_expired'); setSearchInput(''); setIsSearchFocused(false); }}>· card_expired</button>
                        <button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-[var(--bg-overlay)] text-[var(--text-primary)]" onMouseDown={() => { setGlobalSearch('₹12,800'); setSearchInput(''); setIsSearchFocused(false); }}>· ₹12,800</button>
                        
                        <div className="px-2 py-1 mt-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Quick filters</div>
                        <button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-[var(--bg-overlay)] text-[var(--text-primary)]" onMouseDown={() => { setGlobalSearch('High value'); setSearchInput(''); setIsSearchFocused(false); }}>· High value (&gt; ₹10,000)</button>
                        <button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-[var(--bg-overlay)] text-[var(--text-primary)]" onMouseDown={() => { setGlobalSearch('hard_decline'); setSearchInput(''); setIsSearchFocused(false); }}>· Needs attention (hard declines)</button>
                        <button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-[var(--bg-overlay)] text-[var(--text-primary)]" onMouseDown={() => { setGlobalSearch('Final attempt'); setSearchInput(''); setIsSearchFocused(false); }}>· Final attempts only</button>
                        <button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-[var(--bg-overlay)] text-[var(--text-primary)]" onMouseDown={() => { setGlobalSearch('Last 24 hours'); setSearchInput(''); setIsSearchFocused(false); }}>· Last 24 hours</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-[20px] p-0.5">
                {globalSearch && (
                  <div className="flex items-center gap-1.5 px-3 h-7 rounded-[18px] text-[12px] font-medium bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-strong)] ml-1 mr-1 relative pr-8">
                    <span className="opacity-70">Search:</span> {globalSearch}
                    <button onClick={() => setGlobalSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent-red)] rounded-full transition-colors"><XCircle className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                {hoverDeclineFilter && (
                  <div className="flex items-center gap-1.5 px-3 h-7 rounded-[18px] text-[12px] font-medium bg-[var(--accent-amber-dim)] text-[var(--accent-amber)] border border-[rgba(245,158,11,0.2)] ml-1 mr-1 relative pr-8">
                    <span className="opacity-70">Filtered by:</span> {hoverDeclineFilter}
                    <button onClick={() => setHoverDeclineFilter(null)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--accent-amber)] hover:text-[var(--accent-red)] rounded-full transition-colors"><XCircle className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                {['All', 'Razorpay', 'Stripe', 'Cashfree', 'PayU'].map((pill, i) => (
                  <button key={i} className={`px-3 h-7 rounded-[18px] text-[12px] font-medium transition-colors ${i === 0 ? 'bg-[var(--accent-blue-dim)] text-[var(--accent-blue)] border border-[rgba(59,130,246,0.2)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'}`}>
                    {pill}
                  </button>
                ))}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[13px] font-normal text-[var(--text-secondary)]">
                    All statuses <span className="ml-1 opacity-50">▾</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[var(--text-primary)]">
                  <DropdownMenuCheckboxItem checked>All active (143)</DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator className="bg-[var(--border-default)]" />
                  <DropdownMenuCheckboxItem>Retrying (34)</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Email sequence (28)</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>WhatsApp sent (23)</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Card updated (12)</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Hard decline (8)</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[13px] font-normal text-[var(--text-secondary)]">
                    All decline types <span className="ml-1 opacity-50">▾</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[var(--text-primary)]">
                  <DropdownMenuCheckboxItem>Insufficient funds (52)</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Card expired (34)</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem className="text-[var(--accent-red)]">Stolen card (5)</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[13px] font-normal text-[var(--text-secondary)]">
                    <CalendarDays className="w-4 h-4 mr-2 text-[var(--text-muted)]" /> Last 30 days <span className="ml-1 opacity-50">▾</span>
                  </Button>
                </DropdownMenuTrigger>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 bg-transparent border-0 text-[13px] font-normal text-[var(--text-secondary)] hover:text-white">
                    Sort: Amount ↓ <span className="ml-1 opacity-50">▾</span>
                  </Button>
                </DropdownMenuTrigger>
              </DropdownMenu>
              
              <div className="flex items-center bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-lg p-0.5">
                <Button variant="ghost" size="sm" className={`h-7 w-8 p-0 ${viewMode === 'table' ? 'bg-[var(--bg-overlay)] text-white' : 'text-[var(--text-muted)]'}`} onClick={() => setViewMode('table')}>
                  <Table2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className={`h-7 w-8 p-0 ${viewMode === 'card' ? 'bg-[var(--bg-overlay)] text-white' : 'text-[var(--text-muted)]'}`} onClick={() => setViewMode('card')}>
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[var(--text-secondary)]">
                <Columns className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* SECTION E: BULK ACTION BAR */}
          <div className={`overflow-hidden transition-all duration-250 ease-out ${selectedCount > 0 ? 'max-h-[50px] opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'}`}>
            <div className="flex items-center justify-between bg-[var(--bg-elevated)] border border-[var(--accent-blue-dim)] rounded-lg px-4 h-[50px] shadow-lg">
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={isAllSelected || (isIndeterminate ? 'indeterminate' : false)} 
                  onCheckedChange={toggleSelectAll} 
                  className="border-[var(--text-muted)] data-[state=checked]:bg-[var(--accent-blue)] data-[state=checked]:border-[var(--accent-blue)]" 
                />
                <span className={`${dmSans.className} font-medium text-[13px] text-[var(--accent-blue)]`}>{selectedCount} payments selected</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => { addToast(`Bulk retry started for ${selectedCount} payments`, 'blue'); setSelectedRows({}); }} className="h-[30px] bg-[var(--accent-blue)] hover:bg-blue-600 text-white text-[12px] px-3"><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry all now</Button>
                <Button size="sm" variant="outline" className="h-[30px] bg-transparent border-[var(--border-strong)] text-[var(--text-primary)] text-[12px] px-3"><Mail className="w-3.5 h-3.5 mr-1.5" /> Send email <span className="ml-1 opacity-50">▾</span></Button>
                <Button size="sm" variant="outline" className="h-[30px] bg-transparent border-[var(--accent-green-dim)] text-[var(--accent-green-text)] text-[12px] px-3 hover:bg-[var(--accent-green-dim)] hover:text-[var(--accent-green-text)]"><Smartphone className="w-3.5 h-3.5 mr-1.5" /> Send WhatsApp</Button>
                <Button size="sm" variant="outline" className="h-[30px] bg-transparent border-[var(--border-strong)] text-[var(--text-primary)] text-[12px] px-3 hover:bg-[var(--bg-overlay)] hover:text-[var(--accent-amber)]"><FastForward className="w-3.5 h-3.5 mr-1.5" /> Skip to next</Button>
                <Button size="sm" variant="outline" className="h-[30px] bg-transparent border-[var(--border-strong)] text-[var(--text-primary)] text-[12px] px-3 hover:bg-[var(--bg-overlay)]"><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Mark resolved</Button>
                <Button size="sm" variant="outline" className="h-[30px] bg-transparent border border-red-900/40 text-[var(--accent-red)] text-[12px] px-3 hover:bg-[var(--accent-red-dim)] hover:text-[var(--accent-red)]"><XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel recovery</Button>
              </div>

              <div className="flex items-center">
                <Button size="sm" variant="ghost" className="h-[30px] text-[13px] text-[var(--text-muted)] hover:text-white" onClick={() => setSelectedRows({})}>Deselect all</Button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION F — MAIN COMPONENTS (TABLE OR CARD VIEW) */}
        {viewMode === 'table' ? (
          <section className="bg-transparent border border-[var(--border-strong)] rounded-xl overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[var(--bg-surface)] border-b border-[var(--border-strong)] h-[40px]">
                  <th className="px-3 py-2 w-[40px] sticky left-0 z-20 bg-[var(--bg-surface)]">
                    <Checkbox checked={isAllSelected || (isIndeterminate ? 'indeterminate' : false)} onCheckedChange={toggleSelectAll} className="border-[var(--text-muted)] data-[state=checked]:bg-[var(--accent-blue)]" />
                  </th>
                  <th className={`${dmSans.className} px-3 py-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider sticky left-[40px] z-20 bg-[var(--bg-surface)] min-w-[180px]`}>Customer</th>
                  <th className={`${dmSans.className} px-3 py-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider text-right w-[100px] group cursor-pointer hover:text-[var(--text-primary)]`}>Amount <span className="inline-block text-[var(--accent-blue)]">↓</span></th>
                  <th className={`${dmSans.className} px-3 py-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-[90px]`}>Gateway</th>
                  <th className={`${dmSans.className} px-3 py-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-[130px]`}>Decline type</th>
                  <th className={`${dmSans.className} px-3 py-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-[90px]`}>Method</th>
                  <th className={`${dmSans.className} px-3 py-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider text-center w-[80px]`}>Attempts</th>
                  <th className={`${dmSans.className} px-3 py-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-[120px]`}>Probability</th>
                  <th className={`${dmSans.className} px-3 py-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-[120px]`}>Status</th>
                  <th className={`${dmSans.className} px-3 py-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-[140px]`}>Last action</th>
                  <th className={`${dmSans.className} px-2 py-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-[60px] text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedPayments.map((payment, i) => {
                  const isSelected = !!selectedRows[payment.id];
                  const isExpanded = !!expandedRows[payment.id];
                  const isAltRow = i % 2 !== 0 && !isSelected;
                  const rowClass = isSelected 
                    ? 'bg-[var(--accent-blue-dim)]' 
                    : isAltRow ? 'bg-[rgba(15,21,32,0.4)]' : 'bg-transparent hover:bg-[var(--bg-overlay)]';
                  
                  return (
                    <React.Fragment key={payment.id}>
                      <tr 
                        className={`h-[48px] border-b border-[var(--border-strong)] transition-colors group cursor-pointer ${rowClass} relative`}
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (!target.closest('button') && !target.closest('input')) toggleRow(payment.id);
                        }}
                      >
                        <td className={`px-3 py-2 sticky left-0 z-10 ${isSelected ? 'bg-[var(--accent-blue-dim)]' : isAltRow ? 'bg-[#0b0f16]' : 'bg-[var(--bg-base)] group-hover:bg-[var(--bg-overlay)]'}`} onClick={(e) => e.stopPropagation()}>
                          {isSelected && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent-blue)]" />}
                          {payment.status === 'hard_decline' && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent-red)]" />}
                          <div className={`transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            <Checkbox checked={isSelected} onCheckedChange={() => toggleSelectRow(payment.id)} className="border-[var(--text-muted)] data-[state=checked]:bg-[var(--accent-blue)]" />
                          </div>
                        </td>
                        
                        <td className={`px-3 py-2 sticky left-[40px] z-10 ${isSelected ? 'bg-[var(--accent-blue-dim)]' : isAltRow ? 'bg-[#0b0f16]' : 'bg-[var(--bg-base)] group-hover:bg-[var(--bg-overlay)]'}`}>
                          <div className="flex items-center gap-2.5">
                            <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center text-white text-[10px] font-medium shrink-0" style={{ backgroundColor: getEmailHashColor(payment.email) }}>
                              {payment.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className={`${dmSans.className} text-[12px] font-medium text-[var(--text-primary)] truncate`}><HighlightMatch text={payment.email} match={activeSearchQuery} /></div>
                              <div className={`${dmSans.className} text-[11px] text-[var(--text-muted)] truncate mt-0`}>{payment.company}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-3 py-2 text-right">
                          <div className={`${jetbrains.className} text-[13px] font-medium flex items-center justify-end gap-1 ${payment.status === 'recovered' ? 'text-[var(--accent-green-text)]' : payment.status === 'hard_decline' ? 'text-[var(--accent-red)]' : 'text-[var(--accent-amber)]'}`}>
                            {payment.amount > 1000000 && <StarIcon className="w-2 h-2 text-yellow-500 fill-yellow-500" />}
                            <HighlightMatch text={formatINR(payment.amount)} match={activeSearchQuery} />
                          </div>
                        </td>
                        
                        <td className="px-3 py-2">
                          <div className={`${dmSans.className} inline-flex items-center h-[20px] px-1.5 rounded-full text-[10px] font-medium`} style={{ backgroundColor: getGatewayStyling(payment.gateway).bg, color: getGatewayStyling(payment.gateway).color }}>
                            {getGatewayStyling(payment.gateway).label}
                          </div>
                        </td>
                        
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            {getDeclineIcon(payment.declineCode)}
                            <span className={`${dmSans.className} text-[12px] text-[var(--text-primary)] truncate`}><HighlightMatch text={payment.declineLabel} match={activeSearchQuery} /></span>
                          </div>
                        </td>
                        
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            {getMethodIcon(payment.method)}
                            <span className={`${dmSans.className} text-[12px] text-[var(--text-secondary)] truncate`}>{payment.method}</span>
                          </div>
                        </td>
                        
                        <td className="px-3 py-2">
                          <AttemptBar used={payment.attempts} max={payment.maxAttempts} isHardDecline={payment.status === 'hard_decline'} isUPI={payment.method.includes('UPI')} />
                        </td>
                        
                        <td className="px-3 py-2">
                          <ProbabilityBadge score={payment.probability} isHardDecline={payment.status === 'hard_decline'} index={i} />
                        </td>
                        
                        <td className="px-3 py-2">
                          <div className={`${dmSans.className} inline-flex items-center gap-1.5 h-[22px] px-2 rounded-[20px] text-[10px] font-medium border ${getStatusBadge(payment.status).outline ? 'bg-transparent border-[var(--accent-red)] text-[var(--accent-red)]' : 'border-transparent'}`} style={{ backgroundColor: getStatusBadge(payment.status).outline ? 'transparent' : getStatusBadge(payment.status).bg, color: getStatusBadge(payment.status).color }}>
                            {payment.status === 'just_failed' && <div className="w-1 h-1 rounded-full bg-[var(--accent-red)] animate-pulse" />}
                            {payment.status === 'retrying' && <Loader2 className="w-2 h-2 animate-spin" />}
                            {getStatusBadge(payment.status).label}
                          </div>
                        </td>
                        
                        <td className="px-3 py-2">
                          <div className={`${dmSans.className} text-[11px] text-[var(--text-secondary)] font-medium truncate`}>{payment.lastAction}</div>
                          <div className={`${dmSans.className} text-[10px] text-[var(--text-muted)] truncate leading-tight`}>{payment.lastActionTime}</div>
                        </td>
                        
                        <td className="px-2 py-2">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="w-[28px] h-[28px] text-[var(--text-muted)] hover:text-[var(--accent-blue)] hover:bg-[var(--bg-overlay)]" onClick={(e) => { e.stopPropagation(); toggleRow(payment.id); }}>
                              <Eye className="w-[14px] h-[14px]" />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-[28px] h-[28px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="w-[14px] h-[14px]" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[var(--text-primary)] min-w-[180px]">
                                <DropdownMenuItem className="focus:bg-[var(--bg-overlay)] focus:text-white cursor-pointer"><RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry now</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-[var(--bg-overlay)] focus:text-white cursor-pointer"><Mail className="mr-2 h-3.5 w-3.5" /> Send email</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-[var(--bg-overlay)] focus:text-[#34d399] cursor-pointer"><Smartphone className="mr-2 h-3.5 w-3.5" /> Send WhatsApp</DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[var(--border-default)]" />
                                <DropdownMenuItem className="focus:bg-[var(--bg-overlay)] focus:text-white cursor-pointer"><Eye className="mr-2 h-3.5 w-3.5" /> View gateway dash</DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[var(--border-default)]" />
                                <DropdownMenuItem className="focus:bg-[var(--accent-red-dim)] focus:text-[var(--accent-red)] text-[var(--accent-red)] cursor-pointer"><XCircle className="mr-2 h-3.5 w-3.5" /> Cancel recovery</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                      
                      {/* EXPANDED ROW PANEL */}
                      <tr>
                        <td colSpan={11} className={`p-0 bg-[var(--bg-base)] transition-all duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isExpanded ? 'max-h-[500px] border-b border-[var(--border-strong)]' : 'max-h-0 border-0'}`} style={{ maxHeight: isExpanded ? '500px' : '0' }}>
                          {isExpanded && <ExpandedRowPanel payment={payment} addToast={addToast} />}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </section>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {sortedPayments.map((payment, i) => (
              <div key={payment.id} className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl py-[18px] px-[18px] hover:border-[var(--text-muted)] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`${dmSans.className} inline-flex items-center h-[22px] px-2 rounded-full text-[10px] font-medium border ${getStatusBadge(payment.status).outline ? 'bg-transparent border-[var(--accent-red)] text-[var(--accent-red)]' : 'border-transparent'}`} style={{ backgroundColor: getStatusBadge(payment.status).outline ? 'transparent' : getStatusBadge(payment.status).bg, color: getStatusBadge(payment.status).color }}>
                      {getStatusBadge(payment.status).label}
                    </div>
                    <div className={`${dmSans.className} text-[10px] text-[var(--text-muted)] uppercase tracking-wider`}>{payment.gateway}</div>
                  </div>
                  <div className={`${jetbrains.className} text-[16px] font-bold flex items-center gap-1 ${payment.status === 'recovered' ? 'text-[var(--accent-green-text)]' : payment.status === 'hard_decline' ? 'text-[var(--accent-red)]' : 'text-[var(--accent-amber)]'}`}>
                     {formatINR(payment.amount)}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className={`${dmSans.className} text-[14px] font-medium text-[var(--text-primary)] truncate mb-0.5`}>{payment.email}</div>
                  <div className={`${dmSans.className} text-[12px] text-[var(--text-muted)] truncate`}>{payment.company}</div>
                </div>
                
                <div className="flex justify-between items-center bg-[var(--bg-overlay)] rounded-lg p-2.5 mb-4">
                  <div className="flex items-center gap-1.5">
                    {getDeclineIcon(payment.declineCode)}
                    <span className={`${dmSans.className} text-[12px] text-[var(--text-primary)] truncate`}>{payment.declineLabel}</span>
                  </div>
                  <AttemptBar used={payment.attempts} max={payment.maxAttempts} isHardDecline={payment.status === 'hard_decline'} isUPI={payment.method.includes('UPI')} />
                </div>
                
                <div className="flex justify-between items-end">
                  <ProbabilityBadge score={payment.probability} isHardDecline={payment.status === 'hard_decline'} index={i} />
                  
                  <div className="text-right">
                    <div className={`${dmSans.className} text-[11px] text-[var(--text-secondary)] truncate`}>{payment.lastAction}</div>
                    <div className={`${dmSans.className} text-[10px] text-[var(--text-muted)] truncate mt-0.5`}>{payment.lastActionTime}</div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* SECTION G — TABLE FOOTER */}
        <section className="flex flex-col md:flex-row justify-between items-center gap-4 py-2 border-t border-[var(--border-default)]">
          <div className={`${dmSans.className} text-[13px] text-[var(--text-muted)]`}>
            Showing 1–15 of 143 failed payments · Total at risk: <span className={`${jetbrains.className} text-[var(--accent-amber)]`}>₹3,08,000</span>
          </div>
          
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" className="text-[var(--text-muted)] hover:text-white" /></PaginationItem>
              <PaginationItem><PaginationLink href="#" isActive className="bg-[var(--accent-blue-dim)] text-[var(--accent-blue)] border-[var(--border-accent)]">1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#" className="text-[var(--text-muted)] hover:bg-[var(--bg-overlay)] hover:text-white border-transparent">2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#" className="text-[var(--text-muted)] hover:bg-[var(--bg-overlay)] hover:text-white border-transparent">3</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#" className="text-[var(--text-muted)] hover:bg-[var(--bg-overlay)] hover:text-white border-transparent">4</PaginationLink></PaginationItem>
              <PaginationItem><PaginationNext href="#" className="text-[var(--text-muted)] hover:text-white" /></PaginationItem>
            </PaginationContent>
          </Pagination>
          
          <div className="hidden lg:flex items-center gap-2">
            <span className={`${dmSans.className} text-[13px] text-[var(--text-muted)]`}>Rows per page:</span>
            <Button variant="outline" size="sm" className="h-8 bg-[var(--bg-surface)] border-[var(--border-strong)] text-[12px] font-normal text-[var(--text-secondary)]">
              15 <span className="ml-1 opacity-50">▾</span>
            </Button>
          </div>
        </section>

        <section className="mt-8 mb-12" ref={h1Ref}>
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className={`${plusJakarta.className} text-[16px] font-bold text-[var(--text-primary)]`}>Decline patterns</h2>
              <p className={`${dmSans.className} text-[13px] text-[var(--text-muted)] mt-1`}>Insights based on your last 30 days</p>
            </div>
            <div className={`${jetbrains.className} text-[12px] text-[var(--text-muted)] px-3 py-1 bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-md`}>
              Mar 1 – Mar 21, 2026
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl p-[20px] shadow-sm relative overflow-hidden">
               {hoverDeclineFilter && <div className="absolute inset-0 bg-[var(--accent-amber-dim)] opacity-5 pointer-events-none transition-opacity duration-300" />}
              <h3 className={`${plusJakarta.className} text-[14px] font-semibold text-[var(--text-primary)] mb-4`}>Most common declines</h3>
              <div className="flex flex-col gap-4">
                {[
                  { rank: '#1', name: 'Insufficient funds', count: '52', amount: 8420000, pct: 34, color: 'var(--accent-amber)' },
                  { rank: '#2', name: 'Card expired', count: '34', amount: 6150000, pct: 22, color: 'var(--accent-red)' },
                  { rank: '#3', name: 'UPI mandate failed', count: '29', amount: 4870000, pct: 19, color: '#a855f7' },
                  { rank: '#4', name: 'Do not honor', count: '23', amount: 5230000, pct: 15, color: '#f97316' },
                  { rank: '#5', name: 'Other', count: '5', amount: 6130000, pct: 10, color: 'var(--text-muted)' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-1.5 group/bar cursor-pointer" 
                    onMouseEnter={() => setHoverDeclineFilter(item.name === 'Other' ? null : item.name)}
                    onMouseLeave={() => setHoverDeclineFilter(null)}
                  >
                    <div className="flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-3">
                        <span className={`${jetbrains.className} text-[var(--text-muted)] text-[11px]`}>{item.rank}</span>
                        <span className={`${dmSans.className} font-medium text-[var(--text-primary)] truncate max-w-[120px] group-hover/bar:text-[var(--accent-blue)] transition-colors`}>{item.name}</span>
                        <span className={`${dmSans.className} text-[var(--text-muted)]`}>{item.count}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`${jetbrains.className} text-[var(--accent-green-text)]`}>{formatINR(item.amount)}</span>
                        <span className={`${jetbrains.className} text-[var(--text-muted)] w-8 text-right`}>{item.pct}%</span>
                      </div>
                    </div>
                    <div className="w-full h-[6px] rounded-full bg-[var(--bg-overlay)] overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: h1InView ? `${item.pct}%` : '0%', backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-3 rounded-lg bg-[var(--accent-amber-dim)] border border-[rgba(245,158,11,0.2)]">
                <p className={`${dmSans.className} text-[12px] text-[var(--accent-amber)] leading-relaxed`}>
                  <strong className="font-semibold text-[var(--accent-amber)]">Insight:</strong> Insufficient funds spikes on Mar 5–8 and Mar 18–22. Scheduling retries around payday (Mar 25) could recover ~₹28,000 more.
                </p>
              </div>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl p-[20px] shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className={`${plusJakarta.className} text-[14px] font-semibold text-[var(--text-primary)]`}>Recoverability by decline type</h3>
                <div className="flex items-center bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-md p-0.5">
                  <button onClick={() => setChartPeriod('this_month')} className={`px-2 py-0.5 text-[10px] font-medium rounded ${chartPeriod === 'this_month' ? 'bg-[var(--bg-overlay)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>This month</button>
                  <button onClick={() => setChartPeriod('last_month')} className={`px-2 py-0.5 text-[10px] font-medium rounded ${chartPeriod === 'last_month' ? 'bg-[var(--bg-overlay)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>Last month</button>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                {[
                  { name: 'Network error', pct: chartPeriod === 'this_month' ? 91 : 88, color: 'var(--accent-green-text)' },
                  { name: 'Insufficient funds', pct: chartPeriod === 'this_month' ? 82 : 75, color: 'var(--accent-green-text)' },
                  { name: 'UPI failure', pct: chartPeriod === 'this_month' ? 68 : 52, color: 'var(--accent-blue)' },
                  { name: 'Card expired', pct: chartPeriod === 'this_month' ? 71 : 68, color: 'var(--accent-green-text)' },
                  { name: 'Do not honor', pct: chartPeriod === 'this_month' ? 54 : 41, color: 'var(--accent-blue)' },
                  { name: 'Bank decline', pct: chartPeriod === 'this_month' ? 49 : 45, color: 'var(--accent-amber)' },
                  { name: 'Stolen card', pct: 0, color: 'var(--bg-overlay)' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center group/chart">
                    <div className={`${dmSans.className} text-[13px] text-[var(--text-primary)] w-[120px] truncate pr-2 group-hover/chart:text-[var(--accent-blue)] transition-colors`}>{item.name}</div>
                    <div className={`${jetbrains.className} text-[12px] text-[var(--text-muted)] w-[36px]`}>{item.pct}%</div>
                    <div className="flex-1 border-l pl-2 border-transparent relative h-3 flex items-center">
                      <div className="absolute left-0 top-0 bottom-0 border-l border-[var(--border-strong)] border-dashed opacity-50 z-0 h-full -ml-[1px]" />
                      <div className="h-[8px] rounded-sm relative z-10 transition-all duration-500 ease-in-out" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-[11px] text-[var(--text-muted)] text-center italic">
                Stolen card declines are correctly never retried — protecting your account from fraud chargebacks.
              </div>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[rgba(59,130,246,0.5)] rounded-xl p-[20px] shadow-[0_4px_24px_-4px_rgba(59,130,246,0.1)] relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-blue)] opacity-5 blur-[50px] rounded-full pointer-events-none" />
              <div className="flex items-center gap-3 mb-5">
                <h3 className={`${plusJakarta.className} text-[15px] font-bold text-[var(--text-primary)]`}>What to do next</h3>
                <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-blue-dim)] text-[var(--accent-blue)] uppercase tracking-wider">3 actions</div>
              </div>
              
              <div className="flex flex-col gap-3 flex-1">
                <div className="border border-[var(--border-strong)] rounded-lg p-3.5 bg-[var(--bg-elevated)] border-l-2 border-l-[var(--accent-amber)] relative group hover:border-[var(--accent-amber)] transition-colors">
                  <div className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-[var(--accent-amber)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className={`${dmSans.className} text-[13px] font-semibold text-[var(--text-primary)] mb-1`}>Schedule retries for payday</h4>
                      <p className={`${dmSans.className} text-[12px] text-[var(--text-muted)] mb-2`}>11 "insufficient funds" failures due for retry. Shifting to Mar 25 could add ₹18,700.</p>
                      <button onClick={() => setIsPaydayModalOpen(true)} className={`${plusJakarta.className} text-[12px] font-medium text-[var(--accent-amber)] hover:underline flex items-center gap-1`}>Apply payday timing <span>→</span></button>
                    </div>
                  </div>
                </div>

                <div className="border border-[var(--border-strong)] rounded-lg p-3.5 bg-[var(--bg-elevated)] border-l-2 border-l-[var(--accent-blue)] relative group hover:border-[var(--accent-blue)] transition-colors">
                  <div className="flex gap-2">
                    <Smartphone className="w-4 h-4 text-[var(--accent-blue)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className={`${dmSans.className} text-[13px] font-semibold text-[var(--text-primary)] mb-1`}>Add WhatsApp to 8 customers</h4>
                      <p className={`${dmSans.className} text-[12px] text-[var(--text-muted)] mb-2`}>These customers haven't responded. WA has 88% open rate vs 67% for email.</p>
                      <button onClick={() => setIsWhatsappModalOpen(true)} className={`${plusJakarta.className} text-[12px] font-medium text-[var(--accent-blue)] hover:underline flex items-center gap-1`}>Send WhatsApp to 8 customers <span>→</span></button>
                    </div>
                  </div>
                </div>

                <div className="border border-[var(--border-strong)] rounded-lg p-3.5 bg-[var(--bg-elevated)] border-l-2 border-l-[var(--text-muted)] relative group hover:border-[var(--text-secondary)] transition-colors">
                  <div className="flex gap-2">
                    <ShieldX className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className={`${dmSans.className} text-[13px] font-semibold text-[var(--text-primary)] mb-1`}>Review 5 hard declines manually</h4>
                      <p className={`${dmSans.className} text-[12px] text-[var(--text-muted)] mb-2`}>2 flagged as potentially misclassified.</p>
                      <a href="#" className={`${plusJakarta.className} text-[12px] font-medium text-[var(--text-secondary)] hover:text-white transition-colors flex items-center gap-1`}>Review flagged <span>→</span></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MODALS */}
        {isPaydayModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPaydayModalOpen(false)} />
            <div className="w-full max-w-md bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-amber-dim)] flex items-center justify-center mb-4">
                <CalendarDays className="w-6 h-6 text-[var(--accent-amber)]" />
              </div>
              <h3 className={`${plusJakarta.className} text-[18px] font-bold text-[var(--text-primary)] mb-2`}>Reschedule to Mar 25?</h3>
              <p className={`${dmSans.className} text-[14px] text-[var(--text-secondary)] leading-relaxed mb-6`}>
                This will reschedule 11 "Insufficient funds" retries to Mar 25 (Payday). This will cancel their current retry schedule and set new dates. Estimated recovery increase: <span className="text-[var(--accent-green-text)] font-medium">₹18,700</span>.
              </p>
              <div className="flex gap-3">
                <Button className="flex-1 bg-[var(--accent-amber)] hover:bg-orange-600 text-white border-0" onClick={() => { setIsPaydayModalOpen(false); addToast('11 retries rescheduled to Mar 25', 'amber'); }}>Confirm rescheduling</Button>
                <Button variant="ghost" className="flex-1 text-[var(--text-muted)] hover:text-white" onClick={() => setIsPaydayModalOpen(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {isWhatsappModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsWhatsappModalOpen(false)} />
            <div className="w-full max-w-lg bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-blue-dim)] flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[var(--accent-blue)]" />
                </div>
                <h3 className={`${plusJakarta.className} text-[18px] font-bold text-[var(--text-primary)]`}>WhatsApp Campaign Preview</h3>
              </div>
              
              <div className="mb-6">
                <div className={`${dmSans.className} text-[12px] text-[var(--text-muted)] uppercase tracking-wider mb-2`}>Targeting 8 customers</div>
                <div className="flex flex-wrap gap-2">
                  {['priya@startup.in', 'arjun@tech.co', 'rohan@india.io', 'ananya@growth.com', 'kabir@nexus.in', 'isha@logic.co', 'advait@build.it', 'zoya@dev.io'].map((email, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-[var(--bg-overlay)] border border-[var(--border-default)] text-[11px] text-[var(--text-secondary)]">{email}</span>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className={`${dmSans.className} text-[12px] text-[var(--text-muted)] uppercase tracking-wider mb-2`}>Template Preview</div>
                <div className="bg-[#075e54] p-4 rounded-xl rounded-tl-none relative border border-white/10 max-w-[85%]">
                  <div className={`${dmSans.className} text-[14px] text-white leading-relaxed`}>
                    👋 Hello! We noticed your last payment to *SaaS Product* failed.<br/><br/>
                    Would you like to try again with a different method? You can complete the payment securely here: <br/><br/>
                    <span className="text-blue-200 underline">https://pay.saas.com/r/xyz123</span>
                  </div>
                  <div className="text-right text-[10px] text-white/60 mt-2">12:04 PM ✓✓</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-[var(--accent-green)] hover:bg-emerald-600 text-white border-0" onClick={() => { setIsWhatsappModalOpen(false); addToast('WhatsApp campaign sent to 8 customers', 'green'); }}>Send to all 8 customers</Button>
                <Button variant="ghost" className="flex-1 text-[var(--text-muted)] hover:text-white" onClick={() => setIsWhatsappModalOpen(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

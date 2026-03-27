"use client";

import { Zap, Pause, Play, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import CampaignTimeline, { type TimelineStep } from "@/components/dashboard/CampaignTimeline";

interface Campaign {
  name: string;
  status: "Active" | "Paused" | "Draft";
  gateways: string;
  rate: string;
  recovered: string;
  customers: number;
  lastTriggered: string;
  steps: TimelineStep[];
  currentStep: number;
}

const campaigns: Campaign[] = [
  {
    name: "7-Day Aggressive",
    status: "Active",
    gateways: "Razorpay",
    rate: "82%",
    recovered: "₹1,40,000",
    customers: 89,
    lastTriggered: "2 hours ago",
    currentStep: 3,
    steps: [
      { day: "Day 0", channels: ["retry"], stat: "58% converted" },
      { day: "Day 1", channels: ["email"], stat: "42% converted" },
      { day: "Day 2", channels: ["whatsapp"], stat: "31% converted" },
      { day: "Day 5", channels: ["sms"], },
      { day: "Day 7", channels: ["retry", "email"], },
    ],
  },
  {
    name: "Standard Recovery",
    status: "Active",
    gateways: "Stripe + Cashfree",
    rate: "71%",
    recovered: "₹68,400",
    customers: 41,
    lastTriggered: "6 hours ago",
    currentStep: 1,
    steps: [
      { day: "Day 0", channels: ["retry"], stat: "35% converted" },
      { day: "Day 2", channels: ["email"], },
      { day: "Day 5", channels: ["whatsapp"], },
      { day: "Day 7", channels: ["email", "sms"], },
    ],
  },
  {
    name: "Gentle Follow-up",
    status: "Paused",
    gateways: "All gateways",
    rate: "61%",
    recovered: "₹31,600",
    customers: 13,
    lastTriggered: "3 days ago",
    currentStep: 0,
    steps: [
      { day: "Day 1", channels: ["email"], },
      { day: "Day 5", channels: ["email"], },
      { day: "Day 10", channels: ["whatsapp"], },
    ],
  },
];

const statusStyle: Record<string, string> = {
  Active: "bg-rx-green-dim text-rx-green",
  Paused: "bg-rx-amber-dim text-rx-amber",
  Draft: "bg-rx-overlay text-rx-text-muted",
};

export default function CampaignsPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-rx-text-primary">Recovery Campaigns</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rx-blue text-sm font-heading font-semibold text-white btn-glow hover:opacity-90 transition-opacity">
          <Zap size={16} /> New campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {campaigns.map((c) => (
          <div key={c.name} className="bg-rx-surface border border-border rounded-2xl p-6 card-hover">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-heading font-semibold text-rx-text-primary">{c.name}</h3>
                <p className="text-xs font-body text-rx-text-muted mt-0.5">{c.gateways}</p>
              </div>
              <span className={cn("text-[11px] px-2 py-1 rounded-md font-body", statusStyle[c.status])}>
                {c.status}
              </span>
            </div>

            {/* Timeline */}
            <div className="mb-5 px-1">
              <CampaignTimeline steps={c.steps} currentStep={c.currentStep} />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs mb-4">
              <span className="font-mono text-rx-green-text">{c.rate} recovery</span>
              <span className="text-rx-text-muted">·</span>
              <span className="font-mono text-rx-green-text">{c.recovered}</span>
              <span className="text-rx-text-muted">·</span>
              <span className="font-body text-rx-text-secondary">{c.customers} customers</span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-[11px] font-body text-rx-text-muted">Last triggered: {c.lastTriggered}</span>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-md hover:bg-rx-overlay text-rx-text-muted transition-colors"><Edit size={14} /></button>
                <button className="p-1.5 rounded-md hover:bg-rx-overlay text-rx-text-muted transition-colors">
                  {c.status === "Paused" ? <Play size={14} /> : <Pause size={14} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

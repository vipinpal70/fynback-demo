"use client";

import { cn } from "@/lib/utils";
import { ExternalLink, Unplug, TestTube, FileText } from "lucide-react";

interface Gateway {
  name: string;
  color: string;
  status: "Connected" | "Token expiring" | "Disconnected";
  recovered: string;
  events: string;
  rate: string;
  webhookHealth: boolean[];
  lastWebhook: string;
  warning?: string;
}

const gateways: Gateway[] = [
  {
    name: "Razorpay", color: "hsl(var(--razorpay))",
    status: "Connected", recovered: "₹1,42,000", events: "847", rate: "78%",
    webhookHealth: [true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    lastWebhook: "2 minutes ago",
  },
  {
    name: "Stripe", color: "hsl(var(--stripe))",
    status: "Connected", recovered: "₹68,400", events: "412", rate: "77%",
    webhookHealth: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    lastWebhook: "8 minutes ago",
  },
  {
    name: "Cashfree", color: "hsl(var(--cashfree))",
    status: "Connected", recovered: "₹29,600", events: "198", rate: "80%",
    webhookHealth: [true, true, false, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true],
    lastWebhook: "15 minutes ago",
  },
  {
    name: "PayU", color: "hsl(var(--payu))",
    status: "Token expiring", recovered: "₹0", events: "0", rate: "—",
    webhookHealth: [],
    lastWebhook: "—",
    warning: "Your token expires in 3 days. Reconnect to avoid service interruption.",
  },
];

export default function GatewaysPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-heading font-bold text-rx-text-primary">Payment Gateways</h1>
        <p className="text-sm font-body text-rx-text-muted mt-1">Manage your connected payment providers</p>
      </div>

      <div className="space-y-4">
        {gateways.map((gw) => {
          const isWarning = gw.status === "Token expiring";
          return (
            <div key={gw.name} className={cn(
              "bg-rx-surface border rounded-2xl p-7 card-hover border-l-4",
              isWarning ? "border-rx-amber" : "border-border",
            )} style={{ borderLeftColor: gw.color }}>
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Left: Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-heading font-bold shrink-0" style={{ background: gw.color, color: "#fff" }}>
                      {gw.name[0]}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-rx-text-primary">{gw.name}</h3>
                      <span className={cn("text-[11px] px-2 py-0.5 rounded-md font-body", isWarning ? "bg-rx-amber-dim text-rx-amber" : "bg-rx-green-dim text-rx-green")}>
                        {gw.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-5 text-sm">
                    <div>
                      <span className="text-rx-text-muted font-body text-xs block">Recovered</span>
                      <span className="font-mono text-rx-green-text">{gw.recovered}</span>
                    </div>
                    <div>
                      <span className="text-rx-text-muted font-body text-xs block">Events</span>
                      <span className="font-mono text-rx-text-primary">{gw.events}</span>
                    </div>
                    <div>
                      <span className="text-rx-text-muted font-body text-xs block">Rate</span>
                      <span className="font-mono text-rx-green-text">{gw.rate}</span>
                    </div>
                  </div>

                  {gw.webhookHealth.length > 0 && (
                    <div>
                      <span className="text-xs font-body text-rx-text-muted">Webhook health</span>
                      <div className="flex items-center gap-0.5 mt-1">
                        {gw.webhookHealth.map((ok, i) => (
                          <div key={i} className={cn("w-2 h-4 rounded-sm", ok ? "bg-rx-green" : "bg-rx-red")} />
                        ))}
                      </div>
                      <span className="text-[11px] font-body text-rx-text-muted mt-1 block">Last: {gw.lastWebhook}</span>
                    </div>
                  )}

                  {gw.warning && (
                    <p className="text-xs font-body text-rx-amber bg-rx-amber-dim px-3 py-2 rounded-lg">{gw.warning}</p>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-2 lg:items-end shrink-0">
                  {isWarning ? (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rx-amber text-sm font-heading font-semibold text-background hover:opacity-90 transition-opacity">
                      <ExternalLink size={14} /> Reconnect {gw.name}
                    </button>
                  ) : (
                    <>
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-body text-rx-text-muted hover:text-rx-text-secondary hover:bg-rx-overlay transition-colors">
                        <FileText size={14} /> View webhook logs
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-body text-rx-text-muted hover:text-rx-text-secondary hover:bg-rx-overlay transition-colors">
                        <TestTube size={14} /> Test webhook
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-body text-rx-red hover:bg-rx-red-dim transition-colors">
                        <Unplug size={14} /> Disconnect
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

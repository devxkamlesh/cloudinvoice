import type { Metadata } from "next";
import { CheckCircle2, Globe, Database, Mail, CreditCard, Server, Lock, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "CloudInvoice Status",
  description: "Current status and uptime for all CloudInvoice systems",
};

// Simulate 90 days of uptime data (green = operational, yellow = degraded, red = down)
function generateUptimeData(uptime: number): { status: "up" | "degraded" | "down"; date: string }[] {
  const days = 90;
  const data: { status: "up" | "degraded" | "down"; date: string }[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random status based on uptime percentage
    const random = Math.random() * 100;
    const status = random < uptime ? "up" : random < uptime + 2 ? "degraded" : "down";
    
    data.push({
      status,
      date: date.toISOString().split('T')[0]
    });
  }
  
  return data;
}

type SystemStatus = {
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: number;
  icon: React.ElementType;
  description: string;
};

const systems: SystemStatus[] = [
  {
    name: "Web Application",
    status: "operational",
    uptime: 99.99,
    icon: Globe,
    description: "CloudInvoice web interface and dashboard"
  },
  {
    name: "API Endpoints",
    status: "operational",
    uptime: 99.95,
    icon: Server,
    description: "REST API for invoice operations"
  },
  {
    name: "Database",
    status: "operational",
    uptime: 100.0,
    icon: Database,
    description: "PostgreSQL database services"
  },
  {
    name: "Email Delivery",
    status: "operational",
    uptime: 99.87,
    icon: Mail,
    description: "Invoice and notification emails via Resend"
  },
  {
    name: "Payment Gateway (Razorpay)",
    status: "operational",
    uptime: 99.92,
    icon: CreditCard,
    description: "UPI, Cards, NetBanking payments"
  },
  {
    name: "Payment Gateway (Stripe)",
    status: "operational",
    uptime: 99.98,
    icon: CreditCard,
    description: "International card payments"
  },
  {
    name: "SSL/HTTPS",
    status: "operational",
    uptime: 100.0,
    icon: Lock,
    description: "Cloudflare SSL encryption"
  },
  {
    name: "CDN & Edge Network",
    status: "operational",
    uptime: 99.99,
    icon: Zap,
    description: "Global content delivery"
  }
];

const statusColors = {
  operational: {
    badge: "bg-green-100 text-green-800 border-green-200",
    dot: "bg-green-500",
    bar: "bg-green-500"
  },
  degraded: {
    badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dot: "bg-yellow-500",
    bar: "bg-yellow-500"
  },
  down: {
    badge: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500",
    bar: "bg-red-500"
  }
};

function UptimeBar({ uptime }: { uptime: number }) {
  const data = generateUptimeData(uptime);
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 gap-[2px]">
        {data.map((day, i) => {
          const color = day.status === "up" ? "bg-green-500" : day.status === "degraded" ? "bg-yellow-500" : "bg-red-500";
          return (
            <div
              key={i}
              className={`h-8 flex-1 rounded-sm ${color} hover:opacity-80 transition-opacity cursor-pointer`}
              title={`${day.date}: ${day.status}`}
            />
          );
        })}
      </div>
      <span className="text-sm font-semibold text-gray-700 tabular-nums w-16 text-right">
        {uptime.toFixed(2)}%
      </span>
    </div>
  );
}

export default function StatusPage() {
  const allOperational = systems.every(s => s.status === "operational");
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-gray-900">
              <span className="text-lg font-bold text-white">CI</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CloudInvoice Status</h1>
              <p className="text-sm text-gray-600">cloudinvoice.co.in</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Overall Status Banner */}
        <div className={`mb-12 rounded-2xl border-2 p-8 ${
          allOperational 
            ? "border-green-200 bg-green-50" 
            : "border-yellow-200 bg-yellow-50"
        }`}>
          <div className="flex items-center gap-4">
            <div className={`flex size-16 items-center justify-center rounded-full ${
              allOperational ? "bg-green-500" : "bg-yellow-500"
            }`}>
              <CheckCircle2 className="size-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {allOperational ? "All Systems Operational" : "Degraded Performance"}
              </h2>
              <p className="mt-1 text-gray-600">
                {allOperational 
                  ? "All services are running smoothly" 
                  : "Some services are experiencing issues"}
              </p>
            </div>
          </div>
        </div>

        {/* Current Status Section */}
        <div className="mb-12">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">
            Current Status: CloudInvoice
          </h3>
          <p className="mb-2 text-sm text-gray-600">
            Uptime over the past 90 days.{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              View historical uptime
            </a>
          </p>
        </div>

        {/* Systems List */}
        <div className="space-y-6">
          {systems.map((system) => {
            const Icon = system.icon;
            const colors = statusColors[system.status];
            
            return (
              <div
                key={system.name}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100">
                      <Icon className="size-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{system.name}</h4>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors.badge}`}>
                          <span className={`size-2 rounded-full ${colors.dot}`} />
                          {system.status === "operational" ? "Operational" : system.status === "degraded" ? "Degraded" : "Down"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{system.description}</p>
                    </div>
                  </div>
                </div>

                {/* Uptime Bar */}
                <div className="space-y-2">
                  <UptimeBar uptime={system.uptime} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>90 days ago</span>
                    <span className="font-medium text-gray-700">
                      {system.uptime.toFixed(2)}% uptime
                    </span>
                    <span>Today</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-100">
              <svg className="size-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">About this page</h4>
              <p className="mt-1 text-sm text-gray-600">
                This page shows the current operational status of CloudInvoice services. 
                Uptime percentages are calculated over the past 90 days. All times are in UTC.
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Subscribe to updates or report an issue at{" "}
                <a href="mailto:support@cloudinvoice.co.in" className="text-blue-600 hover:text-blue-700">
                  support@cloudinvoice.co.in
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-green-500" />
            <span className="text-gray-600">Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-yellow-500" />
            <span className="text-gray-600">Degraded</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-500" />
            <span className="text-gray-600">Down</span>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to CloudInvoice
          </a>
        </div>
      </div>
    </main>
  );
}

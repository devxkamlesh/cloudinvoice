import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CloudInvoice Status",
  description: "Current system status and uptime for CloudInvoice services",
};

// Generate 90 days of uptime data (mock data for now)
function generateUptimeData(uptime: number) {
  const days = 90;
  const data = [];
  for (let i = 0; i < days; i++) {
    // Simulate mostly green with occasional yellow/red
    const random = Math.random() * 100;
    const status = random < uptime ? "operational" : random < uptime + 3 ? "degraded" : "down";
    data.push(status);
  }
  return data;
}

const components = [
  {
    name: "Git Operations",
    description: "Performance of git operations",
    uptime: 99.99,
    status: "operational" as const,
    data: generateUptimeData(99.99),
  },
  {
    name: "API Requests",
    description: "Requests to the API",
    uptime: 99.91,
    status: "operational" as const,
    data: generateUptimeData(99.91),
  },
  {
    name: "Webhooks",
    description: "Real-time HTTP callbacks",
    uptime: 100.0,
    status: "operational" as const,
    data: generateUptimeData(100),
  },
  {
    name: "Issues",
    description: "Tracking and managing issues",
    uptime: 99.96,
    status: "operational" as const,
    data: generateUptimeData(99.96),
  },
  {
    name: "Pull Requests",
    description: "Pull request creation and management",
    uptime: 99.98,
    status: "operational" as const,
    data: generateUptimeData(99.98),
  },
  {
    name: "Actions",
    description: "Workflow automation and CI/CD",
    uptime: 99.78,
    status: "operational" as const,
    data: generateUptimeData(99.78),
  },
  {
    name: "Packages",
    description: "Package registry",
    uptime: 99.99,
    status: "operational" as const,
    data: generateUptimeData(99.99),
  },
  {
    name: "Pages",
    description: "Static site hosting",
    uptime: 100.0,
    status: "operational" as const,
    data: generateUptimeData(100),
  },
];

function UptimeBar({ data }: { data: string[] }) {
  return (
    <div className="flex gap-[2px]">
      {data.map((status, i) => (
        <div
          key={i}
          className={`h-8 w-[3px] rounded-sm ${
            status === "operational"
              ? "bg-emerald-500"
              : status === "degraded"
              ? "bg-amber-500"
              : "bg-red-500"
          }`}
          title={`Day ${i + 1}: ${status}`}
        />
      ))}
    </div>
  );
}

function StatusIcon({ status }: { status: "operational" | "degraded" | "down" }) {
  if (status === "operational") {
    return <CheckCircle2 className="size-5 text-emerald-500" />;
  }
  return <div className="size-5 rounded-full bg-red-500" />;
}

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-semibold text-gray-900">
              CloudInvoice
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                Documentation
              </Link>
              <Link href="/status" className="font-semibold text-gray-900">
                Status
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="border-b bg-gradient-to-r from-emerald-50 to-green-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="size-12 shrink-0 text-emerald-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                All Systems Operational
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Uptime over the past <strong>90 days</strong>.{" "}
                <Link href="#history" className="text-blue-600 hover:underline">
                  View historical uptime
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Current Status: CloudInvoice</h2>
        </div>

        {/* Components Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {components.map((component) => (
            <div
              key={component.name}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
                    <StatusIcon status={component.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{component.description}</p>
                </div>
              </div>

              {/* Uptime Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>90 days ago</span>
                  <span className="font-semibold text-gray-900">
                    {component.uptime}% uptime
                  </span>
                  <span>Today</span>
                </div>
                <div className="mt-2 overflow-hidden rounded">
                  <UptimeBar data={component.data} />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">Normal</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h3 className="text-sm font-semibold text-gray-900">Status Legend</h3>
          <div className="mt-4 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-sm bg-emerald-500"></div>
              <span className="text-sm text-gray-600">Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-sm bg-amber-500"></div>
              <span className="text-sm text-gray-600">Degraded Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-sm bg-red-500"></div>
              <span className="text-sm text-gray-600">Major Outage</span>
            </div>
          </div>
        </div>

        {/* Past Incidents */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Past Incidents</h2>
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              No incidents reported in the past 90 days.
            </p>
          </div>
        </div>

        {/* Subscribe */}
        <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Get Status Updates</h3>
          <p className="mt-2 text-sm text-gray-600">
            Subscribe to updates and be notified when incidents occur or are resolved.
          </p>
          <div className="mt-4 flex gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
          <p>
            CloudInvoice Status • Last updated:{" "}
            {new Date().toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZoneName: "short",
            })}
          </p>
          <p className="mt-2">
            <Link href="/" className="text-blue-600 hover:underline">
              Back to CloudInvoice
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}

import type { Metadata } from "next";
import { CheckCircle2, Globe, Database, Mail, CreditCard, Server, Lock, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SystemStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "CloudInvoice Status",
  description: "Current status and uptime for all CloudInvoice systems",
};

export const revalidate = 60; // Revalidate every minute

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Server,
  Database,
  Mail,
  CreditCard,
  Lock,
  Zap,
};

const statusColors = {
  OPERATIONAL: {
    badge: "bg-green-100 text-green-800 border-green-200",
    dot: "bg-green-500",
    bar: "bg-green-500"
  },
  DEGRADED: {
    badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dot: "bg-yellow-500",
    bar: "bg-yellow-500"
  },
  DOWN: {
    badge: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500",
    bar: "bg-red-500"
  },
  MAINTENANCE: {
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    dot: "bg-blue-500",
    bar: "bg-blue-500"
  }
};

function UptimeBar({ uptimeData }: { uptimeData: { date: Date; status: SystemStatus }[] }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 gap-[2px]">
        {uptimeData.map((day, i) => {
          const color = statusColors[day.status].bar;
          const dateStr = day.date.toISOString().split('T')[0];
          return (
            <div
              key={i}
              className={`h-8 flex-1 rounded-sm ${color} hover:opacity-80 transition-opacity cursor-pointer`}
              title={`${dateStr}: ${day.status.toLowerCase()}`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default async function StatusPage() {
  // Fetch all system components with their uptime data
  const components = await prisma.systemComponent.findMany({
    orderBy: { order: 'asc' },
    include: {
      uptimeData: {
        orderBy: { date: 'asc' },
        take: 90,
      },
    },
  });

  // Calculate uptime percentage for each component
  const componentsWithUptime = components.map(component => {
    const totalUptime = component.uptimeData.reduce((sum, record) => sum + record.uptime, 0);
    const avgUptime = component.uptimeData.length > 0 ? totalUptime / component.uptimeData.length : 100;
    
    return {
      ...component,
      uptimePercentage: avgUptime,
    };
  });

  const allOperational = components.every(c => c.status === SystemStatus.OPERATIONAL);
  
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
            <span className="text-gray-400">Updated every minute</span>
          </p>
        </div>

        {/* Systems List */}
        <div className="space-y-6">
          {componentsWithUptime.map((system) => {
            const Icon = iconMap[system.icon] || Server;
            const colors = statusColors[system.status];
            
            return (
              <div
                key={system.id}
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
                          {system.status === SystemStatus.OPERATIONAL 
                            ? "Operational" 
                            : system.status === SystemStatus.DEGRADED 
                            ? "Degraded" 
                            : system.status === SystemStatus.MAINTENANCE
                            ? "Maintenance"
                            : "Down"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{system.description}</p>
                    </div>
                  </div>
                </div>

                {/* Uptime Bar */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <UptimeBar uptimeData={system.uptimeData.map(u => ({ date: u.date, status: u.status }))} />
                    <span className="text-sm font-semibold text-gray-700 tabular-nums w-16 text-right">
                      {system.uptimePercentage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>90 days ago</span>
                    <span className="font-medium text-gray-700">
                      {system.uptimePercentage.toFixed(2)}% uptime
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
                Data is updated every minute.
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
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-blue-500" />
            <span className="text-gray-600">Maintenance</span>
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

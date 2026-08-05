"use server";

import { prisma } from "@/lib/prisma";

export interface HomepageStats {
  totalRevenue: string;
  activeUsers: number;
  paymentSuccessRate: string;
}

/**
 * Fetch real statistics from the database for homepage display
 * Returns actual values only - no fake/default data
 */
export async function getHomepageStats(): Promise<HomepageStats> {
  try {
    // Get total revenue from all paid invoices
    const paidInvoices = await prisma.invoice.aggregate({
      where: {
        status: "PAID",
      },
      _sum: {
        total: true,
      },
    });

    // Get count of active users (users with at least one invoice or client)
    const usersWithActivity = await prisma.user.count({
      where: {
        OR: [
          { invoices: { some: {} } },
          { clients: { some: {} } },
        ],
      },
    });

    // Calculate payment success rate
    // (Total paid invoices / Total sent invoices) * 100
    const totalSentInvoices = await prisma.invoice.count({
      where: {
        status: {
          in: ["SENT", "VIEWED", "PAID", "PARTIALLY_PAID", "OVERDUE"],
        },
      },
    });

    const totalPaidInvoices = await prisma.invoice.count({
      where: {
        status: "PAID",
      },
    });

    const successRate =
      totalSentInvoices > 0
        ? ((totalPaidInvoices / totalSentInvoices) * 100).toFixed(0)
        : "N/A";

    // Format revenue - show 0 if no data
    const revenueInRupees = paidInvoices._sum.total || 0;
    const revenueFormatted = formatIndianCurrency(revenueInRupees);

    return {
      totalRevenue: revenueFormatted,
      activeUsers: usersWithActivity,
      paymentSuccessRate: totalSentInvoices > 0 ? `${successRate}%` : "N/A",
    };
  } catch (error) {
    console.error("Error fetching homepage stats:", error);
    
    // Return zeros on error - no fake data
    return {
      totalRevenue: "₹0",
      activeUsers: 0,
      paymentSuccessRate: "N/A",
    };
  }
}

/**
 * Format number to Indian currency format (Lakhs and Crores)
 * Shows actual values only - returns ₹0 if amount is 0
 */
function formatIndianCurrency(amount: number): string {
  if (amount === 0) return "₹0";
  
  // Convert paise to rupees (assuming amount is in paise)
  const rupees = amount / 100;

  if (rupees >= 10000000) {
    // 1 Crore = 10,000,000
    const crores = rupees / 10000000;
    return `₹${crores.toFixed(1)}Cr+`;
  } else if (rupees >= 100000) {
    // 1 Lakh = 100,000
    const lakhs = rupees / 100000;
    return `₹${lakhs.toFixed(0)}L+`;
  } else if (rupees >= 1000) {
    const thousands = rupees / 1000;
    return `₹${thousands.toFixed(0)}K+`;
  } else {
    return `₹${rupees.toFixed(0)}`;
  }
}

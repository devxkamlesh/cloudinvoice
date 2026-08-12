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
    // Get total revenue from ALL issued invoices (not just this month)
    // This makes more sense for new businesses that don't have monthly volume yet
    const allIssuedInvoices = await prisma.invoice.aggregate({
      where: {
        status: {
          in: ["SENT", "VIEWED", "PAID", "PARTIALLY_PAID", "OVERDUE"],
        },
      },
      _sum: {
        total: true,
      },
    });

    // Get count of active users (users who have signed up)
    const activeUsers = await prisma.user.count();

    // Calculate payment success rate based on PAYMENTS, not invoice status
    // This is more accurate: successful payments / total payment attempts
    const totalPayments = await prisma.payment.count();
    
    const successfulPayments = await prisma.payment.count({
      where: {
        status: "SUCCEEDED",
      },
    });

    const successRate =
      totalPayments > 0
        ? ((successfulPayments / totalPayments) * 100).toFixed(0)
        : "0";

    // Format revenue - show 0 if no data (value is stored in paise/cents, divide by 100)
    const revenueInPaise = allIssuedInvoices._sum.total ? Number(allIssuedInvoices._sum.total) : 0;
    const revenueFormatted = formatIndianCurrency(revenueInPaise);

    return {
      totalRevenue: revenueFormatted,
      activeUsers: activeUsers,
      paymentSuccessRate: totalPayments > 0 ? `${successRate}%` : "0%",
    };
  } catch (error) {
    console.error("Error fetching homepage stats:", error);
    
    // Return zeros on error - no fake data
    return {
      totalRevenue: "₹0",
      activeUsers: 0,
      paymentSuccessRate: "0%",
    };
  }
}

/**
 * Format number to Indian currency format (Lakhs and Crores)
 * Shows actual values only - returns ₹0 if amount is 0
 * Amount is expected in paise (smallest currency unit)
 */
function formatIndianCurrency(amountInPaise: number): string {
  if (amountInPaise === 0) return "₹0";
  
  // Convert paise to rupees (100 paise = 1 rupee)
  const rupees = amountInPaise / 100;

  if (rupees >= 10000000) {
    // 1 Crore = 10,000,000
    const crores = rupees / 10000000;
    return `₹${crores.toFixed(1)}Cr`;
  } else if (rupees >= 100000) {
    // 1 Lakh = 100,000
    const lakhs = rupees / 100000;
    return `₹${lakhs.toFixed(1)}L`;
  } else if (rupees >= 1000) {
    const thousands = rupees / 1000;
    return `₹${thousands.toFixed(0)}K`;
  } else {
    // For amounts less than 1000, show actual rupees
    return `₹${rupees.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
}

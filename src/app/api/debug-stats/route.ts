import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Get all invoices with their issue dates
    const allInvoices = await prisma.invoice.findMany({
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        issueDate: true,
        total: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Get current month invoices
    const currentMonthInvoices = await prisma.invoice.findMany({
      where: {
        issueDate: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
        status: {
          in: ["SENT", "VIEWED", "PAID", "PARTIALLY_PAID", "OVERDUE"],
        },
      },
      select: {
        invoiceNumber: true,
        status: true,
        issueDate: true,
        total: true,
      },
    });

    // Get payments
    const payments = await prisma.payment.findMany({
      select: {
        id: true,
        status: true,
        amount: true,
        method: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Get counts
    const userCount = await prisma.user.count();
    const invoiceCount = await prisma.invoice.count();
    const paymentCount = await prisma.payment.count();

    return NextResponse.json({
      debug: {
        currentDate: now.toISOString(),
        monthStart: startOfCurrentMonth.toISOString(),
        monthEnd: endOfCurrentMonth.toISOString(),
      },
      counts: {
        totalUsers: userCount,
        totalInvoices: invoiceCount,
        totalPayments: paymentCount,
        currentMonthInvoices: currentMonthInvoices.length,
      },
      recentInvoices: allInvoices.map((inv) => ({
        ...inv,
        total: Number(inv.total) / 100, // Convert paise to rupees
        issueDate: inv.issueDate.toISOString(),
        createdAt: inv.createdAt.toISOString(),
      })),
      currentMonthInvoices: currentMonthInvoices.map((inv) => ({
        ...inv,
        total: Number(inv.total) / 100,
        issueDate: inv.issueDate.toISOString(),
      })),
      recentPayments: payments.map((p) => ({
        ...p,
        amount: Number(p.amount) / 100,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Debug stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch debug stats", details: String(error) },
      { status: 500 }
    );
  }
}

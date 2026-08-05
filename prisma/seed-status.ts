import { PrismaClient, SystemStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSystemStatus() {
  console.log('🌱 Seeding system components...');

  const components = [
    {
      name: 'Web Application',
      slug: 'web-app',
      description: 'CloudInvoice web interface and dashboard',
      icon: 'Globe',
      order: 1,
      status: SystemStatus.OPERATIONAL,
    },
    {
      name: 'API Endpoints',
      slug: 'api',
      description: 'REST API for invoice operations',
      icon: 'Server',
      order: 2,
      status: SystemStatus.OPERATIONAL,
    },
    {
      name: 'Database',
      slug: 'database',
      description: 'PostgreSQL database services',
      icon: 'Database',
      order: 3,
      status: SystemStatus.OPERATIONAL,
    },
    {
      name: 'Email Delivery',
      slug: 'email',
      description: 'Invoice and notification emails via Resend',
      icon: 'Mail',
      order: 4,
      status: SystemStatus.OPERATIONAL,
    },
    {
      name: 'Payment Gateway (Razorpay)',
      slug: 'razorpay',
      description: 'UPI, Cards, NetBanking payments',
      icon: 'CreditCard',
      order: 5,
      status: SystemStatus.OPERATIONAL,
    },
    {
      name: 'Payment Gateway (Stripe)',
      slug: 'stripe',
      description: 'International card payments',
      icon: 'CreditCard',
      order: 6,
      status: SystemStatus.OPERATIONAL,
    },
    {
      name: 'SSL/HTTPS',
      slug: 'ssl',
      description: 'Cloudflare SSL encryption',
      icon: 'Lock',
      order: 7,
      status: SystemStatus.OPERATIONAL,
    },
    {
      name: 'CDN & Edge Network',
      slug: 'cdn',
      description: 'Global content delivery',
      icon: 'Zap',
      order: 8,
      status: SystemStatus.OPERATIONAL,
    },
  ];

  for (const component of components) {
    await prisma.systemComponent.upsert({
      where: { slug: component.slug },
      update: component,
      create: component,
    });
  }

  console.log('✓ Created/updated system components');

  // Seed 90 days of uptime data with high uptime
  console.log('🌱 Seeding uptime data (90 days)...');

  const allComponents = await prisma.systemComponent.findMany();
  const now = new Date();

  for (const component of allComponents) {
    const uptimePercentage = 99.5 + Math.random() * 0.5; // 99.5% to 100%

    for (let i = 89; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const randomValue = Math.random() * 100;
      const status =
        randomValue < uptimePercentage
          ? SystemStatus.OPERATIONAL
          : randomValue < uptimePercentage + 0.3
          ? SystemStatus.DEGRADED
          : SystemStatus.DOWN;

      const downtime = status === SystemStatus.DOWN ? Math.floor(Math.random() * 60) : status === SystemStatus.DEGRADED ? Math.floor(Math.random() * 10) : 0;

      const uptime = 100 - (downtime / 1440) * 100; // 1440 minutes in a day

      await prisma.uptimeRecord.upsert({
        where: {
          componentId_date: {
            componentId: component.id,
            date: date,
          },
        },
        update: {
          status,
          uptime,
          downtime,
        },
        create: {
          componentId: component.id,
          date: date,
          status,
          uptime,
          downtime,
        },
      });
    }
  }

  console.log('✓ Created 90 days of uptime records for all components');
  console.log('✅ Status page seeding complete!');
}

seedSystemStatus()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

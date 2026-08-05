-- CreateEnum
CREATE TYPE "SystemStatus" AS ENUM ('OPERATIONAL', 'DEGRADED', 'DOWN', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "SystemComponent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "SystemStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "icon" TEXT NOT NULL DEFAULT 'Server',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UptimeRecord" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "SystemStatus" NOT NULL,
    "uptime" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    "downtime" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UptimeRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'investigating',
    "severity" TEXT NOT NULL DEFAULT 'minor',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentUpdate" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IncidentUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IncidentToSystemComponent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_IncidentToSystemComponent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemComponent_name_key" ON "SystemComponent"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SystemComponent_slug_key" ON "SystemComponent"("slug");

-- CreateIndex
CREATE INDEX "SystemComponent_status_idx" ON "SystemComponent"("status");

-- CreateIndex
CREATE INDEX "UptimeRecord_componentId_idx" ON "UptimeRecord"("componentId");

-- CreateIndex
CREATE INDEX "UptimeRecord_date_idx" ON "UptimeRecord"("date");

-- CreateIndex
CREATE UNIQUE INDEX "UptimeRecord_componentId_date_key" ON "UptimeRecord"("componentId", "date");

-- CreateIndex
CREATE INDEX "Incident_status_idx" ON "Incident"("status");

-- CreateIndex
CREATE INDEX "Incident_startedAt_idx" ON "Incident"("startedAt");

-- CreateIndex
CREATE INDEX "IncidentUpdate_incidentId_idx" ON "IncidentUpdate"("incidentId");

-- CreateIndex
CREATE INDEX "_IncidentToSystemComponent_B_index" ON "_IncidentToSystemComponent"("B");

-- AddForeignKey
ALTER TABLE "UptimeRecord" ADD CONSTRAINT "UptimeRecord_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "SystemComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentUpdate" ADD CONSTRAINT "IncidentUpdate_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncidentToSystemComponent" ADD CONSTRAINT "_IncidentToSystemComponent_A_fkey" FOREIGN KEY ("A") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncidentToSystemComponent" ADD CONSTRAINT "_IncidentToSystemComponent_B_fkey" FOREIGN KEY ("B") REFERENCES "SystemComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

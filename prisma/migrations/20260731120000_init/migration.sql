-- CloudInvoice initial tenant-isolated schema
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'VOID');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');
CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE', 'UPI', 'BANK_TRANSFER', 'CASH', 'OTHER');
CREATE TYPE "TaxMode" AS ENUM ('INTRA_STATE', 'INTER_STATE');

CREATE TABLE "User" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "emailVerified" BOOLEAN NOT NULL DEFAULT false, "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Session" (
  "id" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "token" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, "ipAddress" TEXT, "userAgent" TEXT, "userId" TEXT NOT NULL,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Account" (
  "id" TEXT NOT NULL, "accountId" TEXT NOT NULL, "providerId" TEXT NOT NULL, "userId" TEXT NOT NULL, "accessToken" TEXT,
  "refreshToken" TEXT, "idToken" TEXT, "accessTokenExpiresAt" TIMESTAMP(3), "refreshTokenExpiresAt" TIMESTAMP(3), "scope" TEXT,
  "password" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Verification" (
  "id" TEXT NOT NULL, "identifier" TEXT NOT NULL, "value" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Organization" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "slug" TEXT NOT NULL, "logoUrl" TEXT, "email" TEXT, "phone" TEXT, "address" TEXT,
  "gstin" TEXT, "pan" TEXT, "stateCode" TEXT, "currency" TEXT NOT NULL DEFAULT 'INR', "invoicePrefix" TEXT NOT NULL DEFAULT 'INV',
  "nextInvoiceNo" INTEGER NOT NULL DEFAULT 1, "stripeAccountId" TEXT, "upiId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Membership" (
  "id" TEXT NOT NULL, "role" TEXT NOT NULL DEFAULT 'owner', "userId" TEXT NOT NULL, "organizationId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Client" (
  "id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT, "phone" TEXT, "billingAddress" TEXT,
  "gstin" TEXT, "stateCode" TEXT, "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Invoice" (
  "id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "clientId" TEXT NOT NULL, "invoiceNumber" TEXT NOT NULL,
  "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT', "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "dueDate" TIMESTAMP(3) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'INR', "template" TEXT NOT NULL DEFAULT 'classic', "taxMode" "TaxMode" NOT NULL DEFAULT 'INTRA_STATE', "subtotal" DECIMAL(12,2) NOT NULL,
  "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0, "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0, "total" DECIMAL(12,2) NOT NULL,
  "amountPaid" DECIMAL(12,2) NOT NULL DEFAULT 0, "notes" TEXT, "terms" TEXT, "publicToken" TEXT NOT NULL,
  "sentAt" TIMESTAMP(3), "viewedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "InvoiceItem" (
  "id" TEXT NOT NULL, "invoiceId" TEXT NOT NULL, "description" TEXT NOT NULL, "hsnSac" TEXT, "quantity" DECIMAL(10,2) NOT NULL,
  "unitPrice" DECIMAL(12,2) NOT NULL, "discount" DECIMAL(12,2) NOT NULL DEFAULT 0, "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
  "total" DECIMAL(12,2) NOT NULL, CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Payment" (
  "id" TEXT NOT NULL, "invoiceId" TEXT NOT NULL, "amount" DECIMAL(12,2) NOT NULL, "currency" TEXT NOT NULL DEFAULT 'INR',
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING', "method" "PaymentMethod" NOT NULL, "stripePaymentId" TEXT, "reference" TEXT,
  "paidAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");
CREATE UNIQUE INDEX "Account_providerId_accountId_key" ON "Account"("providerId", "accountId");
CREATE UNIQUE INDEX "Verification_identifier_value_key" ON "Verification"("identifier", "value");
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");
CREATE UNIQUE INDEX "Membership_userId_organizationId_key" ON "Membership"("userId", "organizationId");
CREATE INDEX "Membership_organizationId_idx" ON "Membership"("organizationId");
CREATE INDEX "Client_organizationId_name_idx" ON "Client"("organizationId", "name");
CREATE UNIQUE INDEX "Invoice_organizationId_invoiceNumber_key" ON "Invoice"("organizationId", "invoiceNumber");
CREATE UNIQUE INDEX "Invoice_publicToken_key" ON "Invoice"("publicToken");
CREATE INDEX "Invoice_organizationId_status_dueDate_idx" ON "Invoice"("organizationId", "status", "dueDate");
CREATE INDEX "Invoice_publicToken_idx" ON "Invoice"("publicToken");
CREATE UNIQUE INDEX "Payment_stripePaymentId_key" ON "Payment"("stripePaymentId");
CREATE INDEX "Payment_invoiceId_status_idx" ON "Payment"("invoiceId", "status");

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Client" ADD CONSTRAINT "Client_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

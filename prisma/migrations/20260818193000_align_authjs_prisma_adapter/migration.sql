-- Align the existing auth tables with Auth.js Prisma adapter fields while preserving
-- every current password account and session token.

-- Auth.js stores a verification timestamp rather than a boolean. Existing users were
-- not email-verified through a provider, so false maps to NULL and true maps to the
-- migration timestamp.
ALTER TABLE "User"
  ALTER COLUMN "emailVerified" DROP DEFAULT,
  ALTER COLUMN "emailVerified" TYPE TIMESTAMP(3)
    USING (CASE WHEN "emailVerified" THEN CURRENT_TIMESTAMP ELSE NULL END),
  ALTER COLUMN "emailVerified" DROP NOT NULL;

-- Current Auth.js Account fields. Existing providerId/accountId columns remain in
-- place and are mapped by Prisma, so password-account relationships are unchanged.
ALTER TABLE "Account"
  ADD COLUMN "type" TEXT NOT NULL DEFAULT 'credentials',
  ADD COLUMN "expires_at" INTEGER,
  ADD COLUMN "token_type" TEXT,
  ADD COLUMN "session_state" TEXT;

-- Existing rows are password credentials. OAuth rows created after this migration
-- receive their provider type from Auth.js.
UPDATE "Account" SET "type" = 'credentials' WHERE "type" IS NULL OR "type" = '';

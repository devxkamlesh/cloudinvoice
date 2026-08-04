-- Platform and membership roles.
--
-- Additive and reversible by design: every new column has a default, so existing rows
-- stay valid and the app keeps working if this runs before the new code deploys.

-- Platform-wide access, separate from workspace membership.
CREATE TYPE "PlatformRole" AS ENUM ('USER', 'ADMIN');

-- Organization-scoped role. Replaces a free-form text column.
CREATE TYPE "MemberRole" AS ENUM ('OWNER', 'MEMBER');

-- Every existing user stays a plain USER. Promotion to ADMIN is a deliberate manual
-- statement, never something a request path can perform.
ALTER TABLE "User" ADD COLUMN "platformRole" "PlatformRole" NOT NULL DEFAULT 'USER';

-- Null means active. Suspension is reversible and destroys nothing.
ALTER TABLE "User" ADD COLUMN "suspendedAt" TIMESTAMP(3);

-- Membership.role was TEXT DEFAULT 'owner' and unread by any code. Convert in place,
-- mapping the historical lowercase value and treating anything unexpected as the
-- lower-privilege MEMBER rather than failing open to OWNER.
ALTER TABLE "Membership"
  ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "Membership"
  ALTER COLUMN "role" TYPE "MemberRole"
  USING (
    CASE lower("role")
      WHEN 'owner' THEN 'OWNER'::"MemberRole"
      ELSE 'MEMBER'::"MemberRole"
    END
  );

ALTER TABLE "Membership"
  ALTER COLUMN "role" SET DEFAULT 'OWNER';

-- Supports the admin user list, which filters and sorts on these.
CREATE INDEX "User_platformRole_idx" ON "User"("platformRole");
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

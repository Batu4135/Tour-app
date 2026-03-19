DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LicenseType') THEN
    CREATE TYPE "LicenseType" AS ENUM ('NONE', 'LP', 'LK', 'LA', 'LV');
  END IF;
END $$;

ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "licenseType" "LicenseType" NOT NULL DEFAULT 'NONE',
ADD COLUMN IF NOT EXISTS "licenseWeightGrams" INTEGER NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LicenseMaterial') THEN
    CREATE TYPE "LicenseMaterial" AS ENUM ('LP', 'LK', 'LA', 'LV');
  END IF;
END $$;

ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "licenseMaterial" "LicenseMaterial",
ADD COLUMN IF NOT EXISTS "licenseWeightGrams" INTEGER NOT NULL DEFAULT 0;

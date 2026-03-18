DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PaymentMethod') THEN
    CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK', 'DIRECT_DEBIT');
  END IF;
END $$;

ALTER TABLE "Draft"
ADD COLUMN IF NOT EXISTS "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
ADD COLUMN IF NOT EXISTS "tourClosedAt" TIMESTAMP(3);

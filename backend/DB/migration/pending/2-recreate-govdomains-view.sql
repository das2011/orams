BEGIN TRANSACTION;

ALTER TABLE IF EXISTS "public"."referral" DROP COLUMN IF EXISTS agency_name;

ALTER TABLE IF EXISTS "public"."referral" ADD COLUMN IF NOT EXISTS "domain" character varying not null;

COMMIT;

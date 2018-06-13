BEGIN TRANSACTION;

CREATE TYPE referral_status_enum AS ENUM (
  'created',
  'accepted',
  'rejected',
  'cancelled',
  'completed',
  'sentForPayment');

ALTER TABLE IF EXISTS "public"."referral" ADD COLUMN IF NOT EXISTS "status" referral_status_enum not null DEFAULT 'created';

COMMIT;
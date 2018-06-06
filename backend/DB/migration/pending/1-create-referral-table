BEGIN TRANSACTION;

create table if not exists "public"."referral" (
    "id" serial,
    "service_type_price_id" integer not null,
    "agency_name" character varying not null,
    "created_by" integer not null,
    "created_at" timestamp without time zone not null
);


CREATE UNIQUE INDEX IF NOT EXISTS referral_pkey ON referral USING btree (id);

ALTER TABLE "public"."referral" DROP CONSTRAINT IF EXISTS "referral_pkey";
alter table "public"."referral" add constraint "referral_pkey" PRIMARY KEY using index "referral_pkey";

ALTER TABLE "public"."referral" DROP CONSTRAINT IF EXISTS "referral_created_by_fkey";
alter table "public"."referral" add constraint "referral_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "user"(id);

ALTER TABLE "public"."referral" DROP CONSTRAINT IF EXISTS "referral_service_type_price_id_fkey";
alter table "public"."referral" add constraint "referral_service_type_price_id_fkey" FOREIGN KEY (service_type_price_id) REFERENCES service_type_price(id);

COMMIT;

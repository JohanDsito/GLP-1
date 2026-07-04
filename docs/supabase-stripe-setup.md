# Supabase + Stripe Setup

## Frontend environment

Add these variables to your frontend `.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Stripe is never called directly from the frontend. Checkout and billing-portal URLs are created by Supabase Edge Functions on demand, using the logged-in user's session.

## Edge Function secrets

Configure these as Supabase secrets (`supabase secrets set NAME=value`), never in the frontend `.env`:

- `STRIPE_SECRET_KEY` — prefer a [restricted key](https://docs.stripe.com/keys/restricted-api-keys) scoped to Checkout Sessions, Billing Portal, Subscriptions, and Customers, instead of the full secret key.
- `STRIPE_PRICE_ID` — the recurring monthly price for the membership (`price_...`, not the product id `prod_...`).
- `STRIPE_WEBHOOK_SECRET` — from the webhook endpoint in the Stripe dashboard.
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` — used by `create-checkout-session` and `create-portal-session` to read the caller's session.
- `SUPABASE_SERVICE_ROLE_KEY` — used only by `stripe-webhook` to write subscription rows (RLS blocks client writes).
- `APP_URL` — the deployed frontend origin, used to build `success_url` / `cancel_url` / `return_url`.

## Database

Apply migrations in order:

1. `supabase/migrations/202607030001_create_subscriptions.sql`
2. `supabase/migrations/202607030003_full_schema.sql`
3. `supabase/migrations/202607040001_lock_subscriptions_rls.sql` — restricts `insert`/`update`/`delete` on `public.subscriptions` to `service_role` only. Without this, an authenticated client can write directly to their own subscription row and grant themselves access without paying.

## Edge Functions

- `create-checkout-session` — verifies the caller's Supabase session, creates a Stripe Checkout Session (`mode: 'subscription'`) with `client_reference_id` and `subscription_data.metadata.user_id` set to the Supabase user id, and returns the session URL for the frontend to redirect to.
- `create-portal-session` — verifies the caller's session, looks up their `stripe_customer_id`, and returns a Billing Portal session URL.
- `stripe-webhook` — listens for `customer.subscription.created|updated|deleted`, and upserts `public.subscriptions` using `subscription.metadata.user_id`. This is why the checkout session above must set that metadata; without it the webhook silently no-ops.

Deploy all three functions:

```bash
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session
supabase functions deploy stripe-webhook
```

## Stripe webhook endpoint

In the Stripe dashboard, point the webhook endpoint at the deployed `stripe-webhook` function URL and subscribe it to:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Copy the resulting signing secret into `STRIPE_WEBHOOK_SECRET`.

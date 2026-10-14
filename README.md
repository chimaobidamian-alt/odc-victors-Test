# ODC VICTORS — Test Store

A mobile-first Next.js 14 storefront for ODC VICTORS, a handmade leather brand based in Port Harcourt, Nigeria. Uses an earthy cream / cocoa / tan palette and NGN pricing. **This is a test/demo build. It is not ready for live orders without the production checklist below.**

## Included

- Responsive homepage, product catalogue, category/colour/size/price filters, search and sort
- Product detail, size and colour choices, quantity, stock display, wishlist, cart
- Checkout form, destination-based delivery fee estimate, Cash on Delivery / WhatsApp / Paystack test-mode choices
- Supabase email/password and Google OAuth sign-in, account orders page
- Supabase SQL schema with RLS policies, products/categories/orders/order items/cart/reviews/wishlist/profiles
- Admin starter page for product CRUD, order status updates and customer profile listing
- Paystack test-mode initialization and server-side verification endpoints
- WhatsApp order/chat links
- `.env.example` and setup instructions

## Important implementation notes

- The provided brand image is the visual reference. The header uses a lightweight typographic brand lockup so it remains crisp at small sizes; place your actual image at `public/odc-victors-logo.jpg` and update `src/components/header.tsx` to use it if you prefer the exact artwork.
- The product catalogue currently comes from `src/lib/products.ts` seed data so the shop works immediately without credentials. To make database products the source of truth, seed `public.products` and connect the shop query to Supabase. The admin endpoints write to the database. This is a demo scaffold, not a fully audited commerce backend.
- Cart and wishlist work locally in the browser for this demo. The database tables are included for migrating them to authenticated cross-device persistence.
- Mailgun environment variables are documented, but sending welcome/order notification/password-reset messages is not wired into every flow in this initial scaffold. Supabase Auth should send password-reset and verification emails; configure a custom SMTP provider (Mailgun) in Supabase for those. Implement order email calls in the trusted server-side order creation flow before production.
- Google sign-in uses Supabase Auth's Google provider, which avoids running two competing session systems. Google credentials are configured in Supabase Auth rather than NextAuth. `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are provided as reference environment variables.
- For safety, Paystack test mode checks the secret key prefix. Before production, add signed webhooks, server-side total calculation from database product prices, stock reservation/decrement, idempotency, and order ownership checks. The checkout currently stores an order before redirecting to Paystack.
- Reviews tables are included; the customer-facing review submission UI is a follow-up enhancement.
- Demo product photos use remote Unsplash images. Replace these with actual product photos before launch.

## Requirements

- Node.js 20 LTS recommended
- npm
- Supabase project
- Optional: Paystack test keys, Google Cloud OAuth credentials, Mailgun domain
- Neon is optional. This app uses Supabase Postgres by default; do not configure Supabase and Neon as two competing databases unless you intentionally migrate the schema.

## 1. Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

On Windows Command Prompt, copy the env file with:

```bat
copy .env.example .env.local
```

Open `http://localhost:3000`.

The storefront pages and seeded demo catalogue render before you configure Supabase. Login, database checkout and admin features require credentials.

## 2. Supabase setup

1. Create a project at https://supabase.com and choose a strong database password.
2. Open **Project Settings → API**. Copy Project URL and anon/public key to `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Copy the service-role key to `SUPABASE_SERVICE_ROLE_KEY` only if you later add trusted admin/background jobs. Never expose it in browser code.
4. Open **SQL Editor**, paste and run `supabase/schema.sql`.
5. In **Authentication → URL Configuration**, set Site URL to `http://localhost:3000`; add `http://localhost:3000/auth/callback` to Redirect URLs. Add your deployed HTTPS URL before launch.
6. In **Storage**, create a bucket named `product-images`. For a demo, public product images can be served from a public bucket; restrict upload/delete permissions to admins. Use the bucket for actual product photos.
7. Register an account using the email you plan to administer. Then in SQL Editor run (replace email):
   ```sql
   update public.profiles set role='admin' where email='you@example.com';
   ```
8. Set `ADMIN_EMAIL` to that exact email in `.env.local`.
9. Add actual product records to `public.products` if you want the admin list and database catalogue to be populated. The current shop cards use seed products from `src/lib/products.ts`.

### Email/password and password reset

Email/password sign-up and login use Supabase Auth. Configure Auth → SMTP settings with your Mailgun SMTP credentials if you want Supabase's confirmation/reset emails delivered through Mailgun. Add a password reset page/flow before launch.

## 3. Google OAuth 2.0

This project uses **Supabase Auth Google provider** (not NextAuth) to avoid duplicate session handling.

1. Visit https://console.cloud.google.com and create/select a project.
2. Configure **Google Auth Platform / OAuth consent screen**. Use External for public customers, enter app name and support email, and add test users while in testing.
3. Create an OAuth Client ID of type **Web application**.
4. Add your local origin `http://localhost:3000` under Authorized JavaScript origins.
5. In Supabase Dashboard → Authentication → Providers → Google, copy the callback URL Supabase displays. It is usually `https://YOUR_PROJECT.supabase.co/auth/v1/callback`; paste it under Google Authorized redirect URIs.
6. Copy Google Client ID and Client Secret into Supabase's Google provider fields and enable the provider.
7. Keep `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` server-side; never commit real credentials. The app's Google button calls Supabase OAuth and returns to `/auth/callback`.

## 4. Paystack test mode

1. Create/log into a Paystack account and obtain the **Test** public and secret keys from the dashboard.
2. Set `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...` and `PAYSTACK_SECRET_KEY=sk_test_...` in `.env.local`.
3. Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
4. Checkout → Paystack initializes a test transaction through `/api/paystack/initialize`. Verify the callback server-side through `/api/paystack/verify`.
5. Use Paystack test card details from Paystack's current official test documentation only. No real money should be charged while using test keys.

Before launch, add a Paystack webhook that validates `x-paystack-signature`, handles duplicate events, and updates payment/order state atomically. Never trust a client redirect alone as proof of payment.

## 5. Mailgun setup

1. Create a Mailgun account and add a sending domain.
2. Verify the domain DNS records (SPF, DKIM and any required tracking records).
3. In Mailgun, copy the API key and sending domain into `MAILGUN_API_KEY` and `MAILGUN_DOMAIN`.
4. Set `MAILGUN_FROM` to a verified sender, e.g. `ODC VICTORS <orders@mg.example.com>`.
5. Configure Supabase Auth SMTP to send confirmation and password-reset mail through Mailgun. Mailgun SMTP credentials differ from the HTTP API key; use the credentials shown by Mailgun.
6. For order-confirmation and admin-notification emails, add a server-only Mailgun call after a validated order is created. Suggested email content: order ID, item list, quantity, NGN totals, delivery address, selected delivery destination, payment method/status and WhatsApp support number. Do not send customer email from browser code.

The Mailgun variables are included, but custom order/welcome email delivery needs to be completed and tested before production.

## 6. Neon Postgres (optional alternative)

This scaffold uses Supabase Postgres because Supabase Auth and Storage are requested. If you prefer Neon:
1. Create a Neon project and copy the pooled connection string into `DATABASE_URL`.
2. Run the SQL schema against Neon after adapting Supabase-specific `auth.users`, `auth.uid()`, triggers and RLS policies.
3. Keep Supabase Auth for identities and store the Supabase user UUID in Neon records, or replace Auth intentionally. Supabase Auth RLS policies in `schema.sql` do **not** run unchanged on Neon.
4. Do not split orders and products across Neon and Supabase without a clear architecture. For this test store, using Supabase Database + Auth + Storage is the simplest supported setup.

## 7. Brand assets and product images

Copy the supplied logo image to `public/odc-victors-logo.jpg` and update the header component if you want to display the exact logo artwork. Replace the Unsplash placeholder images with your actual product photography. Add `images.unsplash.com` to `next.config.mjs` if you later switch to `next/image`; current cards use ordinary `<img>` tags.

## 8. Pages

- `/` home
- `/shop` catalogue and filters
- `/product/[slug]` product details
- `/cart`, `/checkout`
- `/account` sign in/register, `/account/orders`
- `/wishlist`
- `/about`, `/contact`, `/size-guide`, `/returns`
- `/admin` starter dashboard (requires the configured admin account)

## 9. Pre-launch checklist

- [ ] Replace all demo products/images and confirm sizes, colours, prices and stock.
- [ ] Connect catalogue queries and image upload to Supabase Storage.
- [ ] Finish persistent authenticated cart/wishlist and review UI.
- [ ] Finish welcome/order/admin emails and password reset UX.
- [ ] Add rate limiting, server-side validation, CSRF/abuse controls and audit logging.
- [ ] Restrict admin API to a trusted database role, not email alone; check user roles server-side.
- [ ] Verify totals on server from database prices; prevent negative quantities and stale stock.
- [ ] Add Paystack signed webhook and idempotent payment/order processing.
- [ ] Publish final return policy, privacy policy, terms and customer support details.
- [ ] Run security review and test all checkout/auth flows before accepting real orders.

## Environment variables

See `.env.example`. Never commit `.env.local` or paste secret keys into client-side code.

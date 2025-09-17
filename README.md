# HAA — Expo React Native App (NativeWind + Supabase, JS)

This app mirrors your HAA website's flows for **Auth, Dashboard, Homes, Vehicles, Providers, Community, Notifications** — using **Expo + React Navigation**, **Supabase Auth & Tables**, and **NativeWind (Tailwind)**.

> Uses **JS only**, no TypeScript. `navigation.js` is the root navigator.

---

## 1) Prereqs
- Node 18+ and npm
- Expo CLI (`npm i -g expo` recommended)
- A Supabase project (same one the website uses)

## 2) Configure environment
Create a `.env` file in the project root by copying `.env.example`, then set:

```
EXPO_PUBLIC_SUPABASE_URL=YOUR_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Expo automatically exposes `EXPO_PUBLIC_*` variables to the JS runtime.

## 3) Install & run
```bash
npm install
npm run start   # choose a device: Android, iOS, or Web
```
- For Android (device/emulator): `npm run android`
- For iOS (simulator): `npm run ios` (macOS only)
- For web: `npm run web` (uses Metro because we configured it)

If Metro cache acts up: `expo start -c`

## 4) Supabase tables expected
The code references these tables — rename here or in code to match your website schema:
- `homes` (id, name, city, address, notes, created_at)
- `vehicles` (id, year, make, model, nickname, mileage, created_at)
- `service_providers` (id, company_name, service_type, service_area, website, reviews, rating, created_at)
- `community_posts` (id, author, content, created_at)
- `notifications` (id, title, due_date, done, created_at)

## 5) Where is what?
- `navigation.js` — root navigation: Auth stack ➜ Main drawer
- `screens/*` — screens organized by domain
- `components/*` — basic UI atoms (Button, Input, Card)
- `lib/supabase.js` — Supabase client (reads env)

## 6) NativeWind/Tailwind setup (as requested)
Already wired:
- `nativewind` + `tailwindcss`
- `babel.config.js` uses `nativewind/babel`
- `metro.config.js` is wrapped with `withNativeWind`
- `global.css` loaded in `App.js`
- `tailwind.config.js` scans `App.js`, `navigation.js`, `components/**/*`, `screens/**/*`

## 7) Navigation / Flow
- On launch, unauthenticated users see **Login** (with link to **Signup**).
- After login, users are routed to `Main` (**Dashboard** in a Drawer) with links to Homes, Vehicles, Service Providers, Community, and Notifications.
- Add/Edit forms are included for Homes, Vehicles, and Providers.

## 8) Adapting to your exact schema
Because the website tables may be named slightly differently, update the target table names in the screens (search for `from("homes")`, etc.).

## 9) Production notes
- Use Supabase Row Level Security (RLS) and policies.
- Add input validation and error handling to taste.
- Replace placeholder images in `assets/`.
- EAS Build or `expo run:android` / `expo run:ios` for device binaries.

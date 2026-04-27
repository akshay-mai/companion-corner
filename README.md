# 🐾 Amazing Pet Wala

A cute, emotionally engaging pet shop website built with **React + Vite + Tailwind CSS + Framer Motion** and powered by **Lovable Cloud (Supabase)**.

- Public site: browse pets, filter by category/price, submit enquiries.
- Admin panel at `/my-section` (hidden from nav) for managing categories, pets, and viewing enquiries.
- Contact: WhatsApp + Call buttons, address shown on homepage.

---

## 📦 Tech Stack

- React 18 + Vite 5 + TypeScript
- Tailwind CSS v3 + shadcn/ui
- Framer Motion (animations)
- TanStack Query (data fetching)
- Supabase (DB + Auth) via Lovable Cloud

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
bun install   # or: npm install

# 2. Run dev server
bun run dev   # or: npm run dev
```

App runs at `http://localhost:8080`.

> ⚠️ Before running, you must configure the **Supabase backend** (see steps below).

---

## 🔧 Supabase Setup — Step by Step

You can either **(A) use Lovable Cloud** (auto-managed, recommended) or **(B) connect your own Supabase project** (self-hosted setup).

### Option A — Lovable Cloud (Recommended)

If the project is opened inside Lovable, Cloud is already enabled. Skip to **Step 5** to seed data.

### Option B — Use Your Own Supabase Project

#### Step 1 — Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) → **New Project**.
2. Choose a name, password, and region.
3. Wait ~2 minutes for the project to provision.

#### Step 2 — Get Your Project Credentials
In your Supabase dashboard → **Project Settings → API**, copy:

| What | Where to use |
|---|---|
| **Project URL** (e.g. `https://xxxx.supabase.co`) | `VITE_SUPABASE_URL` |
| **anon / public key** | `VITE_SUPABASE_PUBLISHABLE_KEY` |
| **Project Ref** (the `xxxx` part of the URL) | `VITE_SUPABASE_PROJECT_ID` |

#### Step 3 — Update Environment Variables

Replace the values in **`.env`** at the project root:

```env
VITE_SUPABASE_PROJECT_ID="your-project-ref"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
```

Also update **`supabase/config.toml`**:

```toml
project_id = "your-project-ref"
```

#### Step 4 — Run the Database Migration

In your Supabase dashboard → **SQL Editor → New query**, paste & run the contents of:

```
supabase/migrations/20260326183311_fe4a6c3e-384e-412e-9665-87ac0d97812c.sql
```

This creates 3 tables with Row Level Security:

| Table | Columns | Purpose |
|---|---|---|
| `categories` | `name` | Pet categories (Dogs, Cats, etc.) |
| `pets` | `name`, `price`, `description`, `category_id`, `image_url` | Pet listings |
| `enquiries` | `name`, `phone`, `message`, `pet_id` | Customer enquiries |

**Access rules:**
- Anyone (public) can read categories, pets, and submit enquiries.
- Anyone can insert/update/delete categories & pets (admin operations are gated by login on the frontend at `/my-section`).

#### Step 5 — Seed Initial Data (Optional but Recommended)

Run this in Supabase **SQL Editor** to seed sample categories & pets:

```sql
-- Seed categories
INSERT INTO public.categories (name) VALUES
  ('Dogs'), ('Cats'), ('Birds'), ('Fish'), ('Rabbits'), ('Reptiles');

-- Seed sample pets (replace category_id values with actual IDs from your categories table)
-- Tip: SELECT id, name FROM categories;  to grab the IDs first
```

#### Step 6 — Configure Authentication

In Supabase dashboard → **Authentication → Providers → Email**:
- ✅ **Enable Email provider**
- ✅ **Auto-confirm emails** (so admin login works without email verification)
- ❌ **Disable public signups** (only the admin user should exist)

#### Step 7 — Create the Admin User

In Supabase dashboard → **Authentication → Users → Add user → Create new user**:

| Field | Value |
|---|---|
| Email | `my@gmail.com` |
| Password | `9250103157` |
| Auto Confirm User | ✅ Yes |

> 🔒 You can change these credentials — just use the new values when logging in at `/my-section`.

#### Step 8 — Verify Everything

1. Run `bun run dev`
2. Visit `http://localhost:8080` → should see homepage with categories/pets.
3. Visit `http://localhost:8080/my-section` → log in with admin creds.
4. Add a pet, submit a test enquiry from the public site, verify it appears in the admin panel.

---

## 🗂️ Project Structure

```
src/
├── assets/              # Hero images & static assets
├── components/          # Reusable UI components
│   ├── ui/              # shadcn components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── PetCard.tsx
│   ├── CategoryCard.tsx
│   └── EnquiryModal.tsx
├── hooks/
│   └── use-data.ts      # TanStack Query hooks (CRUD)
├── integrations/
│   └── supabase/        # Auto-generated client & types ⚠️ do not edit
├── pages/
│   ├── Index.tsx        # Homepage (hero, categories, contact)
│   ├── BrowsePage.tsx   # Browse with filters
│   ├── AdminLogin.tsx   # /my-section login
│   ├── AdminPage.tsx    # Admin dashboard (auth-protected)
│   └── NotFound.tsx
└── index.css            # Design tokens (pastel theme)

supabase/
├── config.toml          # Project ref
└── migrations/          # SQL migrations
```

---

## 🧾 Brand & Contact Info

Update these in code if rebranding:

| Item | Value | File(s) |
|---|---|---|
| Brand name | `Amazing Pet Wala` | `Navbar.tsx`, `Footer.tsx`, `index.html`, `Index.tsx` |
| Phone | `+91 8587944627` | `Index.tsx` (Call & WhatsApp buttons) |
| Address | Ramesh Nagar Metro Station, near Kesar Chai Wala | `Index.tsx` (Contact section) |
| Admin route | `/my-section` | `App.tsx` |

---

## ✅ Replacement Checklist

When moving to a new Supabase project, replace these values:

- [ ] `.env` → `VITE_SUPABASE_PROJECT_ID`
- [ ] `.env` → `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `.env` → `VITE_SUPABASE_URL`
- [ ] `supabase/config.toml` → `project_id`
- [ ] Run migration SQL in new project
- [ ] Seed categories + pets
- [ ] Configure Email auth (auto-confirm ON, signups OFF)
- [ ] Create admin user `my@gmail.com` / `9250103157`

---

## 🚢 Deployment

**Via Lovable:** Click **Publish** (top-right). Frontend changes go live on update; backend changes deploy automatically.

**Custom domain:** After publishing → **Project Settings → Domains**.

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| Empty homepage / no pets | Run the seed SQL from Step 5 |
| Can't log in to `/my-section` | Re-create admin user in Supabase Auth, ensure auto-confirm is ON |
| "Failed to fetch" errors | Check `.env` values match Supabase project |
| Enquiries not saving | Verify RLS policies from migration are applied |

---

Made with ❤️ for animal lovers.

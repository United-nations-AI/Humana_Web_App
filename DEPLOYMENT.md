# Humana AI — Deployment Guide

> Next.js 16.2.6 · React 19 · Node ≥ 20 LTS recommended

This guide covers three deployment targets (Vercel, AWS, Azure) and Hostinger domain wiring for each. Read the **Pre-Deployment Checklist** first — it applies to every platform.

---

## Table of Contents

1. [Pre-Deployment Checklist](#1-pre-deployment-checklist)
2. [Deploy on Vercel](#2-deploy-on-vercel) ← recommended
3. [Deploy on AWS (Amplify + EC2 options)](#3-deploy-on-aws)
4. [Deploy on Azure (App Service)](#4-deploy-on-azure)
5. [Wiring a Hostinger Domain](#5-wiring-a-hostinger-domain)
6. [Environment Variables Reference](#6-environment-variables-reference)
7. [Post-Deployment Verification](#7-post-deployment-verification)

---

## 1. Pre-Deployment Checklist

Complete these steps before touching any platform.

### 1.1 — Confirm the build passes locally

```bash
npm run build
```

The output must end with `✓ Compiled successfully`. Fix any TypeScript or lint errors before deploying.

### 1.2 — Prepare your environment variables

Copy `.env.example` to a scratch file (do **not** commit it):

```bash
cp .env.example .env.local
```

Fill in every variable listed in [Section 6](#6-environment-variables-reference). You will paste these into each platform's secrets panel.

### 1.3 — Supabase Edge Function secret

Your OpenAI key lives inside Supabase, not in the app's env. Set it once via the Supabase CLI:

```bash
supabase secrets set OPENAI_API_KEY=sk-... --project-ref <your-project-ref>
```

Or: Supabase Dashboard → Project → Settings → Edge Functions → Secrets.

### 1.4 — Confirm Node version

The app targets **Node 20 LTS** (minimum Node 18.18). Check with:

```bash
node --version
```

Set `"engines": { "node": ">=20" }` in `package.json` if your host requires an explicit declaration.

### 1.5 — Push to GitHub

All three platforms deploy from a Git remote. Make sure the `main` branch is current:

```bash
git add . && git commit -m "production ready" && git push origin main
```

---

## 2. Deploy on Vercel

Vercel is the native host for Next.js and requires zero configuration for this stack.

### Step 1 — Create a Vercel account

Go to [vercel.com](https://vercel.com) and sign up with your GitHub account.

### Step 2 — Import the repository

1. Click **Add New → Project**.
2. Select your GitHub repository (`Humana-Web-App` or whatever you named it).
3. Vercel auto-detects Next.js. Leave all framework settings at their defaults.

### Step 3 — Set environment variables

In the **Environment Variables** panel (before clicking Deploy), add each variable from [Section 6](#6-environment-variables-reference):

| Key | Scope |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Production only (server-side secret) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Production, Preview, Development |
| `SUPABASE_SECRET_KEY` | Production only |

> `NEXT_PUBLIC_*` variables are embedded in the client bundle. All others stay server-side only.

### Step 4 — Deploy

Click **Deploy**. Vercel runs `npm run build` and `npm run start` automatically. The first deploy takes 2–4 minutes.

### Step 5 — Verify

Open the `.vercel.app` preview URL that Vercel assigns. Test:
- Home page loads
- `/chat` opens and disclaimer modal appears
- Send a message and receive a response
- TTS audio plays

### Step 6 — Add your custom domain

See [Section 5](#5-wiring-a-hostinger-domain) for Hostinger DNS steps, then:

1. Vercel Dashboard → Project → **Settings → Domains**.
2. Enter your domain (e.g. `humanai.org`).
3. Vercel shows you a `CNAME` or `A` record — copy it.
4. Add that record in Hostinger (see Section 5).
5. Vercel auto-provisions an SSL certificate via Let's Encrypt within minutes.

### Redeployments

Every `git push` to `main` triggers an automatic redeploy. No manual action needed.

---

## 3. Deploy on AWS

Two options are covered: **AWS Amplify** (managed, closest to Vercel) and **EC2** (full control, more setup).

---

### Option A — AWS Amplify (recommended for AWS)

Amplify handles build, deploy, CDN, and SSL automatically.

#### Step 1 — Open the Amplify Console

AWS Console → search **Amplify** → **Create new app**.

#### Step 2 — Connect GitHub

Choose **Deploy from Git** → Authorize AWS Amplify to access your GitHub → select your repository and `main` branch.

#### Step 3 — Build settings

Amplify should auto-detect Next.js. If the build spec is not pre-filled, use this:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

#### Step 4 — Set environment variables

Amplify Console → App → **Environment variables** → Add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `LEARN_CERT_SECRET`
- `LEARN_ADMIN_KEY`

#### Step 5 — Set Node version

In the build spec `preBuild` commands add:

```yaml
- nvm use 20
```

Or set the `_LIVE_UPDATES` environment variable in Amplify:

```
_LIVE_UPDATES = [{"pkg":"node","type":"nvm","version":"20"}]
```

#### Step 6 — Deploy and add domain

1. Click **Save and deploy**.
2. Once the build succeeds, go to **Domain management** → **Add domain**.
3. Enter your domain, choose the subdomain mapping.
4. Amplify gives you a CNAME value — add it in Hostinger (Section 5).
5. SSL is provisioned automatically via ACM.

---

### Option B — AWS EC2 (manual / full control)

Use this if you need a persistent server, WebSockets, or custom infrastructure.

#### Step 1 — Launch an EC2 instance

- **AMI**: Ubuntu 24.04 LTS
- **Instance type**: `t3.small` minimum (t3.medium recommended)
- **Security group**: open ports `22` (SSH), `80` (HTTP), `443` (HTTPS), `3000` (Node, optional for testing)

#### Step 2 — SSH into the instance

```bash
ssh -i your-key.pem ubuntu@<ec2-public-ip>
```

#### Step 3 — Install Node 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version   # should print v20.x.x
```

#### Step 4 — Install PM2 (process manager)

```bash
sudo npm install -g pm2
```

#### Step 5 — Clone your repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm ci
```

#### Step 6 — Create the `.env.local` file on the server

```bash
nano .env.local
```

Paste all variables from [Section 6](#6-environment-variables-reference).

#### Step 7 — Build and start

```bash
npm run build
pm2 start "npm run start" --name humana-ai
pm2 save
pm2 startup   # follow the printed command to enable auto-start on reboot
```

The app is now running on port `3000`.

#### Step 8 — Set up Nginx reverse proxy + SSL

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/humana-ai`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and get SSL:

```bash
sudo ln -s /etc/nginx/sites-available/humana-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot auto-renews. Point your domain's A record at the EC2 public IP (Section 5).

---

## 4. Deploy on Azure

Azure App Service runs the Node.js process directly with minimal configuration.

### Step 1 — Create an App Service

Azure Portal → **Create a resource** → **Web App**:

| Field | Value |
|-------|-------|
| Runtime stack | **Node 20 LTS** |
| Operating System | Linux |
| Region | Choose nearest to your users |
| Plan | **B2** minimum (B1 may run out of memory during build) |

### Step 2 — Connect GitHub for CI/CD

In the new App Service → **Deployment Center**:

1. Source: **GitHub**
2. Authorise and select your repo + `main` branch
3. Build provider: **GitHub Actions** (Azure generates the workflow file automatically)

### Step 3 — Set environment variables

App Service → **Configuration** → **Application settings** → **New application setting** for each variable:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `LEARN_CERT_SECRET`
- `LEARN_ADMIN_KEY`

Click **Save** after adding all variables.

### Step 4 — Set the startup command

App Service → **Configuration** → **General settings** → **Startup Command**:

```
npm run start
```

### Step 5 — Set build commands via GitHub Actions workflow

The auto-generated workflow (`.github/workflows/main_<appname>.yml`) needs updating. Replace the build step with:

```yaml
- name: Install and build
  run: |
    npm ci
    npm run build
```

And the deploy step should upload the full directory including `.next`.

### Step 6 — Add a custom domain

App Service → **Custom domains** → **Add custom domain**:

1. Enter your domain (e.g. `humanai.org`).
2. Azure shows you a `TXT` record (for verification) and a `CNAME` or `A` record.
3. Add both in Hostinger (Section 5).
4. Once DNS propagates, click **Validate** → **Add**.
5. App Service → **TLS/SSL settings** → **Private Key Certificates** → **Create App Service Managed Certificate** (free SSL).

---

## 5. Wiring a Hostinger Domain

This section applies regardless of your hosting platform. You add DNS records in Hostinger's control panel and they point to Vercel / AWS / Azure.

### Where to find DNS settings in Hostinger

1. Log into [hpanel.hostinger.com](https://hpanel.hostinger.com).
2. Click **Domains** → select your domain.
3. Click **DNS / Nameservers** → **Manage DNS Records**.

---

### 5.1 — Pointing to Vercel

Vercel gives you either an `A` record or a `CNAME`. Use both for root + www:

**Root domain (`yourdomain.com`):**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `A` | `@` | `76.76.21.21` | 3600 |

**www subdomain:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `www` | `cname.vercel-dns.com` | 3600 |

> Vercel's IP and CNAME are shown in your project's **Settings → Domains** panel. Always use the values Vercel gives you — they may differ from the examples above.

---

### 5.2 — Pointing to AWS Amplify

Amplify provides a CNAME for each domain/subdomain:

**Root domain** — Amplify provides a special `ANAME` / `ALIAS` record for root domains. Since Hostinger's basic DNS panel may not support ALIAS, use:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `www` | `<your-amplify-id>.cloudfront.net` | 300 |

Then set `www` as the primary in Amplify and redirect root → www inside Amplify.

For EC2 (using an Elastic IP or public IP):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `A` | `@` | `<EC2 Public IP>` | 3600 |
| `CNAME` | `www` | `yourdomain.com` | 3600 |

---

### 5.3 — Pointing to Azure App Service

Azure gives you a default `.azurewebsites.net` hostname. Map your domain:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `www` | `<appname>.azurewebsites.net` | 3600 |
| `TXT` | `@` | `<verification string from Azure>` | 3600 |

For the root domain (Azure App Service does not accept CNAME at root), use:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `A` | `@` | `<Azure outbound IP>` | 3600 |

Find the outbound IP in Azure: App Service → **Properties** → **Outbound IP addresses** (use the first one).

---

### 5.4 — DNS propagation

After saving records in Hostinger, propagation takes **5 minutes to 48 hours** worldwide (usually under 1 hour). Check status at [dnschecker.org](https://dnschecker.org).

**Do not** delete old records until propagation is confirmed — it causes downtime.

---

### 5.5 — Using Hostinger Nameservers vs External DNS

**Option A — Keep Hostinger nameservers (default):**
Add `A` / `CNAME` records directly in Hostinger's DNS panel as shown above. Easiest approach.

**Option B — Delegate to Vercel / Cloudflare DNS (advanced):**
In Hostinger → **DNS / Nameservers** → **Change Nameservers** → enter the NS records provided by Vercel or Cloudflare. This gives you full DNS control on the other platform. Do this only if you need advanced routing (geo-routing, load balancing, etc.).

---

## 6. Environment Variables Reference

All variables must be set on the hosting platform before the first deploy.

| Variable | Required | Scope | Where to get it |
|----------|----------|-------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Client + Server | Supabase Dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client + Server | Supabase Dashboard → Project Settings → API → `anon` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server only | Supabase Dashboard → Project Settings → API → `service_role` key |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Client + Server | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SECRET_KEY` | Yes | Server only | Supabase Dashboard → Project Settings → API |
| `LEARN_CERT_SECRET` | Yes | Server only | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` — signs learning-platform certificates. Any random string ≥ 16 chars. Changing it invalidates previously issued certificates. |
| `LEARN_ADMIN_KEY` | Yes | Server only | Generate like `LEARN_CERT_SECRET`. Unlocks the `/admin/learn` statistics dashboard. |

> **OpenAI API Key** is set as a Supabase Edge Function secret, not in the app's environment. See [Section 1.3](#13--supabase-edge-function-secret).

> Variables prefixed `NEXT_PUBLIC_` are embedded in the browser JavaScript bundle. Never put secrets (service keys, OpenAI keys) in `NEXT_PUBLIC_` variables.

---

## 7. Post-Deployment Verification

Run through this checklist after every platform deploy:

- [ ] Home page (`/`) loads correctly with no console errors
- [ ] Navigating to `/chat` triggers the **Disclaimer modal** on first visit
- [ ] Clicking **Decline** redirects to home page
- [ ] Checking the box and clicking **I Agree** accepts and enters chat
- [ ] Disclaimer does **not** re-appear on second visit (localStorage persisted)
- [ ] Sending a message receives an AI response (tests `/api/chat` → Supabase Edge Function → OpenAI)
- [ ] **Listen** button on an AI response generates and plays audio (tests `/api/tts`)
- [ ] Voice recording and transcription works (tests `/api/transcribe`)
- [ ] URL attachment processing works (tests `/api/process-url`)
- [ ] Sidebar thread create, select, rename, delete all work
- [ ] Language switcher changes the UI language
- [ ] `/about` and `/contact` pages load
- [ ] `/learn` loads; **Start Course** asks for a name, videos play, **Mark Complete** advances progress
- [ ] Questionnaire is locked until all modules are complete, grades on submit, and a pass (≥ 80%) opens the certificate page (tests `/api/learn/quiz` and `LEARN_CERT_SECRET`)
- [ ] Supabase migration `003_learn_assessments.sql` has been run; `/admin/learn` shows the attempt after a test quiz
- [ ] **Download / Print PDF** on the certificate opens the print dialog with only the certificate visible
- [ ] Response headers include `Content-Security-Policy` and `Strict-Transport-Security` (check in browser DevTools → Network)
- [ ] HTTPS is active (padlock icon in browser)
- [ ] Custom domain resolves correctly (both `yourdomain.com` and `www.yourdomain.com`)

---

## Quick Reference — Build Commands

| Command | Purpose |
|---------|---------|
| `npm ci` | Install exact dependencies (use in CI, not `npm install`) |
| `npm run build` | Production build |
| `npm run start` | Start production server on port 3000 |
| `npm run dev` | Local development only — do not use in production |

**Default port:** `3000`. Override with `PORT=8080 npm run start` if your platform requires a different port (Azure App Service uses `8080` by default — set `WEBSITES_PORT=3000` in Azure app settings, or use `PORT=8080 npm run start`).

---

*Last updated: September 2026 — Humana AI v1.1 (learning platform) · Qatar CPD*

# Website Template

Reusable static website template. Fork this repo for each new website build.

## Stack
HTML5 · CSS3 (custom properties) · Vanilla JS · Digital Ocean App Platform · Cloudflare · GitHub Actions · Zapier

## How to use this template

### Step 1 — Fork the repo
```
gh repo fork chiragnm2017/website-template --clone --fork-name chiragnm2017/YOUR-NEW-REPO
```

### Step 2 — Replace all tokens
Find and replace every `{{TOKEN}}` in the codebase. Start with `css/variables.css`, then HTML files.

Key tokens to replace first:
| Token | Description |
|-------|-------------|
| `Carcorp Australia` | Full company name |
| `carcorpaust.com.au` | Domain without https:// (e.g. example.com.au) |
| `GTM-KJ8C8QLH` | Google Tag Manager container ID (GTM-XXXXXXX) |
| `Inter:wght@400;500;600;700` | Google Fonts URL param (e.g. Inter:wght@400;500;600;700) |
| `https://hooks.zapier.com/hooks/catch/4694436/unqxddt/` | Zapier catch hook URL for contact form |
| `REPLACE_WITH_TURNSTILE_SITEKEY` | Cloudflare Turnstile site key |
| `0395834535` | Phone number for tel: links (no spaces) |
| `(03) 9583 4535` | Phone number formatted for display |
| `enq@carcorpaust.com.au` | Primary email address |
| `Suite 305 / 75 Tulip Street, Cheltenham VIC 3192` | Full postal address |

### Step 3 — Add assets
- `/assets/logo-dark.png` — logo for light backgrounds (nav)
- `/assets/logo-light.png` — logo for dark backgrounds (footer, hero)
- `/assets/favicon.ico`
- `/assets/og-image.png` — 1200x630px social share image

### Step 4 — Update service page filenames
Rename `services/service-1.html`, `service-2.html`, `service-3.html` to match your actual service names.
Update all internal links to match.

### Step 5 — Rename optional page
Rename `careers.html` if needed (e.g. `portfolio.html`, `products.html`). Update nav links on all pages.

### Step 6 — Connect to Digital Ocean
1. Create new App on Digital Ocean App Platform
2. Connect to this GitHub repo, `main` branch
3. Static site — no build command, output dir `/`

### Step 7 — Configure Cloudflare
1. Add domain to Cloudflare
2. Update nameservers at registrar
3. Add CNAME: `@` → DO staging URL
4. Enable Full Strict SSL/TLS
5. Add 6 Transform Rules for security headers (copy from UXDG project)
6. Create Cloudflare Turnstile widget → copy sitekey → replace `REPLACE_WITH_TURNSTILE_SITEKEY`

## File structure
```
/
├── index.html              Home page
├── about.html              About page
├── careers.html            Careers/listings page (rename as needed)
├── contact.html            Contact form
├── privacy.html            Privacy policy
├── 404.html                Error page
├── services/
│   ├── service-1.html      Service page template (×3)
├── css/
│   ├── variables.css       Brand tokens — edit these first
│   ├── base.css            Reset, typography, layout
│   ├── components.css      Nav, footer, buttons, cards, forms
│   └── pages.css           Page-specific layouts
├── js/
│   ├── main.js             Nav, dropdowns, FAQ, scroll
│   ├── form.js             Contact form → Zapier
│   └── careers.js          Job listings loader
├── data/
│   └── careers.json        Job listings data
├── assets/                 Logo, favicon, og-image
├── email-templates/        Zapier email HTML templates
├── .github/workflows/      Security Guardian, Site Health, Weekly Checks
├── .do/app.yaml            Digital Ocean App Platform config
├── llms.txt                LLM crawler summary
├── sitemap.xml             XML sitemap
└── robots.txt              Crawler rules
```

## GitHub Actions
| Workflow | Schedule | Purpose |
|----------|----------|---------|
| Security Guardian | Daily 6am AEST | Scans for secrets, unsafe JS, missing headers |
| Site Health | Sunday 6am AEST | Checks all pages, internal links, mobile tags |
| Weekly Checks | Sunday 6am AEST | Metadata, JSON validity, hardcoded years |

Issues are created automatically with labels `security-guardian`, `site-health`, `automated-check`. Wire these to Zapier for email alerts.

# Frank Davis Narh — Portfolio

A professional portfolio for a Network Operations Engineer. Clean sidebar + content layout with dark/light mode and an admin panel to update content without touching code.

---

## Project Structure

```
frank-portfolio/
├── frontend/          ← Static site (deploy to Vercel / GitHub Pages)
│   ├── index.html
│   ├── style.css
│   ├── data.js        ← Default data (fallback)
│   ├── app.js         ← All rendering + admin panel logic
│   ├── frank.jpg      ← Your photo (add this file!)
│   └── Frank_Davis_Narh_CV.pdf  ← Your CV (add this file!)
│
└── backend/           ← Express API (deploy separately to Vercel)
    ├── server.js
    ├── package.json
    ├── vercel.json
    ├── .env.example
    └── data/
        └── default.json
```

---

## Files You Need to Add

Before deploying, add these two files to the `frontend/` folder:

1. **`frank.jpg`** — your profile photo (already in the design)
2. **`Frank_Davis_Narh_CV.pdf`** — your CV for the download button

---

## Frontend Deploy (Vercel — recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Set **Root Directory** to `frontend`
4. Framework Preset: **Other** (static)
5. Deploy ✓

### Or GitHub Pages
1. Push to GitHub
2. Settings → Pages → Source: `main` branch, `/frontend` folder
3. Done

---

## Backend Deploy (Vercel)

1. Go to [vercel.com](https://vercel.com) → New Project → Import same repo
2. Set **Root Directory** to `backend`
3. Add Environment Variables:
   - `JWT_SECRET` → any long random string
   - `ADMIN_PASS` → your admin password
   - `FRONTEND_URL` → your frontend Vercel URL
4. Deploy ✓

> **Note:** The frontend works fully without the backend — all edits save to `localStorage`. The backend API is optional for persistence across devices/browsers.

---

## Admin Panel

- Click **Admin** in the sidebar
- Default password: `frank@admin2025`  
  *(change this in `app.js` → `ADMIN_PASSWORD` constant before deploying)*
- Edit: Profile, Skills, Tools, Certifications, Roles, Contact
- Changes save instantly to `localStorage`

---

## Customisation

| What | Where |
|------|-------|
| Default content | `frontend/data.js` |
| Admin password | `frontend/app.js` → `ADMIN_PASSWORD` |
| Colours / fonts | `frontend/style.css` → `:root` variables |
| Server password | `backend/.env` → `ADMIN_PASS` |

---

## API Endpoints (Backend)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/portfolio` | None | Get all portfolio data |
| POST | `/api/auth/login` | None | Login, returns JWT |
| PUT | `/api/portfolio` | JWT | Update all data |
| PUT | `/api/portfolio/:section` | JWT | Update one section |

Sections: `profile`, `skills`, `monitoringTools`, `certifications`, `roles`, `experience`, `contact`

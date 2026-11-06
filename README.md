# SharePlate — Save Food. Share Hope.

A small food-donation board for my CA3 assignment. A donor lists surplus food (with an optional photo) and a visitor can browse the listings. Donations can also be edited and deleted, to demonstrate the REST API.

**Stack:** React + Vite + React Router DOM + custom CSS (client) · Node.js + Express + Mongoose + Multer (server) · MongoDB (local) · Postman.

Extra files: `CA3_GUIDE.md` (explanation + viva), `docs/CA3_Report.md` (report), `docs/SharePlate.postman_collection.json` (Postman).

## Before you start

You need **Node.js 20.19 or newer** (Node 22.13+ or 24 also work; Node 22 LTS is a good choice) and your **existing local MongoDB service running**. This comes from the packages in the lockfiles: Vite 8 and Mongoose 9 need Node 20.19+ (or 22.12+), and ESLint 10 needs `^20.19.0 || ^22.13.0 || >=24`, so the safe combined range is `^20.19.0 || ^22.13.0 || >=24`. Both `package.json` files declare this in `engines`. Odd versions such as Node 21 or 23 are not supported. This project does not install or change MongoDB. It uses its own database, `shareplate_ca3`, and refuses to connect to the old `shareplate` database.

Optional read-only check in PowerShell (the service name may differ on your PC):

```powershell
node -v
npm -v
Get-Service *mongo*
```

`Status` should say `Running`.

### If `node -v` shows an older version

Do not change Node globally. The smallest fix is to run the project commands with a temporary Node 22 from npm, inside the project folder only:

```powershell
cd D:\SharePlate_CA3\server
npx -p node@22 -- npm install
npx -p node@22 -- npm start
```

Use the same pattern in the `client` folder (`npx -p node@22 -- npm run dev`). I tested this pattern on Linux only, not on Windows. The other option is to ask your lab or admin for Node 22 LTS.

## Install and run (two PowerShell windows)

Replace `D:\SharePlate_CA3` with the folder where you extracted the zip. (Do not put it inside the old `D:\SharePlate` folder.)

**Window 1 — server (API on port 5000)**

```powershell
cd D:\SharePlate_CA3\server
npm install
Copy-Item .env.example .env
npm start
```

You should see `SharePlate server running at http://localhost:5000` and `[DB] MongoDB connected. Database: shareplate_ca3`.

**Window 2 — client (website on port 5173)**

```powershell
cd D:\SharePlate_CA3\client
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

If PowerShell says scripts are disabled for `npm`, run the same commands as `npm.cmd install`, `npm.cmd start`, `npm.cmd run dev` — no system setting needs to change.

## Quick checks

- http://localhost:5173 shows the Home page.
- http://localhost:5173/donations shows the listings (empty at first).
- http://localhost:5000/api/donations returns JSON.
- If MongoDB is not running, the API answers with `503` and the Browse Food page shows "Database is not connected…". The app never switches to fake data or another database.

## Environment files

| File | Purpose |
|---|---|
| `server/.env.example` | Copy to `server/.env`. Holds `PORT`, `MONGODB_URI`, `CLIENT_URL`. No passwords are needed for local MongoDB. |
| `client/.env.example` | Optional. Only needed if the API is not at `http://localhost:5000`. |

`.env` files are listed in `.gitignore` and must never be committed.

## Useful commands

| Where | Command | What it does |
|---|---|---|
| `server` | `npm start` | Run the API |
| `server` | `npm run dev` | Run the API and restart on file changes |
| `client` | `npm run dev` | Run the website |
| `client` | `npm run lint` | Check the code style |
| `client` | `npm run build` | Make a production build in `client/dist` |

## Postman

1. Open Postman → **Import** → choose `docs/SharePlate.postman_collection.json`.
2. Start the server.
3. Run the requests in order (1 → 5). Request 2 saves the new id automatically for requests 3–5.
4. In request 2, pick an image in the `image` row (optional).

## Folder structure

```
SharePlate_CA3/
├── client/                 React app
│   ├── public/images/      locally stored homepage photograph
│   └── src/
│       ├── App.jsx         frontend routes
│       ├── pages/          Home, Donations, DonationForm, NotFound
│       ├── components/     Navbar, Footer, Logo, DonationCard
│       ├── services/       donationApi.js (all fetch calls)
│       └── styles.css      custom CSS
├── server/                 Express API
│   ├── server.js           app setup + middleware order
│   ├── config/db.js        MongoDB connection
│   ├── models/             Donation.js
│   ├── routes/             donationRoutes.js
│   ├── controllers/        donationController.js
│   ├── middleware/         requestLogger, validateDonation, upload, errorHandler, checkDatabase
│   └── uploads/            saved images (created at runtime)
└── docs/                   report, Postman collection, screenshots/
```

## Photo credits

The homepage includes a locally stored photograph of fresh food and produce, restored from the earlier SharePlate homepage preview, so it loads without relying on an external image host.

| File | Photographer | Source URL | Licence |
|---|---|---|---|
| `client/public/images/hero.jpg` | Food photo restored from the earlier SharePlate homepage preview | Included locally |

Photos that donors upload through the form are saved in `server/uploads/` and are not part of the project files. A listing without a photo simply shows no image area.

The Browse Food and API screenshots in `docs/screenshots/` were captured while the local MongoDB service was running. The API returned HTTP 200 with an empty list; no sample donations were inserted for the screenshots. For your own submission, capture additional screens of the create, edit, delete and upload flows after you try them locally.

# SharePlate CA3 Guide (read this before your viva)

## 1. What the app does

SharePlate is a food donation board. A donor fills a form (food title, donor name, category, quantity, pickup location, pickup deadline, optional photo). The data is saved in MongoDB. The Browse Food page shows every saved donation. Each donation can be edited or deleted.

## 2. Request flow

```
React form → Express route → middleware → controller → Mongoose model → MongoDB → JSON response → React UI
```

Example: adding a donation with a photo

1. `DonationForm.jsx` → `handleSubmit()` builds a `FormData` and calls `createDonation()` in `services/donationApi.js`.
2. The browser sends `POST http://localhost:5000/api/donations`.
3. `server.js` runs the global middleware (logger, cors, json), then `checkDatabase`.
4. `routes/donationRoutes.js` matches `POST /` and runs, in order: `uploadImage` (Multer) → `validateDonation` → `createDonation`.
5. `controllers/donationController.js` → `createDonation()` calls `Donation.create(...)` (the Mongoose model in `models/Donation.js`).
6. MongoDB stores the document in the `shareplate_ca3` database.
7. The controller replies `201` with JSON: `{ success: true, message, data }`.
8. React navigates to `/donations`, which calls `GET /api/donations` and draws the cards.

If anything fails, `next(error)` sends it to `middleware/errorHandler.js`, which replies with `{ success: false, message }`.

## 3. Where to show each assignment concept

| Concept | File | Function / line to show |
|---|---|---|
| **Routing (frontend)** | `client/src/App.jsx` | `<Routes>` with `<Route>` for `/`, `/donations`, `/donations/new`, `/donations/:id/edit`, and `*` (404) |
| **Routing (backend)** | `server/routes/donationRoutes.js` | `router.get`, `router.post`, `router.put`, `router.delete`; mounted in `server/server.js` with `app.use('/api/donations', ...)` |
| **Middleware – logging** | `server/middleware/requestLogger.js` | `requestLogger()` |
| **Middleware – validation** | `server/middleware/validateDonation.js` | `validateDonation()` |
| **Middleware – upload** | `server/middleware/upload.js` | `uploadImage`, `fileFilter()`, `storage.filename()` |
| **Middleware – errors** | `server/middleware/errorHandler.js` | `errorHandler()` and `notFound()` |
| **Middleware order** | `server/server.js` | the comment at the top and the `app.use(...)` lines |
| **Controller** | `server/controllers/donationController.js` | `getAllDonations`, `getDonationById`, `createDonation`, `updateDonation`, `deleteDonation` |
| **REST API** | `server/routes/donationRoutes.js` + controller | 5 endpoints with status codes 200, 201, 400, 404, 503 |
| **File upload** | `server/middleware/upload.js` | `uploadImage` (Multer); static serving in `server/server.js`: `app.use('/uploads', express.static(...))` |
| **Showing the uploaded image** | `client/src/components/DonationCard.jsx` | `<img src={getImageUrl(...)}>` |

## 4. The five concepts in simple words

**Routing** means "which code runs for which address". In React, `App.jsx` says that `/donations` shows the Donations page. In Express, `donationRoutes.js` says that `GET /api/donations` runs `getAllDonations`. React routes change the page in the browser; Express routes answer API requests.

**Middleware** is a small function that sits between the request and the final answer. It can look at the request, change it, stop it, or pass it on with `next()`. We have four: a logger (prints each request), validation (checks required fields), Multer (handles the image file) and an error handler (turns any error into a clean JSON message). Express runs them in the order they are written.

**Controller** is the file that holds the real work. The route file only points to a controller function, and the controller talks to the database through the model. This keeps the route file short and easy to read.

**REST API** is a way of using URLs and HTTP methods for data. The URL names the thing (`/api/donations`) and the method says the action: `GET` read, `POST` create, `PUT` update, `DELETE` remove. Replies are JSON with a status code (200 OK, 201 Created, 400 Bad request, 404 Not found).

**File Upload** lets a user send a file with a form. The form is sent as `multipart/form-data` (not JSON). Multer reads the file, checks the type (JPG, JPEG, PNG, WebP) and size (max 5 MB), gives it a random safe name, and saves it in `server/uploads`. Only the file name is saved in MongoDB. Express serves the folder at `/uploads`, so the browser can display the picture.

## 5. REST endpoints

| Method | URL | Body | Success reply |
|---|---|---|---|
| GET | `/api/donations` | – | 200 + list |
| GET | `/api/donations/:id` | – | 200 + one donation, or 404 |
| POST | `/api/donations` | form-data (+ `image`) | 201 + new donation, or 400 |
| PUT | `/api/donations/:id` | JSON | 200 + updated donation, or 400 / 404 |
| DELETE | `/api/donations/:id` | – | 200, or 404 |

Reply shape: `{ "success": true, "message": "...", "data": ... }` or `{ "success": false, "message": "..." }`.

## 6. Upload safety (good viva points)

- Only `image/jpeg`, `image/png`, `image/webp` with extensions `.jpg .jpeg .png .webp` are accepted.
- The saved name is `random-id + extension chosen by the server`. The user's file name or path is never used.
- Limit is 5 MB. Too-large and wrong-type files return a clear 400 message.
- If validation fails after Multer saved a file, the file is deleted so nothing is left behind.
- The database stores only the file name; deleting a donation also deletes its file (`deleteUploadedFile` uses `path.basename`).
- A limit to mention honestly: the type check uses the type the browser reports, it does not inspect the file's bytes.

## 7. Running it (two PowerShell windows)

Window 1:

```powershell
cd D:\SharePlate_CA3\server
npm install
Copy-Item .env.example .env
npm start
```

Window 2:

```powershell
cd D:\SharePlate_CA3\client
npm install
npm run dev
```

Open http://localhost:5173. Full details are in `README.md`.

## 8. Demo order (about 8–10 minutes)

1. Show the folder structure (client / server / docs).
2. Start the server and client in two PowerShell windows. Point out `[DB] MongoDB connected. Database: shareplate_ca3`.
3. Open the Home page, then click Browse Food (React Router, no page reload).
4. Type a wrong address like `/abc` to show the 404 page.
5. Click Donate Food. Submit the empty form to show the browser's required-field messages, then fill it in with a photo and submit.
6. The Browse Food page now shows the new card with its photo. In the server window, show the logger lines (`POST /api/donations -> 201`).
7. Try uploading a `.txt` or a file over 5 MB to show the clear error message.
8. Click Edit, change the quantity, save. Then Delete another donation (PUT and DELETE).
9. Open Postman: run the five requests of the collection in order; show the status codes.
10. Open the code: `App.jsx` (routing) → `donationRoutes.js` → `server.js` middleware order → `upload.js` → `donationController.js`.
11. Optional: open `server/uploads` to show the saved file with its random name.

## 9. Viva practice

**What is the difference between React Router and Express Router?**
React Router decides which page component to show in the browser. Express Router decides which server function answers an API request.

**What is middleware? Give examples from your project.**
A function that runs between the request and the response and calls `next()` to continue. Mine: `requestLogger`, `validateDonation`, `uploadImage` (Multer), `errorHandler`.

**In what order do they run?**
Logger → cors → express.json → static uploads → checkDatabase → route (Multer → validation → controller) → notFound → errorHandler. The order is set by the order of `app.use` in `server.js` and the order in the route.

**Why does validation come after Multer?**
For a multipart form, `req.body` is filled by Multer. Before Multer runs, the text fields are not available.

**How does Express know `errorHandler` is an error handler?**
It has four parameters: `(err, req, res, next)`. It is placed last.

**Why use a controller?**
To keep database work out of the route file. Routes say where, controllers say what.

**What does `Donation.find().sort({ createdAt: -1 })` do?**
Reads all donations from MongoDB, newest first.

**Why status 201 for POST and 404 for a missing id?**
201 means "created". 404 means the record was not found. 400 means the client sent bad data.

**How is the image uploaded?**
React sends `FormData` with the field named `image`. Multer saves it with a random name in `server/uploads`. MongoDB stores only the name. Express serves it from `/uploads`.

**How do you stop unsafe files or names?**
Type and extension allow-list, 5 MB limit, server-generated name, and the user's path is never used.

**Why not JSON for the create request?**
JSON cannot carry a file. `multipart/form-data` can carry text and a file together.

**What does `useEffect` do on the Donations page?**
It runs once when the page opens and fetches the list from the API.

**What happens if MongoDB is not running?**
`checkDatabase` returns 503 with a setup message, and the Browse Food page shows it. There is no fake data.

**Why a separate database `shareplate_ca3`?**
So this project does not touch the older `shareplate` database. `config/db.js` refuses to connect to `shareplate`.

**What is Mongoose?**
A library that lets Node define a schema/model and talk to MongoDB with simple functions like `find`, `create`, `findByIdAndUpdate`.

**What is CORS and why is it needed?**
React (port 5173) and Express (port 5000) are different origins. The `cors` middleware tells the browser the React app is allowed to call the API.

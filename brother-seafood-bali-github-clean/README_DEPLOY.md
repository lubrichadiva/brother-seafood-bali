# Brother Seafood Bali — Production Deployment

Architecture:
- GitHub: source code
- Vercel: React frontend (`frontend/`)
- Render: FastAPI backend (`backend/`)
- MongoDB Atlas: database + uploaded logo/gallery storage

## 1. MongoDB Atlas
Create a cluster and database user. Allow the Render service to connect through Atlas Network Access, then copy the `mongodb+srv://...` connection string.

Backend environment variables:
- `MONGO_URL`
- `DB_NAME=brother_seafood_bali`
- `CORS_ORIGINS=https://YOUR-VERCEL-DOMAIN.vercel.app`

## 2. Render
Create a Web Service from this GitHub repository.
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

Add the three environment variables above. Render will provide a URL such as `https://brother-seafood-bali-api.onrender.com`.

## 3. Vercel
Import the same GitHub repository into Vercel.
- Root Directory: `frontend`
- Framework: Create React App
- Build Command: `npm run build`
- Output Directory: `build`

Add:
- `REACT_APP_BACKEND_URL=https://YOUR-RENDER-BACKEND.onrender.com`

The included `vercel.json` keeps React Router routes working on refresh.

## 4. Connect CORS
After Vercel gives the frontend URL, set Render's `CORS_ORIGINS` to that exact URL and redeploy the backend.

## 5. Test
- Open Vercel URL
- Login
- Inventory
- Sales Report
- Reservation
- Calendar
- Monthly Reservation Report
- Guide / Travel Agent filters
- Proposal template
- Proposal DOCX export
- Logo/gallery upload

Do not commit real `.env` files or API keys to GitHub.

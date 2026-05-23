# Online Job Portal

A full-stack job portal built with React, Express, and MongoDB.

## Setup

### Backend
1. Go to `api/`
2. `npm install`
3. Create `.env` and add `MONGO_URI`
4. `node index.js`

### Frontend
1. Go to `client/`
2. `npm install`
3. `npm run dev`

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Express, Node.js
- **Database**: MongoDB
- **Hosting**: Vercel

## 🚀 Deployment Guide (Vercel)

Because this repository uses a custom `vercel.json` routing configuration and root `package.json` build scripts, Vercel will deploy **both the frontend and backend into a single unified deployment**. 

### 1. Push Code to GitHub
Ensure all your final code is pushed to your remote GitHub repository:
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

### 2. Import Project to Vercel
1. Log in to [Vercel](https://vercel.com) and go to your dashboard.
2. Click **Add New** > **Project**.
3. Locate your `job-portal` repository under "Import Git Repository" and click **Import**.

### 3. Configure Project Settings
When the "Configure Project" screen appears, **wait before clicking deploy**:
- **Project Name:** `job-portal` (or your preferred name).
- **Framework Preset:** Leave as `Other`.
- **Root Directory:** Leave as `./` (the default).
- **Build and Output Settings:** Expand this. Leave the Build Command and Install Command exactly as they are. (Vercel will natively detect our `npm run build` script which installs and builds the React client).

### 4. Input Environment Variables
Your `.env` files are ignored by git for security, so they must be entered manually into the Vercel dashboard:
1. Expand the **Environment Variables** section on the project setup screen.
2. Open your local `api/.env` file. Add the following key-value pairs one by one, clicking **Add** for each:
   - **Key:** `MONGO_URI`
   - **Value:** `mongodb+srv://<username>:<password>@cluster0.myqdpal.mongodb.net/jobportal?appName=Cluster0`
   - **Key:** `JWT_SECRET`
   - **Value:** `[Your 64-character generated secret]`
   - **Key:** `PORT`
   - **Value:** `5000`

### 5. Deploy!
1. Click the blue **Deploy** button.
2. Vercel will install dependencies, build the Vite frontend, convert `api/index.js` into serverless backend functions, and map the routes!
3. Once you see the success screen, click **Continue to Dashboard** and visit your live `*.vercel.app` domain. The live backend runs cleanly on the `/api/*` endpoints, while the frontend displays normally on the main URL.

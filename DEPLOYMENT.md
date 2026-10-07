# 🚀 Aethera Deployment Guide

Aethera is fully optimized and configured for instant deployment across multiple cloud platforms. Choose the platform that best fits your workflow.

---

## ⚡ Option 1: Deploy to Vercel (Recommended — Free & Serverless)

Aethera includes pre-configured [`vercel.json`](vercel.json) and [`api/index.js`](api/index.js) for serverless operation.

### Steps:
1. **Push your repository** to GitHub or GitLab.
2. Go to [vercel.com](https://vercel.com) and click **"Add New..."** → **"Project"**.
3. Import your Aethera repository.
4. **Project Settings**:
   - **Framework Preset**: `Other`
   - **Root Directory**: `./` (leave default)
   - **Build Command**: (leave empty or default)
   - **Output Directory**: `Frontend` (automatically read from `vercel.json`)
5. **Environment Variables**:
   Add the following under **Settings → Environment Variables**:
   - `GEMINI_API_KEY`: Your Gemini API key from [aistudio.google.com](https://aistudio.google.com/)
   - `SUPABASE_URL`: *(Recommended for cloud multi-user sync)* Your Supabase project URL from [supabase.com](https://supabase.com)
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key
6. Click **Deploy**. Your site will be live with a free SSL certificate!

---

## 🌐 Option 2: Deploy to Render (Free Node.js Web Service)

Aethera includes a [`render.yaml`](render.yaml) blueprint and [`Procfile`](Procfile).

### Steps:
1. Push your repository to GitHub.
2. Go to [dashboard.render.com](https://dashboard.render.com/) and click **"New +"** → **"Web Service"**.
3. Connect your GitHub repository.
4. Settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node Backend/server.js`
   - **Instance Type**: Free
5. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `SUPABASE_URL`: (Optional) Your Supabase URL
   - `SUPABASE_SERVICE_ROLE_KEY`: (Optional) Your Supabase key
6. Click **Create Web Service**.

---

## 🚂 Option 3: Deploy to Railway

Aethera includes [`railway.json`](railway.json) for automatic Nixpacks detection.

### Steps:
1. Go to [railway.app](https://railway.app/) and click **"New Project"**.
2. Select **"Deploy from GitHub repo"** and select your repository.
3. In the project dashboard, go to **Variables** and add:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `SUPABASE_URL`: (Optional) Your Supabase URL
   - `SUPABASE_SERVICE_ROLE_KEY`: (Optional) Your Supabase key
4. Railway will automatically build and deploy the Node.js application.

---

## 🐳 Option 4: Deploy with Docker (Self-Hosted VPS, AWS, Cloud Run, DigitalOcean)

Aethera includes a production-ready [`Dockerfile`](Dockerfile) and [`.dockerignore`](.dockerignore).

### 1. Build and Run Locally:
```bash
# Build the Docker image
docker build -t aethera .

# Run the container
docker run -d -p 3000:3000 \
  -e GEMINI_API_KEY="your_api_key_here" \
  -e SUPABASE_URL="https://your-project.supabase.co" \
  -e SUPABASE_SERVICE_ROLE_KEY="your_service_role_key" \
  --name aethera-app aethera
```

### 2. Run with Docker Compose:
Create a `docker-compose.yml`:
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped
```
Run:
```bash
docker compose up -d
```

---

## 🔑 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key for AI Studio, Chatbot, and Assistant. |
| `SUPABASE_URL` | Optional* | Supabase PostgreSQL endpoint for persistent multi-device account sync. *(Required for Vercel/Serverless persistence).* |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional* | Supabase backend service role key for administrative data read/write. |
| `PORT` | Optional | HTTP server listening port (Default: `3000`). |
| `NODE_ENV` | Optional | Set to `production` in live environments. |

---

## 🛠️ Verifying Your Deployment

Once deployed, verify that:
1. `GET /` serves the Landing Page with all interactive components.
2. `GET /api/config/ai-key` returns `{ "hasKey": true, "serverConfigured": true }`.
3. Try asking a question in **AI Studio** or the **Chatbot** to confirm real-time Gemini streaming.

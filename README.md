# SmartMall

SmartMall is a split frontend/backend e-commerce app.

- `sales/` - client + admin UI
- `sales-api/` - REST API, auth, payments, sockets, admin APIs, Swagger

## Stack

- Frontend: React 18, Vite, Redux Toolkit, React Router, Ant Design, Tailwind, Sass, Socket.IO client
- Backend: Node.js, Express, MongoDB, Redis, Socket.IO, Swagger, Passport, Multer, Nodemailer

## Local setup

### 1. Frontend

```bash
cd sales
npm install
```

Create `sales/.env`:

```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_SOCKET_URL=http://localhost:3001
VITE_CLIENT_URL=http://localhost:3000
VITE_NAME_APP=SmartMall
```

Run:

```bash
npm run dev
```

Frontend default port: `3000`.

### 2. Backend

```bash
cd sales-api
npm install
```

Create `sales-api/.env` with at least:

```env
PORT=3001
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:3001
MONGO_URL=mongodb://localhost:27017/smartmall
REDIS_URL=redis://localhost:6379
ACCESS_SECRET=your_access_secret
REFRESH_SECRET=your_refresh_secret
```

Also set any needed service keys:

```env
CLOUD_NAME=
API_KEY=
API_SECRET=
MAIL_USER=
MAIL_PASS=
OPENAI_API_KEY=
DEEPSEEK_API_KEY=
GROQ_API_KEY=
NINEROUTER_API_KEY=
```

Run:

```bash
npm run dev
```

API default port: `3001`.

## Scripts

Frontend:

- `npm run dev` / `npm start` - Vite dev server
- `npm run build` - production build
- `npm run preview` - preview build

Backend:

- `npm run dev` - nodemon
- `npm start` - node `index.js`
- `npm run seed:chat` - seed chat conversations
- `npm run migrate:content-pages` - migrate CMS pages

## URLs

- Frontend: `http://localhost:3000`
- API: `http://localhost:3001/api/v1`
- Swagger: `http://localhost:3001/api-docs`
- Health: `http://localhost:3001/health`

## Main client routes

- `/`
- `/products`
- `/products/:slug`
- `/product-categories/:slug`
- `/flash-sale`
- `/cart`
- `/checkout`
- `/orders`
- `/wishlist`
- `/compare`
- `/blog`
- `/blog/:slug`
- `/contact`
- `/about`

## Auth routes

- `/user/login`
- `/user/register`
- `/user/forgot-password`
- `/user/oauth-callback`

## Admin routes

- `/admin/dashboard`
- `/admin/products`
- `/admin/product-categories`
- `/admin/orders`
- `/admin/accounts`
- `/admin/roles`
- `/admin/permissions`
- `/admin/promo-codes`
- `/admin/banners`
- `/admin/widgets`
- `/admin/flash-sales`
- `/admin/chat`

## API notes

- Frontend uses `credentials: 'include'`
- `VITE_API_URL` must include `/api/v1`
- `sales/vite.config.mjs` still supports legacy `REACT_APP_*` env vars
- Backend Swagger is exposed at `/api-docs` and `/docs`
- Admin APIs are under `/api/v1/admin`

## Docs

- `sales-api/api/v1/docs/*.yaml`
- `sales-api/config/swagger.js`
- `sales/src/utils/env.js`
- `sales/vite.config.mjs`

## Repo layout

```text
sales/
  public/
  src/
sales-api/
  api/
  config/
  scripts/
```

# JABA MOCKUPS Backend

Express + MongoDB API for a mockup discovery/download platform.

## Setup

1. Copy `.env.example` to `.env`.
2. Put your MongoDB Atlas/Compass-compatible connection string in `MONGO_URI`.
3. Run `npm install`.
4. Run `npm run create-admin` once.
5. Start with `npm run dev`.

## Main API

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `GET /api/categories`
- `POST/PUT/DELETE /api/categories` (admin)
- `GET /api/mockups`
- `GET /api/mockups/:id`
- `GET /api/mockups/:id/download`
- `POST/PUT/DELETE /api/mockups` (admin)

## Mockup listing filters

`GET /api/mockups?q=business&page=1&limit=12&category=branding&featured=true&tag=psd`

Admin mockup upload uses `multipart/form-data` with:

- `title`
- `description`
- `category`
- `tags` (comma-separated or repeated form values)
- `featured` (`true`/`false`)
- `previewImage` (`jpg`, `jpeg`, `png`, `webp`)
- `downloadFile` (`psd`, `zip`, `rar`, `ai`, `indd`, `sketch`, `fig`)

The backend stores only generated filenames in MongoDB and serves files from `/uploads`.

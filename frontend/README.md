# JABA MOCKUPS — Frontend

React + Vite + Tailwind CSS frontend for the JABA MOCKUPS mockup library. It connects to the Express/MongoDB backend included separately.

## Features
- Responsive home page with search and category navigation
- Browse/search mockups, category filter, pagination, and featured filter
- Mockup detail page with file download
- Registration and login using JWT
- Admin dashboard for uploading mockups and managing categories
- Admin mockup deletion and download statistics

## Requirements
- Node.js 18 or newer
- JABA MOCKUPS backend running at `http://localhost:5000`

## Setup
1. Open this folder in VS Code.
2. Open the VS Code terminal.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env` (optional if the backend uses the default URL).
5. Start the frontend:
   ```bash
   npm run dev
   ```
6. Open the local URL Vite prints, usually `http://localhost:5173`.

## API configuration
Set `VITE_API_URL` in `.env` if the backend API is not at `http://localhost:5000/api`:
```env
VITE_API_URL=http://localhost:5000/api
```

## First admin account
Create an admin using the backend's existing `createAdmin.js` flow. Public registration intentionally creates normal users, not admins. Sign in with that admin account to access `/admin`.

## Notes
- Uploaded mockup preview and download files are served by the backend from `/uploads`.
- The admin upload form sends `previewImage` and `downloadFile` as multipart form fields, matching the backend routes.
- Tailwind is installed/configured for future UI development; the custom CSS currently handles the design system and responsive layouts.

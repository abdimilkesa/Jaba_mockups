# JABA MOCKUPS

A platform for discovering and downloading high-quality design mockups.

## About

JABA MOCKUPS is a web platform where designers can browse, preview, and download realistic mockups for their design projects.

## Technologies

- React
- Node.js
- Express.js
- MongoDB

## Backend setup

Create `backend/.env` and set `MONGO_URI` to the connection string copied from
MongoDB Atlas under **Connect → Drivers**. In Atlas, make sure the cluster is
running and your current IP address is allowed under **Network Access**. Keep
the `.env` file private. Start the backend from the `backend` directory with
`npm install` followed by `npm run dev`; the API starts only after MongoDB
connects successfully.

## Project Structure

```text
jaba_mockups/
├── backend/
├── frontend/
├── .gitignore
└── README.md
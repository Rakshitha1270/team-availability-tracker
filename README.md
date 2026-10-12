# Team Availability Tracker

A simple full-stack project for tracking team member availability.

## Features
- SQLite backend database
- REST API
- Status options: Available, Busy, Away
- Responsive dashboard
- Automatic refresh every 3 seconds
- Easy deployment on Render

## Run locally

Install Node.js, then open this folder in CMD/Terminal:

```bash
npm install
npm start
```

Open:

http://localhost:3000

## API endpoints

GET `/api/team`

PATCH `/api/team/:id/status`

Example request body:

```json
{
  "status": "Busy"
}
```

GET `/api/health`

## Render deployment

Build Command:
```bash
npm install
```

Start Command:
```bash
npm start
```

After deployment, submit:
1. GitHub repository URL
2. Deployed Render app URL

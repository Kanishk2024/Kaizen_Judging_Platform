# NIQR Kaizen Competition Scoring Platform

A modern, responsive React application for managing and scoring Kaizen competition entries. This is a **frontend-only** application that runs entirely in the browser.

## Features

- **Reviewer Dashboard**: Score teams across multiple criteria
- **Organizer Dashboard**: View all scores and export to CSV
- **Admin Panel**: Local data management (frontend-only)
- **Responsive Design**: Works on desktop and mobile devices
- **PWA Support**: Can be installed as a progressive web app
- **Local Data Storage**: All data stored in browser local storage

## Quick Start

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## User Roles & Credentials

### Organizer
- **Username**: `Organiser-01`
- **Password**: `India@2026`
- **Access**: Full dashboard with admin panel

### Reviewer
- **Username**: `reviewer1` or `reviewer2`
- **Password**: `pass1` or `pass2`
- **Access**: Scoring interface for assigned hall

## Data Management

Since this is a frontend-only application:
- All data is stored locally in the browser
- Data persists during the session but is cleared on refresh
- Use the "Clear All Data" function in admin panel to reset
- Export scores to CSV for permanent storage
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Security Considerations

This is a frontend-only application with mock data. All data is stored locally in the browser.

### Features
- Client-side data storage
- No backend API calls
- Mock data for demonstration
- Responsive design with Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

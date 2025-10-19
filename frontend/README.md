# Frontend for AI Meeting App

This is the frontend for the AI-powered video meeting application built with React and Vite.

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Environment Variables

Create a `.env` file in this directory with the following variables:

```
VITE_BACKEND_URL=http://localhost:5001
```

For production deployment, set `VITE_BACKEND_URL` to your deployed backend URL.

## Deployment

This frontend is configured for deployment on Vercel. Make sure to set the following build settings:

- Build Command: `npm run build`
- Root Directory: `frontend`
- Output Directory: `dist`

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Previews the production build locally
- `npm run lint` - Runs ESLint on the source files
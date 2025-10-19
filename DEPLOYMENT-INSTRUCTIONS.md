# Deployment Instructions

## Prerequisites
1. GitHub account (sanmatipt.123@gmail.com)
2. MongoDB Atlas account
3. Vercel account (for frontend)
4. Render.com account (for backend - Heroku alternative)

## MongoDB Atlas Setup
1. Create a MongoDB Atlas account if you haven't already
2. Create a new cluster
3. In the Network Access section, add your IP address or allow access from anywhere (0.0.0.0/0) for testing
4. Create a database user with read/write permissions
5. Get the connection string for your cluster

## GitHub Repository Setup
1. Create a new repository on GitHub
2. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

## Frontend Deployment (Vercel)

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project with these settings:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
5. Add environment variables if needed:
   - VITE_BACKEND_URL: https://your-backend-app-name.onrender.com

## Backend Deployment (Render.com - Heroku Alternative)

### Deploy using Render Dashboard (Recommended)

1. Create a new account at https://render.com/ using your GitHub account
2. Click "New Web Service"
3. Connect your GitHub repository
4. Configure your web service:
   - Name: meeting-app-backend
   - Region: Choose the closest to your users
   - Branch: main
   - Root Directory: backend
   - Environment: Node
   - Build Command: npm install
   - Start Command: npm start
5. Click "Advanced" and add the following environment variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure secret key (different from your local one)
   - `JWT_EXPIRE`: 7d
   - `NODE_ENV`: production
6. Click "Create Web Service"

### Deploy using render.yaml (Alternative)

If you've added the render.yaml file to your repository:

1. Create a new account at https://render.com/ using your GitHub account
2. Click "New Web Service"
3. Connect your GitHub repository
4. Render will automatically detect the render.yaml file
5. Review the settings and click "Create Web Service"

## Environment Variables Explained

- `MONGO_URI`: Your MongoDB Atlas connection string. Replace username, password, and cluster details with your actual values.
- `JWT_SECRET`: A secure secret key for JWT tokens. Use a long, random string for production.
- `JWT_EXPIRE`: Expiration time for JWT tokens (e.g., 7d for 7 days).
- `NODE_ENV`: Set to "production" for production environment.

## MongoDB Atlas Connection String Format

Your MongoDB Atlas connection string should look like this:
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/meetingapp?retryWrites=true&w=majority
```

Replace:
- `username`: Your MongoDB Atlas database user
- `password`: Your MongoDB Atlas database user password
- `cluster0.abc123.mongodb.net`: Your actual cluster address

## Post-Deployment

1. Check the logs in Render dashboard:
   - Go to your service in Render dashboard
   - Click "Logs" to view real-time logs

2. Test your API endpoints:
   - Visit https://your-backend-app-name.onrender.com/
   - You should see "AI Meeting App Backend Server is running!"

3. Test frontend:
   - Visit your Vercel deployment URL
   - Try logging in and accessing meeting features

## Common Issues and Solutions

1. **MongoDB Connection Error**:
   - Ensure your MongoDB Atlas cluster allows connections from Render IPs (0.0.0.0/0)
   - Double-check your MONGO_URI format and credentials

2. **Environment Variables Not Set**:
   - Make sure all required environment variables are set in Render Environment Variables

3. **CORS Issues**:
   - The backend is already configured to allow all origins, but you can adjust the cors settings in server.js if needed

4. **Build Failures**:
   - Check the build logs in Render dashboard
   - Ensure all dependencies are correctly listed in package.json

5. **Application Crashes**:
   - Check the runtime logs in Render dashboard
   - Ensure your MONGO_URI is correctly formatted and accessible
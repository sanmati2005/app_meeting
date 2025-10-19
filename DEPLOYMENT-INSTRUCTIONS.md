# Deployment Instructions

## Prerequisites
1. GitHub account (sanmatipt.123@gmail.com)
2. MongoDB Atlas account
3. Vercel account (for frontend)
4. Heroku account (for backend)

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
   - VITE_BACKEND_URL: https://your-backend-app-name.herokuapp.com

## Backend Deployment (Heroku via GitHub)

### Option 1: Deploy using Heroku Dashboard (Recommended)

1. Create a new app on Heroku dashboard:
   - Go to https://dashboard.heroku.com/new-app
   - Click "Create new app"
   - Give your app a unique name
   - Select your region

2. Connect to GitHub:
   - In your Heroku app dashboard, go to the "Deploy" tab
   - Select "GitHub" as the deployment method
   - Connect your GitHub account (sanmatipt.123@gmail.com)
   - Search for your repository and connect it
   - Enable automatic deploys from the main branch

3. Set environment variables in Heroku:
   - In your Heroku app dashboard, go to the "Settings" tab
   - Click "Reveal Config Vars"
   - Add the following config vars (replace with your actual values):
     - `MONGO_URI`: mongodb+srv://username:password@cluster0.abc123.mongodb.net/meetingapp?retryWrites=true&w=majority
     - `JWT_SECRET`: your_secure_jwt_secret_key_12345 (use a different, more secure secret for production)
     - `JWT_EXPIRE`: 7d
     - `NODE_ENV`: production
     - `PORT`: 5001 (Heroku will automatically set this, but you can specify it)

4. Deploy:
   - Either manually deploy by clicking "Deploy Branch" or wait for automatic deployment

### Option 2: Deploy using Heroku Git (If CLI login works)

1. Update the `.env.production` file in the backend directory with your actual values:
   ```
   MONGO_URI=your_actual_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRE=7d
   PORT=5001
   ```

2. Commit your changes:
   ```bash
   git add .
   git commit -m "Prepare for Heroku deployment"
   ```

3. Set up Heroku remote:
   ```bash
   heroku git:remote -a your-heroku-app-name
   ```

4. Set environment variables on Heroku:
   ```bash
   heroku config:set MONGO_URI="your_actual_mongodb_atlas_connection_string"
   heroku config:set JWT_SECRET="your_secure_jwt_secret"
   heroku config:set JWT_EXPIRE=7d
   heroku config:set NODE_ENV=production
   ```

5. Deploy to Heroku:
   ```bash
   git push heroku main
   ```

### Option 3: Deploy using Heroku Container Registry

1. Install Heroku CLI and Docker
2. Log in to Heroku:
   ```bash
   heroku login
   ```

3. Log in to Heroku Container Registry:
   ```bash
   heroku container:login
   ```

4. Create a Heroku app:
   ```bash
   heroku create your-app-name
   ```

5. Set environment variables:
   ```bash
   heroku config:set MONGO_URI="your_actual_mongodb_atlas_connection_string"
   heroku config:set JWT_SECRET="your_secure_jwt_secret"
   heroku config:set JWT_EXPIRE=7d
   heroku config:set NODE_ENV=production
   ```

6. Push the Docker image:
   ```bash
   heroku container:push web -a your-app-name
   ```

7. Release the image:
   ```bash
   heroku container:release web -a your-app-name
   ```

## Environment Variables Explained

- `MONGO_URI`: Your MongoDB Atlas connection string. Replace username, password, and cluster details with your actual values.
- `JWT_SECRET`: A secure secret key for JWT tokens. Use a long, random string for production.
- `JWT_EXPIRE`: Expiration time for JWT tokens (e.g., 7d for 7 days).
- `NODE_ENV`: Set to "production" for production environment.
- `PORT`: Port number (Heroku automatically sets this, defaults to 5001 if not set).

## MongoDB Atlas Connection String Format

Your MongoDB Atlas connection string should look like this:
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/meetingapp?retryWrites=true&w=majority
```

Replace:
- `username`: Your MongoDB Atlas database user
- `password`: Your MongoDB Atlas database user password
- `cluster0.abc123.mongodb.net`: Your actual cluster address

## Troubleshooting

If you're having trouble logging into Heroku CLI:
1. Try using the Heroku Dashboard method (Option 1 above) - this doesn't require CLI login
2. Make sure you're using the correct Heroku credentials
3. Check if two-factor authentication is enabled
4. Try resetting your Heroku password
5. Clear your browser cache and cookies before logging in
6. Try logging in through an incognito/private browser window

## Post-Deployment

1. Check the logs in Heroku dashboard:
   - Go to your app in Heroku dashboard
   - Click "More" > "View logs"

2. Test your API endpoints:
   - Visit https://your-backend-app-name.herokuapp.com/
   - You should see "AI Meeting App Backend Server is running!"

3. Test frontend:
   - Visit your Vercel deployment URL
   - Try logging in and accessing meeting features

## Common Issues and Solutions

1. **MongoDB Connection Error**:
   - Ensure your MongoDB Atlas cluster allows connections from Heroku IPs (0.0.0.0/0)
   - Double-check your MONGO_URI format and credentials

2. **Environment Variables Not Set**:
   - Make sure all required environment variables are set in Heroku Config Vars

3. **CORS Issues**:
   - The backend is already configured to allow all origins, but you can adjust the cors settings in server.js if needed

4. **Port Issues**:
   - Heroku dynamically assigns ports through the PORT environment variable
   - The server.js file is already configured to use process.env.PORT
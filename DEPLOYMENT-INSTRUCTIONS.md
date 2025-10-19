# Deployment Instructions

## Prerequisites
1. Heroku account
2. MongoDB Atlas account
3. Git installed and configured

## MongoDB Atlas Setup
1. Create a MongoDB Atlas account if you haven't already
2. Create a new cluster
3. In the Network Access section, add your IP address or allow access from anywhere (0.0.0.0/0) for testing
4. Create a database user with read/write permissions
5. Get the connection string for your cluster

## Heroku Deployment

### Option 1: Deploy using Heroku Git

1. Create a new app on Heroku dashboard:
   - Go to https://dashboard.heroku.com/new-app
   - Click "Create new app"
   - Give your app a unique name
   - Select your region

2. Update the `.env.production` file in the backend directory with your actual values:
   ```
   MONGO_URI=your_actual_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRE=7d
   PORT=5001
   ```

3. Commit your changes:
   ```bash
   git add .
   git commit -m "Prepare for Heroku deployment"
   ```

4. Set up Heroku remote:
   ```bash
   heroku git:remote -a your-heroku-app-name
   ```

5. Set environment variables on Heroku:
   ```bash
   heroku config:set MONGO_URI="your_actual_mongodb_atlas_connection_string"
   heroku config:set JWT_SECRET="your_secure_jwt_secret"
   heroku config:set JWT_EXPIRE=7d
   ```

6. Deploy to Heroku:
   ```bash
   git push heroku main
   ```

### Option 2: Deploy using Heroku Container Registry

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
   ```

6. Push the Docker image:
   ```bash
   heroku container:push web -a your-app-name
   ```

7. Release the image:
   ```bash
   heroku container:release web -a your-app-name
   ```

## Post-Deployment

1. Check the logs:
   ```bash
   heroku logs --tail
   ```

2. Open the app:
   ```bash
   heroku open
   ```

3. Scale the dynos if needed:
   ```bash
   heroku ps:scale web=1
   ```

## Environment Variables

Make sure to set the following environment variables in your Heroku app:

- `MONGO_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure secret key for JWT tokens
- `JWT_EXPIRE`: Expiration time for JWT tokens (e.g., 7d)
- `PORT`: Port number (defaults to 5001 if not set)
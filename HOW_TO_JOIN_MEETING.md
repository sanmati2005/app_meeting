# How to Join Meetings in the AI Meeting App

## User Authentication

### Creating an Account
1. Navigate to the login page at `http://localhost:3004/login`
2. Click "Sign Up" to create a new account
3. Fill in your name, email, and password
4. Click "Sign Up" to create your account

### Logging In
1. Navigate to the login page at `http://localhost:3004/login`
2. Enter your email and password
3. Click "Sign In" to access your account

### Profile Management
1. After logging in, click on "Profile" in the navigation bar
2. View your personal information and preferences
3. Click "Edit Profile" to update your information
4. Make changes to your name, email, or preferences
5. Click "Save Changes" to update your profile

## For Meeting Hosts

### Creating a Meeting
1. Navigate to the "Meetings" tab
2. Click "+ Start Instant Meeting" for an immediate meeting
3. Or click "+ Schedule Meeting" to plan a future meeting

### Sharing Meeting Access
When you create a meeting, you'll get a unique Meeting ID that others can use to join.

## For Participants

### Joining a Meeting
1. **Get the Meeting ID** from the host (it's a random string like "A1B2C3D4")
2. **Navigate to the Meetings page** in the app
3. **Click "+ Start Instant Meeting"** or go to the scheduled meeting
4. **Click "Join"** on the meeting you want to attend

### Alternative Way to Join
1. **Direct URL**: Participants can join directly using a URL in the format:
   ```
   http://localhost:3004/room/{MEETING_ID}
   ```
   For example: `http://localhost:3004/room/A1B2C3D4`

## How It Works

### Technical Details
1. **Room Creation**: When a host starts a meeting, a unique room ID is generated
2. **WebSocket Connection**: The app uses Socket.IO for real-time communication
3. **Peer-to-Peer Connection**: Video/audio streams are sent directly between participants using WebRTC
4. **User Authentication**: All users must log in to access meetings
5. **Profile Storage**: User preferences and settings are saved to their profile

### What Participants See
- Their own video feed (bottom left)
- Other participants' video feeds
- Controls for audio/video toggle, screen sharing, and leaving the meeting

## Troubleshooting

### Common Issues
1. **Camera/Microphone Not Working**:
   - Check browser permissions
   - Ensure no other apps are using the camera
   - Try refreshing the page

2. **Can't Join Meeting**:
   - Verify the meeting ID is correct
   - Ensure both host and participant are on the same network (for localhost)
   - Check that the app servers are running

3. **Poor Video Quality**:
   - Check internet connection
   - Close other bandwidth-intensive applications
   - Try turning off video for some participants

4. **Login Issues**:
   - Verify email and password are correct
   - Ensure you've created an account if logging in for the first time
   - Check that the backend server is running
   - Make sure you're using the correct URL (`http://localhost:3004`)

## Best Practices

### For Hosts
- Share the meeting ID in advance for scheduled meetings
- Test audio/video before participants join
- Use the "Mute on Entry" feature for large meetings

### For Participants
- Join with headphones to prevent echo
- Mute when not speaking
- Ensure good lighting for video

### For All Users
- Keep your profile updated with current preferences
- Log out when using shared computers
- Use strong passwords for your account
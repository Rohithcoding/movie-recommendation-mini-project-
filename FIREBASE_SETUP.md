# Firebase Setup Guide for CineAI

This guide will help you set up Firebase Authentication and Firestore for the CineAI movie app.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `cineai-movie-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable the following providers:

### Email/Password
- Click on **Email/Password**
- Enable **Email/Password**
- Enable **Email link (passwordless sign-in)** (optional)
- Click **Save**

### Google
- Click on **Google**
- Enable **Google**
- Select your project support email
- Click **Save**

### Phone
- Click on **Phone**
- Enable **Phone**
- Add your phone number for testing (optional)
- Click **Save**

## 3. Set up Firestore Database

1. Go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your preferred location
5. Click **Done**

### Firestore Security Rules (for production)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow read access to movies data
    match /movies/{movieId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 4. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Web app** icon (`</>`)
4. Register your app with name: `CineAI Web App`
5. Copy the configuration object

## 5. Update Environment Variables

Create or update `.env.local` file in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:your-app-id
```

## 6. Configure Authentication Settings

### Email Templates
1. Go to **Authentication** > **Templates**
2. Customize email templates for:
   - Email verification
   - Password reset
   - Email address change

### Authorized Domains
1. Go to **Authentication** > **Settings** > **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - Your production domain

## 7. Phone Authentication Setup

### Enable reCAPTCHA
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Enable **Identity Toolkit API**
4. Go to **APIs & Services** > **Credentials**
5. Create **API Key** for reCAPTCHA (if needed)

### Test Phone Numbers (for development)
1. Go to **Authentication** > **Sign-in method** > **Phone**
2. Add test phone numbers with verification codes:
   - Phone: `+1 555-123-4567`
   - Code: `123456`

## 8. Security Best Practices

### API Key Restrictions
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **APIs & Services** > **Credentials**
3. Click on your API key
4. Add **Application restrictions**:
   - HTTP referrers for web
   - Add your domains
5. Add **API restrictions**:
   - Identity Toolkit API
   - Cloud Firestore API

### Authentication Settings
1. Enable **Email enumeration protection**
2. Set **Password policy** requirements
3. Configure **Multi-factor authentication** (optional)

## 9. Testing the Setup

1. Start your development server: `npm run dev`
2. Try the following authentication methods:
   - Email/Password signup and login
   - Google OAuth login
   - Phone number with OTP
   - Password reset
   - Email verification

## 10. Production Deployment

### Environment Variables
Set the same environment variables in your production environment:
- Vercel: Project Settings > Environment Variables
- Netlify: Site Settings > Environment Variables
- Other platforms: Follow their documentation

### Domain Configuration
1. Add your production domain to **Authorized domains**
2. Update **OAuth redirect URIs** if needed
3. Update Firestore security rules for production

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Check if all environment variables are set correctly
   - Verify Firebase project configuration

2. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to Authorized domains in Firebase Console

3. **"Firebase: Error (auth/popup-blocked)"**
   - Enable popups in browser for Google OAuth

4. **Phone authentication not working**
   - Check if reCAPTCHA is properly configured
   - Verify phone number format includes country code

5. **Firestore permission denied**
   - Check Firestore security rules
   - Ensure user is authenticated

### Support
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

## Demo Mode

If you want to test without setting up Firebase, the app will work in demo mode with mock authentication. Simply don't set the environment variables and it will use the fallback AuthContext.

# Supabase Setup Guide for Kalendi

This guide will help you set up Supabase for the Kalendi calendar application with FCM push notifications.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub or create an account
4. Click "New Project"
5. Choose your organization
6. Enter project details:
   - **Name**: `kalendi-calendar`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
7. Click "Create new project"

## 2. Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon Key** (public key)
   - **Service Role Key** (keep this secret)

## 3. Update App Configuration

Update `src/services/supabase.ts` with your credentials:

```typescript
const supabaseUrl = 'YOUR_PROJECT_URL';
const supabaseAnonKey = 'YOUR_ANON_KEY';
```

## 4. Create Database Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  location TEXT,
  color TEXT NOT NULL,
  reminder_time INTEGER,
  user_id UUID NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule JSONB,
  original_event_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  fcm_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendar_sync table
CREATE TABLE calendar_sync (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook', 'apple')),
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  calendar_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_sync ENABLE ROW LEVEL SECURITY;

-- Create policies for events
CREATE POLICY "Users can view their own events" ON events
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own events" ON events
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create policies for users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Create policies for calendar_sync
CREATE POLICY "Users can manage their own calendar sync" ON calendar_sync
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Create indexes for better performance
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_original_event_id ON events(original_event_id);
CREATE INDEX idx_calendar_sync_user_id ON calendar_sync(user_id);
```

## 5. Firebase Setup for FCM

### 5.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `kalendi-fcm`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 5.2 Add iOS App

1. In Firebase Console, click "Add app" → iOS
2. Enter iOS bundle ID: `org.reactjs.native.example.calendy`
3. Download `GoogleService-Info.plist`
4. Add it to your iOS project in Xcode

### 5.3 Add Android App

1. In Firebase Console, click "Add app" → Android
2. Enter Android package name: `com.calendy`
3. Download `google-services.json`
4. Add it to your Android project

### 5.4 Configure iOS

1. In Xcode, add `GoogleService-Info.plist` to your project
2. Update `ios/calendy/AppDelegate.swift`:

```swift
import UIKit
import Firebase

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    FirebaseApp.configure()
    return true
  }
}
```

### 5.5 Configure Android

1. Add `google-services.json` to `android/app/`
2. Update `android/build.gradle`:

```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

3. Update `android/app/build.gradle`:

```gradle
apply plugin: 'com.google.gms.google-services'
```

## 6. Backend Functions for FCM

Create a Supabase Edge Function for sending FCM notifications:

```typescript
// supabase/functions/send-notification/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { eventId, userId } = await req.json();

    // Get user's FCM token
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: user } = await supabase
      .from('users')
      .select('fcm_token')
      .eq('id', userId)
      .single();

    if (!user?.fcm_token) {
      throw new Error('No FCM token found');
    }

    // Get event details
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (!event) {
      throw new Error('Event not found');
    }

    // Send FCM notification
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization: `key=${Deno.env.get('FIREBASE_SERVER_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user.fcm_token,
        notification: {
          title: 'Event Reminder',
          body: `${event.title} starts in ${event.reminder_time} minutes`,
        },
        data: {
          eventId: event.id,
          type: 'event_reminder',
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send FCM notification');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

## 7. Environment Variables

Add these to your Supabase project settings:

1. Go to **Settings** → **API**
2. Add environment variables:
   - `FIREBASE_SERVER_KEY`: Your Firebase Server Key
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key

## 8. Deploy Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy send-notification
```

## 9. Test the Setup

1. Run the app: `npm run ios` or `npm run android`
2. Add an event with a reminder
3. Check that FCM token is generated
4. Test push notifications

## 10. Troubleshooting

### Common Issues:

1. **FCM Token not generated**: Check Firebase configuration
2. **Notifications not received**: Verify server key and token
3. **Database errors**: Check RLS policies
4. **Build errors**: Ensure all dependencies are installed

### Debug Commands:

```bash
# Check FCM token
npx react-native log-ios

# Test Supabase connection
curl -X GET "YOUR_SUPABASE_URL/rest/v1/events" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## 11. Next Steps

1. Implement user authentication
2. Add calendar sync with Google/Outlook
3. Implement recurring event logic
4. Add offline support
5. Implement push notification scheduling

---

**Need help?** Check the [Supabase documentation](https://supabase.com/docs) or [Firebase documentation](https://firebase.google.com/docs).

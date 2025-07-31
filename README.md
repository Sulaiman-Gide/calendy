# Kalendi - Modern Calendar App

A beautiful, modern calendar application built with React Native, featuring event management, Supabase integration, and push notifications.

## Features

- 📅 **Beautiful Calendar Interface** - Clean, modern calendar view with event indicators
- 🎨 **Dark/Light Theme Support** - Automatic theme switching based on system preferences
- 📝 **Event Management** - Add, edit, and delete events with rich details
- 🔔 **Push Notifications** - Automatic reminders for events
- ☁️ **Cloud Sync** - Events stored in Supabase database
- 📱 **Responsive Design** - Optimized for mobile devices
- 🎯 **Modern UI/UX** - Clean, intuitive interface inspired by iOS Calendar

## Screenshots

_Screenshots will be added here_

## Tech Stack

- **React Native** - Cross-platform mobile development
- **TypeScript** - Type-safe development
- **Supabase** - Backend as a Service (Database & Auth)
- **React Native Vector Icons** - Beautiful icons
- **React Native Modal** - Smooth modal interactions
- **React Native Date Picker** - Native date/time selection
- **React Native Push Notification** - Local notifications

## Prerequisites

- Node.js (v18 or higher)
- React Native CLI
- iOS Simulator (for iOS development)
- Android Studio & Android SDK (for Android development)
- Supabase account

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd calendy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)

   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Configure Supabase**

   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key
   - Update `src/services/supabase.ts` with your credentials:

   ```typescript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

5. **Create Database Tables**
   Run the following SQL in your Supabase SQL editor:

   ```sql
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
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     name TEXT NOT NULL,
     avatar TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE events ENABLE ROW LEVEL SECURITY;
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view their own events" ON events
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own events" ON events
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own events" ON events
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own events" ON events
     FOR DELETE USING (auth.uid() = user_id);
   ```

## Running the App

### iOS

```bash
npm run ios
```

### Android

```bash
npm run android
```

### Metro Bundler

```bash
npm start
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CalendarHeader.tsx
│   ├── CalendarGrid.tsx
│   ├── EventCard.tsx
│   └── AddEventModal.tsx
├── screens/            # Screen components
│   └── CalendarScreen.tsx
├── services/           # API and external services
│   ├── supabase.ts
│   └── notificationService.ts
├── hooks/              # Custom React hooks
│   └── useTheme.ts
├── utils/              # Utility functions
│   └── dateUtils.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── constants/          # App constants
    └── theme.ts
```

## Features in Detail

### Calendar View

- Monthly calendar grid with event indicators
- Smooth navigation between months
- Today button for quick navigation
- Event dots showing event count per day

### Event Management

- Add events with title, description, location
- Set start and end times
- All-day event support
- Color coding for events
- Reminder settings (5 min, 15 min, 30 min, 1 hour, 1 day)

### Notifications

- Local push notifications for event reminders
- Configurable reminder times
- Automatic notification scheduling

### Theme Support

- Automatic dark/light mode detection
- Consistent theming throughout the app
- Beautiful color palette

## Configuration

### Supabase Setup

1. Create a new Supabase project
2. Enable Row Level Security (RLS)
3. Create the required tables (see Installation section)
4. Update the credentials in `src/services/supabase.ts`

### Push Notifications

The app uses `react-native-push-notification` for local notifications. No additional setup is required for basic functionality.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Kalendi** - Your modern calendar companion 📅✨

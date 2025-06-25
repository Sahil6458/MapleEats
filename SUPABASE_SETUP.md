# Supabase Setup Instructions for MapleEats

This guide will help you set up Supabase authentication and database for the MapleEats application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `MapleEats`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
5. Click "Create new project"

## 2. Install Dependencies

Run the following command to install Supabase client:

```bash
npm install @supabase/supabase-js
```

## 3. Environment Variables

Create a `.env` file in your project root and add:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ENABLE_API_LOGGING=false
```

To get these values:
1. Go to your Supabase project dashboard
2. Click on "Settings" in the sidebar
3. Go to "API" section
4. Copy the "Project URL" and "anon public" key

## 4. Database Setup

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Copy and paste the contents of `supabase-schema.sql` file
4. Click "Run" to execute the SQL

This will create:
- `users` table for user profiles
- `orders` table for order management
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for automatic timestamps

## 5. Enable Phone Authentication

1. Go to "Authentication" > "Settings" in your Supabase dashboard
2. Scroll down to "Phone Auth"
3. Enable "Enable phone signup"
4. Configure your phone provider (Twilio recommended)
5. Add your phone provider credentials

### Twilio Setup (Recommended)

1. Sign up at [twilio.com](https://twilio.com)
2. Get your Account SID and Auth Token
3. Purchase a phone number for SMS
4. In Supabase, add:
   - Account SID
   - Auth Token
   - Phone Number

## 6. Configure Authentication Settings

1. Go to "Authentication" > "Settings"
2. Set "Site URL" to your app URL (e.g., `http://localhost:5173` for development)
3. Add additional redirect URLs if needed
4. Configure email templates if using email auth

## 7. Row Level Security Policies

The SQL script already includes RLS policies, but here's what they do:

### Users Table Policies:
- Users can only view their own profile
- Users can only update their own profile
- Users can only insert their own profile

### Orders Table Policies:
- Users can only view their own orders
- Users can only insert orders for themselves

## 8. Testing the Setup

1. Start your development server: `npm run dev`
2. Try logging in with a phone number
3. Place a test order
4. Check the Supabase dashboard to see if data is being stored correctly

## 9. Production Considerations

### Security:
- Enable RLS on all tables
- Review and test all policies
- Use environment variables for all sensitive data
- Enable MFA for your Supabase account

### Performance:
- Add indexes for frequently queried columns
- Monitor query performance in Supabase dashboard
- Consider database optimization for large datasets

### Backup:
- Enable daily backups in Supabase
- Export your schema regularly
- Test restore procedures

## 10. Troubleshooting

### Common Issues:

1. **Phone OTP not working:**
   - Check Twilio configuration
   - Verify phone number format (+1234567890)
   - Check Supabase logs for errors

2. **RLS blocking queries:**
   - Ensure user is authenticated
   - Check policy conditions
   - Test policies in SQL editor

3. **Environment variables not loading:**
   - Restart development server
   - Check `.env` file location
   - Verify variable names (must start with `VITE_`)

### Debug Mode:

Enable debug logging by setting:
```env
VITE_ENABLE_API_LOGGING=true
```

This will log all API requests and responses to the browser console.

## 11. API Integration

The app includes these services:
- `AuthContext`: Handles user authentication
- `OrderService`: Manages orders in Supabase
- `LoginModal`: Phone-based login interface

### Key Features:
- Phone number authentication with OTP
- User profile management
- Order history and tracking
- Real-time order updates
- Secure data access with RLS

## 12. Next Steps

After setup, you can:
- Customize the authentication flow
- Add more user profile fields
- Implement real-time order tracking
- Add push notifications
- Integrate with payment providers
- Add restaurant management features

For more advanced features, check the [Supabase documentation](https://supabase.com/docs). 
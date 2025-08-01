# Supabase Authentication Setup

This guide will help you set up Supabase authentication for your Marketing Agent application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account or sign in
2. Create a new project
3. Wait for the project to be set up (this may take a few minutes)

## 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy your **Project URL** and **anon public** key
3. Create a `.env` file in the `Frontend` directory with the following content:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Configure Authentication Settings

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Configure the following settings:

### Site URL

Set your site URL to `http://localhost:5173` for development

### Redirect URLs

Add these redirect URLs:

- `http://localhost:5173/signin`
- `http://localhost:5173/signup`
- `http://localhost:5173/reset-password`

### Email Templates (Optional)

You can customize the email templates in **Authentication** > **Email Templates**:

- Confirm signup
- Reset password
- Magic link

## 4. Enable Email Authentication

1. Go to **Authentication** > **Providers**
2. Make sure **Email** is enabled
3. Configure any additional settings as needed

## 5. Test the Authentication

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:5173/signup`
3. Create a new account
4. Check your email for the confirmation link
5. Sign in with your credentials

## 6. Database Schema (Optional)

If you want to store additional user data, you can create a `profiles` table:

```sql
-- Create a profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## 7. Environment Variables for Production

When deploying to production, make sure to:

1. Update the Site URL in Supabase to your production domain
2. Add your production domain to the redirect URLs
3. Set the environment variables in your hosting platform

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**: Make sure you're using the `anon` key, not the `service_role` key
2. **Redirect errors**: Ensure your redirect URLs are correctly configured in Supabase
3. **Email not sending**: Check your email provider settings in Supabase
4. **CORS errors**: Make sure your domain is added to the allowed origins in Supabase

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Visit the [Supabase community](https://github.com/supabase/supabase/discussions)
- Review the [React Auth Helpers documentation](https://supabase.com/docs/guides/auth/auth-helpers/react)

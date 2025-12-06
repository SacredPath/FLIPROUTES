-- Admin Account Setup SQL
-- Run this in your Supabase SQL Editor to create an admin account
--
-- Instructions:
-- 1. Replace 'admin@fliproutes.com' with your desired admin email
-- 2. Replace 'SecurePassword123!' with a strong password
-- 3. Run this SQL in Supabase SQL Editor
-- 4. The admin account will be created in auth.users and public.users

-- Step 1: Create the admin user in auth.users
-- Note: You'll need to use Supabase Dashboard > Authentication > Users > Add User
-- Or use the Supabase Management API

-- Step 2: After creating the auth user, get their UUID and run this:
-- Replace 'YOUR_USER_UUID_HERE' with the actual UUID from auth.users

-- Update existing user to admin (if user already exists)
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@fliproutes.com';

-- Or insert new admin user (if creating from scratch)
-- First, create the user in Supabase Dashboard > Authentication > Users
-- Then get their UUID and run:
/*
INSERT INTO public.users (id, email, full_name, company, role)
VALUES (
  'YOUR_USER_UUID_HERE',  -- Replace with actual UUID from auth.users
  'admin@fliproutes.com',
  'Admin User',
  'FlipRoutes',
  'admin'
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin';
*/

-- Verify admin account was created
SELECT id, email, full_name, role, created_at 
FROM public.users 
WHERE role = 'admin';


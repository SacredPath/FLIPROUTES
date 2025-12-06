/**
 * Admin Account Setup Script
 * 
 * This script helps you create an admin account in Supabase.
 * 
 * Usage:
 * 1. Set your Supabase credentials in .env.local
 * 2. Run: npx tsx scripts/setup-admin.ts
 * 
 * Or use the Supabase SQL Editor to run the SQL directly.
 */

import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

async function setupAdmin() {
  console.log('🔐 Admin Account Setup\n')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials')
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    console.log('Enter admin account details:\n')
    const email = await question('Email: ')
    const password = await question('Password (min 6 characters): ')
    const fullName = await question('Full Name: ') || 'Admin User'
    const company = await question('Company (optional): ') || 'FlipRoutes'

    if (!email || !password) {
      console.error('❌ Email and password are required')
      process.exit(1)
    }

    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters')
      process.exit(1)
    }

    console.log('\n⏳ Creating admin account...')

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        company: company
      }
    })

    if (authError) {
      console.error('❌ Error creating auth user:', authError.message)
      process.exit(1)
    }

    if (!authData.user) {
      console.error('❌ Failed to create user')
      process.exit(1)
    }

    // Create user profile with admin role
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        email: authData.user.email!,
        full_name: fullName,
        company: company,
        role: 'admin'
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      console.error('❌ Error creating user profile:', profileError.message)
      // Try to delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      process.exit(1)
    }

    console.log('\n✅ Admin account created successfully!')
    console.log('\n📋 Account Details:')
    console.log(`   Email: ${email}`)
    console.log(`   User ID: ${authData.user.id}`)
    console.log(`   Role: admin`)
    console.log('\n🔗 You can now log in at: /login')
    console.log('   Admin dashboard: /admin\n')

  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

setupAdmin()


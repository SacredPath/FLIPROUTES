"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { nameSchema, emailSchema, passwordSchema, companySchema, sanitizeInput, validatePasswordStrength } from '@/lib/security'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const router = useRouter()

  const validateForm = () => {
    const errors: string[] = []
    
    // Validate name
    const nameResult = nameSchema.safeParse(fullName)
    if (!nameResult.success) {
      errors.push(nameResult.error.errors[0].message)
    }
    
    // Validate email
    const emailResult = emailSchema.safeParse(email)
    if (!emailResult.success) {
      errors.push(emailResult.error.errors[0].message)
    }
    
    // Validate password
    const passwordResult = passwordSchema.safeParse(password)
    if (!passwordResult.success) {
      errors.push(passwordResult.error.errors[0].message)
    }
    
    // Validate company (optional)
    if (company) {
      const companyResult = companySchema.safeParse(company)
      if (!companyResult.success) {
        errors.push(companyResult.error.errors[0].message)
      }
    }
    
    // Check password strength
    const strengthCheck = validatePasswordStrength(password)
    if (!strengthCheck.isValid) {
      errors.push(...strengthCheck.errors)
    }
    
    setPasswordErrors(strengthCheck.errors)
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validate form
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '))
      return
    }
    
    setIsLoading(true)
    
    // Sanitize inputs
    const sanitizedData = {
      fullName: sanitizeInput(fullName),
      email: sanitizeInput(email),
      company: company ? sanitizeInput(company) : null
    }
    
    const { data, error } = await supabase.auth.signUp({
      email: sanitizedData.email,
      password,
      options: {
        data: {
          full_name: sanitizedData.fullName,
          company: sanitizedData.company,
        },
      },
    })
    
    if (error) {
      setIsLoading(false)
      setError(error.message)
      return
    }

    // Create user profile in users table
    if (data.user) {
      try {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: sanitizedData.email,
              full_name: sanitizedData.fullName,
              company: sanitizedData.company,
              role: 'customer'
            }
          ])

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          // Don't fail the signup if profile creation fails - it might already exist
          // The user can still proceed
        }
      } catch (profileErr) {
        console.error('Error creating user profile:', profileErr)
        // Continue even if profile creation fails
      }
    }

    setIsLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Create your account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              required
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {passwordErrors.length > 0 && (
              <div className="mt-2 text-sm text-red-600">
                <ul className="list-disc list-inside">
                  {passwordErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Company (optional)"
              value={company}
              onChange={e => setCompany(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</a>
        </p>
      </div>
    </div>
  )
} 
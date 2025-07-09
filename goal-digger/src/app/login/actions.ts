'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
})

const signupSchema = z.object({
  displayName: z.string()
    .min(2, { message: 'Display name must be at least 2 characters long' })
    .regex(/^[a-zA-Z0-9 ]+$/, { message: 'Display name can only contain letters, numbers, and spaces' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(32, { message: 'Password must be at most 32 characters long' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/, { message: 'Password must be 6-32 characters long, contain lowercase, uppercase letters and digits' }),
})

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const result = loginSchema.safeParse(data)
  if (!result.success) {
    // Format zod errors into a single string or object
    const errors = result.error.issues.map(issue => issue.message).join(', ')
    return { error: errors }
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    displayName: formData.get('displayName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const result = signupSchema.safeParse(data)

  if (!result.success) {
    // Format zod errors into a single string or object
    const errors = result.error.issues.map(issue => issue.message).join(', ')
    return { error: errors }
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.displayName,
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
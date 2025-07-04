'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const UpdateUserSchema = z.object({
    displayName: z.string().min(2, 'Display name must be at least 2 characters').optional().or(z.literal('')),
    password: z.string()
        .min(6, 'Password must be 6-32 characters long, contain lowercase, uppercase letters and digits')
        .max(32, 'Password must be less than 32 char')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/, { message: 'Password must be 6-32 characters long, contain lowercase, uppercase letters and digits' })
        .optional()
        .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
})
.refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], 
})

export async function getUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login') 
    }
    return {
        email: user.email,
        created_at: user.created_at,
        displayName: user.user_metadata?.name ?? ''
    }
}

export async function updateUserProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        return { error: 'User not authenticated' }
    }

    const data = {
        displayName: formData.get('displayName') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
    }

    const result = UpdateUserSchema.safeParse(data)
    if (!result.success) {
        const errors = result.error.issues.map(issue => issue.message).join(', ')
        return { error: errors }
    }

    let errorMsg = ''

    // Only update display name if it has changed and is not empty
    if (result.data.displayName && result.data.displayName !== user.user_metadata?.name) {
        const { error } = await supabase.auth.updateUser({
            data: { name: result.data.displayName }
        })
        if (error) errorMsg += `Display name update failed: ${error.message} `
    }

    // Only update password if a new one is provided
    if (result.data.password) {
        const { error } = await supabase.auth.updateUser({
            password: result.data.password
        })
        if (error) errorMsg += `Password update failed: ${error.message}`
    }
    
    if (errorMsg) {
        return { error: errorMsg.trim() }
    }
    return { success: true }
}
'use server'
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const UpdateUserSchema = z.object({
    displayName: z.string().min(2, 'Display name is required, min 2 char').optional(),
    password: z.string()
        .min(6, 'Password is required, min 6 char')
        .max(32, 'Password must be less than 32 char')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/, { message: 'Password must be 6-32 characters long, contain lowercase, uppercase letters and digits' })
        .optional(),
    confirmPassword: z.string()
        .min(6, 'Confirm password is required, min 6 char')
        .max(32, 'Confirm password must be less than 32 char')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/, { message: 'Confirm password must be 6-32 characters long, contain lowercase, uppercase letters and digits' })
        .optional(),
})
.refine((data) => !data.password || data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], 
})

export async function getUser() {
    const supabase = createClient()
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
    const user = await getUser()

    const data = {
        displayName: formData.get('displayName') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
    }

    const result = UpdateUserSchema.safeParse(data)
    if (!result.success) {
        const errors = result.error.issues.map(issue => issue.message).join(', ')
        return { error: errors}
    }

    const supabase = createClient()
    let errorMsg = ''

    if (data.displayName && data.displayName !== user.displayName) {
        const { error } = await supabase.auth.updateUser({
            data: { name: data.displayName }
        })
        if (error) errorMsg += error.message + ' '
    }

    if (data.password) {
        const { error } = await supabase.auth.updateUser({
            password: data.password
        })
        if (error) errorMsg += error.message + ' '  
    }
    
    if (errorMsg) {
        return { error: errorMsg.trim() }
    }
    return { success: true }
}
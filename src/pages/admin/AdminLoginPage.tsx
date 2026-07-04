import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password required'),
})
type FormData = z.infer<typeof schema>

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async ({ email, password }: FormData) => {
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
    } else {
      navigate('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] relative overflow-hidden">
      <div className="hero-bg-effects">
        <div className="grid-pattern" />
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-[2] w-full max-w-md mx-4"
      >
        <div className="rounded-3xl p-10 shadow-2xl border border-[var(--border)] bg-[var(--card-bg,var(--surface))] backdrop-blur-xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)] shadow-lg mb-4">
              <span className="font-display font-black text-white text-2xl">J+</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-[var(--text)]">Admin Portal</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">J+ Jaidad Group Dashboard</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="email"
                  placeholder="admin@jaidadgroup.com"
                  className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 pl-10 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 pl-10 pr-10 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  {...register('password')}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]">
                  {showPwd ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full mt-6" loading={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In to Dashboard'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
            Restricted access — authorized personnel only
          </p>
        </div>
      </motion.div>
    </div>
  )
}

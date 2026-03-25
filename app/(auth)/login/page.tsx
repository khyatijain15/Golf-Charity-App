import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function loginAction(formData: FormData) {
  'use server';
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  redirect('/dashboard')
}

export default async function LoginPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams?.error === 'string' ? searchParams.error : undefined;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      {/* Left panel — branding */}
      <div style={{
        background: 'linear-gradient(135deg, #080810 0%, #0F0F2A 100%)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start',
        padding: '60px', gap: '32px'
      }} className="hidden md:flex">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' }} />
          <span style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-heading)' }}>GolfGives</span>
        </div>

        {/* Headline */}
        <div>
          <h1 style={{ fontSize: 42, fontWeight: 700, fontFamily: 'var(--font-heading)', lineHeight: 1.2, margin: 0 }}>
            Play Golf.<br />
            <span style={{ color: 'var(--accent)' }}>Change Lives.</span><br />
            Win Big.
          </h1>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '32px', marginTop: '16px' }}>
          {[
            { value: '£8,400', label: 'Current Jackpot' },
            { value: '2,847', label: 'Active Players' },
            { value: '£34k+', label: 'Donated' },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '40px 24px', minHeight: '100vh'
      }}>
        <div className="card-glass" style={{ width: '100%', maxWidth: 400, padding: '40px 36px' }}>
          {/* Mobile brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }} className="md:hidden">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
            <span style={{ fontSize: 16, fontWeight: 600 }}>GolfGives</span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: 6 }}>Welcome back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Sign in to access your dashboard</p>

          {error && (
            <div style={{ background: 'rgba(255,77,106,0.1)', border: '1px solid rgba(255,77,106,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: 'var(--red)' }}>
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Email</label>
              <input name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Password</label>
              <input name="password" type="password" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn-accent" style={{ marginTop: 8, width: '100%', fontSize: 15 }}>
              Sign In →
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
            No account?{' '}
            <Link href="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

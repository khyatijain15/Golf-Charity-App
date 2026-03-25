import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const heading = Space_Grotesk({
  variable: '--font-heading',
  subsets: ['latin'],
});

const body = Inter({
  variable: '--font-body',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Golf Charity Subscription Platform',
  description: 'Play Golf. Change Lives. Win Big.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://placeholder.url',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key',
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const initials = user?.user_metadata?.full_name 
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('')
    : user?.email?.[0].toUpperCase() || 'U';

  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full m-0 p-0 flex flex-col">
        {/* Navbar */}
        <header style={{
          position: 'fixed', top: 0, width: '100%', zIndex: 50,
          background: 'rgba(8,8,16,0.8)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          padding: '0 32px', height: '64px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          {/* Left */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'white' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
            <span style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-heading)' }}>GolfGives</span>
          </Link>

          {/* Center (Desktop only) */}
          <div className="hidden md:flex gap-8" style={{ gap: '32px' }}>
            <Link href="/charities" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-white">Charities</Link>
            <Link href="/how-it-works" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-white">How it works</Link>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {!user ? (
              <>
                <Link href="/login" style={{ fontSize: 14, color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }} className="hover:opacity-80">Sign In</Link>
                <Link href="/signup" className="btn-accent" style={{ textDecoration: 'none', fontSize: 14, padding: '8px 16px' }}>Get Started</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" style={{ fontSize: 14, color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }} className="hover:opacity-80">Dashboard</Link>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)',
                  color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 600
                }}>
                  {initials}
                </div>
              </>
            )}
          </div>
        </header>
        <div style={{ marginTop: '64px', flex: 1 }}>{children}</div>
      </body>
    </html>
  );
}

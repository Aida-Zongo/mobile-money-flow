import type { Metadata } from 'next'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'
import { LanguageProvider } from '@/lib/LanguageContext'
import type { Viewport } from 'next'

export const metadata: Metadata = {
  title: 'MoneyFlow',
  description: 'Expense Tracker Mobile Money',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect"
          href="https://fonts.googleapis.com" />
        <link rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var theme = localStorage.getItem('mf_theme') || 'light';
              var isDark = theme === 'dark' || 
                (theme === 'system' && 
                  window.matchMedia('(prefers-color-scheme: dark)').matches);
              if (isDark) {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.documentElement.style.setProperty('--bg', '#0F1117');
                document.documentElement.style.setProperty('--bg-card', '#1A1D23');
                document.documentElement.style.setProperty('--bg-sidebar', '#13161C');
                document.documentElement.style.setProperty('--text-main', '#F0F2F8');
                document.documentElement.style.setProperty('--text-muted', '#8A94A6');
                document.documentElement.style.setProperty('--border', '#2A2D35');
                document.documentElement.style.setProperty('--bg-hover', '#1E2128');
                document.documentElement.style.setProperty('--bg-input', '#1E2128');
              } else {
                document.documentElement.style.setProperty('--bg', '#F5F7F5');
                document.documentElement.style.setProperty('--bg-card', '#FFFFFF');
                document.documentElement.style.setProperty('--bg-sidebar', '#FFFFFF');
                document.documentElement.style.setProperty('--text-main', '#1A1D23');
                document.documentElement.style.setProperty('--text-muted', '#8A94A6');
                document.documentElement.style.setProperty('--border', '#E2EAE7');
                document.documentElement.style.setProperty('--bg-hover', '#F5F7F5');
                document.documentElement.style.setProperty('--bg-input', '#FAFBFC');
              }
            })()
          `
        }} />
      </head>
      <body>
        <LanguageProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

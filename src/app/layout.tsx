import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Hestia — Immobilier Tunisie',
    template: '%s | Hestia',
  },
  description:
    'La plateforme immobilière de référence en Tunisie. Trouvez votre bien idéal à vendre ou à louer.',
  keywords: ['immobilier', 'tunisie', 'vente', 'location', 'villa', 'appartement'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}

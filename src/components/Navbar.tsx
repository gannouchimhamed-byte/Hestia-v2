'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface NavbarProps {
  user?: { name: string; role: string } | null
}

export default function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-hestia-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold font-serif">H</span>
            </div>
            <span className="text-xl font-serif font-bold text-hestia-primary">Hestia</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/properties"
              className="text-gray-600 hover:text-hestia-primary font-medium transition-colors"
            >
              Propriétés
            </Link>
            <Link
              href="/properties?listingType=SALE"
              className="text-gray-600 hover:text-hestia-primary font-medium transition-colors"
            >
              Acheter
            </Link>
            <Link
              href="/properties?listingType=RENT"
              className="text-gray-600 hover:text-hestia-primary font-medium transition-colors"
            >
              Louer
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {(user.role === 'AGENT' || user.role === 'ADMIN') && (
                  <Link
                    href="/agent"
                    className="text-hestia-primary font-medium hover:underline"
                  >
                    Dashboard
                  </Link>
                )}
                <span className="text-gray-600 text-sm">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn-outline text-sm py-2 px-4"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-hestia-primary font-medium">
                  Connexion
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            <Link href="/properties" className="block px-2 py-2 text-gray-700 hover:text-hestia-primary">
              Propriétés
            </Link>
            <Link href="/properties?listingType=SALE" className="block px-2 py-2 text-gray-700 hover:text-hestia-primary">
              Acheter
            </Link>
            <Link href="/properties?listingType=RENT" className="block px-2 py-2 text-gray-700 hover:text-hestia-primary">
              Louer
            </Link>
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              {user ? (
                <>
                  {(user.role === 'AGENT' || user.role === 'ADMIN') && (
                    <Link href="/agent" className="btn-outline text-sm text-center">Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="btn-outline text-sm">Déconnexion</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-outline text-sm text-center">Connexion</Link>
                  <Link href="/register" className="btn-primary text-sm text-center">S'inscrire</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

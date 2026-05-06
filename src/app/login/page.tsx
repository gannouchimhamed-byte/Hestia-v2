'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Identifiants incorrects')
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hestia-primary-dark relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1000')" }}
        />
        <div className="relative flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-hestia-accent rounded-lg flex items-center justify-center">
              <span className="text-hestia-primary-dark font-bold font-serif">H</span>
            </div>
            <span className="text-2xl font-serif font-bold">Hestia</span>
          </Link>
          <div>
            <h2 className="text-4xl font-serif font-bold leading-tight mb-4">
              Bienvenue sur<br />
              <span className="text-hestia-accent">Hestia</span>
            </h2>
            <p className="text-white/70 text-lg max-w-sm leading-relaxed">
              La plateforme immobilière de référence en Tunisie. Des milliers de biens vous attendent.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-hestia-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold font-serif text-sm">H</span>
            </div>
            <span className="text-xl font-serif font-bold text-hestia-primary">Hestia</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-md p-8">
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-1">Connexion</h1>
            <p className="text-gray-500 text-sm mb-8">Accédez à votre espace personnel</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder="vous@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-hestia-primary font-medium hover:underline">
                S'inscrire
              </Link>
            </p>

            {/* Demo hints */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-3">Comptes de démonstration</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ email: 'admin@hestia.tn', password: 'admin123' })}
                  className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-lg transition-colors text-left"
                >
                  <span className="font-medium block">Admin</span>
                  admin@hestia.tn
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ email: 'karim@hestia.tn', password: 'agent123' })}
                  className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-lg transition-colors text-left"
                >
                  <span className="font-medium block">Agent</span>
                  karim@hestia.tn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

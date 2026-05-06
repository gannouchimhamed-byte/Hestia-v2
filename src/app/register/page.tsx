'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Erreur lors de l\'inscription')
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
      <div className="hidden lg:flex lg:w-1/2 bg-hestia-primary relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1000')" }}
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
              Rejoignez<br />
              <span className="text-hestia-accent">Hestia</span>
            </h2>
            <p className="text-white/70 text-lg max-w-sm leading-relaxed">
              Créez votre compte et accédez à des milliers de propriétés à travers toute la Tunisie.
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
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-1">Créer un compte</h1>
            <p className="text-gray-500 text-sm mb-8">Rejoignez la communauté Hestia gratuitement</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nom complet
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="Votre nom"
                  required
                  autoComplete="name"
                />
              </div>

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
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Téléphone <span className="text-gray-400">(optionnel)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field"
                  placeholder="+216 XX XXX XXX"
                  autoComplete="tel"
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
                  placeholder="Minimum 8 caractères"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="input-field"
                  placeholder="Répétez votre mot de passe"
                  required
                  autoComplete="new-password"
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
                {loading ? 'Création du compte...' : 'Créer mon compte'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-hestia-primary font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

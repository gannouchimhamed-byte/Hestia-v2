'use client'

import { useState } from 'react'

interface InquiryFormProps {
  propertyId: string
  userId: string
}

export default function InquiryForm({ propertyId, userId }: InquiryFormProps) {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return

    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, userId, message }),
      })

      if (!res.ok) throw new Error('Erreur lors de l\'envoi')
      setStatus('success')
      setMessage('')
    } catch {
      setStatus('error')
      setError('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-2">✅</div>
        <p className="font-medium text-gray-900">Demande envoyée !</p>
        <p className="text-sm text-gray-500 mt-1">L'agent vous contactera très prochainement.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-hestia-primary hover:underline"
        >
          Envoyer une autre demande
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Bonjour, je suis intéressé(e) par ce bien. Pourriez-vous me donner plus d'informations ?"
        rows={5}
        className="input-field resize-none text-sm"
        required
        disabled={status === 'loading'}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={status === 'loading' || !message.trim()}
        className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Envoi...' : 'Envoyer la demande'}
      </button>
    </form>
  )
}

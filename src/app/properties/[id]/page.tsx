import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import InquiryForm from './InquiryForm'

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Appartement',
  HOUSE: 'Maison',
  VILLA: 'Villa',
  LAND: 'Terrain',
  COMMERCIAL: 'Commercial',
  OFFICE: 'Bureau',
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const property = await prisma.property.findUnique({ where: { id: params.id } })
    if (!property) return { title: 'Propriété introuvable' }
    return { title: property.title }
  } catch {
    return { title: 'Propriété' }
  }
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession()

  let property
  try {
    property = await prisma.property.findUnique({
      where: { id: params.id },
      include: { agent: { select: { name: true, phone: true, email: true } } },
    })
  } catch {
    notFound()
  }

  if (!property) notFound()

  const isRent = property.listingType === 'RENT'
  const formattedPrice = new Intl.NumberFormat('fr-TN', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(property.price)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={session ? { name: session.name, role: session.role } : null} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back link */}
        <a href="/properties" className="inline-flex items-center gap-2 text-hestia-primary hover:underline mb-6 text-sm font-medium">
          ← Retour aux propriétés
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="rounded-2xl overflow-hidden bg-gray-100">
              {property.images.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-80 object-cover"
                  />
                  {property.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {property.images.slice(1, 4).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${property.title} ${i + 2}`}
                          className="w-full h-32 object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">
                  Pas d'image disponible
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={isRent ? 'badge-rent' : 'badge-sale'}>
                  {isRent ? 'Location' : 'Vente'}
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                  {TYPE_LABELS[property.type] ?? property.type}
                </span>
                {property.featured && (
                  <span className="bg-hestia-accent/20 text-hestia-primary text-xs font-semibold px-3 py-1 rounded-full">
                    ⭐ Vedette
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2">
                {property.title}
              </h1>

              <p className="text-gray-500 flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-hestia-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.address}, {property.city}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-serif font-bold text-hestia-primary">{property.area}</div>
                  <div className="text-xs text-gray-500 mt-0.5">m² surface</div>
                </div>
                {property.bedrooms !== null && (
                  <div className="text-center">
                    <div className="text-2xl font-serif font-bold text-hestia-primary">{property.bedrooms}</div>
                    <div className="text-xs text-gray-500 mt-0.5">chambres</div>
                  </div>
                )}
                {property.bathrooms !== null && (
                  <div className="text-center">
                    <div className="text-2xl font-serif font-bold text-hestia-primary">{property.bathrooms}</div>
                    <div className="text-xs text-gray-500 mt-0.5">salles de bain</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-sm font-semibold text-hestia-primary mt-1">
                    {new Date(property.createdAt).toLocaleDateString('fr-TN')}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">date d'ajout</div>
                </div>
              </div>

              <h2 className="font-serif font-semibold text-lg text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          </div>

          {/* Right column — price + contact */}
          <div className="space-y-6">
            {/* Price card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-serif font-bold text-hestia-primary">{formattedPrice}</span>
                <span className="text-gray-500 font-medium">TND{isRent ? '/mois' : ''}</span>
              </div>
              {isRent && (
                <p className="text-sm text-gray-400">Loyer mensuel hors charges</p>
              )}
            </div>

            {/* Agent */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-serif font-semibold text-gray-900 mb-4">Agent responsable</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-hestia-primary/10 rounded-full flex items-center justify-center text-hestia-primary font-bold text-lg font-serif">
                  {property.agent.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{property.agent.name}</p>
                  <p className="text-sm text-hestia-primary">Agent immobilier</p>
                </div>
              </div>
              {property.agent.phone && (
                <a
                  href={`tel:${property.agent.phone}`}
                  className="btn-primary w-full text-center block mb-3"
                >
                  📞 {property.agent.phone}
                </a>
              )}
              <a
                href={`mailto:${property.agent.email}`}
                className="btn-outline w-full text-center block text-sm"
              >
                Envoyer un email
              </a>
            </div>

            {/* Inquiry form */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-serif font-semibold text-gray-900 mb-4">
                {session ? 'Envoyer une demande' : 'Contactez-nous'}
              </h3>
              {session ? (
                <InquiryForm propertyId={property.id} userId={session.sub} />
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm mb-4">
                    Connectez-vous pour envoyer une demande de renseignement.
                  </p>
                  <a href="/login" className="btn-primary block text-center">
                    Se connecter
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

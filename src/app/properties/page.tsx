import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'
import { Prisma } from '@prisma/client'

interface SearchParams {
  q?: string
  listingType?: string
  type?: string
  city?: string
  minPrice?: string
  maxPrice?: string
  page?: string
}

const TUNISIAN_CITIES = [
  'Tunis', 'La Marsa', 'Sidi Bou Said', 'Gammarth', 'Lac 2',
  'Sousse', 'Sfax', 'Hammamet', 'Nabeul', 'Bizerte',
  'Monastir', 'Djerba', 'Gabès', 'Kairouan',
]

const PROPERTY_TYPES = [
  { value: '', label: 'Tous types' },
  { value: 'APARTMENT', label: 'Appartement' },
  { value: 'HOUSE', label: 'Maison' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'LAND', label: 'Terrain' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'OFFICE', label: 'Bureau' },
]

const PAGE_SIZE = 9

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const session = await getSession()
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10))

  const where: Prisma.PropertyWhereInput = { status: 'ACTIVE' }

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: 'insensitive' } },
      { city: { contains: searchParams.q, mode: 'insensitive' } },
      { description: { contains: searchParams.q, mode: 'insensitive' } },
    ]
  }
  if (searchParams.listingType && ['SALE', 'RENT'].includes(searchParams.listingType)) {
    where.listingType = searchParams.listingType as 'SALE' | 'RENT'
  }
  if (searchParams.type) {
    where.type = searchParams.type as Prisma.PropertyWhereInput['type']
  }
  if (searchParams.city) {
    where.city = { contains: searchParams.city, mode: 'insensitive' }
  }
  if (searchParams.minPrice) {
    where.price = { ...((where.price as object) ?? {}), gte: parseFloat(searchParams.minPrice) }
  }
  if (searchParams.maxPrice) {
    where.price = { ...((where.price as object) ?? {}), lte: parseFloat(searchParams.maxPrice) }
  }

  let properties: Awaited<ReturnType<typeof prisma.property.findMany>> = []
  let total = 0

  try {
    ;[properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.property.count({ where }),
    ])
  } catch {
    // DB not yet connected — show empty state
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={session ? { name: session.name, role: session.role } : null} />

      {/* Header */}
      <div className="bg-hestia-primary-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Propriétés</h1>
          <p className="text-white/70">
            {total > 0 ? `${total} bien${total > 1 ? 's' : ''} disponible${total > 1 ? 's' : ''}` : 'Parcourez notre catalogue'}
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <form className="bg-white rounded-2xl shadow-md p-6 space-y-6 sticky top-24">
              <h2 className="font-serif font-semibold text-lg text-gray-900">Filtres</h2>

              {/* Listing type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type d'annonce</label>
                <div className="flex gap-2">
                  {[
                    { value: '', label: 'Tous' },
                    { value: 'SALE', label: 'Vente' },
                    { value: 'RENT', label: 'Location' },
                  ].map((opt) => (
                    <a
                      key={opt.value}
                      href={`/properties?${new URLSearchParams({
                        ...searchParams,
                        listingType: opt.value,
                        page: '1',
                      })}`}
                      className={`flex-1 text-center py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                        (searchParams.listingType ?? '') === opt.value
                          ? 'bg-hestia-primary text-white border-hestia-primary'
                          : 'text-gray-600 border-gray-200 hover:border-hestia-primary'
                      }`}
                    >
                      {opt.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Property type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de bien</label>
                <select
                  name="type"
                  className="input-field text-sm py-2"
                  defaultValue={searchParams.type ?? ''}
                  onChange={undefined}
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <select
                  name="city"
                  className="input-field text-sm py-2"
                  defaultValue={searchParams.city ?? ''}
                >
                  <option value="">Toutes les villes</option>
                  {TUNISIAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary w-full text-sm py-2.5">
                Appliquer les filtres
              </button>

              {Object.values(searchParams).some(Boolean) && (
                <a href="/properties" className="block text-center text-sm text-gray-500 hover:text-hestia-primary">
                  Réinitialiser
                </a>
              )}
            </form>
          </aside>

          {/* Results */}
          <main className="flex-1">
            {/* Search bar */}
            <form action="/properties" method="GET" className="mb-6">
              <div className="flex gap-3">
                <input
                  name="q"
                  type="text"
                  defaultValue={searchParams.q ?? ''}
                  placeholder="Rechercher par ville, titre..."
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary px-6">
                  Chercher
                </button>
              </div>
            </form>

            {properties.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <p className="text-lg font-medium">Aucune propriété trouvée</p>
                <p className="text-sm mt-1">Modifiez vos filtres ou réinitialisez la recherche</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <a
                        key={p}
                        href={`/properties?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-colors ${
                          p === page
                            ? 'bg-hestia-primary text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-hestia-primary'
                        }`}
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

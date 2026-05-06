import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'

async function getFeaturedProperties() {
  try {
    return await prisma.property.findMany({
      where: { featured: true, status: 'ACTIVE' },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { agent: { select: { name: true, phone: true } } },
    })
  } catch {
    return []
  }
}

const STATS = [
  { value: '2,400+', label: 'Propriétés listées' },
  { value: '850+', label: 'Clients satisfaits' },
  { value: '15+', label: 'Villes couvertes' },
  { value: '98%', label: 'Taux de satisfaction' },
]

const CITIES = [
  { name: 'Tunis', desc: 'Capitale & Grand Tunis', img: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400' },
  { name: 'Sousse', desc: 'La Perle du Sahel', img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400' },
  { name: 'Hammamet', desc: 'Riviera Tunisienne', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
  { name: 'Sfax', desc: 'Capitale Économique', img: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400' },
]

export default async function HomePage() {
  const [session, featured] = await Promise.all([getSession(), getFeaturedProperties()])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={session ? { name: session.name, role: session.role } : null} />

      {/* Hero */}
      <section className="relative bg-hestia-primary-dark text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600')" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <span className="inline-block text-hestia-accent font-medium text-sm uppercase tracking-widest mb-4">
              Immobilier Tunisie
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
              Trouvez votre<br />
              <span className="text-hestia-accent">bien idéal</span><br />
              en Tunisie
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
              Des villas luxueuses aux appartements modernes — explorez des milliers de propriétés à vendre et à louer à travers toute la Tunisie.
            </p>

            {/* Search bar */}
            <form action="/properties" method="GET" className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                name="q"
                type="text"
                placeholder="Ville, quartier, type de bien..."
                className="flex-1 px-5 py-4 rounded-xl text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-hestia-accent"
              />
              <button type="submit" className="btn-accent px-8 py-4 rounded-xl text-base">
                Rechercher
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-hestia-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-serif font-bold text-hestia-accent">{stat.value}</div>
                <div className="text-white/80 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-hestia-primary font-medium text-sm uppercase tracking-wider mb-2">Sélection</p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Propriétés en vedette</h2>
            </div>
            <Link href="/properties" className="btn-outline hidden sm:inline-flex">
              Tout voir →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p>Les propriétés seront disponibles après initialisation de la base de données.</p>
              <Link href="/properties" className="btn-primary mt-4 inline-block">Explorer</Link>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link href="/properties" className="btn-outline">Voir toutes les propriétés</Link>
          </div>
        </div>
      </section>

      {/* Browse by city */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-hestia-primary font-medium text-sm uppercase tracking-wider mb-2">Destinations</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Explorer par ville</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CITIES.map((city) => (
              <Link
                key={city.name}
                href={`/properties?city=${city.name}`}
                className="relative rounded-2xl overflow-hidden group h-48 block"
              >
                <img
                  src={city.img}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <div className="font-serif font-bold text-lg">{city.name}</div>
                  <div className="text-white/80 text-xs">{city.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-hestia-primary text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Vous avez un bien à vendre ou louer ?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Rejoignez Hestia et publiez votre annonce auprès de milliers d'acheteurs qualifiés en Tunisie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-accent px-8 py-4 rounded-xl text-base">
              Publier une annonce
            </Link>
            <Link href="/properties" className="border-2 border-white text-white px-8 py-4 rounded-xl text-base font-medium hover:bg-white hover:text-hestia-primary transition-colors">
              Parcourir les biens
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

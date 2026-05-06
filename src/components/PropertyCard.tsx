import Image from 'next/image'
import Link from 'next/link'

interface Property {
  id: string
  title: string
  price: number
  type: string
  listingType: string
  city: string
  address: string
  bedrooms: number | null
  bathrooms: number | null
  area: number
  images: string[]
  featured: boolean
}

interface PropertyCardProps {
  property: Property
}

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Appartement',
  HOUSE: 'Maison',
  VILLA: 'Villa',
  LAND: 'Terrain',
  COMMERCIAL: 'Commercial',
  OFFICE: 'Bureau',
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const isRent = property.listingType === 'RENT'
  const image = property.images[0] ?? 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600'

  const formattedPrice = new Intl.NumberFormat('fr-TN', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(property.price)

  return (
    <Link href={`/properties/${property.id}`} className="card group block">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {isRent ? (
            <span className="badge-rent">Location</span>
          ) : (
            <span className="badge-sale">Vente</span>
          )}
          {property.featured && (
            <span className="bg-hestia-accent/90 text-hestia-primary-dark text-xs font-semibold px-3 py-1 rounded-full">
              ⭐ Vedette
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
          {TYPE_LABELS[property.type] ?? property.type}
        </p>
        <h3 className="font-serif font-semibold text-gray-900 text-lg leading-snug mb-2 group-hover:text-hestia-primary transition-colors line-clamp-2">
          {property.title}
        </h3>
        <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
          <svg className="w-4 h-4 text-hestia-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.city}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          {property.bedrooms !== null && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {property.bedrooms} ch.
            </span>
          )}
          {property.bathrooms !== null && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 5H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {property.bathrooms} sdb.
            </span>
          )}
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {property.area} m²
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 border-t border-gray-100 pt-3">
          <span className="text-2xl font-bold text-hestia-primary font-serif">
            {formattedPrice}
          </span>
          <span className="text-sm font-medium text-gray-500">
            TND{isRent ? '/mois' : ''}
          </span>
        </div>
      </div>
    </Link>
  )
}

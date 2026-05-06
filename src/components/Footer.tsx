import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-hestia-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-hestia-accent rounded-lg flex items-center justify-center">
                <span className="text-hestia-primary-dark text-sm font-bold font-serif">H</span>
              </div>
              <span className="text-xl font-serif font-bold">Hestia</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              La plateforme immobilière de référence en Tunisie. Trouvez le bien de vos rêves.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wide text-sm">Rechercher</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><Link href="/properties?listingType=SALE" className="hover:text-hestia-accent transition-colors">Acheter</Link></li>
              <li><Link href="/properties?listingType=RENT" className="hover:text-hestia-accent transition-colors">Louer</Link></li>
              <li><Link href="/properties?type=VILLA" className="hover:text-hestia-accent transition-colors">Villas</Link></li>
              <li><Link href="/properties?type=APARTMENT" className="hover:text-hestia-accent transition-colors">Appartements</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wide text-sm">Villes</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><Link href="/properties?city=Tunis" className="hover:text-hestia-accent transition-colors">Tunis</Link></li>
              <li><Link href="/properties?city=Sousse" className="hover:text-hestia-accent transition-colors">Sousse</Link></li>
              <li><Link href="/properties?city=Sfax" className="hover:text-hestia-accent transition-colors">Sfax</Link></li>
              <li><Link href="/properties?city=Hammamet" className="hover:text-hestia-accent transition-colors">Hammamet</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wide text-sm">Contact</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-hestia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@hestia.tn
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-hestia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +216 71 000 000
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-hestia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Tunis, Tunisie
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-sm">
          <p>© {new Date().getFullYear()} Hestia. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-hestia-accent transition-colors">Mentions légales</Link>
            <Link href="#" className="hover:text-hestia-accent transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

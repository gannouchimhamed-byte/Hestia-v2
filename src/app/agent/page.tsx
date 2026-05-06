import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  ACTIVE: { label: 'Actif', class: 'bg-green-100 text-green-800' },
  SOLD: { label: 'Vendu', class: 'bg-gray-100 text-gray-600' },
  RENTED: { label: 'Loué', class: 'bg-blue-100 text-blue-800' },
  PENDING: { label: 'En attente', class: 'bg-yellow-100 text-yellow-800' },
}

export default async function AgentDashboardPage() {
  const session = await getSession()

  if (!session || (session.role !== 'AGENT' && session.role !== 'ADMIN')) {
    redirect('/login')
  }

  let properties: Awaited<ReturnType<typeof prisma.property.findMany>> = []
  let inquiries: Awaited<ReturnType<typeof prisma.inquiry.findMany>> = []
  let stats = { total: 0, active: 0, sold: 0, rented: 0 }

  try {
    const whereClause = session.role === 'ADMIN' ? {} : { agentId: session.sub }

    ;[properties, inquiries] = await Promise.all([
      prisma.property.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.inquiry.findMany({
        where: { property: whereClause },
        include: {
          property: { select: { title: true, id: true } },
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

    const allProps = await prisma.property.findMany({ where: whereClause, select: { status: true } })
    stats = {
      total: allProps.length,
      active: allProps.filter((p) => p.status === 'ACTIVE').length,
      sold: allProps.filter((p) => p.status === 'SOLD').length,
      rented: allProps.filter((p) => p.status === 'RENTED').length,
    }
  } catch {
    // DB not connected
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={{ name: session.name, role: session.role }} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
              Bonjour, {session.name.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 mt-1">
              {session.role === 'ADMIN' ? 'Tableau de bord administrateur' : 'Tableau de bord agent'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total annonces', value: stats.total, color: 'text-hestia-primary' },
            { label: 'Actives', value: stats.active, color: 'text-green-600' },
            { label: 'Vendues', value: stats.sold, color: 'text-gray-600' },
            { label: 'Louées', value: stats.rented, color: 'text-blue-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5">
              <div className={`text-3xl font-serif font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Properties list */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-serif font-semibold text-lg text-gray-900">Mes annonces</h2>
              </div>

              {properties.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>Aucune annonce pour le moment.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {properties.map((p) => {
                    const isRent = p.listingType === 'RENT'
                    const status = STATUS_LABELS[p.status] ?? { label: p.status, class: 'bg-gray-100 text-gray-600' }
                    return (
                      <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                        {p.images[0] && (
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/properties/${p.id}`}
                            className="font-medium text-gray-900 hover:text-hestia-primary transition-colors line-clamp-1"
                          >
                            {p.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.class}`}>
                              {status.label}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isRent ? 'bg-hestia-accent/20 text-hestia-primary' : 'bg-hestia-primary/10 text-hestia-primary'}`}>
                              {isRent ? 'Location' : 'Vente'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-semibold text-hestia-primary text-sm">
                            {new Intl.NumberFormat('fr-TN').format(p.price)} TND
                          </div>
                          <div className="text-xs text-gray-400">{p.city}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Inquiries */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-serif font-semibold text-lg text-gray-900">Demandes récentes</h2>
              </div>
              {inquiries.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  <p>Aucune demande reçue.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 bg-hestia-primary/10 rounded-full flex items-center justify-center text-hestia-primary text-xs font-bold font-serif">
                          {inq.user.name.charAt(0)}
                        </div>
                        <span className="font-medium text-sm text-gray-900">{inq.user.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1 truncate">{inq.user.email}</p>
                      <Link
                        href={`/properties/${inq.property.id}`}
                        className="text-xs text-hestia-primary hover:underline line-clamp-1 mb-2 block"
                      >
                        → {inq.property.title}
                      </Link>
                      <p className="text-sm text-gray-600 line-clamp-2">{inq.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(inq.createdAt).toLocaleDateString('fr-TN')}
                      </p>
                    </div>
                  ))}
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

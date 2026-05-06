import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hestia.tn' },
    update: {},
    create: { email: 'admin@hestia.tn', password: adminPassword, name: 'Admin Hestia', phone: '+216 71 000 000', role: 'ADMIN' },
  })

  const agentPassword = await bcrypt.hash('agent123', 10)
  const agent = await prisma.user.upsert({
    where: { email: 'karim@hestia.tn' },
    update: {},
    create: { email: 'karim@hestia.tn', password: agentPassword, name: 'Karim Ben Salah', phone: '+216 98 123 456', role: 'AGENT' },
  })

  console.log('✅ Users:', admin.email, agent.email)

  const props = [
    { title: 'Villa de Luxe avec Piscine — La Marsa', description: 'Somptueuse villa contemporaine avec piscine privée, jardin paysager et vue imprenable sur la mer. Finitions haut de gamme.', price: 850000, type: 'VILLA', listingType: 'SALE', city: 'La Marsa', address: 'Rue du Lac, La Marsa', bedrooms: 5, bathrooms: 3, area: 420, images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'], featured: true },
    { title: 'Appartement Moderne S+3 — Lac 2', description: 'Appartement neuf de standing dans la résidence sécurisée Les Jardins du Lac. Double vitrage, parquet en bois.', price: 285000, type: 'APARTMENT', listingType: 'SALE', city: 'Tunis', address: 'Les Berges du Lac 2, Tunis', bedrooms: 3, bathrooms: 2, area: 145, images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], featured: true },
    { title: 'Villa Méditerranéenne — Hammamet Nord', description: 'Magnifique villa de style méditerranéen à 300m de la plage. Terrasse panoramique, piscine chauffée.', price: 620000, type: 'VILLA', listingType: 'SALE', city: 'Hammamet', address: 'Zone Touristique Hammamet Nord', bedrooms: 4, bathrooms: 3, area: 320, images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'], featured: true },
    { title: 'Appartement S+2 à Louer — Sousse', description: 'Bel appartement meublé au cœur de Sousse. Lumineux, proche de toutes commodités.', price: 900, type: 'APARTMENT', listingType: 'RENT', city: 'Sousse', address: 'Avenue Bourguiba, Sousse', bedrooms: 2, bathrooms: 1, area: 90, images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], featured: false },
    { title: 'Terrain Constructible 1200m² — Nabeul', description: 'Grand terrain viabilisé dans une zone résidentielle calme. Toutes commodités disponibles.', price: 180000, type: 'LAND', listingType: 'SALE', city: 'Nabeul', address: 'Route de Tunis, Nabeul', bedrooms: null, bathrooms: null, area: 1200, images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'], featured: false },
    { title: 'Maison Traditionnelle — Sidi Bou Said', description: 'Authentique dar arabe entièrement restaurée. Patio central avec fontaine, terrasse vue mer.', price: 490000, type: 'HOUSE', listingType: 'SALE', city: 'Sidi Bou Said', address: 'Rue Sidi Dhrif, Sidi Bou Saïd', bedrooms: 4, bathrooms: 2, area: 210, images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'], featured: true },
    { title: 'Villa Contemporaine S+4 — Gammarth', description: 'Villa architecturale de prestige. Piscine à débordement, home cinéma, domotique, garage 3 voitures.', price: 1200000, type: 'VILLA', listingType: 'SALE', city: 'Gammarth', address: 'Collines de Gammarth, Tunis', bedrooms: 5, bathrooms: 4, area: 580, images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'], featured: true },
    { title: 'Bureau Haut Standing — Centre Urbain Nord', description: 'Espace bureau entièrement rénové, open space aménageable, salle de réunion, parking privatif.', price: 2500, type: 'OFFICE', listingType: 'RENT', city: 'Tunis', address: 'Centre Urbain Nord, Tunis', bedrooms: null, bathrooms: 1, area: 180, images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'], featured: false },
  ]

  for (const p of props) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prisma.property.create({ data: { ...p, agentId: agent.id } as any })
  }

  console.log(`✅ ${props.length} properties created`)
  console.log('🎉 Done!')
}

main().catch(console.error).finally(() => prisma.$disconnect())

import { PrismaClient, Role, PropertyType, ListingType, Status } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hestia.tn' },
    update: {},
    create: {
      email: 'admin@hestia.tn',
      password: adminPassword,
      name: 'Admin Hestia',
      phone: '+216 71 000 000',
      role: Role.ADMIN,
    },
  })

  // Create agent user
  const agentPassword = await bcrypt.hash('agent123', 10)
  const agent = await prisma.user.upsert({
    where: { email: 'karim@hestia.tn' },
    update: {},
    create: {
      email: 'karim@hestia.tn',
      password: agentPassword,
      name: 'Karim Ben Salah',
      phone: '+216 98 123 456',
      role: Role.AGENT,
    },
  })

  console.log('✅ Users created:', { admin: admin.email, agent: agent.email })

  // Create properties
  const properties = [
    {
      title: 'Villa de Luxe avec Piscine — La Marsa',
      description:
        'Somptueuse villa contemporaine avec piscine privée, jardin paysager et vue imprenable sur la mer. Finitions haut de gamme, cuisine équipée, climatisation centrale. Idéale pour famille ou investissement.',
      price: 850000,
      type: PropertyType.VILLA,
      listingType: ListingType.SALE,
      city: 'La Marsa',
      address: 'Rue du Lac, La Marsa, Tunis',
      bedrooms: 5,
      bathrooms: 3,
      area: 420,
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800',
      ],
      featured: true,
      agentId: agent.id,
    },
    {
      title: 'Appartement Moderne S+3 — Lac 2',
      description:
        'Appartement neuf de standing dans la résidence sécurisée Les Jardins du Lac. Double vitrage, parquet en bois, cuisine américaine ouverte. Proche du centre commercial et des ambassades.',
      price: 285000,
      type: PropertyType.APARTMENT,
      listingType: ListingType.SALE,
      city: 'Tunis',
      address: 'Les Berges du Lac 2, Tunis',
      bedrooms: 3,
      bathrooms: 2,
      area: 145,
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
      featured: true,
      agentId: agent.id,
    },
    {
      title: 'Villa Méditerranéenne — Hammamet Nord',
      description:
        'Magnifique villa de style méditerranéen à 300m de la plage. Terrasse panoramique, piscine chauffée, garage double. Idéale pour résidence principale ou location saisonnière haut de gamme.',
      price: 620000,
      type: PropertyType.VILLA,
      listingType: ListingType.SALE,
      city: 'Hammamet',
      address: 'Zone Touristique Hammamet Nord',
      bedrooms: 4,
      bathrooms: 3,
      area: 320,
      images: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      ],
      featured: true,
      agentId: agent.id,
    },
    {
      title: 'Appartement S+2 à Louer — Sousse Centre',
      description:
        'Bel appartement meublé au cœur de Sousse. Lumineux et refait à neuf, proche de toutes commodités, medina, corniche et commerces. Idéal pour couple ou petite famille.',
      price: 900,
      type: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
      city: 'Sousse',
      address: 'Avenue Bourguiba, Sousse',
      bedrooms: 2,
      bathrooms: 1,
      area: 90,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      ],
      featured: false,
      agentId: agent.id,
    },
    {
      title: 'Terrain Constructible 1200m² — Nabeul',
      description:
        'Grand terrain viabilisé dans une zone résidentielle calme de Nabeul. Toutes les commodités disponibles: eau, électricité, réseau téléphonique. Excellent investissement dans une région en plein développement.',
      price: 180000,
      type: PropertyType.LAND,
      listingType: ListingType.SALE,
      city: 'Nabeul',
      address: 'Route de Tunis, Nabeul',
      bedrooms: null,
      bathrooms: null,
      area: 1200,
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      ],
      featured: false,
      agentId: agent.id,
    },
    {
      title: 'Bureau Haut Standing — Centre Urbain Nord',
      description:
        'Espace bureau entièrement rénové dans un immeuble professionnel sécurisé. Open space aménageable, salle de réunion, parking privatif. Idéal pour entreprise, cabinet ou représentation.',
      price: 2500,
      type: PropertyType.OFFICE,
      listingType: ListingType.RENT,
      city: 'Tunis',
      address: 'Centre Urbain Nord, Tunis',
      bedrooms: null,
      bathrooms: 1,
      area: 180,
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      ],
      featured: false,
      agentId: agent.id,
    },
    {
      title: 'Maison Traditionnelle avec Patio — Sidi Bou Said',
      description:
        'Authentique dar arabe entièrement restaurée dans le village pittoresque de Sidi Bou Saïd. Patio central avec fontaine, décoration traditionnelle, terrasse vue mer. Une perle rare.',
      price: 490000,
      type: PropertyType.HOUSE,
      listingType: ListingType.SALE,
      city: 'Sidi Bou Said',
      address: 'Rue Sidi Dhrif, Sidi Bou Saïd',
      bedrooms: 4,
      bathrooms: 2,
      area: 210,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=800',
      ],
      featured: true,
      agentId: agent.id,
    },
    {
      title: 'Appartement S+1 Meublé — Sfax Corniche',
      description:
        'Studio moderne et entièrement meublé sur la corniche de Sfax. Vue mer imprenable depuis le balcon. Toutes charges comprises. Disponible immédiatement.',
      price: 650,
      type: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
      city: 'Sfax',
      address: 'Corniche de Sfax',
      bedrooms: 1,
      bathrooms: 1,
      area: 65,
      images: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      ],
      featured: false,
      agentId: agent.id,
    },
    {
      title: 'Villa Contemporaine S+4 — Gammarth',
      description:
        'Villa architecturale de prestige à Gammarth, quartier le plus prisé du Grand Tunis. Piscine à débordement, home cinéma, domotique, garage pour 3 voitures. Vue 360° sur la mer.',
      price: 1200000,
      type: PropertyType.VILLA,
      listingType: ListingType.SALE,
      city: 'Gammarth',
      address: 'Collines de Gammarth, Tunis',
      bedrooms: 5,
      bathrooms: 4,
      area: 580,
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      ],
      featured: true,
      agentId: agent.id,
    },
    {
      title: 'Local Commercial — Monastir Centre',
      description:
        'Local commercial de 95m² en rez-de-chaussée avec grande vitrine sur artère principale. Fort passage piéton. Idéal pour boutique, restaurant, agence ou showroom.',
      price: 1800,
      type: PropertyType.COMMERCIAL,
      listingType: ListingType.RENT,
      city: 'Monastir',
      address: 'Avenue de la République, Monastir',
      bedrooms: null,
      bathrooms: 1,
      area: 95,
      images: [
        'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800',
      ],
      featured: false,
      agentId: agent.id,
    },
  ]

  for (const property of properties) {
    await prisma.property.create({ data: property })
  }

  console.log(`✅ ${properties.length} properties created`)
  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

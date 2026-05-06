import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken, setAuthCookie } from '@/lib/auth'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, phone } = schema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashed, phone },
    })

    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    setAuthCookie(token)

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: err.errors },
        { status: 400 }
      )
    }
    console.error('[REGISTER]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

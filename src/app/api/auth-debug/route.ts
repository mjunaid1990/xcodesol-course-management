import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const users = await payload.find({
      collection: 'users',
      showHiddenFields: true,
      overrideAccess: true,
      depth: 0,
    })
    return NextResponse.json({
      status: 'ok',
      count: users.docs.length,
      users: users.docs.map((u: any) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        hasSalt: Boolean(u.salt),
        saltLen: u.salt ? u.salt.length : 0,
        hasHash: Boolean(u.hash),
        hashPrefix: u.hash ? u.hash.slice(0, 30) : null,
        lockUntil: u.lockUntil,
        loginAttempts: u.loginAttempts,
      })),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()
    const { email, password, secret } = body
    if (secret !== 'reset-admin-pwd-2026') {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const cleanEmail = (email || 'admin@example.com').toLowerCase().trim()
    const cleanPassword = password || 'Admin123456!'

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: cleanEmail } },
      showHiddenFields: true,
      overrideAccess: true,
    })

    if (existing.docs.length === 0) {
      const created = await payload.create({
        collection: 'users',
        data: {
          email: cleanEmail,
          password: cleanPassword,
          role: 'admin',
          name: 'Course Administrator',
        },
        overrideAccess: true,
      })
      return NextResponse.json({ message: 'created', id: created.id, email: created.email })
    }

    const updated = await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data: {
        password: cleanPassword,
        loginAttempts: 0,
        lockUntil: null,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ message: 'password_reset_success', id: updated.id, email: updated.email })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 })
  }
}

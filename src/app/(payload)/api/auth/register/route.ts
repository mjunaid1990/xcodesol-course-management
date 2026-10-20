import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'

const registrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(128),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const input = registrationSchema.safeParse(body)
  if (!input.success) return Response.json({ message: 'Enter a name, valid email, and password with at least 12 characters.' }, { status: 400 })

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'users',
      data: { ...input.data, role: 'student' },
      overrideAccess: true,
    })
    return Response.json({ message: 'Account created. You can now sign in.' }, { status: 201 })
  } catch {
    return Response.json({ message: 'We could not create the account. Check the details or try signing in.' }, { status: 400 })
  }
}

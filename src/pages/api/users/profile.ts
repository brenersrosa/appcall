import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { prisma } from '../../../lib/prisma'
import { buildNextAuthOptions } from '../auth/[...nextauth]'

const updateProfileBodySchema = z.object({
  schedulePrivate: z.boolean().default(false),
  bio: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(401).end()
  }

  const { schedulePrivate, bio } = updateProfileBodySchema.parse(req.body)

  const username = session.user.username

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User not found.' })
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      schedule_private: schedulePrivate,
      bio,
    },
  })

  return res.status(204).end()
}

import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const findUserRequestBodySchema = z.object({
  username: z.string(),
})

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { username } = findUserRequestBodySchema.parse(req.query)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  return res.json({ user })
}

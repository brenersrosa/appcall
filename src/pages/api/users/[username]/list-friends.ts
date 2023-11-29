import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const friendList = await prisma.friend.findMany({
    where: {
      OR: [{ user_id: user.id }, { friend_id: user.id }],
    },
    orderBy: {
      friend: {
        name: 'asc',
      },
    },
  })

  return res.json({ friendList })
}

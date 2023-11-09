import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { buildNextAuthOptions } from '../../auth/[...nextauth]'
import { prisma } from '@/lib/prisma'

const deleteFriendRequestBodySchema = z.object({
  userLoggedId: z.string().uuid(),
  friendId: z.string().uuid(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'DELETE') {
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

  const userLoggedId = z.string().parse(req.query.userLoggedId)
  const friendId = z.string().parse(req.query.friendId)

  try {
    const friendRequest = await prisma.friend.findFirst({
      where: {
        OR: [
          { user_id: userLoggedId, friend_id: friendId },
          { user_id: friendId, friend_id: userLoggedId },
        ],
      },
    })

    if (friendRequest) {
      await prisma.friend.delete({
        where: { id: friendRequest.id },
      })

      return res.status(200).json({ message: 'Friend request removed.' })
    }

    return res.status(404).json({ message: 'Friend request not found.' })
  } catch (error) {
    console.error('Error removing friend request', error)
    return res.status(500).json({ message: 'Error removing friend request' })
  }
}

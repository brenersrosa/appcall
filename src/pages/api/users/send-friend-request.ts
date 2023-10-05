import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth]'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const sendFriendRequestBodySchema = z.object({
  friendId: z.string().uuid(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
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

  const userId = session.user.id

  const { friendId } = sendFriendRequestBodySchema.parse(req.body)

  try {
    const existingRequest = await prisma.friend.findFirst({
      where: {
        user_id: userId,
        friend_id: friendId,
      },
    })

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: 'Friend request previously sent.' })
    }

    await prisma.friend.create({
      data: {
        user_id: userId,
        friend_id: friendId,
        status: 'pending',
      },
    })

    await prisma.notification.create({
      data: {
        sender_id: userId,
        user_id: friendId,
        type: 'friend_request',
      },
    })

    res.status(201).json({ message: 'Friend request sent successfully.' })
  } catch (error) {
    console.log('ERROR | Error sending friend request.', error)
    res.status(500).json({ message: 'Error sending friend request.' })
  }
}

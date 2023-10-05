import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { buildNextAuthOptions } from '../auth/[...nextauth]'
import { prisma } from '@/lib/prisma'

const updateFriendRequestStatusBodySchema = z.object({
  friendId: z.string().uuid(),
  action: z.enum(['accept', 'reject']),
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

  const userId = session.user.id

  try {
    const { friendId, action } = updateFriendRequestStatusBodySchema.parse(
      req.body,
    )

    const status = action === 'accept' ? 'accepted' : 'rejected'

    await prisma.friend.updateMany({
      where: {
        user_id: friendId,
        friend_id: userId,
      },
      data: {
        status,
      },
    })

    await prisma.notification.updateMany({
      where: {
        user_id: userId,
        sender_id: friendId,
        type: 'friend_request',
      },
      data: {
        as_read: true,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid request data.' })
    } else {
      console.log('ERROR | Error performing update.', error)
      res.status(500).json({ message: 'Error performing update.' })
    }
  }
}

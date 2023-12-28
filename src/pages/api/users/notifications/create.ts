import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { buildNextAuthOptions } from '../../auth/[...nextauth]'

const sendFriendRequestBodySchema = z.object({
  username: z.string(),
  type: z.enum(['friend_request', 'appointment']),
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

  const userLoggedInId = session.user.id

  const { username, type } = sendFriendRequestBodySchema.parse(req.body)
  const userReceive = await prisma.user.findFirst({
    where: {
      username,
    },
  })

  try {
    if (userReceive) {
      await prisma.notification.create({
        data: {
          sender_id: userLoggedInId,
          user_id: userReceive.id,
          type,
        },
      })
    }

    res.status(201).json({ message: 'Notification created successfully.' })
  } catch (error) {
    console.log('ERROR | Error create notification.', error)
    res.status(500).json({ message: 'Error create notification.' })
  }
}

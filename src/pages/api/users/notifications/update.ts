import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { buildNextAuthOptions } from '../../auth/[...nextauth]'
import { prisma } from '@/lib/prisma'

const updateNotificationStatusBodySchema = z.object({
  notificationId: z.string().uuid(),
  asRead: z.boolean(),
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

  try {
    const { notificationId, asRead } = updateNotificationStatusBodySchema.parse(
      req.body,
    )

    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        as_read: !asRead,
      },
    })

    return res.status(200).end()
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid request data.' })
    } else {
      console.log('ERROR | Error performing update.', error)
      res.status(500).json({ message: 'Error performing update.' })
    }
  }
}

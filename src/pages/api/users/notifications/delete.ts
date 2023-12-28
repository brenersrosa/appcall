import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { buildNextAuthOptions } from '../../auth/[...nextauth]'

const deleteNotificationBodySchema = z.object({
  id: z.string().uuid(),
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

  const { id } = deleteNotificationBodySchema.parse(req.query)

  try {
    const notification = await prisma.notification.findFirst({
      where: {
        id,
      },
    })

    if (id) {
      await prisma.notification.delete({
        where: { id },
      })

      return res.status(200).json({ message: 'Notification removed.' })
    }

    if (notification) {
      await prisma.notification.delete({
        where: { id: notification.id },
      })

      return res.status(200).json({ message: 'Notification removed.' })
    }

    return res.status(404).json({ message: 'Notification not found.' })
  } catch (error) {
    console.error('Error removing notification', error)
    return res.status(500).json({ message: 'Error removing notification' })
  }
}

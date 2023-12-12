import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { buildNextAuthOptions } from '../auth/[...nextauth]'
import { prisma } from '@/lib/prisma'

const deleteAppointmentBodySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
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

  const senderId = session.user.id

  const { id, userId } = deleteAppointmentBodySchema.parse(req.query)

  try {
    await prisma.scheduling.delete({
      where: {
        id,
      },
    })

    await prisma.notification.create({
      data: {
        sender_id: senderId,
        user_id: userId,
        type: 'cancel_appointment',
      },
    })

    return res.status(200).json({ message: 'Appointment removed.' })
  } catch (error) {
    console.error('Error removing appointment', error)
    return res.status(500).json({ message: 'Error removing appointment' })
  }
}

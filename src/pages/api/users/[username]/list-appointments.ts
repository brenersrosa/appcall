import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dayjs from 'dayjs'
import { prisma } from '@/lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  const userId = session.user.id
  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: 'Date not provided.' })
  }

  const selectedDate = dayjs(String(date)).startOf('day').toDate()

  const userAppointments = await prisma.scheduling.findMany({
    where: {
      user_id: userId,
      date: {
        gte: selectedDate,
      },
    },
    include: {
      creator: {
        select: {
          avatar_url: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  })

  return res.json({ appointments: userAppointments })
}

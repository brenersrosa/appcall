import { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'

import { prisma } from '@/lib/prisma'
import { getGoogleOAuthToken } from '@/lib/google'

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

  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleOAuthToken(user.id),
  })

  try {
    const calendarsList = await calendar.calendarList.list()

    const calendars =
      calendarsList.data.items?.map((calendarItem) => ({
        id: calendarItem.id,
        summary: calendarItem.summary,
      })) || []

    return res.json({ calendars })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching calendars.' })
  }
}

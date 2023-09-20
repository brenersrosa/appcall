import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { google } from 'googleapis'

import { buildNextAuthOptions } from '../auth/[...nextauth]'

import { prisma } from '@/lib/prisma'
import { getGoogleOAuthToken } from '@/lib/google'

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

  const username = session.user.username

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User not found.' })
  }

  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleOAuthToken(user.id),
  })

  const calendarList = await calendar.calendarList.list()

  const calendarExists = calendarList.data.items?.find(
    (item) => item.summary === 'appcall',
  )

  let calendarId = null

  if (!calendarExists) {
    const newCalendar = {
      summary: 'appcall',
      description: 'Calendar with appointments from appcall application',
      backgroundColor: '#8B5CF6',
    }

    await calendar.calendars
      .insert({
        requestBody: newCalendar,
      })
      .then(
        function (response) {
          console.log('Calendar created successfully.', response)
          calendarId = response.data.id
        },
        function (error) {
          console.log('Error with creating the calendar.', error)
        },
      )
  } else {
    calendarId = calendarExists.id
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      schedule_id: calendarId,
    },
  })

  return res.status(204).end()
}

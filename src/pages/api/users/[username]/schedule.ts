import dayjs from 'dayjs'
import { google } from 'googleapis'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { getGoogleOAuthToken } from '@/lib/google'
import { prisma } from '@/lib/prisma'

import { buildNextAuthOptions } from '../../auth/[...nextauth]'

export default async function handle(
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

  const senderId = session.user.id

  const username = String(req.query.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const createSchedulingBody = z.object({
    creator: z.string().uuid(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    observations: z.string(),
    date: z.string().datetime(),
  })

  const { creator, name, email, phone, observations, date } =
    createSchedulingBody.parse(req.body)

  const schedulingDate = dayjs(date).startOf('hour')

  if (schedulingDate.isBefore(new Date())) {
    return res.status(400).json({
      message: 'Date is in the past.',
    })
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflictingScheduling) {
    return res.status(400).json({
      message: 'There is another scheduling at the same time.',
    })
  }

  const notification = await prisma.notification.create({
    data: {
      sender_id: senderId,
      user_id: user.id || '',
      type: 'appointment',
    },
  })

  const scheduling = await prisma.scheduling.create({
    data: {
      creator_id: creator,
      name,
      email,
      phone,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
      notification: {
        connect: {
          id: notification.id,
        },
      },
    },
  })

  await prisma.notification.update({
    where: { id: notification.id },
    data: {
      scheduling_id: scheduling.id,
    },
  })

  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleOAuthToken(user.id),
  })

  const googleData = await calendar.events.insert({
    calendarId: user.schedule_id || 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: `appCall | ${name}`.toUpperCase(),
      description: observations,
      start: {
        dateTime: schedulingDate.format(),
      },
      end: {
        dateTime: schedulingDate.add(1, 'hour').format(),
      },
      attendees: [{ email, displayName: name }],
      conferenceData: {
        createRequest: {
          requestId: scheduling.id,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: 'popup',
            minutes: 30,
          },
          {
            method: 'email',
            minutes: 1440, // 24 hours
          },
        ],
      },
    },
  })

  await prisma.scheduling.update({
    where: { id: scheduling.id },
    data: {
      meet_url: googleData.data.hangoutLink,
    },
  })

  return res.status(201).end()
}

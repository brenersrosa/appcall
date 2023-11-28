import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { X } from 'phosphor-react'

import { Calendar } from '@/components/ui/Calendar'

import { api } from '@/lib/axios'
import { Text } from '@/components/ui/Text'
import { Heading } from '@/components/ui/Heading'

interface Appointment {
  id: string
  date: string
  name: string
  email: string
  phone: string
  observations: string
  created_at: string
  updated_at: string
  user_id: string
  creator_id: string
  creator: {
    name: string
    avatar_url: string
  }
}

interface UpcomingAppointment {
  appointments: Appointment[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export default function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()
  const username = String(router.query.username)

  const isDateSelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: upcomingAppointments } = useQuery<UpcomingAppointment>(
    ['upcomingAppointments', selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/list-appointments`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },
    {
      enabled: !!selectedDateWithoutTime,
    },
  )

  function handleCloseModal() {
    setSelectedDate(null)
  }

  return (
    <div
      className={clsx(
        'relative mx-auto mb-0 grid max-w-full divide-x divide-zinc-700 rounded-lg border border-zinc-700 bg-zinc-800',
        {
          'w-[540px] grid-cols-1': isDateSelected === false,
          'grid-cols-1 lg:grid-cols-custom': isDateSelected === true,
        },
      )}
    >
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <div className="flex flex-col gap-3 divide-y divide-zinc-700 p-6">
          <div className="flex items-center justify-between">
            <p className="font-medium">
              {weekDay}, <span className="text-zinc-400">{describedDate}</span>
            </p>

            <button
              onClick={handleCloseModal}
              title="Close modal"
              className="flex cursor-pointer items-center justify-center rounded-md p-2 leading-[0] transition-colors hover:bg-zinc-700"
            >
              <X className="h-5 w-5 text-zinc-200" />
            </button>
          </div>
          <div className="absolute bottom-0 right-0 top-14 mt-4 flex w-80 flex-col gap-3 overflow-y-scroll p-4">
            <div className="w-full grid-cols-2 gap-2 lg:grid lg:grid-cols-1">
              {upcomingAppointments?.appointments.length === 0 ? (
                <div className="mt-4 flex h-full flex-1 flex-col items-center justify-center gap-4">
                  <Heading size="lg">👀</Heading>
                  <Text>Aparentemente tudo está calmo...</Text>
                </div>
              ) : (
                upcomingAppointments?.appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-1 items-center justify-between gap-2 rounded-md border border-zinc-800 bg-zinc-700/75 px-4 py-2"
                  >
                    <div className="flex flex-col gap-2">
                      <Text>{dayjs(appointment.date).format('HH:mm')}h</Text>
                      <Text size="lg" className="font-bold">
                        {appointment.name}
                      </Text>
                    </div>
                    <Image
                      className="rounded-full"
                      src={appointment.creator.avatar_url}
                      alt={appointment.name}
                      width={40}
                      height={40}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

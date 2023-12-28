import 'dayjs/locale/pt-br'

import { DialogTrigger, Root } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { X } from 'phosphor-react'
import { useState } from 'react'

import { Card } from '@/components/dashboard/card'
import { Calendar } from '@/components/ui/calendar'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { useToast } from '@/contexts/toast-context'
import { api } from '@/lib/axios'

dayjs.extend(isBetween)

interface Appointment {
  id: string
  date: string
  name: string
  email: string
  phone: string
  observations: string
  meet_url: string
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
  const [isLoading, setIsLoading] = useState(false)

  const { showToast } = useToast()

  const router = useRouter()
  const username = String(router.query.username)

  const isDateSelected = !!selectedDate

  const weekDay = selectedDate
    ? dayjs(selectedDate).locale('pt-br').format('dddd')
    : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).locale('pt-br').format('DD[ de ]MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).locale('pt-br').format('YYYY-MM-DD')
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

  async function handleCancelAppointment(id: string, userId: string) {
    setIsLoading(true)

    try {
      const response = await api.delete(
        `/users/delete-appointment?id=${id}&userId=${userId}`,
      )

      if (response.status === 200) {
        setSelectedDate(null)
        showToast('Sucesso!', 'Agendamento removido com sucesso.', 'success')
      }
      setIsLoading(false)
    } catch (error) {
      showToast('Erro!', 'Erro ao remover agendamento.', 'error')
      console.error(`ERROR | Error to remove appointment:`, error)
      setIsLoading(false)
    }
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
        <div className="flex flex-col gap-3 divide-y divide-zinc-700 rounded-r-md bg-zinc-900 p-6">
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
          <div className="absolute bottom-0 right-0 top-14 mt-4 flex w-80 flex-col gap-3 overflow-y-scroll rounded-r-md p-4">
            <div className="w-full grid-cols-2 gap-2 lg:grid lg:grid-cols-1">
              {upcomingAppointments?.appointments.length === 0 ? (
                <div className="mt-4 flex h-full flex-1 flex-col items-center justify-center gap-4">
                  <Heading size="lg">👀</Heading>
                  <Text>Aparentemente tudo está calmo...</Text>
                </div>
              ) : (
                upcomingAppointments?.appointments.map((appointment) => {
                  const now = dayjs()

                  const appointmentEnd = dayjs(appointment.date).add(1, 'hour')

                  const isWithinCurrentHour = appointmentEnd.isBetween(
                    appointment.date,
                    now,
                  )

                  const isFuture = dayjs(appointment.date).isAfter(now, 'hour')

                  return (
                    <div key={appointment.id}>
                      <Root>
                        <DialogTrigger asChild>
                          <div
                            className={clsx(
                              'flex flex-1 cursor-pointer items-center justify-between gap-2 rounded-md px-4 py-2 font-sans transition-all hover:bg-zinc-700',
                              {
                                'border border-zinc-700 bg-zinc-800 opacity-30':
                                  isWithinCurrentHour,
                                'border border-zinc-700 bg-zinc-800': isFuture,
                                'border border-zinc-600 bg-zinc-700':
                                  !isWithinCurrentHour,
                              },
                            )}
                          >
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-start gap-2">
                                <div
                                  className={clsx('h-3 w-3 rounded-full', {
                                    'bg-yellow-500': isFuture,
                                    'bg-red-500': isWithinCurrentHour,
                                    'bg-green-500': !isWithinCurrentHour,
                                  })}
                                ></div>
                                <Text>
                                  {dayjs(appointment.date).format('HH:mm')}h
                                </Text>
                              </div>
                              <Text
                                size="lg"
                                className={clsx('font-bold', {
                                  'line-through': isWithinCurrentHour,
                                })}
                              >
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
                        </DialogTrigger>

                        <Card
                          appointment={appointment}
                          onAppointmentAction={handleCancelAppointment}
                        />
                      </Root>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

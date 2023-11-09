import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { X } from 'phosphor-react'

import { Calendar } from '@/components/ui/Calendar'
import { CalendarStepButton } from '@/components/schedule/CalendarStep/Button'

import { api } from '@/lib/axios'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
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

  const { data: availability } = useQuery<Availability>(
    ['availability', selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },
    {
      enabled: !!selectedDate,
    },
  )

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectDateTime(dateWithTime)
  }

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
          <div className="absolute bottom-0 right-0 top-14 mt-4 flex w-80 flex-col gap-3 overflow-y-scroll px-6 py-2">
            <div className="w-full grid-cols-2 gap-2 lg:grid lg:grid-cols-1">
              {availability?.possibleTimes.map((hour) => {
                return (
                  <CalendarStepButton
                    key={hour}
                    onClick={() => handleSelectTime(hour)}
                    disabled={!availability.availableTimes.includes(hour)}
                  >
                    {String(hour).padStart(2, '0')}:00h
                  </CalendarStepButton>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

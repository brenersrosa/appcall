import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { CaretLeft, CaretRight, ArrowUUpLeft } from 'phosphor-react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

import { api } from '@/lib/axios'

import { getWeekDays } from '@/utils/get-week-days'
import clsx from 'clsx'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

interface CalendarProps {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const router = useRouter()

  function handleBackToToday() {
    const currentMonth = dayjs().month()
    const currentYear = dayjs().year()

    setCurrentDate(
      currentDate.set('month', currentMonth).set('year', currentYear),
    )
  }

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month')

    setCurrentDate(previousMonthDate)
  }

  function handleNextMonth() {
    const previousMonthDate = currentDate.add(1, 'month')

    setCurrentDate(previousMonthDate)
  }

  const shortWeekDays = getWeekDays({ short: true })

  const currentMonth = currentDate.locale('pt-br').format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const username = String(router.query.username)

  const { data: blockedDates } = useQuery<BlockedDates>(
    [
      'blocked-dates',
      currentDate.get('year'),
      String(currentDate.get('month') + 1).padStart(2, '0'),
    ],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: String(currentDate.get('month') + 1).padStart(2, '0'),
        },
      })

      return response.data
    },
  )

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    const firstWeekDay = currentDate.get('day')

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )

    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(date.get('day')) ||
            blockedDates.blockedDates.includes(date.get('date')),
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <div className="rounded-md bg-zinc-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={handleBackToToday}
            title="Back to today"
            className="flex cursor-pointer items-center justify-center gap-1 rounded-md border border-purple-500 p-2 text-sm leading-[0] text-zinc-200 transition-colors hover:bg-purple-600"
          >
            <ArrowUUpLeft className="h-5 w-5" />
            Hoje
          </button>
        </div>

        <p className="font-medium capitalize text-zinc-200">
          {currentMonth} <span className="text-zinc-400">{currentYear}</span>
        </p>

        <div className="flex gap-2">
          <button
            onClick={handlePreviousMonth}
            title="Previous month"
            className="flex cursor-pointer items-center justify-center rounded-md p-2 leading-[0] transition-colors hover:bg-zinc-700"
          >
            <CaretLeft className="h-5 w-5 text-zinc-200" />
          </button>

          <button
            onClick={handleNextMonth}
            title="Next month"
            className="flex cursor-pointer items-center justify-center rounded-md p-2 leading-[0] transition-colors hover:bg-zinc-700"
          >
            <CaretRight className="h-5 w-5 text-zinc-200" />
          </button>
        </div>
      </div>

      <table className="mt-6 w-full table-fixed border-spacing-1">
        <thead>
          <tr className="text-sm font-medium text-zinc-400">
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>

        <tbody className="before:block before:leading-3 before:text-zinc-800 before:content-['.']">
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  const isToday =
                    new Date().toDateString() === date.toDate().toDateString()

                  return (
                    <td key={date.toString()} className="box-border p-[2px]">
                      <button
                        onClick={() => onDateSelected(date.toDate())}
                        disabled={disabled}
                        className={clsx(
                          'aspect-square w-full cursor-pointer rounded-lg bg-zinc-800 text-center text-zinc-200 transition-colors focus:shadow-md disabled:cursor-default disabled:bg-zinc-800/25 disabled:opacity-40 disabled:hover:bg-zinc-800',
                          {
                            'border border-purple-500 bg-purple-500 hover:bg-purple-600 focus:bg-purple-600':
                              isToday,
                            'hover:bg-zinc-700 focus:bg-zinc-700': !isToday,
                          },
                        )}
                      >
                        {date.get('date')}
                      </button>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

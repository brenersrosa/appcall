import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { Header } from '@/components/header'
import { Calendar } from '@/components/ui/Calendar'

import { api } from '@/lib/axios'
import DashboardForm from './DashboardForm'

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
}

interface UpcomingAppointment {
  appointments: Appointment[]
}

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()
  const username = String(router.query.username)

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

  console.log(upcomingAppointments)

  return (
    <>
      <Header />

      <div className="mx-auto mb-4 mt-20 flex max-w-[852px] flex-col gap-6 px-4">
        <DashboardForm />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context)

    if (!session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    return {
      props: {
        session,
      },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        session: null,
      },
    }
  }
}

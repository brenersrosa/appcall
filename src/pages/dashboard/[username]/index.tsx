import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

import { DashboardLayout } from '@/components/dashboard'

import DashboardForm from './dashboard-form'

export default function Dashboard() {
  return (
    <DashboardLayout
      headerTitle="👋 Bem-vindo!"
      heading="Dashboard"
      tag=""
      text="👇 Tenha um overview das suas reuniões."
    >
      <div className="mx-auto mb-4 mt-20 flex max-w-[852px] flex-col gap-6 px-4">
        <DashboardForm />
      </div>
    </DashboardLayout>
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

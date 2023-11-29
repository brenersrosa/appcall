import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

import { Header } from '@/components/header'
import { Navbar } from '@/components/navbar'
import { Text } from '@/components/ui/Text'

export default function Friends() {
  return (
    <div className="flex h-full min-h-screen">
      <Navbar />

      <div className="flex flex-1 flex-col">
        <Header title="🖖 Amigos" />

        <div className="mx-auto mb-4 mt-20 flex max-w-[852px] flex-col gap-6 px-4">
          <Text>friends</Text>
        </div>
      </div>
    </div>
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

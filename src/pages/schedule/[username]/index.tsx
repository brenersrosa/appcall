import { GetStaticPaths, GetStaticProps } from 'next'

import ScheduleForm from './ScheduleForm'
import { Header } from '@/components/schedule/Header'

import { prisma } from '@/lib/prisma'

interface ScheduleProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <div className="mx-auto mb-4 mt-20 flex max-w-[852px] flex-col gap-6 px-4">
      <Header user={user} />

      <ScheduleForm />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}

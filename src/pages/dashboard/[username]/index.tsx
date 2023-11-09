import { GetServerSideProps } from 'next'

import { Text } from '@/components/ui/Text'

import { prisma } from '@/lib/prisma'
import { getSession, useSession } from 'next-auth/react'
import { Header } from '@/components/header'
// import { Widget } from '@/components/ui/Notification/Widget'

interface ScheduleProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Dashboard() {
  const session = useSession()

  return (
    <>
      <Header />

      <div className="flex h-screen w-full flex-col items-center justify-center gap-6">
        <Text>dash</Text>

        <span className="text-zinc-300">{session.data?.user.name}</span>

        {/* <Widget /> */}
      </div>
    </>
  )
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: 'blocking',
//   }
// }

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const username = String(params?.username)

//   const user = await prisma.user.findUnique({
//     where: {
//       username,
//     },
//   })

//   if (!user) {
//     return {
//       notFound: true,
//     }
//   }

//   return {
//     props: {
//       user: {
//         name: user.name,
//         bio: user.bio,
//         avatarUrl: user.avatar_url,
//       },
//     },
//     revalidate: 60 * 60 * 24, // 1 day
//   }
// }

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

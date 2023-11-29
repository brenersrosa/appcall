import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { MagnifyingGlass } from 'phosphor-react'

import { Dashboard } from '@/components/dashboard'
import { Input } from '@/components/ui/Input'
import { Heading } from '@/components/ui/Heading'
import { CardFriend } from '@/components/friends/Card'

import { prisma } from '@/lib/prisma'
import { FriendStatus, User } from '@prisma/client'
import { Text } from '@/components/ui/Text'

interface FriendProps {
  friendList: {
    id: string
    status: FriendStatus
    created_at: Date
    updated_at: Date
    user_id: string
    friend_id: string
    user: User
    friend: User
  }[]
}

export default function Friends({ friendList }: FriendProps) {
  const session = useSession()
  const userLoggedIn = session.data?.user

  return (
    <Dashboard
      headerTitle="🖖 Amigos"
      heading="Encontre seu próximo compromisso"
      text="👇 Aqui estão seus amigos, ou se preferir, busque por uma nova
    //         agenda."
    >
      <div>
        <Input icon={MagnifyingGlass} placeholder="Buscar" />
      </div>

      <div className="flex flex-col gap-4">
        <Heading>Solicitações</Heading>

        <div className="grid grid-cols-3 gap-4">
          {friendList.map((data) =>
            data.status === 'pending' && data.user.id !== userLoggedIn?.id ? (
              <CardFriend
                key={data.id}
                id={data.id}
                status={data.status}
                avatarUrl={
                  data.user.id === userLoggedIn?.id
                    ? data.friend.avatar_url || ''
                    : data.user.avatar_url || ''
                }
                avatarAlt={
                  data.user.id === userLoggedIn?.id
                    ? data.friend.name
                    : data.user.name
                }
                name={
                  data.user.id === userLoggedIn?.id
                    ? data.friend.name
                    : data.user.name
                }
                username={
                  data.user.id === userLoggedIn?.id
                    ? data.friend.username
                    : data.user.username
                }
                link={
                  data.user.id === userLoggedIn?.id
                    ? data.friend.username
                    : data.user.username
                }
              />
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <Heading>🫡 Nenhuma solicitação pendente!</Heading>
                  <Text>
                    Mas fique calmo(a) que avisaremos quando alguma solicitação
                    chegar.
                  </Text>
                </div>
              </>
            ),
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Heading>Amigos</Heading>

        <div className="grid grid-cols-3 gap-4">
          {friendList.map((data) =>
            data.status === 'accepted' ? (
              <CardFriend
                key={data.id}
                id={data.id}
                status={data.status}
                avatarUrl={
                  data.user.id === userLoggedIn?.id
                    ? data.friend.avatar_url || ''
                    : data.friend.id === userLoggedIn?.id
                    ? data.user.avatar_url || ''
                    : ''
                }
                avatarAlt={
                  data.user.id === userLoggedIn?.id
                    ? data.friend.name
                    : data.friend.id === userLoggedIn?.id
                    ? data.user.name
                    : ''
                }
                name={
                  data.user.id === userLoggedIn?.id
                    ? data.friend.name
                    : data.friend.id === userLoggedIn?.id
                    ? data.user.name
                    : ''
                }
                username={
                  data.user.id === userLoggedIn?.id
                    ? data.friend.username
                    : data.friend.id === userLoggedIn?.id
                    ? data.user.username
                    : ''
                }
                link={
                  data.user.id === userLoggedIn?.id
                    ? data.id
                    : data.friend.id === userLoggedIn?.id
                    ? data.user.username
                    : ''
                }
                // variant="accepted"
              />
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <Heading>🤔 Você ainda não possui amigos...</Heading>
                  <Text>Busque pelos seus amigos e envie uma solicitação.</Text>
                </div>
              </>
            ),
          )}
        </div>
      </div>
    </Dashboard>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const username = String(context.params?.username)
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  try {
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

    const friendList = await prisma.friend.findMany({
      where: {
        OR: [{ user_id: user.id }, { friend_id: user.id }],
      },
      include: {
        user: true,
        friend: true,
      },
      orderBy: {
        friend: {
          name: 'asc',
        },
      },
    })

    const formattedFriendList = friendList.map((friendship) => ({
      id: friendship.id,
      user: {
        ...friendship.user,
        created_at: friendship.user.created_at.toISOString(),
        updated_at: friendship.user.updated_at.toISOString(),
      },
      friend: {
        ...friendship.friend,
        created_at: friendship.friend.created_at.toISOString(),
        updated_at: friendship.friend.updated_at.toISOString(),
      },
      status: friendship.status,
      created_at: friendship.created_at.toISOString(),
      updated_at: friendship.updated_at.toISOString(),
    }))

    return {
      props: {
        session,
        friendList: formattedFriendList,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        error: 'Erro ao buscar informações do usuário',
      },
    }
  } finally {
    await prisma.$disconnect()
  }
}

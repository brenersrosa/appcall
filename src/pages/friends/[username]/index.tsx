import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { MagnifyingGlass } from 'phosphor-react'

import { DashboardLayout } from '@/components/dashboard'
import { Heading } from '@/components/ui/Heading'
import { Input } from '@/components/ui/Input'
import { CardFriend } from '@/components/friends/Card'
import { Text } from '@/components/ui/Text'

import { prisma } from '@/lib/prisma'
import { User } from '@prisma/client'
import { api } from '@/lib/axios'

import { useToast } from '@/contexts/ToastContext'

enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
}

enum FriendAction {
  SEND_REQUEST = 'send_request',
  ACCEPT_REQUEST = 'accept_request',
  REMOVE_FRIEND = 'remove_friend',
  REJECT_REQUEST = 'remove_request',
}

interface FriendProps {
  acceptedFriends: {
    id: string
    status: FriendStatus.ACCEPTED
    created_at: Date
    updated_at: Date
    user_id: string
    friend_id: string
    user: User
    friend: User
  }[]
  pendingRequests: {
    id: string
    status: FriendStatus.PENDING
    created_at: Date
    updated_at: Date
    user_id: string
    friend_id: string
    user: User
    friend: User
  }[]
}

export default function Friends({
  acceptedFriends: initialAcceptedFriends,
  pendingRequests: initialPendingRequests,
}: FriendProps) {
  const [friendsList, setFriendsList] = useState<FriendProps>({
    acceptedFriends: initialAcceptedFriends,
    pendingRequests: initialPendingRequests,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [searchFriend, setSearchFriend] = useState('')
  const [filteredFriends, setFilteredFriends] = useState<FriendProps>({
    acceptedFriends: [],
    pendingRequests: [],
  })

  const session = useSession()
  const userLoggedIn = session.data?.user

  const { showToast } = useToast()

  async function handleFriendAction(requestId: string, action: FriendAction) {
    setIsLoading(true)

    try {
      let response

      switch (action) {
        case FriendAction.ACCEPT_REQUEST:
          response = await api.put('/users/friend-request/update', {
            requestId,
            action: 'accept',
          })
          break

        case FriendAction.REMOVE_FRIEND:
          response = await api.delete(
            `/users/friend-request/delete?id=${requestId}`,
          )
          break

        case FriendAction.REJECT_REQUEST:
          response = await api.delete(
            `/users/friend-request/delete?id=${requestId}`,
          )
          break

        default:
          setIsLoading(false)
          return
      }

      if (response.status === 200) {
        showToast(
          'Sucesso!',
          action === FriendAction.ACCEPT_REQUEST
            ? 'Solicitação aceita com sucesso.'
            : action === FriendAction.REJECT_REQUEST
            ? 'Solicitação recusada com sucesso.'
            : 'Amizade removida com sucesso.',
          'success',
        )

        let updatedAcceptedFriends = [...friendsList.acceptedFriends]
        let updatedPendingRequests = [...friendsList.pendingRequests]

        if (action === FriendAction.ACCEPT_REQUEST) {
          updatedPendingRequests = updatedPendingRequests.filter(
            (request) => request.id !== requestId,
          )

          const acceptedFriendRequest = friendsList.pendingRequests.find(
            (request) => request.id === requestId,
          )

          if (acceptedFriendRequest) {
            updatedAcceptedFriends.push({
              ...acceptedFriendRequest,
              status: FriendStatus.ACCEPTED,
            })
          }
        } else if (action === FriendAction.REJECT_REQUEST) {
          updatedPendingRequests = updatedPendingRequests.filter(
            (request) => request.id !== requestId,
          )
        } else if (action === FriendAction.REMOVE_FRIEND) {
          updatedAcceptedFriends = updatedAcceptedFriends.filter(
            (friend) => friend.id !== requestId,
          )
        }

        setFriendsList((prevState: FriendProps) => ({
          ...prevState,
          acceptedFriends: updatedAcceptedFriends,
          pendingRequests: updatedPendingRequests,
        }))
      }
    } catch (error) {
      console.error(`ERROR | Error during ${action} friend request:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const filterFriends = (friendList: FriendProps, searchTerm: string) => {
      const filteredAcceptedFriends = friendList.acceptedFriends.filter(
        (friend) =>
          friend.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          friend.friend.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      const filteredPendingRequests = friendList.pendingRequests.filter(
        (request) =>
          request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.friend.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      return {
        acceptedFriends: filteredAcceptedFriends,
        pendingRequests: filteredPendingRequests,
      }
    }

    setFilteredFriends(filterFriends(friendsList, searchFriend.trim()))
  }, [searchFriend, friendsList])

  return (
    <DashboardLayout
      headerTitle="🖖 Amigos"
      heading="Encontre seu próximo compromisso"
      tag=""
      text="👇 Aqui estão seus amigos, ou se preferir, busque por uma nova agenda."
    >
      <div>
        <Input
          icon={MagnifyingGlass}
          placeholder="Buscar"
          onChange={(e) => setSearchFriend(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Heading>Solicitações</Heading>

        <div className="grid grid-cols-3 gap-4">
          {friendsList.pendingRequests.length > 0 ? (
            friendsList.pendingRequests.map((data) => (
              <CardFriend
                key={data.id}
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
                requestId={data.id}
                onFriendAction={handleFriendAction}
              />
            ))
          ) : (
            <div className="flex flex-col gap-2">
              <Heading>🫡 Nenhuma solicitação pendente!</Heading>
              <Text>
                Mas fique calmo(a) que avisaremos quando alguma solicitação
                chegar.
              </Text>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Heading>Amigos</Heading>

        <div className="grid grid-cols-3 gap-4">
          {filteredFriends.acceptedFriends.length > 0 ? (
            filteredFriends.acceptedFriends.map((data) => (
              <CardFriend
                key={data.id}
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
                requestId={data.id}
                onFriendAction={handleFriendAction}
              />
            ))
          ) : (
            <div className="flex flex-col gap-2">
              <Heading>🤔 Você ainda não possui amigos...</Heading>
              <Text>
                Busque pelos seus amigos e envie uma solicitação, ou caso tenha
                solicitações pendentes, aceite uma.
              </Text>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
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

  if (session.user.username !== username) {
    return {
      redirect: {
        destination: `/friends/${session.user.username}`,
        permanent: true,
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
      status: friendship.status,
      created_at: friendship.created_at.toISOString(),
      updated_at: friendship.updated_at.toISOString(),
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
    }))

    const acceptedFriends = formattedFriendList.filter(
      (friendship) => friendship.status === FriendStatus.ACCEPTED,
    )

    const pendingRequests = formattedFriendList.filter(
      (friendship) =>
        friendship.status === FriendStatus.PENDING &&
        friendship.user.id !== user.id,
    )

    return {
      props: {
        session,
        acceptedFriends,
        pendingRequests,
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

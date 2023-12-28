import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { AxiosError } from 'axios'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import { Calendar, MagnifyingGlass } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { DashboardLayout } from '@/components/dashboard'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useToast } from '@/contexts/toast-context'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'

interface RecentProps {
  usersList: User[]
}
const findUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .regex(/^([a-z0-9\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras, números e hifens.',
    })
    .transform((username) => username.toLocaleLowerCase()),
})

type FindUsernameFormData = z.infer<typeof findUsernameFormSchema>

export default function Scheduling({ usersList }: RecentProps) {
  const router = useRouter()
  const { showToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FindUsernameFormData>({
    resolver: zodResolver(findUsernameFormSchema),
  })

  async function handleFindUserByUsername(data: FindUsernameFormData) {
    try {
      const { username } = data

      const response = await api.get('/users/find-user-by-username', {
        params: {
          username,
        },
      })

      console.log(response.data)

      await router.push(`/schedule/${username}`)
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data) {
        console.log(error.response.data)

        showToast('Falha!', 'Usuário não encontrado.', 'error')

        return
      }
      console.log('ERROR | ', error)
    }
  }

  return (
    <DashboardLayout
      headerTitle="📅 Novo agendamento"
      heading="Selecione uma agenda"
      tag=""
      text="👇 Busque por um usuário e visualize seus horários."
    >
      <Box
        as="form"
        onSubmit={handleSubmit(handleFindUserByUsername)}
        className="flex items-center gap-4"
      >
        <Input
          prefix="appcall.com/"
          placeholder="nome-do-usuario"
          {...register('username')}
          error={errors.username}
        />

        <div className="h-full w-[1px] bg-zinc-600"></div>

        <Button
          isLoading={isSubmitting}
          className="min-w-[172px]"
          icon={MagnifyingGlass}
        >
          Buscar
        </Button>
      </Box>

      <div className="flex flex-col gap-4">
        <Heading>Recentes</Heading>

        <div className="grid grid-cols-3 gap-4">
          {usersList.length > 0 ? (
            usersList.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-5 rounded-md border border-zinc-600 p-4 transition-colors hover:border-violet-500"
              >
                <div className="flex gap-5 divide-x divide-zinc-600">
                  <Image
                    src={user.avatar_url || ''}
                    alt={user.name}
                    width={56}
                    height={56}
                    className="rounded-full"
                  />

                  <div className="gap-1 pl-5">
                    <Text className="font-semibold text-zinc-50" size="lg">
                      {user.name}
                    </Text>
                    <Text
                      size="sm"
                      className="transition-colors hover:text-violet-200"
                    >
                      @{user.username}
                    </Text>
                  </div>
                </div>

                <div>
                  <Button
                    className="min-w-[198px]"
                    icon={Calendar}
                    iconPosition="left"
                    onClick={() => router.push(`/schedule/${user.username}`)}
                  >
                    Ver agenda
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-2">
              <Heading>
                🧐 Até o momento você não teve nenhum agendamento
              </Heading>
              <Text>
                Na medida que os agendamentos forem acontecendo, iremos deixar
                os usuários recentes para facilitar para você.
              </Text>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const userLoggedIn = session.user

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userLoggedIn.id,
      },
    })

    if (!user) {
      return {
        notFound: true,
      }
    }

    const recentList = await prisma.scheduling.findMany({
      where: {
        OR: [{ user_id: user.id }, { creator_id: user.id }],
      },
      include: {
        user: true,
        creator: true,
      },
    })

    const recentUsers = recentList.map((item) => {
      if (item.user.id === userLoggedIn.id) {
        return {
          ...item.creator,
          created_at: item.creator.created_at.toISOString(),
          updated_at: item.creator.updated_at.toISOString(),
        }
      } else if (item.creator.id === userLoggedIn.id) {
        return {
          ...item.user,
          created_at: item.user.created_at.toISOString(),
          updated_at: item.user.updated_at.toISOString(),
        }
      } else {
        return {
          id: '',
          schedule_private: false,
          username: '',
          name: '',
          schedule_id: null,
          bio: null,
          email: null,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
    })

    const usersList = recentUsers.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id),
    )

    return {
      props: {
        session,
        usersList,
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

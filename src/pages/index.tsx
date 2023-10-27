import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { signIn, useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { GoogleLogo } from 'phosphor-react'

import { ClaimUsernameForm } from '@/components/ClaimUsernameForm'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

import logoImg from '@/assets/logo.svg'
import heroImg from '@/assets/hero.svg'

export default function Home() {
  const session = useSession()
  const router = useRouter()

  async function handleSignIn() {
    await signIn('google')

    await router.push(`/dashboard/${session.data?.user.username}`)
  }

  return (
    <div className="h-screen w-screen bg-home bg-contain bg-repeat">
      <div className="ml-auto grid h-full w-full max-w-[calc(100vw-(100vw-1160px)/2)] grid-cols-2 items-center justify-between gap-20">
        <div className="flex flex-col gap-8">
          <Image src={logoImg} height={48} alt="AppCall logo" />

          <div className="flex flex-col gap-4">
            <Heading size="3xl">Agendamento simplificado</Heading>

            <Text className="">
              Integre seu calendário de forma simples e habilite outras pessoas
              a agendarem compromissos durante seus períodos disponíveis.
            </Text>
          </div>

          <ClaimUsernameForm />

          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-full rounded-full bg-zinc-600"></div>
            <Text size="sm" className="text-zinc-400">
              ou
            </Text>
            <div className="h-[1px] w-full rounded-full bg-zinc-600"></div>
          </div>

          <Button
            icon={GoogleLogo}
            iconPosition="left"
            variant="social"
            color="red"
            onClick={handleSignIn}
          >
            Entrar com o Google
          </Button>
        </div>

        <div className="flex items-center justify-end">
          <Image src={heroImg} height={382} alt="Hero image" />
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context)

    if (session) {
      return {
        redirect: {
          destination: `/dashboard/${session.user.username}`,
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

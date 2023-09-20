import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { CaretRight, Check, X } from 'phosphor-react'

import { Box } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { MultiStepVertical } from '@/components/ui/MultiStepVertical'
import { Text } from '@/components/ui/Text'

import { api } from '@/lib/axios'

import { steps } from '@/utils/register-form-steps'
import { useState } from 'react'

export default function ConnectCalendar() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const session = useSession()
  const router = useRouter()

  const hasAuthError = !!router.query.error
  const isSignedId = session.status === 'authenticated'

  async function handleConnectCalendar() {
    await signIn('google')
  }

  async function handleCreateCalendar() {
    setIsSubmitting(true)
    await api.put('/users/connect-calendar')

    await router.push('/register/time-intervals')
    setIsSubmitting(false)
  }

  return (
    <div className="mx-auto flex h-screen w-screen max-w-7xl items-center justify-between py-24">
      <div>
        <MultiStepVertical steps={steps} currentStep={2} />
      </div>

      <div className="h-full w-[2px] rounded-full bg-zinc-600"></div>

      <div className="flex max-w-[548px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Heading>📅 Conecte sua agenda!</Heading>
          <Text>
            Vincule sua conta do Google para verificar automaticamente seus
            compromissos e os novos eventos à medida em que são agendados.
          </Text>
        </div>

        <Box className="flex-col">
          <div className="flex items-center rounded-lg border border-zinc-600 px-6 py-4">
            <Text className="flex w-full">Google Calendar</Text>

            {isSignedId ? (
              <Button icon={Check} variant="secondary" disabled>
                Conectado
              </Button>
            ) : (
              <Button icon={CaretRight} onClick={handleConnectCalendar}>
                Conectar
              </Button>
            )}
          </div>

          {hasAuthError && (
            <div className="flex items-center gap-2">
              <X className="h-8 w-8 text-red-500" />
              <Text className="text-sm leading-relaxed text-zinc-400">
                Falha ao se conectar ao Google, verifique se você habilitou as
                permissões de acesso ao Google Calendar.
              </Text>
            </div>
          )}

          <Button
            icon={CaretRight}
            onClick={handleCreateCalendar}
            disabled={!isSignedId}
            isLoading={!isSubmitting}
          >
            Próximo passo
          </Button>
        </Box>
      </div>
    </div>
  )
}

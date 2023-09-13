import { CaretRight } from 'phosphor-react'

import { Box } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { MultiStepVertical } from '@/components/ui/MultiStepVertical'
import { Text } from '@/components/ui/Text'

import { steps } from '@/utils/register-form-steps'

export default function ConnectCalendar() {
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

            <Button icon={CaretRight}>Conectar</Button>
          </div>

          <Button icon={CaretRight} disabled>
            Próximo passo
          </Button>
        </Box>
      </div>
    </div>
  )
}

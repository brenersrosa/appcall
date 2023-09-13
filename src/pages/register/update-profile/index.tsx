import { CaretRight } from 'phosphor-react'

import { Box } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { MultiStepVertical } from '@/components/ui/MultiStepVertical'
import { Text } from '@/components/ui/Text'

import { steps } from '@/utils/register-form-steps'
import { Textarea } from '@/components/ui/Textarea'

export default function UpdateProfile() {
  return (
    <div className="mx-auto flex h-screen w-screen max-w-7xl items-center justify-between py-24">
      <div>
        <MultiStepVertical steps={steps} currentStep={4} />
      </div>

      <div className="h-full w-[2px] rounded-full bg-zinc-600"></div>

      <div className="flex max-w-[548px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Heading>✅ Pronto!</Heading>
          <Text>
            Por último, mas não menos importante. Informe uma breve descrição do
            seu perfil.
          </Text>
        </div>

        <Box className="flex-col">
          <Textarea
            label="Sobre você"
            placeholder="Fale um pouco sobre você. Isto será exibido em sua página pessoal."
          />

          <Button icon={CaretRight}>Finalizar</Button>
        </Box>
      </div>
    </div>
  )
}

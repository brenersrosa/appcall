import { Box } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { Input } from '@/components/ui/Input'
import { CaretRight } from 'phosphor-react'

import { MultiStepVertical } from '@/components/ui/MultiStepVertical'
import { Text } from '@/components/ui/Text'

import { steps } from '@/utils/register-form-steps'

export default function Register() {
  return (
    <div className="mx-auto flex h-screen w-screen max-w-7xl items-center justify-between py-24">
      <div>
        <MultiStepVertical steps={steps} currentStep={1} />
      </div>

      <div className="h-full w-[2px] rounded-full bg-zinc-600"></div>

      <div className="flex max-w-[548px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Heading>👋 Bem-vindo ao AppCall!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil. Mas não se
            preocupe, essas informações poderão ser editadas depois.
          </Text>
        </div>

        <Box as="form" className="flex-col">
          <Input
            label="Nome de usuário"
            prefix="appcall.com/"
            placeholder="seu-usuario"
          />

          <Input label="Nome completo" placeholder="Seu nome completo" />

          <Button icon={CaretRight}>Próximo passo</Button>
        </Box>
      </div>
    </div>
  )
}

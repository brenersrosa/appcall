import Image from 'next/image'
import { CaretRight } from 'phosphor-react'

import { Box } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { Input } from '@/components/ui/Input'
import { Text } from '@/components/ui/Text'

import logoImg from '@/assets/logo.svg'
import heroImg from '@/assets/hero.svg'

export default function Home() {
  function handleClick() {
    console.log('ok')
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

          <Box className="flex items-center justify-between gap-4">
            <Input
              prefix="appcall.com/"
              placeholder="seu-usuario"
              className="w-full"
            />

            <Button
              icon={CaretRight}
              size="default"
              className="min-w-[172px]"
              onClick={handleClick}
            >
              Reservar
            </Button>
          </Box>
        </div>

        <div className="flex items-center justify-end">
          <Image src={heroImg} height={382} alt="Hero image" />
        </div>
      </div>
    </div>
  )
}

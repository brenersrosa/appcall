import { Box } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { Input } from '@/components/ui/Input'
import { Text } from '@/components/ui/Text'
import { CaretRight } from 'phosphor-react'

export default function Home() {
  function handleClick() {
    console.log('ok')
  }

  return (
    <div className="flex h-screen w-screen flex-col justify-center">
      <Heading size="3xl">Agendamento simplificado</Heading>

      <Text className="max-w-2xl">
        Integre seu calendário de forma simples e habilite outras pessoas a
        agendarem compromissos durante seus períodos disponíveis.
      </Text>

      <Box className="flex max-w-2xl items-center justify-between gap-4">
        <Input
          label="Usuário"
          prefix="appcall.com/"
          placeholder="seu-usuario"
          className="w-full"
        />

        <Button icon={CaretRight} size="default" onClick={handleClick}>
          Label
        </Button>
      </Box>
    </div>
  )
}

import { Box } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
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

      <Box>
        <Button icon={CaretRight} onClick={handleClick}>
          Reservar
        </Button>
      </Box>
    </div>
  )
}

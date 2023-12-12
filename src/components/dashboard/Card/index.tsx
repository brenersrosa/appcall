import Image from 'next/image'
import dayjs from 'dayjs'
import {
  TextAlignLeft,
  Info,
  WhatsappLogo,
  EnvelopeSimple,
  Link,
  X,
  Calendar,
} from 'phosphor-react'

import {
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@radix-ui/react-dialog'

import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

interface CardProps {
  appointment: {
    id: string
    date: string
    name: string
    email: string
    phone: string
    observations: string
    meet_url: string
    created_at: string
    updated_at: string
    user_id: string
    creator_id: string
    creator: {
      name: string
      avatar_url: string
    }
  }
  onAppointmentAction: (id: string, userId: string) => void
}

export function Card({ appointment, onAppointmentAction }: CardProps) {
  async function handleCancelAppointment(id: string, userId: string) {
    try {
      onAppointmentAction(id, userId)
    } catch (error) {
      console.error(`ERROR | Error to delete appointment:`, error)
    }
  }

  return (
    <div>
      <DialogOverlay className="fixed inset-0 bg-zinc-900/75 data-[state=open]:animate-overlayShow" />
      <DialogContent className="fixed left-[50%] top-[50%] flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] flex-col gap-4 rounded-[6px] border border-zinc-600 bg-zinc-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
        <DialogTitle>
          <Heading className="flex items-center gap-2">
            <Calendar />
            Detalhes
          </Heading>
        </DialogTitle>

        <div className="flex items-center justify-between rounded-md border border-zinc-600 p-4">
          <div className="flex items-center gap-4 divide-x divide-zinc-600">
            <div className="flex flex-col items-end justify-center">
              <Text>
                {dayjs(appointment.date).locale('pt-br').format('dddd')},
              </Text>

              <Text>
                {dayjs(appointment.date).locale('pt-br').format('DD [de] MMMM')}
              </Text>
            </div>

            <div className="flex flex-col items-start justify-center pl-4">
              <Text>{dayjs(appointment.date).format('HH:mm')}h</Text>

              <Text>{appointment.name}</Text>
            </div>
          </div>

          <Image
            src={appointment.creator.avatar_url || ''}
            alt={appointment.creator.name}
            width={56}
            height={56}
            className="rounded-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Text className="flex items-center gap-2">
            <TextAlignLeft />
            Observações
          </Text>

          <Text className="cursor-default">
            {appointment.observations === ''
              ? 'Nenhuma observação.'
              : appointment.observations}
          </Text>
        </div>

        <div className="flex flex-col gap-2">
          <Text className="flex items-center gap-2">
            <Info />
            Informações
          </Text>

          <div className="flex flex-col gap-1">
            <Text className="flex items-center gap-2">
              <WhatsappLogo />
              {appointment.phone === ''
                ? 'Nenhum telefone informado.'
                : appointment.phone}
            </Text>

            <Text className="flex items-center gap-2">
              <EnvelopeSimple />
              {appointment.email === ''
                ? 'Nenhum e-mail informado.'
                : appointment.email}
            </Text>

            <Text className="flex items-center gap-2">
              <Link />
              {appointment.meet_url === null
                ? 'Nenhum link informado.'
                : appointment.meet_url}
            </Text>
          </div>
        </div>

        <Button
          variant="destructive"
          onClick={() =>
            handleCancelAppointment(appointment.id, appointment.creator_id)
          }
        >
          Cancelar agendamento
        </Button>

        <DialogClose asChild>
          <button
            className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
            aria-label="Close"
          >
            <X />
          </button>
        </DialogClose>
      </DialogContent>
    </div>
  )
}

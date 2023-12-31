import 'dayjs/locale/pt-br'

import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { Calendar, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/contexts/toast-context'
import { api } from '@/lib/axios'

const confirmStepSchema = z.object({
  creator: z.string().uuid(),
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  phone: z.string(),
  observations: z.string().max(100),
})

type ConfirmStepData = z.infer<typeof confirmStepSchema>

interface UserLoggedInProps {
  id?: string
  name: string
  email: string
}

interface ConfirmStepProps {
  schedulingDate: Date
  onReturnToCalendar: () => void
  userLoggedIn: UserLoggedInProps
}

export default function ConfirmStep({
  schedulingDate,
  onReturnToCalendar,
  userLoggedIn,
}: ConfirmStepProps) {
  const { showToast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmStepData>({
    resolver: zodResolver(confirmStepSchema),
    defaultValues: {
      creator: userLoggedIn?.id,
      name: userLoggedIn?.name,
      email: userLoggedIn?.email,
      phone: '',
    },
  })

  const router = useRouter()
  const username = String(router.query.username)

  const describedDate = dayjs(schedulingDate)
    .locale('pt-br')
    .format('DD[ de ]MMMM[ de ]YYYY')
  const describedTime = dayjs(schedulingDate).locale('pt-br').format('HH:mm[h]')
  const formattedDate = dayjs(schedulingDate)
    .locale('pt-br')
    .format('dddd, DD [de] MMMM [às] HH:mm[h]')

  async function handleConfirmScheduling(data: ConfirmStepData) {
    const { creator, name, email, phone, observations } = data

    await api
      .post(`/users/${username}/schedule`, {
        creator,
        name,
        email,
        phone,
        observations,
        date: schedulingDate,
      })
      .then(() => {
        showToast('Agendamento realizado!', formattedDate, 'success')

        onReturnToCalendar()
      })
      .catch((err) => {
        console.log('ERROR | ', err)
      })
  }

  return (
    <Box
      as="form"
      className="mx-auto w-[540px] flex-col gap-6 divide-y divide-zinc-600"
      onSubmit={handleSubmit(handleConfirmScheduling)}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-white">
          <Calendar className="h-5 w-5 text-zinc-400" />
          <span>{describedDate}</span>
        </div>

        <div className="flex items-center gap-2 text-white">
          <Clock className="h-5 w-5 text-zinc-400" />
          <span>{describedTime}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 pt-6">
        <Input
          label="Nome completo"
          placeholder="Seu nome"
          // message="Informe seu nome completo."
          {...register('name')}
          // info
          error={errors.name}
        />

        <div className="grid grid-cols-2 items-center gap-2">
          <Input
            label="E-mail"
            placeholder="johndoe@gmail.com"
            // message="Informe seu melhor e-mail."
            {...register('email')}
            // info
            error={errors.email}
          />

          <Input
            label="Telefone"
            placeholder="(99) 999999999"
            {...register('phone')}
            error={errors.phone}
          />
        </div>

        <Textarea
          label="Observações"
          {...register('observations')}
          error={errors.observations}
          limit={100}
          totalCharacters={
            watch('observations') ? watch('observations').length : 0
          }
        />

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={onReturnToCalendar}
            variant="destructive"
            className="w-full"
          >
            Cancelar
          </Button>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Confirmar
          </Button>
        </div>
      </div>
    </Box>
  )
}

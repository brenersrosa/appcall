import { useRouter } from 'next/router'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Clock } from 'phosphor-react'
import dayjs from 'dayjs'

import { Input } from '@/components/ui/Input'
import { Box } from '@/components/ui/Box'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

import { api } from '@/lib/axios'

import { useToast } from '@/contexts/ToastContext'
import { useSession } from 'next-auth/react'

const confirmStepSchema = z.object({
  creator: z.string().uuid(),
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  phone: z.string(),
  observations: z.string(),
})

type ConfirmStepData = z.infer<typeof confirmStepSchema>

interface ConfirmStepProps {
  schedulingDate: Date
  onReturnToCalendar: () => void
}

export default function ConfirmStep({
  schedulingDate,
  onReturnToCalendar,
}: ConfirmStepProps) {
  const { showToast } = useToast()

  const session = useSession()
  const user = session.data?.user

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmStepData>({
    resolver: zodResolver(confirmStepSchema),
    defaultValues: {
      creator: user?.id,
      name: user?.name,
      email: user?.email,
      phone: '',
    },
  })

  const router = useRouter()
  const username = String(router.query.username)

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describedTime = dayjs(schedulingDate).format('HH:mm[h]')
  const formattedDate = dayjs(schedulingDate).format(
    'dddd, DD [de] MMMM [às] HH:mm[h]',
  )

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
        console.log(err)
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

        <Input
          label="Endereço de e-mail"
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

          <Button type="submit" disabled={isSubmitting} className="w-full">
            Confirmar
          </Button>
        </div>
      </div>
    </Box>
  )
}

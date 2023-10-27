import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AxiosError } from 'axios'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CaretRight } from 'phosphor-react'

import { Box } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { Input } from '@/components/ui/Input'
import { MultiStepVertical } from '@/components/ui/MultiStepVertical'
import { Text } from '@/components/ui/Text'

import { useToast } from '@/contexts/ToastContext'

import { api } from '@/lib/axios'

import { steps } from '@/utils/register-form-steps'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .regex(/^([a-z0-9\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras, números e hifens.',
    })
    .transform((username) => username.toLocaleLowerCase()),
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 caracteres.' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const searchParams = useSearchParams()

  const { showToast } = useToast()

  useEffect(() => {
    if (searchParams.get('username')) {
      setValue('username', String(searchParams.get('username')))
    }
  }, [searchParams, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        username: data.username,
        name: data.name,
      })

      console.log(data)

      await router.push('/register/connect-calendar')
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data) {
        console.log(err.response.data)

        showToast('Falha!', 'Este usuário já existe.', 'error')

        return
      }
      console.log(err)
    }
  }

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

        <Box
          as="form"
          onSubmit={handleSubmit(handleRegister)}
          className="flex-col"
        >
          <Input
            label="Nome de usuário"
            prefix="appcall.com/"
            placeholder="seu-usuario"
            {...register('username')}
            error={errors.username}
          />

          <Input
            label="Nome completo"
            placeholder="Seu nome completo"
            {...register('name')}
            error={errors.name}
            autoFocus
          />

          <Button type="submit" icon={CaretRight}>
            Próximo passo
          </Button>
        </Box>
      </div>
    </div>
  )
}

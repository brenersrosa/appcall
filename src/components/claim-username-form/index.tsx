import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { CaretRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Box } from '../ui/box'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .regex(/^([a-z0-9\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras, números e hifens.',
    })
    .transform((username) => username.toLocaleLowerCase()),
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  const router = useRouter()

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data

    await router.push(`/register?username=${username}`)
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleClaimUsername)}
      className="items-center justify-between"
    >
      <Input
        prefix="appcall.com/"
        placeholder="seu-usuario"
        className="w-full"
        autoFocus
        {...register('username')}
        error={errors.username}
      />

      <Button
        icon={CaretRight}
        size="default"
        className="min-w-[172px]"
        disabled={isSubmitting}
      >
        Reservar
      </Button>
    </Box>
  )
}

import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { CaretRight } from 'phosphor-react'

import { Box } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { MultiStepVertical } from '@/components/ui/multi-step-vertical'
import { Text } from '@/components/ui/Text'
import { Textarea } from '@/components/ui/Textarea'

import { steps } from '@/utils/register-form-steps'

import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth]'

import { api } from '@/lib/axios'
import { Checkbox } from '@/components/ui/Checkbox'

const updateProfileSchema = z.object({
  schedulePrivate: z.boolean().default(false),
  bio: z.string().max(100),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const session = useSession()
  const router = useRouter()

  async function handleUpdateProfile(data: UpdateProfileData) {
    await api.put('/users/profile', {
      schedulePrivate: data.schedulePrivate,
      bio: data.bio,
    })

    await router.push(`/dashboard/${session.data?.user.username}`)
  }

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

        <Box
          as="form"
          onSubmit={handleSubmit(handleUpdateProfile)}
          className="flex-col"
        >
          <div className="flex items-center gap-3">
            <Controller
              name="schedulePrivate"
              control={control}
              defaultValue={false}
              render={({ field }) => {
                return (
                  <Checkbox
                    onCheckedChange={(checked) => {
                      field.onChange(checked === true)
                    }}
                    checked={field.value}
                  />
                )
              }}
            />

            <Text as="span" className="text-zinc-100">
              Agenda privada
            </Text>
          </div>

          <Textarea
            label="Sobre você"
            placeholder="Fale um pouco sobre você. Isto será exibido em sua página pessoal."
            {...register('bio')}
            limit={100}
            totalCharacters={watch('bio') ? watch('bio').length : 0}
          />

          <Button
            type="submit"
            icon={CaretRight}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Finalizar
          </Button>
        </Box>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  return {
    props: {
      session,
    },
  }
}

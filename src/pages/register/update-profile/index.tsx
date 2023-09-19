import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { CaretRight } from 'phosphor-react'

import { Box } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { MultiStepVertical } from '@/components/ui/MultiStepVertical'
import { Text } from '@/components/ui/Text'

import { steps } from '@/utils/register-form-steps'
import { Textarea } from '@/components/ui/Textarea'

const updateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const session = useSession()
  const router = useRouter()

  async function handleUpdateProfile(data: UpdateProfileData) {
    // await api.put('/users/profile', {
    //   bio: data.bio,
    // })
    // await router.push(`/schedule/${session.data?.user.username}`)
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

        <Box className="flex-col">
          <Textarea
            label="Sobre você"
            placeholder="Fale um pouco sobre você. Isto será exibido em sua página pessoal."
            {...register('bio')}
            totalCharacters={watch('bio') ? watch('bio').length : 0}
          />

          <Button type="submit" icon={CaretRight} disabled={isSubmitting}>
            Finalizar
          </Button>
        </Box>
      </div>
    </div>
  )
}

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   const session = await getServerSession(
//     req,
//     res,
//     buildNextAuthOptions(req, res),
//   )

//   return {
//     props: {
//       session,
//     },
//   }
// }

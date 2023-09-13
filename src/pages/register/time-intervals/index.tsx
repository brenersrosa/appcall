import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CaretRight } from 'phosphor-react'

import { Box } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Heading } from '@/components/ui/Heading'
import { Input } from '@/components/ui/Input'
import { MultiStepVertical } from '@/components/ui/MultiStepVertical'
import { Slider } from '@/components/ui/Slider'
import { Text } from '@/components/ui/Text'

import { steps } from '@/utils/register-form-steps'
import { convertTimeStringToMinutes } from '@/utils/convert-time-string-to-minutes'
import { getWeekDays } from '@/utils/get-week-days'

const timeIntervalsFormSchema = z.object({
  meetDuration: z.number().min(10).max(180),
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
        dayMeetDuration: z.number().min(10).max(180),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana!',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
          dayMeetDuration: interval.dayMeetDuration,
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - interval.dayMeetDuration >=
            interval.startTimeInMinutes,
        )
      },
      {
        message:
          'O horário informado não respeita a regra do intervalo selecionado!',
      },
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>

type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      meetDuration: 60,
      intervals: [
        {
          weekDay: 0,
          enabled: false,
          startTime: '08:00',
          endTime: '18:00',
          dayMeetDuration: 160,
        },
        {
          weekDay: 1,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
          dayMeetDuration: 60,
        },
        {
          weekDay: 2,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
          dayMeetDuration: 60,
        },
        {
          weekDay: 3,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
          dayMeetDuration: 60,
        },
        {
          weekDay: 4,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
          dayMeetDuration: 60,
        },
        {
          weekDay: 5,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
          dayMeetDuration: 60,
        },
        {
          weekDay: 6,
          enabled: false,
          startTime: '08:00',
          endTime: '18:00',
          dayMeetDuration: 60,
        },
      ],
    },
  })

  const weekDays = getWeekDays()

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })

  const intervals = watch('intervals')

  const meetDuration = watch('meetDuration')

  function isInvalidEndTime(startTime: string, endTime: string) {
    if (!startTime || !endTime) {
      return false
    }

    const startTimeInMinutes = convertTimeStringToMinutes(startTime)
    const endTimeInMinutes = convertTimeStringToMinutes(endTime)

    return endTimeInMinutes < startTimeInMinutes + meetDuration
  }

  async function handleSetTimeIntervals(data: unknown) {
    const { meetDuration, intervals } = data as TimeIntervalsFormOutput

    // await api.post('/users/time-intervals', { intervals })

    console.log(meetDuration)
    console.log(intervals)

    // await router.push('/register/update-profile')
  }

  useEffect(() => {
    intervals.map((interval, index) =>
      setValue(`intervals.${index}.dayMeetDuration`, meetDuration),
    )
  }, [meetDuration, intervals, setValue])

  return (
    <div className="mx-auto flex h-screen w-screen max-w-7xl items-center justify-between py-24">
      <div>
        <MultiStepVertical steps={steps} currentStep={3} />
      </div>

      <div className="h-full w-[2px] rounded-full bg-zinc-600"></div>

      <div className="flex max-w-[548px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Heading>🕓 Defina seus horários!</Heading>
          <Text>
            Defina a duração de cada agendamento e o intervalo de horários que
            você está disponível em cada dia da semana.
          </Text>
        </div>

        <Box
          as="form"
          onSubmit={handleSubmit(handleSetTimeIntervals)}
          className="flex-col"
        >
          <div className="mb-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Text as="label">Duração de cada agendamento (minutos)</Text>
              <Text as="span" size="sm" className="text-zinc-200">
                {meetDuration} min
              </Text>
            </div>

            <Slider
              value={[meetDuration]}
              onValueChange={(newValue) => {
                setValue('meetDuration', newValue[0])
              }}
              min={10}
              max={180}
              step={10}
            />
          </div>

          <div className="divide-y divide-zinc-700 rounded-md border border-zinc-700">
            {fields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Controller
                      name={`intervals.${index}.enabled`}
                      control={control}
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
                    <Text as="span" className="text-sm text-zinc-100">
                      {weekDays[field.weekDay]}
                    </Text>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      type="time"
                      step={60}
                      min="00:00"
                      max="23:59"
                      {...register(`intervals.${index}.startTime`)}
                      disabled={intervals[index].enabled === false}
                    />

                    <Input
                      type="time"
                      step={60}
                      min={intervals[index].startTime}
                      max="23:59"
                      {...register(`intervals.${index}.endTime`)}
                      disabled={intervals[index].enabled === false}
                      isInvalid={isInvalidEndTime(
                        intervals[index].startTime,
                        intervals[index].endTime,
                      )}
                    />

                    <div className="sr-only">
                      <Input
                        value={meetDuration}
                        type="number"
                        {...register(`intervals.${index}.dayMeetDuration`)}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Button
            icon={CaretRight}
            disabled={
              isSubmitting || intervals.every((interval) => !interval.enabled)
            }
          >
            Próximo passo
          </Button>
        </Box>
      </div>
    </div>
  )
}

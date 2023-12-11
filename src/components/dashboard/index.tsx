import { ReactNode } from 'react'
import { Header } from '../header'
import { Navbar } from '../navbar'
import { Heading } from '../ui/Heading'
import { Text } from '../ui/Text'
import schedule from '@/pages/api/users/[username]/schedule'

interface DashboardProps {
  headerTitle: string
  heading?: string
  text?: string
  action?: ReactNode
  children: ReactNode
  asSchedule?: boolean
  avatarUrl?: string
  name?: string
  tag?: string
  bio?: string
}

export function DashboardLayout({
  headerTitle,
  heading,
  asSchedule = false,
  avatarUrl,
  name,
  tag,
  bio,
  text,
  action,
  children,
}: DashboardProps) {
  return (
    <div className="grid h-screen grid-cols-dashboard grid-rows-dashboard">
      <Navbar />

      <Header title={headerTitle} />

      <div className="col-start-2 flex flex-col gap-6 pl-9 pt-6">
        <div className="flex items-center justify-between pr-9">
          <div className="flex flex-col gap-2">
            {asSchedule ? (
              <>
                <div className="flex items-center gap-2 divide-x divide-zinc-200">
                  <Heading>{name}</Heading>
                  <Text size="sm" className="pl-2 text-zinc-200">
                    @{tag}
                  </Text>
                </div>

                <Text>{bio}</Text>
              </>
            ) : (
              <>
                <Heading>{heading}</Heading>
                <Text>{text}</Text>
              </>
            )}
          </div>

          <div>{action}</div>
        </div>

        <div className="flex flex-1 flex-col gap-12 rounded-tl-md bg-zinc-800 px-12 py-8">
          {children}
        </div>
      </div>
    </div>
  )
}

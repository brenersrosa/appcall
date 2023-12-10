import { ReactNode } from 'react'
import { Header } from '../header'
import { Navbar } from '../navbar'
import { Heading } from '../ui/Heading'
import { Text } from '../ui/Text'

interface DashboardProps {
  headerTitle: string
  heading: string
  tag: string
  text: string
  action?: ReactNode
  children: ReactNode
}

export function DashboardLayout({
  headerTitle,
  heading,
  tag,
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
            <div className="flex items-center gap-2 divide-x divide-zinc-200">
              <Heading>{heading}</Heading>
              {tag !== '' && (
                <Text size="sm" className="pl-2 text-zinc-200">
                  @{tag}
                </Text>
              )}
            </div>
            <Text>{text}</Text>
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

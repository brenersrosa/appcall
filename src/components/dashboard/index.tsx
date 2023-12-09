import { ReactNode } from 'react'
import { Header } from '../header'
import { Navbar } from '../navbar'
import { Heading } from '../ui/Heading'
import { Text } from '../ui/Text'

interface DashboardProps {
  headerTitle: string
  heading: string
  text: string
  children: ReactNode
}

export function DashboardLayout({
  headerTitle,
  heading,
  text,
  children,
}: DashboardProps) {
  return (
    <div className="grid h-screen grid-cols-dashboard grid-rows-dashboard">
      <Navbar />

      <Header title={headerTitle} />

      <div className="col-start-2 flex flex-col gap-6 pl-9 pt-6">
        <div className="flex flex-col gap-2 pr-9">
          <Heading>{heading}</Heading>
          <Text>{text}</Text>
        </div>

        <div className="flex flex-1 flex-col gap-12 rounded-tl-md bg-zinc-800 px-12 py-8">
          {children}
        </div>
      </div>
    </div>
  )
}

import { Bell, Checks } from 'phosphor-react'
import { Heading } from '../ui/Heading'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu'
import { Text } from '../ui/Text'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '../ui/Button'
import { Widget } from '../ui/Notification/Widget'

export function Header() {
  const session = useSession()

  return (
    <div className="mx-9 flex h-[120px] items-center justify-between">
      <Heading>👋 Bem-vindo!</Heading>

      <div className="flex items-center justify-center gap-2 divide-x divide-zinc-600">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Bell className="h-5 w-5 text-zinc-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <Widget />
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center justify-center gap-2 pl-2">
          <Text>{session.data?.user.name}</Text>

          <Image
            src={session.data?.user.avatar_url || ''}
            alt={session.data?.user.name || 'User profile image.'}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  )
}

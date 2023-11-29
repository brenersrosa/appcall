import { Bell, Checks, SignOut } from 'phosphor-react'
import { Heading } from '../ui/Heading'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '../ui/DropdownMenu'
import { Text } from '../ui/Text'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
// import { Button } from '../ui/Button'
// import { Widget } from '../ui/Notification/Widget'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const session = useSession()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()

    await router.push('/')
  }

  return (
    <div className="mx-9 flex h-[120px] items-center justify-between border-b border-zinc-600">
      <Heading>{title}</Heading>

      <div className="flex items-center justify-center gap-2 divide-x divide-zinc-600">
        {/* <DropdownMenu>
          <DropdownMenuTrigger>
            <Bell className="h-5 w-5 text-zinc-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <Widget />
          </DropdownMenuContent>
        </DropdownMenu> */}

        <div className="flex items-center gap-2 divide-x divide-zinc-400">
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

          <button onClick={handleSignOut} className="pl-2">
            <SignOut className="h-5 w-5 text-zinc-200" />
          </button>
        </div>
      </div>
    </div>
  )
}

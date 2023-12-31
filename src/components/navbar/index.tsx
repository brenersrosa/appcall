import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { CalendarPlus, QrCode, SquaresFour, UsersThree } from 'phosphor-react'

import logoImg from '@/assets/logo.svg'

import { NavMenu } from './nav-menu'

export function Navbar() {
  const session = useSession()
  const username = session.data?.user.username

  const isScheduleSelected = useRouter().asPath.startsWith(`/schedule`)

  return (
    <div className="row-span-2 w-52 divide-y divide-zinc-600 px-6">
      <div className="flex h-[120px] items-center justify-center">
        <Image src={logoImg} alt="appCall logo" width={120} height={35} />
      </div>

      <div className="flex flex-col gap-4 py-6">
        <NavMenu
          url={`/dashboard/${username}`}
          icon={SquaresFour}
          title="Dashboard"
        />

        <NavMenu
          url={`/scheduling`}
          icon={CalendarPlus}
          title="Agendar"
          selected={isScheduleSelected}
        />

        <NavMenu
          url={`/friends/${username}`}
          icon={UsersThree}
          title="Amigos"
        />

        <NavMenu url={`/share-profile`} icon={QrCode} title="Compartilhar" />
      </div>
    </div>
  )
}

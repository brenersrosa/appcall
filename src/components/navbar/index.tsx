import { useSession } from 'next-auth/react'
import Image from 'next/image'
import {
  CalendarPlus,
  MagnifyingGlass,
  SquaresFour,
  UsersThree,
} from 'phosphor-react'

import { NavMenu } from './NavMenu'

import logoImg from '@/assets/logo.svg'

export function Navbar() {
  const session = useSession()
  const username = session.data?.user.username

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

        <NavMenu url={`/new-appointment`} icon={CalendarPlus} title="Agendar" />

        <NavMenu
          url={`/friends/${username}`}
          icon={UsersThree}
          title="Amigos"
        />

        <NavMenu url={`/search`} icon={MagnifyingGlass} title="Buscar" />
      </div>
    </div>
  )
}

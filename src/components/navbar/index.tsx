import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { SquaresFour, UsersThree } from 'phosphor-react'

import { NavMenu } from './NavMenu'

import logoImg from '@/assets/logo.svg'

export function Navbar() {
  const session = useSession()
  const username = session.data?.user.username

  return (
    <div className="h-full min-h-screen w-52 divide-y divide-zinc-600 px-6">
      <div className="flex h-[120px] flex-1 items-center justify-center">
        <Image src={logoImg} alt="appCall logo" width={120} height={35} />
      </div>

      <div className="flex flex-col gap-4 py-6">
        <NavMenu
          url={`/dashboard/${username}`}
          icon={SquaresFour}
          title="Dashboard"
        />

        <NavMenu
          url={`/friends/${username}`}
          icon={UsersThree}
          title="Amigos"
        />
      </div>
    </div>
  )
}

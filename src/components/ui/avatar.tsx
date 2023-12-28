import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'

interface AvatarProps {
  name?: string
  avatarUrl?: string
}

export function Avatar({ name = 'User', avatarUrl }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-700">
      {avatarUrl !== undefined ? (
        name && avatarUrl === '' ? (
          <span className="text-2xl font-bold text-zinc-400">{initials}</span>
        ) : (
          <Image
            src={avatarUrl}
            alt="Profile image"
            className="h-16 w-16 rounded-full"
            width={64}
            height={64}
          />
        )
      ) : (
        <Skeleton circle height={64} width={64} />
      )}
    </div>
  )
}

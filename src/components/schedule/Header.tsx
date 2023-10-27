import { Avatar } from '../ui/Avatar'

interface ScheduleHeaderProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export function Header({ user }: ScheduleHeaderProps) {
  return (
    <div className="flex flex-col items-center">
      <Avatar name={user.name} avatarUrl={user.avatarUrl} />

      <strong className="mt-2 text-2xl font-bold leading-relaxed text-zinc-50">
        {user.name}
      </strong>

      <span className="text-zinc-400">{user.bio}</span>
    </div>
  )
}

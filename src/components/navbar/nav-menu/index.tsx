import { cva, VariantProps } from 'class-variance-authority'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import { cn } from '@/lib/utils'

const linkVariants = cva(
  'flex w-full items-center justify-start gap-2 rounded-md p-4 transition-colors font-semibold',
)

export interface NavMenuProps
  extends Omit<LinkProps, 'href'>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean
  url: string
  icon: React.ElementType
  title: string
  className?: string
  selected?: boolean
}

const NavMenu = React.forwardRef<HTMLAnchorElement, NavMenuProps>(
  (
    { className, icon: Icon = () => null, url, title, selected, ...props },
    ref,
  ) => {
    const { asPath } = useRouter()

    const variantOption =
      asPath === url || !!selected
        ? 'bg-violet-200 text-violet-800 hover:bg-violet-300'
        : 'text-zinc-400 hover:bg-zinc-800'

    return (
      <Link
        href={url}
        className={cn(linkVariants({ className }), variantOption)}
        ref={ref}
        {...props}
      >
        <Icon className="h-5 w-5" />
        {title}
      </Link>
    )
  },
)

NavMenu.displayName = 'NavMenu'

export { NavMenu, linkVariants }

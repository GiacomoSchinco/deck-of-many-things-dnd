'use client'

import Link from 'next/link'
import { useIsAdmin } from '@/hooks/useAuth'
import Loading from '@/components/custom/Loading'
import { buttonVariants } from '@/components/ui/button-variants'
import { Surface } from '@/components/ui/surface'
import { cn } from '@/lib/utils'
import { ShieldX } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: isAdmin, isLoading } = useIsAdmin()

  if (isLoading) return <Loading />

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Surface level={2} className="max-w-md p-8 text-center">
          <span className="mx-auto mb-4 grid place-items-center w-14 h-14 rounded-full surface-well text-destructive">
            <ShieldX className="w-7 h-7" aria-hidden="true" />
          </span>
          <h2 className="text-2xl font-serif text-ink-strong mb-4">Accesso Negato</h2>
          <p className="text-ink-muted mb-6">Solo gli amministratori possono accedere a questa area</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className={cn(buttonVariants({ variant: 'outline' }))}>
              Vai al Login
            </Link>
            <Link href="/dashboard" className={cn(buttonVariants())}>
              Torna alla Dashboard
            </Link>
          </div>
        </Surface>
      </div>
    )
  }

  return <>{children}</>
}

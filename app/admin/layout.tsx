'use client'

import Link from 'next/link'
import { useIsAdmin } from '@/hooks/useAuth'
import Loading from '@/components/custom/Loading'
import { Button } from '@/components/ui/button'
import { ShieldX } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: isAdmin, isLoading } = useIsAdmin()

  if (isLoading) return <Loading />

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <ShieldX className="w-12 h-12 text-red-700 mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-amber-900 mb-4">Accesso Negato</h2>
          <p className="text-amber-700 mb-6">Solo gli amministratori possono accedere a questa area</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login">
              <Button variant="outline" className="border-amber-700 text-amber-700">Vai al Login</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-amber-700 hover:bg-amber-800">Torna alla Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

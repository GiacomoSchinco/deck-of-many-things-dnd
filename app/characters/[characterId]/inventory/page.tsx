"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PackageOpen } from 'lucide-react'
import Loading from '@/components/custom/Loading'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { buttonVariants } from '@/components/ui/button-variants'
import { EmptyState } from '@/components/ui/empty-state'
import { useInventory } from '@/hooks/queries/useInventory'
import ItemCard from '@/components/custom/ItemCard'
import { cn } from '@/lib/utils'
import type { Item } from '@/types/item'

export default function InventoryPage() {
  const params = useParams()
  const characterId = params.characterId as string | undefined

  const { data, isLoading, error } = useInventory(characterId)

  if (isLoading) return <Loading />

  const items = data?.items ?? []

  return (
    <PageWrapper
      title="Inventario"
      subtitle="Ogni oggetto che l'eroe porta con sé"
      icon={<PackageOpen className="w-6 h-6" />}
      maxWidth="xl"
      action={
        <Link
          href={`/characters/${characterId}`}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          <ArrowLeft className="w-4 h-4" />
          Indietro
        </Link>
      }
    >
      {error ? (
        <EmptyState
          icon={PackageOpen}
          title="Impossibile caricare l'inventario"
          description="Riprova tra qualche istante o torna alla scheda del personaggio."
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="Inventario vuoto"
          description="Le borse dell'eroe sono ancora leggere: aggiungi equipaggiamento dalla scheda."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <ItemCard key={it.id} item={it as unknown as Item} showActions />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}

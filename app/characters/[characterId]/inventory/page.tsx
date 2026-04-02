"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Loading from '@/components/custom/Loading'
import { Button } from '@/components/ui/button'
import { useInventory } from '@/hooks/queries/useInventory'
import ItemCard from '@/components/custom/ItemCard'
import type { Item } from '@/types/item'

export default function InventoryPage() {
  const params = useParams()
  const characterId = params.characterId as string | undefined

  const { data, isLoading, error } = useInventory(characterId)

  if (isLoading) return <Loading />
  if (error) return <div className="container mx-auto p-4">Errore caricamento inventario</div>
  const items = data?.items ?? []

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-serif font-bold">Inventario</h1>
        <div className="flex gap-2">
          <Link href={`/characters/${characterId}`}>
            <Button variant="outline" size="sm">Indietro</Button>
          </Link>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="text-center text-amber-700">Inventario vuoto</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <ItemCard key={it.id} item={it as unknown as Item} showActions />
          ))}
        </div>
      )}
    </div>
    
  )
}

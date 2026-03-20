"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Loading from '@/components/custom/Loading'
import { Button } from '@/components/ui/button'
import { useInventory } from '@/hooks/queries/useInventory'

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
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left text-sm text-amber-700 border-b">
                <th className="py-2">Nome</th>
                <th className="py-2">Tipo</th>
                <th className="py-2">Q.tà</th>
                <th className="py-2">Peso</th>
                <th className="py-2">Equip.</th>
                <th className="py-2">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b last:border-b-0">
                  <td className="py-2">{it.item_name}</td>
                  <td className="py-2">{it.item_type ?? '—'}</td>
                  <td className="py-2">{it.quantity}</td>
                  <td className="py-2">{it.weight}</td>
                  <td className="py-2">{it.equipped ? 'Sì' : 'No'}</td>
                  <td className="py-2">
                    <Link href={`/characters/${characterId}/inventory/${it.id}`}>
                      <Button variant="ghost" size="sm">Apri</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

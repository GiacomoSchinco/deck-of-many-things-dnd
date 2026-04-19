"use client";
import AncientContainer from "@/components/custom/AncientContainer";
import DataTable from "@/components/custom/DataTable";
import Loading from "@/components/custom/Loading";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useItems } from "@/hooks/queries/useItems";
import type { Item } from '@/types/item';
import { getItalianItemType, getItalianCurrency } from "@/lib/utils/nameMappers";
import { Plus, Sword, Shield, Package, FlaskConical, ArrowUpDown, Wrench, Coins } from "lucide-react";
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function ItemsPage() {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [typeQuery, setTypeQuery] = useState('')
    const itemTypeOptions = [
        { value: 'weapon', label: 'Arma', icon: Sword },
        { value: 'armor', label: 'Armatura', icon: Shield },
        { value: 'gear', label: 'Equipaggiamento', icon: Package },
        { value: 'consumable', label: 'Consumabile', icon: FlaskConical },
        { value: 'ammunition', label: 'Munizione', icon: ArrowUpDown },
        { value: 'tool', label: 'Attrezzo', icon: Wrench },
        { value: 'currency', label: 'Moneta', icon: Coins },
    ] as const
    const [debouncedFilters, setDebouncedFilters] = useState<{ search?: string; type?: string }>({})

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedFilters({
                search: query?.trim() ? query.trim() : undefined,
                type: typeQuery?.trim() ? typeQuery.trim() : undefined,
            })
        }, 300)
        return () => clearTimeout(t)
    }, [query, typeQuery])

    const { data: items, isLoading, isError } = useItems(debouncedFilters);
    if (isLoading) return <Loading />;
    if (isError) return <div className="text-center text-red-600 p-8">Errore nel caricamento degli oggetti.</div>;
    return (
        <AncientContainer
            title="Catalogo Oggetti"
            subtitle="Esplora il vasto catalogo di oggetti magici e non, pronti per essere aggiunti al tuo inventario o utilizzati nelle tue avventure!"
            action={<Button
                onClick={() => router.push('/admin/items/create')}
                className="bg-amber-700 hover:bg-amber-800 text-white shadow-md hover:shadow-lg transition-all"
            >
                <Plus className="w-4 h-4 mr-2" />
                Nuovo Oggetto
            </Button>}
            showDecorations={false}>

            <div className="mb-4">
                <div className="flex gap-2">
                    <Input placeholder="Cerca (nome/desc)" value={query} onChange={(e) => setQuery(e.target.value)} />
                    <Select value={typeQuery ?? ''} onValueChange={(v) => setTypeQuery(v || '')}>
                        <SelectTrigger className="w-56">
                            <SelectValue placeholder="Tipo (seleziona)">
                                <div className="flex items-center gap-2">
                                    {(() => {
                                        const sel = itemTypeOptions.find(t => t.value === typeQuery);
                                        if (!sel) return 'Tipo (seleziona)';
                                        const Icon = sel.icon;
                                        return (
                                            <>
                                                <Icon className="w-4 h-4" />
                                                <span>{sel.label}</span>
                                            </>
                                        )
                                    })()}
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="" label="Tutti">Tutti</SelectItem>
                            {itemTypeOptions.map(opt => {
                                const Icon = opt.icon;
                                return (
                                    <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4" />
                                            <span>{opt.label}</span>
                                        </div>
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DataTable
                initialData={(items ?? []) as unknown as Record<string, unknown>[]}
                visibleColumns={['id', 'name', 'type', 'weight', 'value']}
                labels={{ id: 'ID', name: 'Nome', type: 'Tipo', weight: 'Peso', value: 'Valore' }}
                customRenderers={{
                    type: (v) => getItalianItemType(String(v ?? '')),
                    value: (v, row) => {
                        const val = v ?? 0
                        const cur = String((row as unknown as Item)?.currency ?? '')
                        return `${val} ${getItalianCurrency(cur)}`
                    }
                }}
                onRowClick={(id) => router.push(`/admin/items/${id}`)}
                pagination
            />
        </AncientContainer>)
}
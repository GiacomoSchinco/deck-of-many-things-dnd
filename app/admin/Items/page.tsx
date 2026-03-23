"use client";
import AncientContainer from "@/components/custom/AncientContainer";
import DataTable from "@/components/custom/DataTable";
import Loading from "@/components/custom/Loading";
import { Button } from "@/components/ui/button";
import { useItems } from "@/hooks/queries/useItems";
import { getItalianItemType, getItalianCurrency } from "@/lib/utils/nameMappers";
import { Plus } from "lucide-react";
import { useRouter } from 'next/navigation'

export default function ItemsPage() {
    const router = useRouter()
    const { data: items, isLoading, isError } = useItems();
    if (isLoading) return <Loading />;
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
                        
            <DataTable
                initialData={items}
                visibleColumns={['id', 'name', 'type', 'weight', 'value']}
                labels={{ id: 'ID', name: 'Nome', type: 'Tipo', weight: 'Peso', value: 'Valore' }}
                customRenderers={{
                    type: (v) => getItalianItemType(String(v ?? '')),
                    value: (v, row) => {
                        const val = v ?? 0
                        const cur = String((row as any)?.currency ?? '')
                        return `${val} ${getItalianCurrency(cur)}`
                    }
                }}
                pagination
            />
        </AncientContainer>)
}
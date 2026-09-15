'use client';

import { use } from 'react';
import ItemForm from '@/components/custom/ItemForm';
import Loading from '@/components/custom/Loading';
import { useItem } from '@/hooks/queries/useItems';

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const itemId = parseInt(id, 10);
  const { data: item, isLoading, isError } = useItem(itemId);
  if (isLoading) return <Loading />;
  if (isError || !item) return <p className="text-red-500 p-8">Oggetto non trovato.</p>;

  return (
      <ItemForm mode= "edit" itemId={itemId} initialData={item} />
  );
}

interface EditEquipmentPresetPageProps {
  params: Promise<{ id: string }>
}

export default async function EditEquipmentPresetPage({ params }: EditEquipmentPresetPageProps) {
  const { id } = await params

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Modifica Equipment Preset</h1>
      <p className="mt-2 text-sm text-muted-foreground">Preset ID: {id}</p>
    </main>
  )
}

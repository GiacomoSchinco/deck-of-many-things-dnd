'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { EquipmentPreset } from '@/types/equipment'
import { usePresetForm } from '@/hooks/usePresetForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Save, Trash2, Copy, GripVertical, Package } from 'lucide-react'
import { getItalianClass } from '@/lib/utils/nameMappers'
import ItemRow from '@/components/custom/ItemRow'
import ChoiceGroup from '@/components/custom/ChoiceGroup'
import { useDeleteEquipmentPreset } from '@/hooks/mutations/useEquipmentPresetMutations'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { toast } from 'sonner'

interface Props {
  initialData?: EquipmentPreset
}

export default function CreateEquipmentPresetPage({ initialData }: Props) {
  const router = useRouter()
  const {
    preset,
    setPreset,
    classes,
    selectedClass,
    addItem,
    updateItem,
    removeItem,
    addChoice,
    updateChoice,
    removeChoice,
    addChoiceItem,
    updateChoiceItem,
    removeChoiceItem,
    handleSubmit,
  } = usePresetForm(initialData)

  const deletePreset = useDeleteEquipmentPreset()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [activeChoicePanels, setActiveChoicePanels] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Copia il preset
  const handleDuplicate = () => {
    const duplicated = {
      ...preset,
      name: `${preset.name} (copia)`,
      is_default: false,
      id: undefined,
    }
    sessionStorage.setItem('duplicate-preset', JSON.stringify(duplicated))
    router.push('/admin/equipment-presets/create')
    toast.success('Preset duplicato!')
  }

  // Salva con feedback
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await handleSubmit(e)
      toast.success(preset.id ? 'Preset aggiornato!' : 'Preset creato!')
    } catch (err) {
      console.error(err)
      toast.error('Errore durante il salvataggio')
    } finally {
      setIsSaving(false)
    }
  }

  // Delete handler for modal
  const handleDelete = async () => {
    if (!preset.id) return
    await deletePreset.mutateAsync(preset.id)
    setShowDeleteModal(false)
    router.push('/admin/equipment-presets')
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl">
      <div className="bg-gradient-to-br from-parchment-100 to-parchment-200 rounded-xl border-2 border-amber-900/30 shadow-xl overflow-hidden">
        {/* Header decorativo */}
        <div className="bg-amber-900/10 border-b border-amber-900/20 px-6 py-4">
          <h1 className="text-2xl fantasy-title flex items-center gap-2">
            {preset.id ? '✏️ Modifica Preset' : '✨ Nuovo Preset'}
            {preset.id && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                ID: {preset.id}
              </span>
            )}
          </h1>
            <p className="text-amber-600 text-sm mt-1">
            Configura l&apos;equipaggiamento iniziale per una classe
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-8">
          {/* === SEZIONE INFO BASE === */}
          <div className="fantasy-section p-5">
            <h2 className="text-lg fantasy-title mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-amber-600 rounded-full" />
              Informazioni Base
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="text-amber-800 font-medium">Nome del preset *</Label>
                <Input
                  value={preset.name}
                  onChange={(e) => setPreset((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Es. Equipaggiamento Guerriero"
                  className="mt-1.5 bg-white border-amber-300 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <Label className="text-amber-800 font-medium">Classe *</Label>
                <Select
                  value={preset.class_id}
                  onValueChange={(value: string | null) =>
                    setPreset((p) => ({ ...p, class_id: value ?? '' }))
                  }
                >
                  <SelectTrigger className="mt-1.5 bg-white border-amber-300">
                    <SelectValue>
                      {selectedClass ? getItalianClass(selectedClass.name) : 'Seleziona classe'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {classes?.map((cls) => (
                      <SelectItem key={cls.id} value={String(cls.id)}>
                        {getItalianClass(cls.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <Label className="text-amber-800 font-medium">Descrizione (opzionale)</Label>
              <Input
                value={preset.description}
                onChange={(e) => setPreset((p) => ({ ...p, description: e.target.value }))}
                placeholder="Breve descrizione del preset..."
                className="mt-1.5 bg-white border-amber-300"
              />
            </div>

            <div className="flex items-center space-x-2 mt-4 pt-2 border-t border-amber-200/50">
              <Checkbox
                id="is_default"
                checked={preset.is_default}
                onCheckedChange={(checked) => setPreset((p) => ({ ...p, is_default: checked as boolean }))}
              />
              <Label htmlFor="is_default" className="cursor-pointer text-amber-700">
                ⭐ Imposta come preset predefinito per questa classe
              </Label>
            </div>
          </div>

          {/* === SEZIONE OGGETTI FISSI === */}
          <div className="fantasy-section p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg fantasy-title flex items-center gap-2">
                <span className="w-1 h-6 bg-amber-600 rounded-full" />
                📦 Oggetti Fissi
              </h2>
              <Button 
                type="button" 
                onClick={addItem} 
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Aggiungi
              </Button>
            </div>
            <p className="text-xs text-amber-500 mb-3">Tutti i personaggi ricevono questi oggetti</p>
            
            <div className="space-y-3">
              {preset.items.map((item, index) => (
                <ItemRow
                  key={item.localKey}
                  value={item.item_id}
                  name={item.name}
                  quantity={item.quantity}
                  onSelect={(selected) => {
                    updateItem(index, 'item_id', selected.id)
                    updateItem(index, 'name', selected.name)
                  }}
                  onQuantityChange={(q) => updateItem(index, 'quantity', q)}
                  onRemove={() => removeItem(index)}
                  placeholder="Seleziona oggetto"
                  showDetails={false}
                  buttonVariant="compact"
                />
              ))}
              {preset.items.length === 0 && (
                <div className="text-center py-6 text-amber-400 border-2 border-dashed border-amber-200 rounded-lg">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nessun oggetto fisso. Clicca &quot;Aggiungi&quot; per iniziare.</p>
                </div>
              )}
            </div>
          </div>

          {/* === SEZIONE SCELTE (ACCORDION) === */}
          <div className="fantasy-section p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg fantasy-title flex items-center gap-2">
                <span className="w-1 h-6 bg-amber-600 rounded-full" />
                🎲 Scelte
              </h2>
              <Button 
                type="button" 
                onClick={addChoice} 
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nuovo Gruppo
              </Button>
            </div>
            <p className="text-xs text-amber-500 mb-3">L&apos;utente potrà scegliere tra queste opzioni</p>

            <Accordion
              value={activeChoicePanels}
              onValueChange={setActiveChoicePanels}
              className="space-y-3"
            >
              {preset.choices.map((choice, cIndex) => (
                <AccordionItem 
                  key={choice.localKey} 
                  value={choice.localKey}
                  className="border border-amber-200 rounded-lg overflow-hidden bg-white"
                >
                  <div className="flex items-center justify-between bg-amber-50/30 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-amber-400 cursor-move" />
                      <AccordionTrigger className="hover:no-underline py-2 text-amber-800 font-medium">
                        {choice.description || `Gruppo ${cIndex + 1}`}
                      </AccordionTrigger>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChoice(cIndex)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <AccordionContent className="p-4">
                    <ChoiceGroup
                      choice={choice}
                      onChangeChoice={(field, value) => updateChoice(cIndex, field, value)}
                      onAddItem={() => addChoiceItem(cIndex)}
                      onUpdateItem={(itemIndex, field, value) => updateChoiceItem(cIndex, itemIndex, field, value)}
                      onRemoveItem={(itemIndex) => removeChoiceItem(cIndex, itemIndex)}
                      onRemoveChoice={() => removeChoice(cIndex)}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {preset.choices.length === 0 && (
              <div className="text-center py-6 text-amber-400 border-2 border-dashed border-amber-200 rounded-lg">
                <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nessun gruppo di scelta. Clicca &quot;Nuovo Gruppo&quot; per iniziare.</p>
              </div>
            )}
          </div>

          {/* === AZIONI === */}
          <div className="flex justify-between items-center pt-4 border-t border-amber-200">
            <div>
              {preset.id && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDuplicate}
                    className="border-amber-400 text-amber-700 hover:bg-amber-100"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplica
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={deletePreset.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deletePreset.isPending ? 'Eliminando...' : 'Elimina'}
                  </Button>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/equipment-presets')}
                className="border-amber-400 text-amber-700"
              >
                Annulla
              </Button>
              <Button 
                type="submit" 
                className="bg-amber-700 hover:bg-amber-800 text-white px-6"
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvataggio...' : 'Salva Preset'}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Modale conferma eliminazione */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-sm bg-parchment-100 border-2 border-amber-900/30">
          <DialogHeader>
            <DialogTitle className="text-red-700 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Elimina Preset
            </DialogTitle>
            <DialogDescription className="text-amber-700">
              Sei sicuro di voler eliminare il preset <strong className="text-amber-900">&ldquo;{preset.name}&rdquo;</strong>?
              Questa operazione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deletePreset.isPending}
              className="border-amber-400"
            >
              Annulla
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={deletePreset.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deletePreset.isPending ? 'Eliminando...' : 'Elimina'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
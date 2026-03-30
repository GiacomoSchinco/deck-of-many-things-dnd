// components/item/ItemForm.tsx (versione con danno selezionabile)
'use client';

import { useState, useEffect, type ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateItem, useUpdateItem, useDeleteItem } from '@/hooks/mutations/useItemMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Save, 
  X, 
  Trash2,
  Sword,
  Shield,
  FlaskConical,
  Wrench,
  Coins,
  ArrowUpDown,
  Package,
  Plus,
  Trash,
  Dice6
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AncientContainer, { SimpleAncientContainer } from '@/components/custom/AncientContainer';
import { AntiqueButton } from '@/components/custom/AntiqueButton';
import { getItalianItemType, getItalianRarity, getItalianCurrency } from '@/lib/utils/nameMappers';
import type { 
  CreateItemDTO, 
  ItemType, 
  Rarity, 
  CurrencyType,
  WeaponProperties,
  ItemProperties,
  ArmorProperties,
  ConsumableProperties,
  AmmunitionProperties,
  ToolProperties,
  GearProperties,
  DamageType
} from '@/types/item';
import { Separator } from '@base-ui/react';

type ItemFormProps = {
  mode?: 'create' | 'edit' | 'view';
  itemId?: number;
  initialData?: Partial<CreateItemDTO>;
  onSubmit?: (data: CreateItemDTO) => Promise<void>;
  onDelete?: () => Promise<void>;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
};

const itemTypes: { value: ItemType; label: string; icon: ComponentType<Record<string, unknown>> }[] = [
  { value: 'weapon',     label: getItalianItemType('weapon'),     icon: Sword },
  { value: 'armor',      label: getItalianItemType('armor'),      icon: Shield },
  { value: 'gear',       label: getItalianItemType('gear'),       icon: Package },
  { value: 'consumable', label: getItalianItemType('consumable'), icon: FlaskConical },
  { value: 'ammunition', label: getItalianItemType('ammunition'), icon: ArrowUpDown },
  { value: 'tool',       label: getItalianItemType('tool'),       icon: Wrench },
  { value: 'currency',   label: getItalianItemType('currency'),   icon: Coins },
];

const rarities: { value: Rarity; label: string; color: string }[] = [
  { value: 'common',    label: getItalianRarity('common'),    color: 'text-gray-500' },
  { value: 'uncommon',  label: getItalianRarity('uncommon'),  color: 'text-green-600' },
  { value: 'rare',      label: getItalianRarity('rare'),      color: 'text-blue-600' },
  { value: 'very rare', label: getItalianRarity('very rare'), color: 'text-purple-600' },
  { value: 'legendary', label: getItalianRarity('legendary'), color: 'text-orange-600' },
  { value: 'artifact',  label: getItalianRarity('artifact'),  color: 'text-red-600' },
];

const currencies: { value: CurrencyType; label: string; symbol: string }[] = [
  { value: 'po', label: getItalianCurrency('po'), symbol: '🪙' },
  { value: 'pa', label: getItalianCurrency('pa'), symbol: '💎' },
  { value: 'pr', label: getItalianCurrency('pr'), symbol: '✨' },
  { value: 'pe', label: getItalianCurrency('pe'), symbol: '🥈' },
  { value: 'mo', label: getItalianCurrency('mo'), symbol: '🥉' },
];

// ===========================================
// DATI PER IL DANNO
// ===========================================

const damageTypes: { value: DamageType; label: string; icon: string }[] = [
  { value: 'tagliente', label: 'Tagliente', icon: '⚔️' },
  { value: 'perforante', label: 'Perforante', icon: '🏹' },
  { value: 'contundente', label: 'Contundente', icon: '🔨' },
  { value: 'acido', label: 'Acido', icon: '🧪' },
  { value: 'freddo', label: 'Freddo', icon: '❄️' },
  { value: 'fuoco', label: 'Fuoco', icon: '🔥' },
  { value: 'fulmine', label: 'Fulmine', icon: '⚡' },
  { value: 'necrotico', label: 'Necrotico', icon: '💀' },
  { value: 'psichico', label: 'Psichico', icon: '🧠' },
  { value: 'radioso', label: 'Radioso', icon: '✨' },
  { value: 'veleno', label: 'Veleno', icon: '☠️' },
  { value: 'tuono', label: 'Tuono', icon: '🌩️' },
  { value: 'forza', label: 'Forza', icon: '💪' },
];

// Dadi predefiniti
const diceOptions = [
  { value: '1d4', label: '1d4', icon: '🎲' },
  { value: '1d6', label: '1d6', icon: '🎲' },
  { value: '1d8', label: '1d8', icon: '🎲' },
  { value: '1d10', label: '1d10', icon: '🎲' },
  { value: '1d12', label: '1d12', icon: '🎲' },
  { value: '2d4', label: '2d4', icon: '🎲' },
  { value: '2d6', label: '2d6', icon: '🎲' },
  { value: '2d8', label: '2d8', icon: '🎲' },
  { value: '3d6', label: '3d6', icon: '🎲' },
  { value: '4d6', label: '4d6', icon: '🎲' },
];

const versatileDiceOptions = [
  { value: '1d8', label: '1d8', icon: '🎲' },
  { value: '1d10', label: '1d10', icon: '🎲' },
  { value: '1d12', label: '1d12', icon: '🎲' },
  { value: '2d6', label: '2d6', icon: '🎲' },
];

const weaponPropertiesList = [
  { value: 'accurata', label: 'Accurata', description: '+1 al tiro per colpire' },
  { value: 'leggera', label: 'Leggera', description: 'Può essere impugnata con due armi' },
  { value: 'lancio', label: 'Lancio', description: 'Può essere lanciata' },
  { value: 'versatile', label: 'Versatile', description: 'Può essere usata a due mani per danno maggiore' },
  { value: 'pesante', label: 'Pesante', description: 'Richiede Forza 13 o superiore' },
  { value: 'a due mani', label: 'A due mani', description: 'Richiede entrambe le mani' },
  { value: 'portata', label: 'Portata', description: 'Colpisce a 3 metri di distanza' },
  { value: 'carica', label: 'Carica', description: 'Richiede tempo per ricaricare' },
  { value: 'munizioni', label: 'Munizioni', description: 'Richiede munizioni' },
];

export default function ItemForm({
  mode = 'create',
  itemId,
  initialData = {},
  onSubmit,
  onDelete,
  isLoading: isLoadingProp = false,
  title = mode === 'edit' ? 'Modifica Oggetto' : 'Nuovo Oggetto',
  subtitle = mode === 'edit' ? 'Modifica i dettagli dell\'oggetto' : 'Crea o modifica un oggetto per il gioco',
}: ItemFormProps) {
  const router = useRouter();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const isLoading = isLoadingProp || createItem.isPending || updateItem.isPending || deleteItem.isPending;
  const [selectedType, setSelectedType] = useState<ItemType>(initialData.type || 'gear');
  const [formData, setFormData] = useState<CreateItemDTO>({
    name: '',
    type: 'gear',
    weight: 0,
    value: 0,
    currency: 'po',
    rarity: 'common',
    requires_attunement: false,
    category: null,
    description: null,
    properties: null,
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isView = mode === 'view';

  useEffect(() => {
    setFormData(prev => ({ ...prev, type: selectedType }));
  }, [selectedType]);

  // Gestisce le proprietà in modo strutturato
  const updateProperties = (updates: Partial<ItemProperties>) => {
    setFormData(prev => {
      const newProps = ({ ...(prev.properties ?? {}), ...updates }) as ItemProperties;
      return { ...prev, properties: newProps };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
    }
    
    if (formData.weight < 0) {
      newErrors.weight = 'Il peso non può essere negativo';
    }
    
    if (formData.value < 0) {
      newErrors.value = 'Il valore non può essere negativo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (onSubmit) {
      await onSubmit(formData);
      return;
    }

    if (mode === 'edit' && itemId) {
      updateItem.mutate(
        { id: itemId, data: { ...formData, id: itemId } },
        {
          onSuccess: () => {
            toast.success('Oggetto aggiornato!');
            router.push('/admin/items');
          },
          onError: (err) => toast.error(err instanceof Error ? err.message : 'Errore aggiornamento'),
        }
      );
    } else {
      createItem.mutate(formData, {
        onSuccess: () => {
          toast.success('Oggetto creato!');
          router.push('/admin/items');
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : 'Errore creazione'),
      });
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete();
      return;
    }
    if (itemId) {
      deleteItem.mutate(itemId, {
        onSuccess: () => {
          toast.success('Oggetto eliminato!');
          router.push('/admin/items');
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : 'Errore eliminazione'),
      });
    }
  };

  // ===========================================
  // RENDER DELLE PROPRIETÀ PER TIPO
  // ===========================================

  const renderWeaponProperties = () => {
    const props = formData.properties as WeaponProperties || { itemType: 'weapon' };
    const isVersatile = props.properties?.includes('versatile');
    
    return (
      <>
        <hr className="border-t border-gray-200 my-4" />
        <div className="pt-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <Sword className="w-4 h-4" />
            Proprietà dell&apos;Arma
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Dado Danno */}
            <div>
              <Label className="flex items-center gap-2">
                <Dice6 className="w-4 h-4" />
                Dado Danno
              </Label>
              <Select
                value={props.damage ?? ''}
                onValueChange={(value) => updateProperties({ damage: value ?? '' })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleziona dado">
                    {props.damage || 'Seleziona dado'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {diceOptions.map(dice => (
                    <SelectItem key={dice.value} value={dice.value} label={dice.value}>
                      <div className="flex items-center gap-2">
                        <span>{dice.icon}</span>
                        <span className="font-mono">{dice.value}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Tipo Danno */}
            <div>
              <Label>Tipo Danno</Label>
              <Select
                value={props.damageType ?? ''}
                onValueChange={(value) => updateProperties({ damageType: value as DamageType })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleziona tipo">
                    {damageTypes.find(t => t.value === props.damageType)?.label || 'Seleziona tipo'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {damageTypes.map(type => (
                    <SelectItem key={type.value} value={type.value} label={type.label}>
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Statistica per il Danno */}
          <div>
            <Label className="flex items-center gap-2">
              Statistica per il Danno
              <span className="text-xs font-normal text-gray-400">(opzionale)</span>
            </Label>
            <Select
              value={props.damageAbility ?? ''}
              onValueChange={(value) => updateProperties({ damageAbility: value ? (value as 'strength' | 'dexterity') : null })}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Nessuna (usa bonus proficiency)">
                  {props.damageAbility === 'strength' ? '💪 Forza (FOR)' :
                   props.damageAbility === 'dexterity' ? '🤸 Destrezza (DES)' :
                   'Nessuna (usa bonus proficiency)'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" label="Nessuna">
                  <span className="text-gray-500">Nessuna (usa bonus proficiency)</span>
                </SelectItem>
                <SelectItem value="strength" label="Forza (FOR)">
                  <div className="flex items-center gap-2">
                    <span>💪</span>
                    <span>Forza (FOR)</span>
                  </div>
                </SelectItem>
                <SelectItem value="dexterity" label="Destrezza (DES)">
                  <div className="flex items-center gap-2">
                    <span>🤸</span>
                    <span>Destrezza (DES)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Danni Aggiuntivi */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center gap-2">
                Danni Aggiuntivi
                <span className="text-xs font-normal text-gray-400">(es. +1d6 fuoco magico)</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-xs"
                onClick={() => {
                  const current = props.extraDamage || [];
                  updateProperties({ extraDamage: [...current, { dice: '1d6', type: 'fuoco' as DamageType }] });
                }}
              >
                <Plus className="w-3 h-3" />
                Aggiungi
              </Button>
            </div>
            {(props.extraDamage || []).length === 0 ? (
              <p className="text-xs text-gray-400 py-1">Nessun danno aggiuntivo</p>
            ) : (
              <div className="space-y-2">
                {(props.extraDamage || []).map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Select
                      value={entry.dice ?? ''}
                      onValueChange={(value) => {
                        const updated = (props.extraDamage || []).map((e, i) =>
                          i === idx ? { ...e, dice: value ?? '1d6' } : e
                        );
                        updateProperties({ extraDamage: updated });
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue>
                          {entry.dice || 'Dado'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {diceOptions.map(dice => (
                          <SelectItem key={dice.value} value={dice.value} label={dice.value}>
                            <div className="flex items-center gap-2">
                              <span>{dice.icon}</span>
                              <span className="font-mono">{dice.value}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={entry.type ?? ''}
                      onValueChange={(value) => {
                        const updated = (props.extraDamage || []).map((e, i) =>
                          i === idx ? { ...e, type: value as DamageType } : e
                        );
                        updateProperties({ extraDamage: updated });
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue>
                          {damageTypes.find(t => t.value === entry.type)?.label || 'Tipo'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {damageTypes.map(type => (
                          <SelectItem key={type.value} value={type.value} label={type.label}>
                            <div className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                      onClick={() => {
                        const updated = (props.extraDamage || []).filter((_, i) => i !== idx);
                        updateProperties({ extraDamage: updated });
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danno Versatile (condizionale) */}
          {isVersatile && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Danno Versatile</Label>
                <Select
                  value={props.versatileDamage ?? ''}
                  onValueChange={(value) => updateProperties({ versatileDamage: value ?? '' })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleziona dado" />
                  </SelectTrigger>
                  <SelectContent>
                    {versatileDiceOptions.map(dice => (
                      <SelectItem key={dice.value} value={dice.value}>
                        <div className="flex items-center gap-2">
                          <span>{dice.icon}</span>
                          <span className="font-mono">{dice.value}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-gray-500 flex items-end pb-2">
                Quando usata a due mani
              </div>
            </div>
          )}

          {/* Proprietà arma (checkboxes con descrizione) */}
          <div>
            <Label>Proprietà</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-1">
              {weaponPropertiesList.map(prop => (
                <label key={prop.value} className="flex items-start gap-2 text-sm p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <Checkbox
                    checked={props.properties?.includes(prop.value) ?? false}
                    onCheckedChange={(checked) => {
                      const current = props.properties || [];
                      const updated = checked 
                        ? [...current, prop.value]
                        : current.filter(p => p !== prop.value);
                      updateProperties({ properties: updated });
                    }}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-medium">{prop.label}</div>
                    <div className="text-xs text-gray-500">{prop.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Gittata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Gittata Normale (m)</Label>
              <Input
                type="number"
                value={props.range?.normal || ''}
                onChange={(e) => updateProperties({ 
                  range: { normal: parseInt(e.target.value) || (props.range?.normal ?? 0), long: props.range?.long }
                })}
                className="mt-1"
                placeholder="es. 6"
              />
            </div>
            <div>
              <Label>Gittata Lunga (m)</Label>
              <Input
                type="number"
                value={props.range?.long ?? ''}
                onChange={(e) => updateProperties({ 
                  range: { normal: props.range?.normal ?? 0, long: parseInt(e.target.value) || 0 }
                })}
                className="mt-1"
                placeholder="es. 18"
              />
            </div>
          </div>

          {/* Bonus magico */}
          <div>
            <Label>Bonus Magico</Label>
            <div className="flex gap-2 mt-1">
              {[0, 1, 2, 3].map(bonus => (
                <Button
                  key={bonus}
                  type="button"
                  variant={props.magicBonus === bonus ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateProperties({ magicBonus: bonus })}
                  className={props.magicBonus === bonus 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "border-gray-300"
                  }
                >
                  {bonus === 0 ? 'Normale' : `+${bonus}`}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderArmorProperties = () => {
    const props = formData.properties as ArmorProperties || { itemType: 'armor' };
    
    return (
      <>
        <hr className="border-t border-gray-200 my-4" />
        <div className="pt-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Proprietà dell&apos;Armatura
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Classe Armatura (CA)</Label>
              <Input
                type="number"
                value={props.armorClass || ''}
                onChange={(e) => updateProperties({ armorClass: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Tipo Armatura</Label>
              <Select
                value={props.armorType ?? ''}
                onValueChange={(value) => updateProperties({ armorType: value as ArmorProperties['armorType'] })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light" label="Leggera">Leggera</SelectItem>
                  <SelectItem value="medium" label="Media">Media</SelectItem>
                  <SelectItem value="heavy" label="Pesante">Pesante</SelectItem>
                  <SelectItem value="shield" label="Scudo">Scudo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={props.addsDexModifier || false}
                onCheckedChange={(checked) => updateProperties({ addsDexModifier: checked })}
              />
              <span>Aggiunge modificatore Destrezza</span>
            </label>

            {props.armorType === 'medium' && (
              <div className="flex items-center gap-2">
                <Label>Max Bonus Destrezza</Label>
                <Input
                  type="number"
                  value={props.maxDexBonus || ''}
                  onChange={(e) => updateProperties({ maxDexBonus: parseInt(e.target.value) || 0 })}
                  className="w-20"
                  placeholder="2"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={props.stealthDisadvantage || false}
                onCheckedChange={(checked) => updateProperties({ stealthDisadvantage: checked })}
              />
              <span>Svantaggio su Furtività</span>
            </label>

            <div className="flex items-center gap-2">
              <Label>Richiede Forza</Label>
              <Input
                type="number"
                value={props.strengthRequirement || ''}
                onChange={(e) => updateProperties({ strengthRequirement: parseInt(e.target.value) || 0 })}
                className="w-20"
                placeholder="13"
              />
            </div>
          </div>

          {/* Bonus magico */}
          <div>
            <Label>Bonus Magico</Label>
            <div className="flex gap-2 mt-1">
              {[0, 1, 2, 3].map(bonus => (
                <Button
                  key={bonus}
                  type="button"
                  variant={props.magicBonus === bonus ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateProperties({ magicBonus: bonus })}
                  className={props.magicBonus === bonus 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "border-gray-300"
                  }
                >
                  {bonus === 0 ? 'Normale' : `+${bonus}`}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderConsumableProperties = () => {
    const props = formData.properties as ConsumableProperties || { itemType: 'consumable' };
    
    return (
      <>
        <hr className="border-t border-gray-200 my-4" />
        <div className="pt-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <FlaskConical className="w-4 h-4" />
            Proprietà del Consumabile
          </h3>

          <div>
            <Label>Effetto</Label>
            <Textarea
              value={props.effect || ''}
              onChange={(e) => updateProperties({ effect: e.target.value })}
              placeholder="es. Recupera 2d4+2 PF, Invisibilità per 1 ora, +2 Forza per 1 ora"
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Durata</Label>
              <Input
                value={props.duration || ''}
                onChange={(e) => updateProperties({ duration: e.target.value })}
                placeholder="es. Istantaneo, 1 ora, 24 ore"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Ricarica</Label>
              <Select
                value={props.recharge ?? ''}
                onValueChange={(value) => updateProperties({ recharge: value as string })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Nessuna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Riposo Breve</SelectItem>
                  <SelectItem value="long">Riposo Lungo</SelectItem>
                  <SelectItem value="dawn">Alba</SelectItem>
                  <SelectItem value="dusk">Crepuscolo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Utilizzi Massimi</Label>
            <Input
              type="number"
              value={props.usesMax ?? ''}
              onChange={(e) => updateProperties({ usesMax: parseInt(e.target.value) || 0 })}
              className="mt-1 w-32"
              placeholder="1, 3, 10"
            />
            <p className="text-xs text-gray-500 mt-1">Lascia vuoto per utilizzo singolo</p>
          </div>
        </div>
      </>
    );
  };

  const renderAmmunitionProperties = () => {
    const props = formData.properties as AmmunitionProperties || { itemType: 'ammunition' };
    
    return (
      <>
        <hr className="border-t border-gray-200 my-4" />
        <div className="pt-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Proprietà delle Munizioni
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select
                value={props.ammunitionType ?? ''}
                onValueChange={(value) => updateProperties({ ammunitionType: value as AmmunitionProperties['ammunitionType'] })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arrow" label="Freccia">Freccia</SelectItem>
                  <SelectItem value="bolt" label="Quadrello">Quadrello</SelectItem>
                  <SelectItem value="bullet" label="Proiettile">Proiettile</SelectItem>
                  <SelectItem value="needle" label="Spillo">Spillo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantità per confezione</Label>
              <Input
                type="number"
                value={props.quantity || ''}
                onChange={(e) => updateProperties({ quantity: parseInt(e.target.value) || 1 })}
                className="mt-1"
                placeholder="20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Bonus Danno</Label>
              <Input
                value={props.damageBonus || ''}
                onChange={(e) => updateProperties({ damageBonus: e.target.value })}
                placeholder="es. 1d4 fuoco, +1 danno"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Bonus Magico</Label>
              <div className="flex gap-2 mt-1">
                {[0, 1, 2, 3].map(bonus => (
                  <Button
                    key={bonus}
                    type="button"
                    variant={props.magicBonus === bonus ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateProperties({ magicBonus: bonus })}
                    className={props.magicBonus === bonus 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "border-gray-300"
                    }
                  >
                    {bonus === 0 ? 'Normale' : `+${bonus}`}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderToolProperties = () => {
    const props = formData.properties as ToolProperties || { itemType: 'tool' };
    
    return (
      <>
        <hr className="border-t border-gray-200 my-4" />
        <div className="pt-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Proprietà dell&apos;Attrezzo
          </h3>

          <div>
            <Label>Tipo Attrezzo</Label>
            <Input
              value={props.toolType || ''}
              onChange={(e) => updateProperties({ toolType: e.target.value })}
              placeholder="es. Attrezzi da fabbro, Attrezzi da scasso, Kit da alchimista"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Abilità Associata</Label>
            <Input
              value={props.skill || ''}
              onChange={(e) => updateProperties({ skill: e.target.value })}
              placeholder="es. Artigianato, Scassinare, Alchimia"
              className="mt-1"
            />
          </div>
          
          <label className="flex items-center gap-2">
            <Checkbox
              checked={!!props.proficiency}
              onCheckedChange={(checked) => updateProperties({ proficiency: !!checked })}
            />
            <span>Richiede competenza</span>
          </label>
        </div>
      </>
    );
  };

  const renderGearProperties = () => {
    const props = formData.properties as GearProperties || { itemType: 'gear' };

    return (
      <>
        <hr className="border-t border-gray-200 my-4" />
        <div className="pt-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Proprietà dell&apos;Equipaggiamento
          </h3>

          <div className="mt-3">
            <Label>Capacità (kg)</Label>
            <Input
              type="number"
              step="0.5"
              value={props.capacity || ''}
              onChange={(e) => updateProperties({ capacity: parseFloat(e.target.value) || 0 })}
              placeholder="Per contenitori (es. zaino, baule)"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Lascia vuoto se non è un contenitore</p>
          </div>
        </div>
      </>
    );
  };

  const renderCurrencyProperties = () => {
    return (
      <>
        <hr className="border-t border-gray-200 my-4" />
        <div className="pt-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Moneta
          </h3>
          <p className="text-sm text-gray-500">
            Le monete sono gestite automaticamente nel sistema di valuta.
            Il valore viene calcolato in base alla moneta selezionata.
          </p>
        </div>
      </>
    );
  };

  const renderPropertiesByType = () => {
    switch (selectedType) {
      case 'weapon':
        return renderWeaponProperties();
      case 'armor':
        return renderArmorProperties();
      case 'consumable':
        return renderConsumableProperties();
      case 'ammunition':
        return renderAmmunitionProperties();
      case 'tool':
        return renderToolProperties();
      case 'gear':
        return renderGearProperties();
      case 'currency':
        return renderCurrencyProperties();
      default:
        return null;
    }
  };

  return (
    <AncientContainer
      title={title}
      subtitle={subtitle}
      action={(
        <div className="flex gap-2">
          {(onDelete || (mode === 'edit' && itemId)) && !isView && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={isLoading}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Elimina
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => router.back()}>
            <X className="w-4 h-4 mr-2" />
            {isView ? 'Chiudi' : 'Annulla'}
          </Button>
        </div>
      )}
      contentClassName="p-0"
    >

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div className="col-span-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Nome Oggetto <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={cn("mt-1", errors.name && "border-red-500")}
              placeholder="es. Spada lunga, Pozione di cura, Armatura di cuoio..."
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Tipo */}
          <div>
            <Label htmlFor="type" className="text-gray-700 font-medium">
              Tipo Oggetto
            </Label>
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as ItemType)}>
              <SelectTrigger className="mt-1">
                {(() => {
                  const found = itemTypes.find(t => t.value === selectedType);
                  if (!found) return <SelectValue placeholder="Seleziona tipo" />;
                  const Icon = found.icon;
                  return <span className="flex items-center gap-2"><Icon className="w-4 h-4" /><span>{found.label}</span></span>;
                })()}
              </SelectTrigger>
              <SelectContent>
                {itemTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value} label={type.label}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Rarità */}
          <div>
            <Label htmlFor="rarity" className="text-gray-700 font-medium">
              Rarità
            </Label>
            <Select
              value={formData.rarity}
              onValueChange={(value) => setFormData({ ...formData, rarity: value as Rarity })}
            >
              <SelectTrigger className="mt-1">
                {(() => {
                  const found = rarities.find(r => r.value === formData.rarity);
                  return found
                    ? <span className={found.color}>{found.label}</span>
                    : <SelectValue placeholder="Seleziona rarità" />;
                })()}
              </SelectTrigger>
              <SelectContent>
                {rarities.map((rarity) => (
                  <SelectItem key={rarity.value} value={rarity.value}>
                    <span className={rarity.color}>{rarity.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Peso */}
          <div>
            <Label htmlFor="weight" className="text-gray-700 font-medium">
              Peso (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
              className="mt-1"
            />
          </div>

          {/* Valore */}
          <div>
            <Label htmlFor="value" className="text-gray-700 font-medium">
              Valore
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="value"
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                className="flex-1"
              />
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value as CurrencyType })}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.symbol} {curr.value.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Richiede Sintonizzazione */}
          {selectedType !== 'currency' && selectedType !== 'consumable' && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Label htmlFor="attunement" className="text-gray-700 font-medium cursor-pointer">
                Richiede Sintonizzazione
              </Label>
              <Switch
                id="attunement"
                checked={formData.requires_attunement ?? false}
                onCheckedChange={(checked) => setFormData({ ...formData, requires_attunement: checked })}
              />
            </div>
          )}

          {/* Categoria */}
          <div className="col-span-2">
            <Label htmlFor="category" className="text-gray-700 font-medium">
              Categoria (opzionale)
            </Label>
            <Input
              id="category"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1"
              placeholder="es. Arma da mischia, Armatura pesante, Strumento musicale..."
            />
          </div>

          {/* Descrizione */}
          <div className="col-span-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">
              Descrizione
            </Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 min-h-[100px]"
              placeholder="Descrivi l'oggetto, i suoi effetti speciali, il suo aspetto, ecc."
            />
          </div>
        </div>
        <Separator className="h-[2px] bg-amber-400" />
        {/* Proprietà specifiche per tipo */}
        {renderPropertiesByType()}

        {/* Pulsante submit */}
        <div className="flex justify-end pt-4 border-t border-amber-200">
          <AntiqueButton
            type="submit"
            variant="parchment"
            size="md"
            icon={<Save className="w-4 h-4" />}
            loading={isLoading}
            disabled={isLoading}
          >
            {mode === 'edit' ? 'Salva Modifiche' : 'Crea Oggetto'}
          </AntiqueButton>
        </div>
      </form>
    </AncientContainer>
  );
}
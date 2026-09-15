// components/items/ItemFormFields.tsx
//
// Campi riutilizzabili del form oggetto.
//
// Dentro `ItemForm.tsx` questi blocchi erano ricopiati per ogni tipo di
// oggetto: il selettore "Bonus Magico" tre volte identico, la select dei dadi
// tre volte, la select del tipo di danno tre volte, il separatore con il
// titolo di sezione sette volte. Qui diventano una definizione sola, ognuna
// con la sola variante che serve davvero.
'use client';

import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { DamageType } from '@/types/item';

import { DAMAGE_DICE_OPTIONS, DAMAGE_TYPE_OPTIONS, type Option } from './itemOptions';

interface ItemPropertyHeaderProps {
  icon: LucideIcon;
  title: string;
}

/**
 * Separatore + titolo delle proprietà specifiche di un tipo.
 *
 * Era ricopiato sette volte, una per ramo di `renderPropertiesByType`, sempre
 * identico. Non ingloba il contenuto: rende solo `hr` e `h3`, così il
 * contenitore che lo segue resta al suo posto e il DOM non cambia.
 */
export function ItemPropertyHeader({ icon: Icon, title }: ItemPropertyHeaderProps) {
  return (
    <>
      <hr className="border-t border-gray-200 my-4" />
      <h3 className="font-medium text-gray-700 flex items-center gap-2">
        <Icon className="w-4 h-4" aria-hidden="true" />
        {title}
      </h3>
    </>
  );
}

interface DiceSelectProps {
  value: string | null | undefined;
  onChange: (value: string) => void;
  options?: Option<string>[];
  placeholder?: string;
  className?: string;
}

/** Select dei dadi danno. Il dado è l'unica informazione, quindi niente icona. */
export function DiceSelect({
  value,
  onChange,
  options = DAMAGE_DICE_OPTIONS,
  placeholder = 'Seleziona dado',
  className,
}: DiceSelectProps) {
  return (
    <Select value={value ?? ''} onValueChange={(v) => onChange(v ?? '')}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>{value || placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((dice) => (
          <SelectItem key={dice.value} value={dice.value} label={dice.label}>
            <span className="font-mono">{dice.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface DamageTypeSelectProps {
  value: DamageType | null | undefined;
  onChange: (value: DamageType) => void;
  placeholder?: string;
  className?: string;
}

export function DamageTypeSelect({
  value,
  onChange,
  placeholder = 'Seleziona tipo',
  className,
}: DamageTypeSelectProps) {
  const selected = DAMAGE_TYPE_OPTIONS.find((t) => t.value === value);

  return (
    <Select value={value ?? ''} onValueChange={(v) => onChange(v as DamageType)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>{selected?.label || placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {DAMAGE_TYPE_OPTIONS.map((type) => {
          const Icon = type.icon;
          return (
            <SelectItem key={type.value} value={type.value} label={type.label}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{type.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

interface MagicBonusFieldProps {
  value: number | null | undefined;
  onChange: (value: number) => void;
}

const MAGIC_BONUSES = [0, 1, 2, 3];

/**
 * Bonus magico come gruppo di pulsanti.
 *
 * Era duplicato identico in arma, armatura e munizioni; l'unica differenza fra
 * le tre copie era il tipo della proprietà scritta, quindi qui il tipo è
 * `number` e la conversione resta al chiamante.
 */
export function MagicBonusField({ value, onChange }: MagicBonusFieldProps) {
  return (
    <div>
      <Label>Bonus Magico</Label>
      <div className="flex gap-2 mt-1">
        {MAGIC_BONUSES.map((bonus) => (
          <Button
            key={bonus}
            type="button"
            variant={value === bonus ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(bonus)}
            className={value === bonus ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-300'}
          >
            {bonus === 0 ? 'Normale' : `+${bonus}`}
          </Button>
        ))}
      </div>
    </div>
  );
}

interface CheckboxFieldProps {
  label: React.ReactNode;
  /** Se presente, il campo diventa una voce di elenco con sottotitolo. */
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/**
 * Casella con etichetta, in due densità: con descrizione (griglia delle
 * proprietà dell'arma) e senza (interruttori singoli di armatura e attrezzi).
 */
export function CheckboxField({ label, description, checked, onCheckedChange }: CheckboxFieldProps) {
  return (
    <label
      className={cn(
        'flex gap-2',
        description
          ? 'items-start text-sm p-2 hover:bg-gray-100 rounded cursor-pointer'
          : 'items-center',
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(!!value)}
        className={description ? 'mt-0.5' : undefined}
      />
      {description ? (
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
      ) : (
        <span>{label}</span>
      )}
    </label>
  );
}

interface NumberFieldProps {
  label: React.ReactNode;
  value: number | null | undefined;
  onChange: (value: number) => void;
  id?: string;
  /** Valore applicato a campo vuoto o non numerico. */
  emptyValue?: number;
  parse?: 'int' | 'float';
  step?: string;
  placeholder?: string;
  hint?: React.ReactNode;
  className?: string;
  inputClassName?: string;
}

/**
 * Campo numerico con conversione.
 *
 * La coercizione `parseInt(prezzo) || 0` era scritta a mano una quindicina di
 * volte, e le due varianti (`parseFloat` per la capacità, `|| 1` per la
 * quantità per confezione) si distinguevano solo per un dettaglio. Qui sono
 * due prop esplicite.
 */
export function NumberField({
  label,
  value,
  onChange,
  id,
  emptyValue = 0,
  parse = 'int',
  step,
  placeholder,
  hint,
  className,
  inputClassName,
}: NumberFieldProps) {
  const handleChange = (raw: string) => {
    const parsed = parse === 'float' ? parseFloat(raw) : parseInt(raw, 10);
    onChange(Number.isNaN(parsed) ? emptyValue : parsed);
  };

  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        step={step}
        value={value || ''}
        onChange={(e) => handleChange(e.target.value)}
        className={cn('mt-1', inputClassName)}
        placeholder={placeholder}
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

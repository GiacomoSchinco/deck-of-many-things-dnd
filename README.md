# 🃏 Deck of Many Things

<div align="center">
  <img src="/public/images/logo.png" alt="Deck of Many Things Logo" width="200" />
  <br />
  <strong>Gestione Schede Personaggio D&D 5e</strong>
  <br />
  <em>Il destino è nelle carte</em>
</div>

---

## 📖 **Descrizione**

**Deck of Many Things** è un'applicazione web per la gestione di schede personaggio di Dungeons & Dragons 5ª edizione. L'app permette di creare, visualizzare e gestire personaggi con un'interfaccia ispirata alle carte antiche, offrendo un'esperienza immersiva per giocatori e dungeon master.

## ✨ **Caratteristiche**

- 🎴 **Interfaccia a carte antiche** - Design unico ispirato ai tarocchi e alle pergamene
- ⚔️ **Creazione personaggio wizard** - Guida passo-passo per creare il tuo eroe
- 📊 **Gestione completa** - Caratteristiche, competenze, incantesimi, inventario
- 🎲 **Tiri automatici** - Calcola bonus e tira i dadi direttamente dalla scheda
- 🏰 **Campagne** - Organizza i personaggi per campagne
- 📦 **Catalogo oggetti** - Oltre 300 oggetti predefiniti
- 📜 **Libro degli incantesimi** - Oltre 350 incantesimi SRD in italiano
- 👥 **Gestione utenti** - Login/registrazione con Supabase Auth

## 🚀 **Tecnologie**

| Tecnologia | Utilizzo |
|------------|----------|
| [Next.js 15](https://nextjs.org/) | Framework React con App Router |
| [TypeScript](https://www.typescriptlang.org/) | Tipizzazione statica |
| [Tailwind CSS](https://tailwindcss.com/) | Styling utility-first |
| [shadcn/ui](https://ui.shadcn.com/) | Componenti UI riutilizzabili |
| [TanStack Query](https://tanstack.com/query) | Gestione stato server |
| [TanStack Table](https://tanstack.com/table) | Tabelle dati avanzate |
| [Zustand](https://github.com/pmndrs/zustand) | Gestione stato client |
| [Supabase](https://supabase.com/) | Database e autenticazione |

## 🎨 **Sistema CSS Fantasy**

Questo progetto usa classi CSS custom definite in `app/globals.css` (`@layer components`) per mantenere uno stile coerente su tutta l'app. **Non usare Tailwind inline per questi pattern — usa le classi fantasy.**

### Classi di testo

| Classe | Tailwind equivalente | Quando usarla |
|---|---|---|
| `fantasy-title` | `font-serif font-bold text-amber-900` | Titoli di sezione, nomi, intestazioni card |
| `fantasy-subtitle` | `text-amber-600 text-sm` | Sottotitoli, descrizioni secondarie |
| `fantasy-label` | `text-amber-800` | Etichetta a sinistra in una riga info |
| `fantasy-value` | `font-bold text-amber-900` | Valore a destra in una riga info |

### Classi contenitore

| Classe | Tailwind equivalente | Quando usarla |
|---|---|---|
| `fantasy-section` | `bg-amber-50/50 rounded-lg border border-amber-200` | Card/box sezione (wizard step, sheet section) |
| `fantasy-row` | `flex justify-between items-center p-2 bg-amber-50 rounded` | Riga label/valore singola |
| `fantasy-section-header` | `font-serif font-bold text-amber-900 mb-4 text-center border-b border-amber-200 pb-2` | Intestazione con bordo inferiore (usare via `SectionTitle`) |
| `fantasy-icon-wrap` | `inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4` | Cerchio attorno a un'icona decorativa |

### Componenti condivisi (`components/shared/`)

Preferisci i componenti invece delle classi dirette quando possibile:

**`<StatRow>`** — riga label/valore con `fantasy-row`
```tsx
import { StatRow } from '@/components/shared/StatRow';

<StatRow label="Classe Armatura" value={character.armor_class} />
// opzionale: className per override/aggiunta classi
```

**`<SectionTitle>`** — intestazione sezione con `fantasy-section-header`
```tsx
import { SectionTitle } from '@/components/shared/SectionTitle';

<SectionTitle>Info Combattimento</SectionTitle>
<SectionTitle size="sm">Sottosezione</SectionTitle>
// size: 'sm' (text-lg) | 'md' (text-xl, default) | 'lg' (text-2xl)
```

**`<WizardNav>`** — navigazione wizard con back/next
```tsx
import { WizardNav } from '@/components/shared/WizardNav';

<WizardNav
  onBack={handleBack}
  backLabel="Indietro"        // default: "Indietro"
  onNext={handleNext}
  nextLabel="Avanti"          // default: "Avanti"
  nextDisabled={!isValid}
  nextLoading={isSaving}
/>
```

### Esempio pattern completo

```tsx
<div className="fantasy-section p-4 space-y-2">
  <SectionTitle>Info Personaggio</SectionTitle>
  <StatRow label="Razza" value={character.race} />
  <StatRow label="Classe" value={character.class} />
  <StatRow label="Livello" value={character.level} />
</div>
```

## 📋 **Prerequisiti**

- Node.js 18+
- npm o yarn
- Account Supabase (gratuito)

## 🔧 **Installazione**

### 1. Clona il repository

```bash
git clone https://github.com/tuo-username/deck-of-many-things.git
cd deck-of-many-things

## 🔮 **Sistema Incantesimi**

### Architettura (due tabelle separate)

```
spells_known      → incantesimi che il personaggio ha imparato/conosce permanentemente
prepared_spells   → incantesimi attualmente preparati (subset di spells_known o dell'intera classe)
spell_slots       → slot disponibili/usati per livello (1–9)
```

### Regole per tipo di classe

| Classe | Impara (spells_known) | Prepara (prepared_spells) | Limite preparazione |
|---|---|---|---|
| **Bardo / Stregone / Warlock** | Sceglie un numero fisso di spell | Non prepara — usa direttamente le conosciute | N/A |
| **Ranger / Ladro** | Sceglie un numero fisso di spell | Non prepara | N/A |
| **Mago** | Tutte le spell nel grimorio (spells_known) | Sceglie ogni giorno dal grimorio | livello + mod INT |
| **Chierico / Druido** | NON salva in spells_known — accede all'intera lista classe | Sceglie ogni giorno da tutta la lista | livello + mod SAG |
| **Paladino** | NON salva in spells_known — accede all'intera lista classe | Sceglie ogni giorno da tutta la lista | livello/2 + mod CAR |

> **Nota**: Il campo `isPreparer` in `Spellbook` attiva il tab "Preparati". Le classi preparatrici (chierico, druido, paladino, mago) hanno `isPreparerClass = true`.

### Flusso dati — aggiungi/rimuovi spell

```
Utente clicca "Gestisci Incantesimi"
  → Spellbook apre SpellsStep dialog
  → onSave chiama useAddCharacterSpells / useRemoveCharacterSpells
  → POST/DELETE /api/characters/[id]/spells
  → tabella spells_known in Supabase
```

### Flusso dati — prepara/de-prepara spell

```
Utente è nel tab "Preparati" (PreparedSpellsManager)
  → Per Mago: lista da spells_known (il grimorio)
  → Per Chierico/Druido/Paladino: lista dall'intera classe (useSpells({ class: "cleric" }))
    ⚠️  Il nome classe è in inglese lowercase nel DB (es. "cleric", "druid", "paladin")
    Il componente riceve già il nome inglese da spells/page.tsx via getEnglishClass()
  → useAddPreparedSpells / useRemovePreparedSpells
  → POST/DELETE /api/characters/[id]/prepared-spells
```

### Flusso dati — usa/recupera slot

```
Utente clicca +/− sullo SpellSlotsManager in Spellbook
  → onUpdate chiama usePatchSpellSlot
  → PATCH /api/characters/[id]/spell-slots  { spell_level, used_slots }

Utente clicca "Riposo lungo"
  → onLongRest chiama useLongRestSpellSlots
  → PUT /api/characters/[id]/spell-slots  (reset used_slots = 0 per tutti)
```

### Level-up e spell slots

Durante il level-up, `getLevelUpSpellChanges()` in `lib/rules/spellcasting.ts` ritorna:
- `newSpellSlots` — **delta** (slot guadagnati al nuovo livello, per la visualizzazione)
- `totalSpellSlots` — **totale** al nuovo livello (usato per l'upsert nel DB)

Non confondere i due: la visualizzazione mostra il delta, il salvataggio usa il totale.
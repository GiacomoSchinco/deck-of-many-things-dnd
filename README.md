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
| [Next.js 16](https://nextjs.org/) | Framework React con App Router |
| [TypeScript](https://www.typescriptlang.org/) | Tipizzazione statica |
| [Tailwind CSS](https://tailwindcss.com/) | Styling utility-first |
| [shadcn/ui](https://ui.shadcn.com/) | Componenti UI riutilizzabili |
| [TanStack Query](https://tanstack.com/query) | Gestione stato server |
| [TanStack Table](https://tanstack.com/table) | Tabelle dati avanzate |
| [Zustand](https://github.com/pmndrs/zustand) | Gestione stato client |
| [Supabase](https://supabase.com/) | Database e autenticazione |

## 🎨 **Design system**

Il tema (pergamena, cuoio, oro antico) è definito da **token** in `app/globals.css` (`@theme`)
più un piccolo set di classi condivise. Due regole:

1. Colori, ombre e raggi si usano **solo tramite token**, mai con `amber-*` o esadecimali sparsi nei componenti.
2. I pattern ricorrenti si usano **tramite le classi**, non riscritti inline.

### Tipografia

Tre ruoli distinti, nessun font "tuttofare":

| Token | Font | Ruolo |
|---|---|---|
| `--font-display` / `--font-serif` | Cinzel | Titoli, intestazioni, nomi di card |
| `--font-sans` | Inter | Testo di interfaccia (default del `body`) |
| `--font-quote` | IM Fell English | Sottotitoli e citazioni, in corsivo |
| `--font-mono` | stack di sistema | Valori numerici e log |

> Le variabili dei font sono applicate su `<html>`, non su `<body>`: i token di `@theme`
> vivono su `:root`, quindi un font definito più in basso non verrebbe mai risolto.

### Token principali

| Categoria | Token | Uso |
|---|---|---|
| Inchiostro | `--color-ink`, `--color-ink-strong`, `--color-ink-muted` | Testo e gerarchia |
| Materiale | `--color-frame`, `--color-frame-deep` | Bordi, cornici, elementi incisi |
| Superfici | `--color-parchment-50…900`, `--color-antique-gold/bronze/copper/rust` | Fondi e accenti |
| Elevazione | `--shadow-raised`, `--shadow-frame`, `--shadow-carved`, `--shadow-emboss` | Ombre calde, mai nero puro |
| Raggi | `--radius-control`, `--radius-panel`, `--radius-frame` | Controlli, pannelli, cornici |
| Movimento | `--ease-soft`, `--duration-quick`, `--duration-base` | Transizioni coerenti |

### Classi di testo

| Classe | Quando usarla |
|---|---|
| `fantasy-title` | Titoli di sezione, nomi, intestazioni card |
| `fantasy-subtitle` | Sottotitoli e descrizioni (corsivo, IM Fell) |
| `fantasy-label` | Etichetta a sinistra in una riga info |
| `fantasy-value` | Valore a destra in una riga info (cifre allineate) |
| `stat-value` | Numeri e statistiche in monospaziato |
| `eyebrow` | Etichetta maiuscola sopra un blocco |

### Superfici

| Classe | Quando usarla |
|---|---|
| `panel` | Superficie standard in rilievo (card, blocco) |
| `panel-inset` | Area incassata nel materiale (riquadri informativi, campi) |
| `fantasy-section` | Card di sezione (step wizard, sezioni scheda) |
| `fantasy-row` | Riga label/valore incassata |
| `fantasy-section-header` | Intestazione di sezione con separatore |
| `fantasy-icon-wrap` | Medaglione circolare attorno a un'icona |
| `divider-ornate` | Divisore sfumato |
| `ornament-diamond`, `paper-grain` | Ornamenti e texture (SVG inline, nessuna richiesta esterna) |

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
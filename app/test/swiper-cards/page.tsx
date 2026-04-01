'use client';

import { useState } from 'react';
import CardSwiper, { type CardSwiperItem, type CardSwiperEntry } from '@/components/custom/CardSwiper';
import CharacterCard from '@/components/custom/CharacterCard';

const CLASSES: CardSwiperItem[] = [
    { id: 'barbarian', label: 'Barbarian', imageSrc: '/images/classes/card_barbarian.png' },
    { id: 'bard',      label: 'Bard',      imageSrc: '/images/classes/card_bard.png' },
    { id: 'cleric',    label: 'Cleric',    imageSrc: '/images/classes/card_cleric.png' },
    { id: 'druid',     label: 'Druid',     imageSrc: '/images/classes/card_druid.png' },
    { id: 'fighter',   label: 'Fighter',   imageSrc: '/images/classes/card_fighter.png' },
    { id: 'monk',      label: 'Monk',      imageSrc: '/images/classes/card_monk.png' },
    { id: 'paladin',   label: 'Paladin',   imageSrc: '/images/classes/card_paladin.png' },
    { id: 'ranger',    label: 'Ranger',    imageSrc: '/images/classes/card_ranger.png' },
    { id: 'rogue',     label: 'Rogue',     imageSrc: '/images/classes/card_rogue.png' },
    { id: 'sorcerer',  label: 'Sorcerer',  imageSrc: '/images/classes/card_sorcerer.png' },
    { id: 'warlock',   label: 'Warlock',   imageSrc: '/images/classes/card_warlock.png' },
    { id: 'wizard',    label: 'Wizard',    imageSrc: '/images/classes/card_wizard.png' },
];

export default function SwiperCardsTestPage() {
    const [selected, setSelected] = useState<CardSwiperItem>(CLASSES[0]);

    const CHARACTERS: CardSwiperEntry[] = [
        {
            id: 1,
            node: (
                <CharacterCard
                    id={1}
                    name="Aran"
                    race="Human"
                    characterClass="Wizard"
                    level={3}
                    background="Folk"
                    alignment="Neutral"
                    hp={10}
                    maxhp={10}
                    isFlippable
                    size="md"
                />
            ),
            label: 'Aran',
        },
        {
            id: 2,
            node: (
                <CharacterCard
                    id={2}
                    name="Bera"
                    race="Elf"
                    characterClass="Rogue"
                    level={2}
                    background="Thief"
                    alignment="Chaotic"
                    hp={8}
                    maxhp={8}
                    isFlippable
                    size="md"
                />
            ),
            label: 'Bera',
        },
    ];

    const [selectedChar, setSelectedChar] = useState<CardSwiperEntry>(CHARACTERS[0]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
            <h1 className="text-2xl font-bold text-amber-400 tracking-widest uppercase">
                CardSwiper — Test
            </h1>

            <CardSwiper
                items={CLASSES}
                onSelect={(item) => setSelected(item as CardSwiperItem)}
                size="md"
                showLabel={false}
                
            />

            {/* Esempio: passare componenti React (CharacterCard) */}
            <div className="mt-8 flex flex-col items-center gap-4">
                <h2 className="text-lg font-semibold text-amber-300">CharacterCard — Example</h2>

                <CardSwiper
                    items={CHARACTERS}
                    onSelect={(item) => setSelectedChar(item)}
                    size="md"
                    showLabel
         
                />

                <div className="text-center">
                    <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Selezionata (Character)</p>
                    <p className="text-xl font-bold text-amber-300">{selectedChar.label}</p>
                    <p className="text-xs text-stone-500 font-mono mt-1">id: {selectedChar.id}</p>
                </div>
            </div>

            {/* Carta selezionata */}
            <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Selezionata</p>
                <p className="text-xl font-bold text-amber-300">{selected.label}</p>
                <p className="text-xs text-stone-500 font-mono mt-1">id: {selected.id}</p>
            </div>

            <p className="text-sm text-stone-400">
                Trascina le carte per scorrerle.
            </p>
        </main>
    );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCards } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-cards';
import { CARD_SIZES, type CardSize } from '@/lib/utils/cardSizes';

export interface CardSwiperItem {
  /** Valore univoco restituito nell'onSelect */
  id: string | number;
  /** Testo mostrato come label (opzionale) */
  label?: string;
  /** Percorso immagine assoluto (es. /images/classes/card_wizard.png) */
  imageSrc?: string;
  /** Colore di sfondo fallback se non c'è immagine */
  color?: string;
}

/**
 * È possibile passare anche componenti React come entry usando la forma:
 * { id: 'x', node: <MyComponent ... />, label?: 'Nome' }
 */
export type CardSwiperEntry = CardSwiperItem | { id: string | number; node: ReactNode; label?: string };

interface CardSwiperProps {
  items: CardSwiperEntry[];
  onSelect?: (item: CardSwiperEntry) => void;
  initialIndex?: number;
  /** Indice controllato dall'esterno: quando cambia lo swiper naviga a quella slide */
  activeIndex?: number;
  size?: CardSize;
  width?: number;
  height?: number;
  showLabel?: boolean;
  // Nuova prop per l'effetto ventaglio
  cardsEffectOptions?: {
    perSlideRotate?: number;  // Gradi di rotazione (default Swiper: 2)
    perSlideOffset?: number;  // Spostamento in px (default Swiper: 8)
    slideShadows?: boolean;   // Ombre (default: true)
  };
}

export default function CardSwiper({
  items,
  onSelect,
  initialIndex = 0,
  activeIndex,
  size,
  width = 230,
  height = 380,
  showLabel = true,
  cardsEffectOptions = {}
}: CardSwiperProps) {
  const [active, setActive] = useState<CardSwiperEntry>(items[initialIndex] ?? items[0]);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (activeIndex !== undefined && swiperRef.current) {
      swiperRef.current.slideTo(activeIndex);
    }
  }, [activeIndex]);

  function handleSlideChange(swiper: SwiperType) {
    const item = items[swiper.realIndex];
    if (!item) return;
    setActive(item);
    onSelect?.(item);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={size ? CARD_SIZES[size] : undefined}
        style={!size ? { width, height } : undefined}
      >
        <Swiper
          effect="cards"
          grabCursor
          initialSlide={initialIndex}
          modules={[EffectCards]}
          style={{ width: '100%', height: '100%' }}
          onSwiper={(sw) => { swiperRef.current = sw; }}
          onSlideChange={handleSlideChange}
          cardsEffect={{
            slideShadows: true,
            perSlideRotate: 2,   // valore base
            perSlideOffset: 8,  // valore base
            ...cardsEffectOptions // sovrascrive con le tue props
          }}
        >
          {items.map((item) => {
            if ('node' in item) {
              return (
                <SwiperSlide
                  key={item.id}
                  style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    position: 'relative',
                    background: '#1c1917',
                  }}
                >
                  {item.node}
                </SwiperSlide>
              );
            }

            return (
              <SwiperSlide
                key={item.id}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  position: 'relative',
                  background: item.color ?? '#1c1917',
                }}
              >
                {item.imageSrc && (
                  <Image
                    src={item.imageSrc}
                    alt={item.label ?? String(item.id)}
                    fill
                    className="object-fill"
                    loading="eager"
                    sizes="320px"
                    draggable={false}
                  />
                )}

                {/* label centrata (visibile solo se non c'è immagine) */}
                {!item.imageSrc && item.label && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 22,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {showLabel && active.label && (
        <p className="text-lg font-bold text-amber-300 tracking-widest uppercase">
          {active.label}
        </p>
      )}
    </div>
  );
}

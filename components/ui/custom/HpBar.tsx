type HpBarProps = {
    current: number;
    max: number;
    size?: "small" | "large"; // nuova prop opzionale
};

export default function HpBar({ current, max, size = "small" }: HpBarProps) {
    // Calcola la percentuale di HP per eventualmente cambiare colore
    const percent = (current / max) * 100;
     // Altezza barra dinamica
    const heightClass = size === "large" ? "h-6" : "h-2";
    const labelClass = size === "large" ? "font-bold text-lg" : "font-bold text-sm";
    const valueClass = size === "large" ? "text-xl font-bold" : "text-sm font-bold";
    // Colore dinamico
    let progressColor = "progress-error"; // rosso
    if (percent > 50) progressColor = "progress-success"; // verde
    else if (percent > 25) progressColor = "progress-warning"; // giallo/arancione

    return (
        <div className="flex items-center gap-2 w-full">
            <span className={valueClass}>HP:</span>
            <progress
                className={`progress ${progressColor} flex-1 ${heightClass}`}
                value={current}
                max={max}
            />
            <span className={valueClass}>{current}/{max}</span>
        </div>
    );
}

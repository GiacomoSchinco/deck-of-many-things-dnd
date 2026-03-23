import AncientContainer from "@/components/custom/AncientContainer";

export default function SpellsAdminPage() {
    return (
        <AncientContainer title="Catalogo Incantesimi" subtitle="Visualizza, modifica e gestisci il catalogo incantesimi disponibile per i tuoi personaggi." showDecorations={false}>
            <p className="text-sm text-amber-600">⚠️ Questa funzionalità è riservata agli amministratori e i dati inseriti influenzeranno il catalogo incantesimi disponibile per tutti gli utenti. Procedi con cautela e assicurati che le informazioni siano accurate prima di creare, modificare o eliminare un incantesimo.</p>   
        </AncientContainer>
    )
}          
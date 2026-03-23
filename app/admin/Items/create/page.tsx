import AncientContainer from "@/components/custom/AncientContainer";
export function CreateItemPage() {

    return (
        <AncientContainer title="Crea nuovo oggetto" subtitle="Utilizza il form sottostante per creare un nuovo oggetto da aggiungere al catalogo. Compila tutti i campi richiesti e clicca su 'Crea' per salvare il nuovo oggetto nel database." showDecorations={false}>
            <p className="text-sm text-amber-600">⚠️ Questa funzionalità è riservata agli amministratori e i dati inseriti influenzeranno il catalogo oggetti disponibile per tutti gli utenti. Procedi con cautela e assicurati che le informazioni siano accurate prima di creare un nuovo oggetto.</p>   
        </AncientContainer>
    )
}
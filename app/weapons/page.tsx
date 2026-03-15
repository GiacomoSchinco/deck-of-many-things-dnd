'use client';

import Loading from "@/components/ui/custom/Loading";
import { useWeapons } from "@/hooks/useWeapons";

export default function WeaponsPage() {
  const { data, isLoading, isError, error } = useWeapons();
  
  if (isLoading) return <Loading />;
  
  if (isError) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-parchment-100 rounded-xl border-8 border-amber-800 shadow-2xl p-8 text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-serif text-amber-900 mb-2">Errore</h2>
        <p className="text-amber-700">{(error as Error).message}</p>
        <div className="mt-4 text-xs text-amber-600/50">♠ ♣ ♥ ♦</div>
      </div>
    </div>
  );
  
  // Mappa i dati per la tabella
  const rows = data?.results.map((w, i) => ({
    id: i + 1,
    name: w.name,
    tipo: w.is_simple ? "Semplice" : "Marziale",
    danno: w.damage_dice && w.damage_type
      ? `${w.damage_dice} ${w.damage_type.name}`
      : w.damage_dice || "-",
    gittata: w.range && w.range > 0
      ? `${w.range}/${w.long_range} ft`
      : "Mischia",
    proprietà: w.properties && w.properties.length > 0
      ? w.properties.map(p => {
          const propName = p.property.name;
          return p.detail ? `${propName} (${p.detail})` : propName;
        }).join(", ")
      : "-",
  })) ?? [];

  const handleEdit = (id: number, row: unknown) => {
    console.log("[WeaponsPage] Edit ID:", id, row);
    // Qui implementerai la modifica
  };
  
  const handleDelete = (id: number, row: unknown) => {
    console.log("[WeaponsPage] Delete ID:", id, row);
    // Qui implementerai l'eliminazione
  };
  
  const handleRowClick = (id: number, row: unknown) => {
    console.log("[WeaponsPage] Row Click ID:", id, row);
    // Qui implementerai la visualizzazione dettagli
  };

  return (
    <div className="min-h-screen p-6">
      {/* Intestazione della pagina in stile antico */}
      <div className="max-w-7xl mx-auto mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-amber-900 mb-2">
          Armeria
        </h1>
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
          <span className="text-3xl text-amber-700">⚔️</span>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
        </div>
        <p className="text-amber-700 font-serif italic">
          &ldquo;Forgiate nei fuochi antichi&rdquo;
        </p>
      </div>

      {/* Tabella delle armi */}
      {/* 
      <DataTable
        title="Elenco delle Armi"
        initialData={rows}
        visibleColumns={["name", "tipo", "danno", "gittata", "proprietà"]}
        labels={{
          name: "Nome",
          tipo: "Tipo",
          danno: "Danno",
          gittata: "Gittata",
          proprietà: "Proprietà",
        }}
        pagination={true}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onRowClick={handleRowClick}
      />*/}
    </div>
  );
}
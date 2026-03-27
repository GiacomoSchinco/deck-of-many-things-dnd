// app/admin/import-items/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import AncientContainer from '@/components/custom/AncientContainer';
import { 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  Package, 
  Database,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

type ImportItem = {
  name: string;
  type: string;
  weight?: number;
  value?: number;
  currency?: string;
  rarity?: string;
  requires_attunement?: boolean;
  category?: string | null;
  description?: string | null;
  properties?: unknown;
};

export default function ImportItemsPage() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [logs, setLogs] = useState<Array<{type: 'info' | 'success' | 'error', message: string}>>([]);
  const [stats, setStats] = useState({ success: 0, errors: 0, skipped: 0 });

  const addLog = (type: 'info' | 'success' | 'error', message: string) => {
    setLogs(prev => [...prev, { type, message }]);
  };

  const clearLogs = () => {
    setLogs([]);
    setStats({ success: 0, errors: 0, skipped: 0 });
    setProgress({ current: 0, total: 0 });
  };

  const importItems = async () => {
    setLoading(true);
    clearLogs();
    
    addLog('info', '📦 Caricamento file items.json...');
    
    try {
      const response = await fetch('/items.json');
      if (!response.ok) throw new Error('File items.json non trovato');
      
      const items: ImportItem[] = await response.json();
      setProgress({ current: 0, total: items.length });
      addLog('success', `✅ Caricati ${items.length} oggetti dal JSON`);
      
      // Verifica tabella
      addLog('info', '🔍 Verifica tabella items...');
      const { error: tableCheckError } = await supabase
        .from('items')
        .select('id')
        .limit(1);
      
      if (tableCheckError) {
        throw new Error('Tabella items non accessibile: ' + tableCheckError.message);
      }
      
      // Import in batch da 25
      const BATCH_SIZE = 25;
      let success = 0;
      let errors = 0;
      let skipped = 0;
      
      for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        
        // Prepara i dati
        const formattedBatch = batch.map((item: ImportItem) => ({
          name: item.name,
          type: item.type,
          weight: item.weight || 0,
          value: item.value || 0,
          currency: item.currency || 'po',
          rarity: item.rarity || 'common',
          requires_attunement: item.requires_attunement || false,
          category: item.category || null,
          description: item.description || null,
          properties: item.properties || null
        }));
        
        // Controlla duplicati
        const names = formattedBatch.map((i) => i.name);
        const { data: existing } = await supabase
          .from('items')
          .select('name')
          .in('name', names);
        
        const existingNames = new Set(existing?.map(e => e.name) || []);
        const newItems = formattedBatch.filter((i) => !existingNames.has(i.name));
        skipped += formattedBatch.length - newItems.length;
        
        if (newItems.length === 0) {
          addLog('info', `⏭️ Batch ${i/BATCH_SIZE + 1}: tutti già presenti (saltato)`);
          setProgress({ current: i + batch.length, total: items.length });
          continue;
        }
        
        const { error } = await supabase
          .from('items')
          .insert(newItems);
        
        if (error) {
          addLog('error', `❌ Batch ${i/BATCH_SIZE + 1}: ${error.message}`);
          errors += newItems.length;
        } else {
          addLog('success', `✅ Batch ${i/BATCH_SIZE + 1}: inseriti ${newItems.length} oggetti`);
          success += newItems.length;
        }
        
        setProgress({ current: i + batch.length, total: items.length });
        setStats({ success, errors, skipped });
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      addLog('success', `\n📊 IMPORT COMPLETATO!`);
      addLog('success', `   ✅ Inseriti: ${success}`);
      addLog('success', `   ⏭️ Già presenti: ${skipped}`);
      addLog('error', `   ❌ Errori: ${errors}`);
      
    } catch (err) {
      addLog('error', `❌ Errore generale: ${err instanceof Error ? err.message : 'Sconosciuto'}`);
    } finally {
      setLoading(false);
    }
  };

  const getLogColor = (type: string) => {
    switch(type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-amber-300';
    }
  };

  const getLogIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-4 h-4 inline mr-2 text-green-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 inline mr-2 text-red-400" />;
      default: return <Sparkles className="w-4 h-4 inline mr-2 text-amber-400" />;
    }
  };

  // Azioni (statistiche e pulsante clear)
  const actions = (
    <div className="flex gap-2">
      {stats.success > 0 && (
        <div className="flex gap-2 mr-2">
          <div className="bg-green-100/80 px-3 py-1.5 rounded-lg text-center">
            <p className="text-xs text-green-700">✅ {stats.success}</p>
          </div>
          <div className="bg-yellow-100/80 px-3 py-1.5 rounded-lg text-center">
            <p className="text-xs text-yellow-700">⏭️ {stats.skipped}</p>
          </div>
          <div className="bg-red-100/80 px-3 py-1.5 rounded-lg text-center">
            <p className="text-xs text-red-700">❌ {stats.errors}</p>
          </div>
        </div>
      )}
      {logs.length > 0 && (
        <Button
          onClick={clearLogs}
          variant="outline"
          size="sm"
          className="border-amber-600 text-amber-700 hover:bg-amber-100"
        >
          🧹 Pulisci
        </Button>
      )}
    </div>
  );

  // Progress bar (se in corso)
  const progressBar = progress.total > 0 && (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-amber-700 mb-1">
        <span className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          Progresso import
        </span>
        <span>{progress.current}/{progress.total}</span>
      </div>
      <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-amber-700 transition-all duration-300 rounded-full"
          style={{ width: `${(progress.current / progress.total) * 100}%` }}
        />
      </div>
    </div>
  );

  // Pulsante import principale
  const importButton = (
    <Button
      onClick={importItems}
      disabled={loading}
      className="w-full bg-amber-700 hover:bg-amber-800 text-white shadow-md hover:shadow-lg transition-all"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Import in corso...
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5 mr-2" />
          Avvia Import Oggetti
        </>
      )}
    </Button>
  );

  // Logs console
  const logsConsole = logs.length > 0 && (
    <div className="bg-gray-900 rounded-lg border border-amber-700/30 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-mono text-gray-400">📋 Console Log</span>
        <span className="text-xs text-gray-500">({logs.length} messaggi)</span>
      </div>
      <div className="font-mono text-sm h-80 overflow-y-auto p-4 space-y-1">
        {logs.map((log, i) => (
          <div key={i} className={`${getLogColor(log.type)} flex items-start text-xs`}>
            {getLogIcon(log.type)}
            <span className="break-all">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Categorie di oggetti per note
  const itemCategories = [
    { name: 'Armi', count: 40, icon: '⚔️' },
    { name: 'Armature', count: 20, icon: '🛡️' },
    { name: 'Equipaggiamento', count: 100, icon: '🎒' },
    { name: 'Oggetti magici', count: 80, icon: '✨' },
    { name: 'Consumabili', count: 40, icon: '💊' },
    { name: 'Strumenti', count: 20, icon: '🔧' },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <AncientContainer
        title="Import Oggetti"
        subtitle="Importa oggetti comuni, armi, armature e equipaggiamento nella tabella items"
        icon={Package}
        action={actions}
        footer={
          <div className="text-xs text-amber-600/80 space-y-2">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
              {itemCategories.map((cat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-lg">{cat.icon}</div>
                  <div className="text-[10px] text-amber-500">{cat.name}</div>
                  <div className="text-[10px] text-amber-600/60">{cat.count}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-amber-200 pt-2">
              <p className="font-semibold mb-1">⚠️ Note importanti:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Assicurati che il file <code className="bg-amber-100 px-1 rounded">items.json</code> sia nella cartella <code className="bg-amber-100 px-1 rounded">public/</code></li>
                <li>L&apos;import verifica i duplicati per nome</li>
                <li>Batch da 25 oggetti per volta (più sicuro)</li>
                <li>Pausa di 100ms tra i batch</li>
                <li>Supporta: armi, armature, equipaggiamento, oggetti magici, consumabili e strumenti</li>
                <li>Puoi eseguirlo più volte senza problemi</li>
              </ul>
            </div>
          </div>
        }
      >
        {/* Progresso */}
        {progressBar}
        
        {/* Pulsante import */}
        <div className="mb-6">
          {importButton}
        </div>
        
        {/* Logs */}
        {logsConsole}
        
        {/* Messaggio di benvenuto se non ci sono logs */}
        {logs.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📦</div>
            <p className="text-amber-700 font-serif">
              Premi &quot;Avvia Import Oggetti&quot; per iniziare
            </p>
            <p className="text-amber-600/60 text-sm mt-2">
              Verranno importati oltre 300 oggetti tra armi, armature, equipaggiamento e oggetti magici
            </p>
            <div className="flex justify-center gap-4 mt-4 text-amber-500/40">
              <span>⚔️</span>
              <span>🛡️</span>
              <span>🎒</span>
              <span>✨</span>
              <span>💊</span>
              <span>🔧</span>
            </div>
          </div>
        )}
      </AncientContainer>
    </div>
  );
}
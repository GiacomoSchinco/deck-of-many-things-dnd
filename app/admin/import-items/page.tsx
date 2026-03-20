// app/admin/import-items/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

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
    
    addLog('info', '📥 Caricamento file items.json...');
    
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200 p-6">
      <div className="container mx-auto max-w-3xl">
        <AncientCardContainer className="p-6">
          <h1 className="text-3xl font-serif font-bold text-amber-900 mb-2">
            📦 Import Oggetti
          </h1>
          <p className="text-amber-700 mb-6">
            Importa 300 oggetti comuni nella tabella `items`
          </p>

          {/* Statistiche */}
          {stats.success > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-lg text-center">
                <p className="text-xs text-green-700">Inseriti</p>
                <p className="text-2xl font-bold text-green-800">{stats.success}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg text-center">
                <p className="text-xs text-yellow-700">Già presenti</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.skipped}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg text-center">
                <p className="text-xs text-red-700">Errori</p>
                <p className="text-2xl font-bold text-red-800">{stats.errors}</p>
              </div>
            </div>
          )}

          {/* Progresso */}
          {progress.total > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-amber-700 mb-1">
                <span>Progresso</span>
                <span>{progress.current}/{progress.total}</span>
              </div>
              <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-700 transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Pulsanti */}
          <div className="flex gap-3 mb-6">
            <Button
              onClick={importItems}
              disabled={loading}
              className="flex-1 bg-amber-700 hover:bg-amber-800"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Import in corso...
                </>
              ) : (
                '🚀 Avvia Import'
              )}
            </Button>
            
            {logs.length > 0 && (
              <Button
                onClick={clearLogs}
                variant="outline"
                className="border-amber-700 text-amber-700"
              >
                🧹 Pulisci Log
              </Button>
            )}
          </div>

          {/* Logs */}
          {logs.length > 0 && (
            <AncientCardContainer className="p-4 bg-gray-900">
              <div className="flex items-center gap-2 mb-3 text-gray-400 border-b border-gray-700 pb-2">
                <span className="text-sm font-mono">Console Log</span>
                <span className="text-xs">({logs.length} messaggi)</span>
              </div>
              <div className="font-mono text-sm h-96 overflow-y-auto space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className={`${
                    log.type === 'success' ? 'text-green-400' : 
                    log.type === 'error' ? 'text-red-400' : 'text-gray-300'
                  } flex items-start`}>
                    {log.type === 'success' && <CheckCircle className="w-4 h-4 inline mr-2 text-green-400" />}
                    {log.type === 'error' && <AlertCircle className="w-4 h-4 inline mr-2 text-red-400" />}
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </AncientCardContainer>
          )}
        </AncientCardContainer>
      </div>
    </div>
  );
}
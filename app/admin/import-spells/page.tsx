// app/admin/import-spells/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function ImportSpellsPage() {
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

  const importSpells = async () => {
    setLoading(true);
    clearLogs();
    
    addLog('info', '📥 Caricamento file spells.json...');
    
    try {
      // 1. Carica il file JSON
      const response = await fetch('/spells.json');
      if (!response.ok) throw new Error('File spells.json non trovato');
      
      const spells = await response.json();
      setProgress({ current: 0, total: spells.length });
      addLog('success', `✅ Caricati ${spells.length} incantesimi dal JSON`);
      
      // 2. Verifica che la tabella esista
      addLog('info', '🔍 Verifica tabella spells...');
      const { error: tableCheckError } = await supabase
        .from('spells')
        .select('id')
        .limit(1);
      
      if (tableCheckError) {
        throw new Error('Tabella spells non accessibile: ' + tableCheckError.message);
      }
      
      // 3. Importa in batch da 25 (più sicuro)
      const BATCH_SIZE = 25;
      let success = 0;
      let errors = 0;
      let skipped = 0;
      
      for (let i = 0; i < spells.length; i += BATCH_SIZE) {
        const batch = spells.slice(i, i + BATCH_SIZE);
        
        // Prepara i dati
        const formattedBatch = batch.map(spell => {
          // Gestisci componenti
          let components = spell.components || [];
          if (spell.material && !components.includes('M')) {
            components.push('M');
          }
          
          // Gestisci higher level
          const atHigherLevels = spell.cantrip_upgrade || spell.higher_level_slot || null;
          
          // Descrizione (pulisci da caratteri problematici)
          const description = (spell.description_it || spell.description || '')
            .replace(/\u0000/g, '') // Rimuovi null bytes
            .trim();
          
          return {
            name: spell.name,
            level: spell.level,
            school: spell.school,
            casting_time: spell.casting_time || null,
            range: spell.range || null,
            components: components.length ? components : null,
            duration: spell.duration || null,
            description: description,
            at_higher_levels: atHigherLevels,
            ritual: spell.ritual || false,
            concentration: spell.concentration || false,
            classes: spell.classes || []
          };
        });
        
        // Filtra eventuali duplicati (controlla se già esiste)
        const names = formattedBatch.map(s => s.name);
        const { data: existing } = await supabase
          .from('spells')
          .select('name')
          .in('name', names);
        
        const existingNames = new Set(existing?.map(e => e.name) || []);
        
        const newSpells = formattedBatch.filter(s => !existingNames.has(s.name));
        skipped += formattedBatch.length - newSpells.length;
        
        if (newSpells.length === 0) {
          addLog('info', `⏭️ Batch ${i/BATCH_SIZE + 1}: tutti già presenti (saltato)`);
          setProgress({ current: i + batch.length, total: spells.length });
          continue;
        }
        
        // Inserisci i nuovi incantesimi
        const { error } = await supabase
          .from('spells')
          .insert(newSpells);
        
        if (error) {
          addLog('error', `❌ Batch ${i/BATCH_SIZE + 1}: ${error.message}`);
          errors += newSpells.length;
        } else {
          addLog('success', `✅ Batch ${i/BATCH_SIZE + 1}: inseriti ${newSpells.length} incantesimi`);
          success += newSpells.length;
        }
        
        setProgress({ current: i + batch.length, total: spells.length });
        setStats({ success, errors, skipped });
        
        // Piccola pausa per non sovraccaricare
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
      default: return 'text-gray-300';
    }
  };

  const getLogIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-4 h-4 inline mr-2 text-green-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 inline mr-2 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200 p-6">
      <div className="container mx-auto max-w-3xl">
        <AncientCardContainer className="p-6">
          <h1 className="text-3xl font-serif font-bold text-amber-900 mb-2">
            📜 Import Incantesimi
          </h1>
          <p className="text-amber-700 mb-6">
            Importa tutti gli incantesimi SRD in italiano nella tabella `spells`
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
              onClick={importSpells}
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
                  <div key={i} className={`${getLogColor(log.type)} flex items-start`}>
                    {getLogIcon(log.type)}
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </AncientCardContainer>
          )}

          {/* Note di sicurezza */}
          <div className="mt-6 text-xs text-amber-600 border-t border-amber-200 pt-4">
            <p className="font-semibold mb-1">⚠️ Note importanti:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Assicurati che il file <code className="bg-amber-100 px-1">spells.json</code> sia nella cartella <code className="bg-amber-100 px-1">public/</code></li>
              <li>L'import verifica i duplicati per nome</li>
              <li>Batch da 25 incantesimi per volta (più sicuro)</li>
              <li>Pausa di 100ms tra i batch</li>
              <li>Puoi eseguirlo più volte senza problemi</li>
            </ul>
          </div>
        </AncientCardContainer>
      </div>
    </div>
  );
}
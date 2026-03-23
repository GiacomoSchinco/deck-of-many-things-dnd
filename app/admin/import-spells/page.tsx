// app/admin/import-spells/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import AncientContainer from '@/components/custom/AncientContainer';
import { AlertCircle, CheckCircle, Loader2, BookOpen, Database, Sparkles } from 'lucide-react';

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
      onClick={importSpells}
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
          <BookOpen className="w-5 h-5 mr-2" />
          Avvia Import Incantesimi
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

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <AncientContainer
        title="Import Incantesimi SRD"
        subtitle="Importa tutti gli incantesimi SRD in italiano nella tabella spells"
        icon={BookOpen}
        action={actions}
        footer={
          <div className="text-xs text-amber-600/80 space-y-1">
            <p className="font-semibold mb-1">⚠️ Note importanti:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Assicurati che il file <code className="bg-amber-100 px-1 rounded">spells.json</code> sia nella cartella <code className="bg-amber-100 px-1 rounded">public/</code></li>
              <li>L'import verifica i duplicati per nome</li>
              <li>Batch da 25 incantesimi per volta (più sicuro)</li>
              <li>Pausa di 100ms tra i batch</li>
              <li>Puoi eseguirlo più volte senza problemi</li>
            </ul>
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
            <div className="text-6xl mb-4 opacity-50">📜</div>
            <p className="text-amber-700 font-serif">
              Premi &quot;Avvia Import Incantesimi&quot; per iniziare
            </p>
            <p className="text-amber-600/60 text-sm mt-2">
              Verranno importati tutti gli incantesimi SRD in italiano
            </p>
          </div>
        )}
      </AncientContainer>
    </div>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AncientScroll } from '../ui/custom/AncientScroll';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <AncientScroll variant="rolled" className="max-w-md mx-auto p-6 text-center space-y-4">
        <div className="text-4xl">✉️</div>
        <h2 className="text-amber-900">Email inviata!</h2>
        <p className="text-amber-700 text-sm">
          Abbiamo inviato un link a <strong>{email}</strong> per reimpostare la password.
          Controlla anche la cartella spam.
        </p>
        <Link href="/login" className="text-amber-700 underline text-sm">
          Torna al login
        </Link>
      </AncientScroll>
    );
  }

  return (
    <AncientScroll variant="rolled" className="max-w-md mx-auto p-6">
      <h2 className="text-center mb-2">Recupera Password</h2>
      <p className="text-center text-sm text-amber-700 mb-6">
        Inserisci la tua email e ti invieremo un link per reimpostare la password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="la-tua@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Invio in corso...' : 'Invia link di recupero'}
        </Button>

        <p className="text-center text-sm text-amber-700">
          <Link href="/login" className="underline hover:text-amber-900">
            Torna al login
          </Link>
        </p>
      </form>
    </AncientScroll>
  );
}

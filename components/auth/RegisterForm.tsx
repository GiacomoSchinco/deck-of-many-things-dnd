'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AncientScroll } from '../custom/AncientScroll';
import { CircleCheck, CircleX, Eye, EyeOff } from 'lucide-react';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }

    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <AncientScroll variant="rolled" className="max-w-md mx-auto p-6 text-center space-y-4">
        <div className="text-4xl">✉️</div>
        <h1 className="mb-0 text-amber-900">Controlla la tua email</h1>
        <p className="text-amber-700 text-sm">
          Abbiamo inviato un link di conferma a <strong>{email}</strong>.
          Clicca il link per attivare il tuo account.
        </p>
        <Link href="/login" className="text-amber-700 underline text-sm">
          Torna al login
        </Link>
      </AncientScroll>
    );
  }

  return (
    <AncientScroll variant="rolled" className="max-w-md mx-auto p-6">
      <h1 className="text-center mb-6">Crea il tuo Account</h1>

      <form onSubmit={handleRegister} className="space-y-4">
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

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimo 6 caratteri"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition-colors hover:text-ink-strong"
              aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirm-password">Conferma Password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Ripeti la password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition-colors hover:text-ink-strong"
              aria-label={showConfirm ? 'Nascondi password' : 'Mostra password'}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {/* Indicatore visivo coincidenza password */}
          {confirmPassword.length > 0 && (
            <p
              className={`mt-1 flex items-center gap-1.5 text-xs ${
                password === confirmPassword ? 'text-success' : 'text-destructive'
              }`}
            >
              {password === confirmPassword ? (
                <>
                  <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Le password coincidono
                </>
              ) : (
                <>
                  <CircleX className="h-3.5 w-3.5" aria-hidden="true" />
                  Le password non coincidono
                </>
              )}
            </p>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Registrazione in corso...' : 'Crea Account'}
        </Button>

        <p className="text-center text-sm text-ink-muted">
          Hai già un account?{' '}
          <Link href="/login" className="font-medium">
            Accedi
          </Link>
        </p>
      </form>
    </AncientScroll>
  );
}

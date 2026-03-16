'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AncientScroll } from '../ui/custom/AncientScroll';
import { Eye, EyeOff } from 'lucide-react';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

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
        <h2 className="text-amber-900">Controlla la tua email</h2>
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
      <h2 className="text-center mb-6">Crea il tuo Account</h2>

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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-900 transition-colors"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-900 transition-colors"
              aria-label={showConfirm ? 'Nascondi password' : 'Mostra password'}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {/* Indicatore visivo coincidenza password */}
          {confirmPassword.length > 0 && (
            <p className={`text-xs mt-1 ${password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
              {password === confirmPassword ? '✓ Le password coincidono' : '✗ Le password non coincidono'}
            </p>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Registrazione in corso...' : 'Crea Account'}
        </Button>

        <p className="text-center text-sm text-amber-700">
          Hai già un account?{' '}
          <Link href="/login" className="underline font-medium hover:text-amber-900">
            Accedi
          </Link>
        </p>
      </form>
    </AncientScroll>
  );
}

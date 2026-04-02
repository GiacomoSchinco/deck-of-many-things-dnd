import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
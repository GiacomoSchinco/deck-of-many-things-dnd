import { CreationWizard } from '@/components/character/creation-wizard';

export default function TestWizardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif text-amber-900 mb-6 text-center">
         Creazione Personaggio
        </h1>
        <CreationWizard />
      </div>
    </div>
  );
}

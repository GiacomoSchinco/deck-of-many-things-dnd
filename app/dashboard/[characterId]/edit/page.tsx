import WorkInProgress from '@/components/custom/WorkInProgress';

export default async function EditCharacterPage({
  params,
}: {
  // In Next 16 i params sono una Promise e vanno attesi prima dell'uso
  params: Promise<{ characterId: string }>;
}) {
  await params;
  return <WorkInProgress />;
}

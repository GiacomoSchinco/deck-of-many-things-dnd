// Scheda personaggio
export default function CharacterPage({
  params,
}: {
  params: { characterId: string };
}) {
  return <div>Character: {params.characterId}</div>;
}

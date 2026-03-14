export default function EditCharacterPage({
  params,
}: {
  params: { characterId: string };
}) {
  return <div>Edit Character: {params.characterId}</div>;
}

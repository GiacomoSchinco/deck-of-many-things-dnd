import WorkInProgress from "@/components/custom/WorkInProgress";

// import CharacterEditForm from "@/components/characters/CharacterEditForm";

type PageProps = {
    // In Next 16 i params sono una Promise e vanno attesi prima dell'uso
    params: Promise<{ characterId: string }>;
};

export default async function EditCharacterPage({ params }: PageProps) {
    const { characterId } = await params;

    if (!characterId) return <WorkInProgress />;

    return (
        <main className="space-y-4 p-6">
            <WorkInProgress />
        </main>
    );
}
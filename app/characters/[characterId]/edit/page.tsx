import WorkInProgress from "@/components/custom/WorkInProgress";

// import CharacterEditForm from "@/components/characters/CharacterEditForm";

type PageProps = {
    params: { characterId: string };
};

export default function EditCharacterPage({ params }: PageProps) {
    const { characterId } = params;

    if (!characterId) return <WorkInProgress />;

    return (
        <main className="space-y-4 p-6">
            <WorkInProgress />
        </main>
    );
}
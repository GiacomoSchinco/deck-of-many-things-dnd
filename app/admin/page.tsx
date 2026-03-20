import Link from 'next/link'
import AncientCardContainer from '@/components/custom/AncientCardContainer'

export default function AdminIndexPage() {
	const areas = [
		{ href: '/admin/equipment-presets', title: 'Equipment Presets', description: 'Crea, modifica e gestisci preset di equipaggiamento' },
		{ href: '/admin/import-items', title: 'Import Items', description: 'Importa oggetti dal json di riferimento' },
		{ href: '/admin/import-spells', title: 'Import Spells', description: 'Importa incantesimi dal json di riferimento' },
	]

	return (
		<div className="container mx-auto p-6">
			<div className="p-6">
				<h1 className="text-2xl font-serif font-bold text-amber-900 mb-6">Area Admin</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{areas.map((area) => (
						<Link key={area.href} href={area.href} className="group block">
							<AncientCardContainer size="md" padded>
								<div className="flex h-full w-full flex-col justify-center items-center text-center">
									<div>
										<h3 className="text-lg font-semibold text-amber-900">{area.title}</h3>
										<p className="mt-2 text-sm text-amber-700">{area.description}</p>
									</div>
								</div>
							</AncientCardContainer>
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}

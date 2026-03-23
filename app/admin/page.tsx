import Link from 'next/link'
import AncientContainer from '@/components/custom/AncientContainer'
import { AncientScroll } from '@/components/custom/AncientScroll'

export default function AdminIndexPage() {
	const areas = [
		{ href: '/admin/equipment-presets', title: 'Equipment Presets', description: 'Crea, modifica e gestisci preset di equipaggiamento' },
		{ href: '/admin/import-items', title: 'Import Items', description: 'Importa oggetti dal json di riferimento' },
		{ href: '/admin/import-spells', title: 'Import Spells', description: 'Importa incantesimi dal json di riferimento' },
		{ href: '/admin/items', title: 'Catalogo Oggetti', description: 'Visualizza, modifica e gestisci il catalogo oggetti' },
		{ href: '/admin/spells', title: 'Catalogo Incantesimi', description: 'Visualizza, modifica e gestisci il catalogo incantesimi' },
	]

	return (
		<AncientContainer title="Admin Dashboard - Il Santuario dell'Archivista" subtitle='Custodire il Caos, Plasmare il Destino'>
			<div className="p-6">
			
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{areas.map((area) => (
						<Link key={area.href} href={area.href} className="group block">
							<AncientScroll variant='rolled'>
								<div className="flex h-full w-full flex-col justify-center items-center text-center">
									<div>
										<h3 className="text-lg font-semibold text-amber-900">{area.title}</h3>
										<p className="mt-2 text-sm text-amber-700">{area.description}</p>
									</div>
								</div>
							</AncientScroll>
						</Link>
					))}
				</div>
			
		</div>
		</AncientContainer>
	)
}

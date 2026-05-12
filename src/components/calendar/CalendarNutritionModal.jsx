import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Modal from './Modal';
import { getCalendarNutrition } from '../../lib/api/calendars';

export default function CalendarNutritionModal({
	calendarId,
	dayKey,
	dayName,
	items,
	activeView,
	onClose,
}) {
	const formatAmount = (amount) => {
		if (amount > 0.01) return Number(amount).toFixed(2).replace('.', ',');
		return amount;
	};

	// Multi-expand accordion state (multiple nutrients can be open at once).
	const [openIds, setOpenIds] = useState(() => new Set());

	const {
		data: detailsData,
		isLoading: isLoadingDetails,
	} = useQuery({
		queryKey: ['calendar-nutrition-details', calendarId, dayKey],
		queryFn: () =>
			getCalendarNutrition(calendarId, dayKey, {
				include_recipes: true,
			}),
		enabled: !!calendarId && !!dayKey,
		staleTime: 5 * 60 * 1000,
	});

	const recipesByNutrient = detailsData?.nutrition_recipes || {};

	const rows = useMemo(() => {
		return items || [];
	}, [items]);

	const toggleExpanded = (id) => {
		setOpenIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	return (
		<Modal
			onClose={onClose}
			title={`Información nutricional - ${dayName}`}
			className='popupstyle1'
			dataModal='calendar-nutrition-details'
			width={640}
		>
			<div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
				{rows?.length ? (
					rows.map((item) => {
						const nutrientId = String(item.id);
						const isExpanded = openIds.has(nutrientId);
						const breakdown = recipesByNutrient?.[nutrientId]?.recipes || [];
						const panelId = `nutrient-panel-${dayKey}-${nutrientId}`;

						return (
							<div key={nutrientId} style={{ borderBottom: '1px solid #efefef' }}>
								<button
									type='button'
									onClick={() => toggleExpanded(nutrientId)}
									aria-expanded={isExpanded}
									aria-controls={panelId}
									style={{
										width: '100%',
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										padding: '8px 0',
										gap: 10,
										border: 'none',
										background: 'transparent',
										cursor: 'pointer',
									}}
								>
									<span
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: 8,
											minWidth: 0,
										}}
									>
										<span
											style={{
												width: 8,
												height: 8,
												borderRadius: '50%',
												display: 'inline-block',
												backgroundColor: item.main_color || '#42bd41',
											}}
										/>
										<span
											style={{
												textAlign: 'left',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
											}}
										>
											{item.nombre}
										</span>
										<span style={{ color: '#999', fontSize: 12, flex: '0 0 auto' }}>
											{isExpanded ? '▾' : '▸'}
										</span>
									</span>
									<span style={{ whiteSpace: 'nowrap', flex: '0 0 auto' }}>
										{activeView === 'statistics' || item.id === 94
											? `${formatAmount(item.cantidad)} ${item.unidad_medida}`
											: `${formatAmount(item.porcentaje)}%`}
									</span>
								</button>

								{isExpanded ? (
									<div
										id={panelId}
										style={{
											padding: '0 0 10px 16px',
										}}
									>
										{isLoadingDetails ? (
											<div style={{ padding: '6px 0', color: '#777', fontSize: 13 }}>
												Cargando…
											</div>
										) : breakdown.length ? (
											breakdown.map((r) => (
												<div
													key={r.id}
													style={{
														display: 'flex',
														justifyContent: 'space-between',
														gap: 10,
														padding: '4px 0',
														color: '#555',
														fontSize: 13,
													}}
												>
													<span
														style={{
															flex: 1,
															minWidth: 0,
															overflow: 'hidden',
															textOverflow: 'ellipsis',
														}}
													>
														{r.titulo}
													</span>
													<span style={{ whiteSpace: 'nowrap' }}>
														{formatAmount(r.cantidad)}{' '}
														{r.unidad_medida || item.unidad_medida}
													</span>
												</div>
											))
										) : (
											<div style={{ padding: '6px 0', color: '#777', fontSize: 13 }}>
												Sin desglose por receta.
											</div>
										)}
									</div>
								) : null}
							</div>
						);
					})
				) : (
					<p style={{ margin: 0 }}>No hay datos nutricionales para este día.</p>
				)}
			</div>
		</Modal>
	);
}

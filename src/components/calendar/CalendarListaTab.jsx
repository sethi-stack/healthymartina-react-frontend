import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendarLista } from '../../lib/api/calendars';
import './CalendarListaTab.scss';

/**
 * Calendar Lista Tab Component
 * Displays the ingredient list (lista) for a calendar
 */
export default function CalendarListaTab({
	calendarId,
	onClose,
	showExportButton = false,
	onExportPdf,
}) {
	const [selectedCategory, setSelectedCategory] = useState(null);

	const { data: listaData, isLoading } = useQuery({
		queryKey: ['calendar-lista', calendarId],
		queryFn: () => getCalendarLista(calendarId),
		enabled: !!calendarId,
	});

	if (isLoading) {
		return (
			<div className='lista-loading'>
				<div className='loader'>
					<img src='/img/progress-calendar.gif' alt='Loading' />
				</div>
			</div>
		);
	}

	const lista = listaData?.data || {};
	const categories = Object.keys(lista);

	return (
		<div className='calendar-lista-tab'>
			{showExportButton && onExportPdf && (
				<div className='lista-actions'>
					<button className='export-lista-btn' onClick={onExportPdf}>
						Exportar Lista PDF
					</button>
				</div>
			)}

			<div className='lista-content'>
				{categories.length === 0 ? (
					<p className='no-items'>No hay ingredientes en la lista</p>
				) : (
					categories.map((category) => (
						<div key={category} className='lista-category'>
							<h4 className='category-title'>{category}</h4>
							<ul className='ingredient-list'>
								{lista[category]?.map((item, index) => (
									<li key={index} className='ingredient-item'>
										<label className='ingredient-checkbox'>
											<input
												type='checkbox'
												checked={item.taken || false}
												onChange={() => {
													// TODO: Implement toggle taken
												}}
											/>
											<span className='ingredient-name'>{item.name}</span>
											{item.quantity && (
												<span className='ingredient-quantity'>
													{item.quantity}
												</span>
											)}
										</label>
									</li>
								))}
							</ul>
						</div>
					))
				)}
			</div>
		</div>
	);
}


import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendarNutrition } from '../../lib/api/calendars';
import './CalendarNutritionRow.scss';

/**
 * Calendar Nutrition Row Component
 * Displays nutritional information for each day below the calendar grid
 */
export default function CalendarNutritionRow({ calendar, days }) {
	const [activeView, setActiveView] = useState('statistics'); // 'statistics' or 'macros'
	const [selectedDay, setSelectedDay] = useState(null);

	// Default nutrition items from constants.php - matching the structure from nutrient_bottom.blade.php
	// Structure matches: [id, nombre, unidad_medida, cantidad, porcentaje, main_color]
	// IDs from constants.php: 1008->94 (Calorías), 1005->99 (Carbohidratos), 1003->96 (Proteína), 1004->97 (Grasa), 1079->213 (Fibra)
	const defaultNutritionItems = useMemo(() => {
		// Get default nutrients from constants structure
		const defaultNutrients = [
			{
				id: 94, // Calorías (1008 in constants key, but id is 94)
				nombre: 'Calorías',
				unidad_medida: 'kcal',
				cantidad: 0,
				porcentaje: 0,
				main_color: '#40deb',
			},
			{
				id: 99, // Carbohidratos (1005 in constants key, but id is 99)
				nombre: 'Carbohidratos',
				unidad_medida: 'g',
				cantidad: 0,
				porcentaje: 0,
				main_color: '#b279eb',
			},
			{
				id: 96, // Proteína (1003 in constants key, but id is 96)
				nombre: 'Proteína',
				unidad_medida: 'g',
				cantidad: 0,
				porcentaje: 0,
				main_color: '#3afe72',
			},
			{
				id: 97, // Grasa total (1004 in constants key, but id is 97)
				nombre: 'Grasa total',
				unidad_medida: 'g',
				cantidad: 0,
				porcentaje: 0,
				main_color: '#e79ccd',
			},
			{
				id: 213, // Fibra (1079 in constants key, but id is 213)
				nombre: 'Fibra',
				unidad_medida: 'g',
				cantidad: 0,
				porcentaje: 0,
				main_color: '#622817',
			},
		];
		return defaultNutrients;
	}, []);

	const handleDayClick = (dayKey) => {
		if (selectedDay === dayKey) {
			setSelectedDay(null);
		} else {
			setSelectedDay(dayKey);
			// TODO: Fetch nutrition data for the day
		}
	};

	return (
		<div className='nutrition'>
			<div role='nutrition'>
				<div className='table__row table__row--nutrition'>
					{/* Icon caption column */}
					<div className='col-xs icon-caption' role='caption'>
						<div className='table__caption table__caption--tabs flex-column'>
							<div className='table__cell-container'>
								<div
									className={`table__header flex-center nutrition-list-icon ${
										activeView === 'statistics' ? 'table__header--active' : ''
									}`}
									data-link='statistics'
									onClick={() => setActiveView('statistics')}
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='16'
										height='16'
										viewBox='0 0 16 16'
									>
										<path
											d='M2,6C0.9,6,0,6.9,0,8c0,1.1,0.9,2,2,2s2-0.9,2-2C4,6.9,3.1,6,2,6z M6,3h9
                                      c0.55,0,1-0.45,1-1c0-0.55-0.45-1-1-1H6C5.45,1,5,1.45,5,2C5,2.55,5.45,3,6,3z M2,12c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2s2-0.9,2-2
                                      C4,12.9,3.1,12,2,12z M15,7H6C5.45,7,5,7.45,5,8c0,0.55,0.45,1,1,1h9c0.55,0,1-0.45,1-1C16,7.45,15.55,7,15,7z M15,13H6
                                      c-0.55,0-1,0.45-1,1c0,0.55,0.45,1,1,1h9c0.55,0,1-0.45,1-1C16,13.45,15.55,13,15,13z M2,0C0.9,0,0,0.9,0,2c0,1.1,0.9,2,2,2
                                      s2-0.9,2-2C4,0.9,3.1,0,2,0z'
										></path>
									</svg>
								</div>
								<div
									className={`table__header nutrition-perct-icon flex-center ${
										activeView === 'macros' ? 'table__header--active' : ''
									}`}
									data-link='macros'
									onClick={() => setActiveView('macros')}
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='16'
										height='16'
										viewBox='0 0 16 16'
									>
										<path d='M7,1.08C3.63,1.58,1.03,4.48,1.03,8c0,3.87,3.13,7,6.98,7c3.52,0,6.42-2.61,6.91-6H7V1.08z'></path>
										<path d='M8,0v8h8C16,3.58,12.42,0,8,0z'></path>
									</svg>
								</div>
							</div>
						</div>
					</div>

					{/* Nutrition columns for each day */}
					{Object.entries(days).map(([dayKey, dayName]) => {
						return (
							<NutritionDayColumn
								key={dayKey}
								dayKey={dayKey}
								dayName={dayName}
								calendarId={calendar?.id}
								defaultItems={defaultNutritionItems}
								activeView={activeView}
								onClick={() => handleDayClick(dayKey)}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}

/**
 * Nutrition Day Column Component
 * Individual column for each day's nutrition data
 */
function NutritionDayColumn({
	dayKey,
	dayName,
	calendarId,
	defaultItems,
	activeView,
	onClick,
}) {
	// Fetch nutrition data for this day
	const {
		data: nutritionData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['calendar-nutrition', calendarId, dayKey],
		queryFn: () => getCalendarNutrition(calendarId, dayKey),
		enabled: !!calendarId && !!dayKey,
		retry: false, // Don't retry on error, use defaults
	});

	// Parse nutrition data - handle both array format and object format
	let nutritionItems = defaultItems;

	if (nutritionData?.nutrition && Array.isArray(nutritionData.nutrition)) {
		// Data comes as array: [id, nombre, unidad_medida, cantidad, porcentaje, main_color]
		nutritionItems = nutritionData.nutrition.map((item) => {
			if (Array.isArray(item)) {
				return {
					id: item[0],
					nombre: item[1],
					unidad_medida: item[2],
					cantidad: item[3] || 0,
					porcentaje: item[4] || 0,
					main_color: item[5] || '#42bd41',
				};
			}
			return item;
		});
	} else if (nutritionData?.data && Array.isArray(nutritionData.data)) {
		// Data comes as object array
		nutritionItems = nutritionData.data.map((item) => ({
			id: item.id,
			nombre: item.nombre || item.name,
			unidad_medida: item.unidad_medida || item.unit,
			cantidad: item.cantidad || item.amount || 0,
			porcentaje: item.porcentaje || item.percentage || 0,
			main_color: item.main_color || item.color || '#42bd41',
		}));
	}

	// Format amount for display
	const formatAmount = (amount) => {
		if (amount > 0.01) {
			return Number(amount).toFixed(2).replace('.', ',');
		}
		return amount;
	};

	return (
		<div className='col-xs data-nutritions' role='column-1'>
			<div className='table__column bottom_nutri_bar'>
				<div className='table__nutrition-container'>
					<div className='table__nutrition-wrap' id={dayKey} onClick={onClick}>
						{isLoading ? (
							<div className='loader-lista-ingrediente'>
								<img
									src='/img/progress-calendar.gif'
									alt='Loading'
									style={{ width: '150px' }}
								/>
							</div>
						) : (
							nutritionItems.map((item) => {
								// Show statistics view (amounts) by default
								const showItem =
									activeView === 'statistics' ||
									(item.id === 94 && activeView === 'macros'); // Calories always shown

								if (!showItem && activeView === 'macros') {
									// For macros view, only show specific nutrients
									if (
										item.id !== 96 &&
										item.id !== 97 &&
										item.id !== 99 &&
										item.id !== 94
									) {
										return null;
									}
								}

								return (
									<div
										key={item.id}
										className={`table__nutrition-item nutritients-list flex-center__y`}
										id={`l_nut_${item.id}`}
										style={{
											'--nutrient-color': item.main_color || '#42bd41',
										}}
									>
										<div>
											<span
												className='table__nutrition-item-label'
												title={item.nombre}
											>
												{item.nombre}
											</span>
										</div>
										<span className='table__nutrition-item-amount'>
											{activeView === 'statistics'
												? `${formatAmount(item.cantidad)} ${item.unidad_medida}`
												: item.id === 94
												? `${formatAmount(item.cantidad)} ${item.unidad_medida}`
												: `${formatAmount(item.porcentaje)}%`}
										</span>
									</div>
								);
							})
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

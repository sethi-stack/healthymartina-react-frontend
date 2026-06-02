import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendarNutritionSummary } from '../../lib/api/calendars';
import CalendarNutritionModal from './CalendarNutritionModal';
import {
	filterNutritionItemsForView,
	normalizeCalendarNutritionItems,
} from './nutritionUtils';
import './CalendarNutritionRow.scss';

/**
 * Calendar Nutrition Row Component
 * Displays nutritional information for each day below the calendar grid
 */
export default function CalendarNutritionRow({ calendar, days, nutritionPlanId = null }) {
	const [activeView, setActiveView] = useState('statistics'); // 'statistics' or 'macros'
	const [selectedDay, setSelectedDay] = useState(null);
	const [selectedDayName, setSelectedDayName] = useState('');
	const [selectedDayItems, setSelectedDayItems] = useState([]);

	const { data: nutritionSummary, isLoading } = useQuery({
		queryKey: ['calendar-nutrition', calendar?.id, nutritionPlanId],
		queryFn: () =>
			getCalendarNutritionSummary(
				calendar?.id,
				nutritionPlanId ? { plan_id: nutritionPlanId } : {}
			),
		enabled: !!calendar?.id,
		retry: false,
		staleTime: 10 * 60 * 1000,
		refetchOnMount: false,
	});

	const handleDayClick = (dayKey, dayName, items) => {
		setSelectedDay(dayKey);
		setSelectedDayName(dayName);
		setSelectedDayItems(items || []);
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
								activeView={activeView}
								isLoading={isLoading}
								nutritionData={nutritionSummary?.nutrition?.[dayKey]}
								onClick={(items) => handleDayClick(dayKey, dayName, items)}
							/>
						);
					})}
				</div>
			</div>
			{selectedDay && (
				<CalendarNutritionModal
					calendarId={calendar?.id}
					dayKey={selectedDay}
					dayName={selectedDayName}
					items={selectedDayItems}
					activeView={activeView}
					onClose={() => {
						setSelectedDay(null);
						setSelectedDayName('');
						setSelectedDayItems([]);
					}}
				/>
			)}
		</div>
	);
}

/**
 * Nutrition Day Column Component
 * Individual column for each day's nutrition data
 */
function NutritionDayColumn({
	dayKey,
	activeView,
	isLoading,
	nutritionData,
	onClick,
}) {
	const nutritionItems = normalizeCalendarNutritionItems(
		nutritionData?.nutrition || nutritionData?.data || nutritionData
	);
	const visibleItems = filterNutritionItemsForView(nutritionItems, activeView);

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
					<div
						className='table__nutrition-wrap'
						id={dayKey}
						onClick={() => onClick?.(visibleItems)}
					>
						{isLoading ? (
							<div className='loader-lista-ingrediente'>
								<img
									src='/img/iconos/recalentado.svg'
									className='hm-loading-spin'
									alt='Loading'
								/>
							</div>
						) : visibleItems.length ? (
							visibleItems.map((item) => {
								return (
									<div
										key={item.id}
										className={`table__nutrition-item nutritients-list flex-center__y`}
										id={`l_nut_${item.id}`}
									>
										<div>
											<span
												className='table__nutrition-item-dot'
												style={{
													backgroundColor: item.main_color || '#42bd41',
												}}
											></span>
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
						) : (
							<div className='table__nutrition-empty'>
								<span>No hay datos nutricionales</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRecipesByIds } from '../../lib/api/recipes';
import CalendarCell from './CalendarCell';
import CalendarNutritionRow from './CalendarNutritionRow';
import EditLabelsModal from './EditLabelsModal';
import './CalendarGrid.scss';

/**
 * Calendar Grid Component
 * Displays the calendar grid with days and meals
 */
export default function CalendarGrid({
	calendar,
	nutritionPlanId = null,
	readOnly = false,
}) {
	if (!calendar) return null;

	const [showEditLabelsModal, setShowEditLabelsModal] = useState(false);
	const [labelType, setLabelType] = useState(null); // 'days' or 'meals'
	const [selectedLabelKey, setSelectedLabelKey] = useState(null);


	// Parse calendar data - handle both API resource format and direct model format
	const labels = calendar.labels
		? typeof calendar.labels === 'string'
			? JSON.parse(calendar.labels)
			: calendar.labels
		: calendar.data?.labels
		? typeof calendar.data.labels === 'string'
			? JSON.parse(calendar.data.labels)
			: calendar.data.labels
		: { days: {}, meals: {} };

	const mainSchedule = calendar.main_schedule
		? typeof calendar.main_schedule === 'string'
			? JSON.parse(calendar.main_schedule)
			: calendar.main_schedule
		: calendar.data?.main_schedule
		? typeof calendar.data.main_schedule === 'string'
			? JSON.parse(calendar.data.main_schedule)
			: calendar.data.main_schedule
		: {};

	const sidesSchedule = calendar.sides_schedule
		? typeof calendar.sides_schedule === 'string'
			? JSON.parse(calendar.sides_schedule)
			: calendar.sides_schedule
		: calendar.data?.sides_schedule
		? typeof calendar.data.sides_schedule === 'string'
			? JSON.parse(calendar.data.sides_schedule)
			: calendar.data.sides_schedule
		: {};

	const mainServings = calendar.main_servings
		? typeof calendar.main_servings === 'string'
			? JSON.parse(calendar.main_servings)
			: calendar.main_servings
		: calendar.data?.main_servings
		? typeof calendar.data.main_servings === 'string'
			? JSON.parse(calendar.data.main_servings)
			: calendar.data.main_servings
		: {};

	const sidesServings = calendar.sides_servings
		? typeof calendar.sides_servings === 'string'
			? JSON.parse(calendar.sides_servings)
			: calendar.sides_servings
		: calendar.data?.sides_servings
		? typeof calendar.data.sides_servings === 'string'
			? JSON.parse(calendar.data.sides_servings)
			: calendar.data.sides_servings
		: {};

	const mainLeftovers = calendar.main_leftovers
		? typeof calendar.main_leftovers === 'string'
			? JSON.parse(calendar.main_leftovers)
			: calendar.main_leftovers
		: calendar.data?.main_leftovers
		? typeof calendar.data.main_leftovers === 'string'
			? JSON.parse(calendar.data.main_leftovers)
			: calendar.data.main_leftovers
		: {};

	const sidesLeftovers = calendar.sides_leftovers
		? typeof calendar.sides_leftovers === 'string'
			? JSON.parse(calendar.sides_leftovers)
			: calendar.sides_leftovers
		: calendar.data?.sides_leftovers
		? typeof calendar.data.sides_leftovers === 'string'
			? JSON.parse(calendar.data.sides_leftovers)
			: calendar.data.sides_leftovers
		: {};

	const mainRacion = calendar.main_racion
		? typeof calendar.main_racion === 'string'
			? JSON.parse(calendar.main_racion)
			: calendar.main_racion
		: calendar.data?.main_racion
		? typeof calendar.data.main_racion === 'string'
			? JSON.parse(calendar.data.main_racion)
			: calendar.data.main_racion
		: {};

	const sidesRacion = calendar.sides_racion
		? typeof calendar.sides_racion === 'string'
			? JSON.parse(calendar.sides_racion)
			: calendar.sides_racion
		: calendar.data?.sides_racion
		? typeof calendar.data.sides_racion === 'string'
			? JSON.parse(calendar.data.sides_racion)
			: calendar.data.sides_racion
		: {};

	// Default labels from config/constants.php
	const defaultDays = {
		day_1: 'Lunes',
		day_2: 'Martes',
		day_3: 'Miércoles',
		day_4: 'Jueves',
		day_5: 'Viernes',
		day_6: 'Sábado',
		day_7: 'Domingo',
	};

	const defaultMeals = {
		meal_1: 'Desayuno',
		meal_2: 'Lunch',
		meal_3: 'Comida',
		meal_4: 'Snack',
		meal_5: 'Cena',
		meal_6: 'Otros',
	};

	const normalizeLabel = (value, fallback) => {
		if (typeof value === 'string') {
			const trimmed = value.trim();
			return trimmed || fallback;
		}

		if (value === null || value === undefined) {
			return fallback;
		}

		const normalized = String(value).trim();
		return normalized || fallback;
	};

	// Original labels from constants (for dropdown options)
	const originalLabels = {
		days: defaultDays,
		meals: defaultMeals,
	};

	const days = labels.days && Object.keys(labels.days).length > 0 
		? labels.days 
		: defaultDays;
	const meals = labels.meals && Object.keys(labels.meals).length > 0 
		? labels.meals 
		: defaultMeals;
	const normalizedDays = Object.fromEntries(
		Object.entries(days).map(([dayKey, dayName]) => [
			dayKey,
			normalizeLabel(dayName, defaultDays[dayKey] || dayKey),
		])
	);
	const normalizedMeals = Object.fromEntries(
		Object.entries(meals).map(([mealKey, mealName]) => [
			mealKey,
			normalizeLabel(mealName, defaultMeals[mealKey] || mealKey),
		])
	);

	// Get all recipe IDs to fetch recipe details
	const allRecipeIds = new Set();
	Object.values(mainSchedule).forEach((day) => {
		Object.values(day || {}).forEach((recipeId) => {
			if (recipeId) allRecipeIds.add(recipeId);
		});
	});
	Object.values(sidesSchedule).forEach((day) => {
		Object.values(day || {}).forEach((recipeId) => {
			if (recipeId) allRecipeIds.add(recipeId);
		});
	});

	const recipeIds = Array.from(allRecipeIds);

	// Fetch all recipe details in one request
	const { data: recipesData } = useQuery({
		queryKey: ['recipes', 'bulk', recipeIds],
		queryFn: () => getRecipesByIds(recipeIds),
		staleTime: 10 * 60 * 1000,
		enabled: recipeIds.length > 0,
		refetchOnMount: false,
	});

	const recipesMap = (recipesData?.data || []).reduce((acc, recipe) => {
		acc[recipe.id] = recipe;
		return acc;
	}, {});

	return (
		<div className='general-calendar general-container-json hm-calendar' id='calendrio'>
			{/* Header row with day names */}
			<div className='row-th hm-calendar__header'>
				<div className='col-part-th hm-calendar__label-col'></div>
				{Object.entries(normalizedDays).map(([dayKey, normalizedDayName]) => {
					return (
						<div
							key={dayKey}
							className='col-day-th hm-calendar__day-col hm-calendar__day-col--header'
							onClick={
								readOnly
									? undefined
									: (e) => {
											e.preventDefault();
											setLabelType('days');
											setSelectedLabelKey(dayKey);
											setShowEditLabelsModal(true);
									  }
							}
						>
							<span id='labels' data-val={dayKey}></span>
							<p
								className={`desk cal_label_${dayKey} hm-calendar__label hm-calendar__label--desktop hm-label hm-label--day hm-label--clickable`}
								style={{ width: '100%' }}
							>
								{normalizedDayName}
							</p>
							<p
								className={`mobile cal_m_label_${dayKey} hm-calendar__label hm-calendar__label--mobile hm-label hm-label--day hm-label--clickable`}
							>
								{normalizedDayName.substring(0, 1)}
							</p>
						</div>
					);
				})}
			</div>

			{/* Meal rows */}
			{Object.entries(normalizedMeals).map(([mealKey, normalizedMealName], mealIndex) => {
				const mealNum = mealIndex + 1;
				return (
					<div key={mealKey} className={`row-td meal_${mealNum} hm-calendar__row`}>
						{/* Meal label column */}
						<div
							className='col-part-td hm-calendar__label-col'
							onClick={
								readOnly
									? undefined
									: (e) => {
											e.preventDefault();
											setLabelType('meals');
											setSelectedLabelKey(mealKey);
											setShowEditLabelsModal(true);
									  }
							}
						>
							<span id='labels' data-val={mealKey}></span>
							<p className={`desk cal_label_${mealKey} hm-calendar__label hm-calendar__label--vertical hm-calendar__label--desktop hm-label hm-label--meal hm-label--clickable`} style={{ width: '100%' }}>
								{normalizedMealName}
							</p>
							<p className={`mobile cal_m_label_${mealKey} hm-calendar__label hm-calendar__label--mobile hm-label hm-label--meal hm-label--clickable`}>
								{normalizedMealName.substring(0, 1)}
							</p>
						</div>

						{/* Day columns */}
						{Object.entries(normalizedDays).map(([dayKey], dayIndex) => {
							const dayNum = dayIndex + 1;
							const cellId = `main_${mealNum}_${dayNum}`;
							const mainRecipeId =
								mainSchedule[`day_${dayNum}`]?.[`meal_${mealNum}`];
							const sideRecipeId =
								sidesSchedule[`day_${dayNum}`]?.[`meal_${mealNum}`];
							const mainServing =
								mainServings[`day_${dayNum}`]?.[`meal_${mealNum}`];
							const sideServing =
								sidesServings[`day_${dayNum}`]?.[`meal_${mealNum}`];
							const mainLeftover =
								mainLeftovers[`day_${dayNum}`]?.[`meal_${mealNum}`];
							const sideLeftover =
								sidesLeftovers[`day_${dayNum}`]?.[`meal_${mealNum}`];
							const mainRacionValue =
								mainRacion[`day_${dayNum}`]?.[`meal_${mealNum}`];
							const sideRacionValue =
								sidesRacion[`day_${dayNum}`]?.[`meal_${mealNum}`];

							return (
								<CalendarCell
									key={cellId}
									cellId={cellId}
									dayNum={dayNum}
									dayKey={dayKey}
									mealNum={mealNum}
									mealKey={mealKey}
									mealName={normalizedMealName}
									calendarId={calendar.id}
									mainRecipeId={mainRecipeId}
									sideRecipeId={sideRecipeId}
									mainServing={mainServing}
									sideServing={sideServing}
									mainLeftover={mainLeftover}
									sideLeftover={sideLeftover}
									mainRacion={mainRacionValue}
									sideRacion={sideRacionValue}
									hasRecipe={!!mainRecipeId}
									mainRecipe={mainRecipeId ? recipesMap[mainRecipeId] : null}
									sideRecipe={sideRecipeId ? recipesMap[sideRecipeId] : null}
									dayLabels={normalizedDays}
									mealLabels={normalizedMeals}
									mainSchedule={mainSchedule}
									sidesSchedule={sidesSchedule}
									readOnly={readOnly}
								/>
							);
						})}
					</div>
				);
			})}

			{/* Nutrition row - shows nutritional info for each day */}
			<CalendarNutritionRow
				calendar={calendar}
				days={normalizedDays}
				nutritionPlanId={nutritionPlanId}
			/>

			{/* Edit Labels Modal */}
			{showEditLabelsModal && !readOnly && (
				<EditLabelsModal
					calendar={calendar}
					labelType={labelType}
					currentLabels={labelType === 'days' ? normalizedDays : normalizedMeals}
					originalLabels={
						labelType === 'days'
							? originalLabels.days
							: originalLabels.meals
					}
					selectedLabelKey={selectedLabelKey}
					onClose={() => {
						setShowEditLabelsModal(false);
						setLabelType(null);
						setSelectedLabelKey(null);
					}}
					onSuccess={() => {
						// Calendar data will be refreshed via query invalidation
						// The component will re-render with updated labels
					}}
				/>
			)}
		</div>
	);
}

import React, { useCallback, useMemo } from 'react';

/**
 * Days Selector Component
 * Checkbox group for selecting which days to add/update recipe
 * Complex validation logic based on general.js lines 116-158
 *
 * Rules for Main Recipes:
 * - Day ENABLED if no main recipe exists
 * - Day DISABLED+CHECKED if same recipe already exists
 * - Day DISABLED+CHECKED if different recipe exists
 *
 * Rules for Side Recipes:
 * - Day ENABLED only if main recipe exists
 * - Day DISABLED if no main recipe exists
 * - Day ENABLED+CHECKED if same side recipe exists
 * - Day DISABLED+CHECKED if different side recipe exists
 */
export default function DaysSelector({ selectedRecipeId, mealType = 'main', mealNum, mainSchedule = {}, sidesSchedule = {}, selectedDays, onChange, dayLabels = {}, isUpdateMode = false }) {
	const mealKey = `meal_${mealNum}`;

	/**
	 * Determine day state based on calendar schedule and meal type
	 * Returns { enabled: boolean, checked: boolean }
	 */
	const getDayState = useCallback(
		(dayKey) => {
			const mainDayData = mainSchedule[dayKey] || {};
			const mainRecipeId = mainDayData[mealKey];

			if (mealType === 'main') {
				// Main recipe logic (from general.js lines 116-142)
				if (!mainRecipeId) {
					// No recipe exists - day is available
					return {
						enabled: true,
						checked: selectedDays.includes(dayKey),
					};
				}

				if (mainRecipeId === selectedRecipeId) {
					// Same recipe exists - can update
					return {
						enabled: true,
						checked: true,
					};
				}

				// Different recipe exists - blocked
				return {
					enabled: false,
					checked: true,
				};
			} else {
				// Side recipe logic (from general.js lines 143-158)
				if (!mainRecipeId) {
					// No main recipe - can't add side
					return {
						enabled: false,
						checked: false,
					};
				}

				const sideDayData = sidesSchedule[dayKey] || {};
				const sideRecipeId = sideDayData[mealKey];

				if (!sideRecipeId) {
					// Main exists but no side - day available
					return {
						enabled: true,
						checked: selectedDays.includes(dayKey),
					};
				}

				if (sideRecipeId === selectedRecipeId) {
					// Same side recipe exists - can update
					return {
						enabled: true,
						checked: true,
					};
				}

				// Different side recipe exists - blocked
				return {
					enabled: false,
					checked: true,
				};
			}
		},
		[selectedRecipeId, mealType, mealKey, mainSchedule, sidesSchedule, selectedDays]
	);

	// Get enabled days count for validation
	const enabledDaysCount = useMemo(() => {
		return Object.keys(dayLabels).filter((dayKey) => {
			const state = getDayState(dayKey);
			return state.enabled && state.checked;
		}).length;
	}, [dayLabels, getDayState]);

	const handleDayChange = (dayKey, checked) => {
		if (checked) {
			onChange([...selectedDays, dayKey]);
		} else {
			onChange(selectedDays.filter((d) => d !== dayKey));
		}
	};

	return (
		<div className='form-group'>
			<p>Días</p>
			<div className='display-flex recpday-tabs'>
				{Object.entries(dayLabels || {}).map(([dayKey, dayLabel]) => {
					const { enabled, checked } = getDayState(dayKey);

					return (
						<label key={dayKey} className={`checkbox-label ${!enabled ? 'recpdaynum-disabled' : ''}`}>
							<input
								type='checkbox'
								className='recpdaynum'
								name='daynum[]'
								value={dayKey}
								checked={checked}
								disabled={!enabled}
								onChange={(e) => handleDayChange(dayKey, e.target.checked)}
							/>
							{dayLabel}
							<span className='checkmark'></span>
						</label>
					);
				})}
			</div>
		</div>
	);
}

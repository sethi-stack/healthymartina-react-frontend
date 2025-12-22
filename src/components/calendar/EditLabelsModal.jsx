import React, { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCalendarLabels } from '../../lib/api/calendars';
import './EditLabelsModal.scss';

/**
 * Edit Labels Modal Component
 * Allows editing day or meal labels with searchable dropdown
 */
export default function EditLabelsModal({
	calendar,
	labelType, // 'days' or 'meals'
	currentLabels, // Object with current labels { day_1: 'Lunes', ... }
	originalLabels, // Default labels from constants
	selectedLabelKey, // The specific label being edited (e.g., 'meal_1')
	onClose,
	onSuccess,
}) {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedLabel, setSelectedLabel] = useState(
		currentLabels[selectedLabelKey] || ''
	);
	const [showDropdown, setShowDropdown] = useState(false);
	const queryClient = useQueryClient();

	// Get all available labels (current + original that aren't in current)
	const availableLabels = useMemo(() => {
		const current = Object.values(currentLabels);
		const original = Object.values(originalLabels);
		const allLabels = [...new Set([...current, ...original])];
		return allLabels.sort();
	}, [currentLabels, originalLabels]);

	// Filter labels based on search
	const filteredLabels = useMemo(() => {
		if (!searchTerm) return availableLabels;
		return availableLabels.filter((label) =>
			label.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [availableLabels, searchTerm]);

	// Update labels mutation
	const updateMutation = useMutation({
		mutationFn: (data) => updateCalendarLabels(calendar?.id, data),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['calendar', calendar?.id] });
			if (onSuccess) {
				onSuccess(response);
			}
			onClose();
		},
	});

	const handleLabelSelect = (label) => {
		setSelectedLabel(label);
		setSearchTerm(label);
		setShowDropdown(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!selectedLabel.trim()) return;

		// API expects: label_type, label_name (the key), and the value in 'days' or 'meals' field
		const data = {
			label_type: labelType,
			label_name: selectedLabelKey,
		};

		// Add the new label value in the appropriate field
		if (labelType === 'days') {
			data.days = selectedLabel.trim();
		} else {
			data.meals = selectedLabel.trim();
		}

		updateMutation.mutate(data);
	};

	return (
		<div className='popup popupstyle1 calendario-labels' onClick={onClose}>
			<div className='container-popup' onClick={(e) => e.stopPropagation()}>
				<button className='close' onClick={onClose}>
					<i className='fas fa-times'></i>
				</button>
				<h3>Subtítulos del calendario</h3>
				<form onSubmit={handleSubmit} className='updateLabelsForm'>
					<input type='hidden' name='label_type' value={labelType} />
					<input type='hidden' name='label_name' value={selectedLabel} />

					<p>Subtítulos</p>
					<div className='dropdown-content myDropdown'>
						<i className='fas fa-search'></i>
						<input
							type='text'
							className='myInput'
							placeholder='Search..'
							maxLength='15'
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setShowDropdown(true);
							}}
							onFocus={() => setShowDropdown(true)}
							onBlur={() => {
								// Delay to allow click on dropdown items
								setTimeout(() => setShowDropdown(false), 200);
							}}
						/>
						{showDropdown && (
							<div className='dropdown-list'>
								{filteredLabels.length > 0 ? (
									filteredLabels.map((label, index) => (
										<a
											key={index}
											className={`name-value ${
												labelType === 'days'
													? 'name-value-days'
													: 'name-value-meals'
											}`}
											href='#'
											data-value={label}
											onMouseDown={(e) => {
												e.preventDefault();
												handleLabelSelect(label);
											}}
										>
											{label}
										</a>
									))
								) : (
									<div className='dropdown-no-results'>No results found</div>
								)}
							</div>
						)}
					</div>
					<input
						type='submit'
						value='Editar subtítulos'
						disabled={updateMutation.isPending || !selectedLabel.trim()}
					/>
				</form>
			</div>
		</div>
	);
}


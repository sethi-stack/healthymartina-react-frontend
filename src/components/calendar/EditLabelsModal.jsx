import React, { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCalendarLabels } from '../../lib/api/calendars';
import Modal from './Modal';
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
	// Start with empty search field for easier filtering
	const [searchTerm, setSearchTerm] = useState('');
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

	// Check if the typed value is a new label (not in existing list)
	const isNewLabel = useMemo(() => {
		if (!searchTerm.trim()) return false;
		return !availableLabels.some(
			(label) => label.toLowerCase() === searchTerm.trim().toLowerCase()
		);
	}, [searchTerm, availableLabels]);

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
		setSearchTerm(label);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const labelValue = searchTerm.trim();
		if (!labelValue) return;

		// API expects: label_type, label_name (the key), and the value in 'days' or 'meals' field
		const data = {
			label_type: labelType,
			label_name: selectedLabelKey,
		};

		// Add the new label value in the appropriate field
		if (labelType === 'days') {
			data.days = labelValue;
		} else {
			data.meals = labelValue;
		}

		updateMutation.mutate(data);
	};

	return (
		<Modal onClose={onClose} title='Subtítulos del calendario' className='popupstyle1 calendario-labels'>
			<form onSubmit={handleSubmit} className='updateLabelsForm'>
				<input type='hidden' name='label_type' value={labelType} />
				<input type='hidden' name='label_name' value={searchTerm} />

				<p>Subtítulos</p>
				<div className='dropdown-content myDropdown'>
					<input
						type='text'
						className='myInput'
						placeholder='Buscar o crear nuevo...'
						maxLength='15'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						autoFocus
					/>
					<div className='dropdown-list'>
						{/* Show "Create new" option when typing a new label */}
						{isNewLabel && (
							<a
								className='name-value name-value-new'
								href='#'
								onClick={(e) => e.preventDefault()}
							>
								<strong>+ Crear:</strong> "{searchTerm.trim()}"
							</a>
						)}
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
									onClick={(e) => {
										e.preventDefault();
										handleLabelSelect(label);
									}}
								>
									{label}
								</a>
							))
						) : !isNewLabel ? (
							<div className='dropdown-no-results'>No hay resultados</div>
						) : null}
					</div>
				</div>
				<input
					type='submit'
					value={isNewLabel ? 'Crear y aplicar' : 'Editar subtítulos'}
					disabled={updateMutation.isPending || !searchTerm.trim()}
				/>
			</form>
		</Modal>
	);
}


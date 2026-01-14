import React, { useState, useEffect } from 'react';
import Modal from '../calendar/Modal';
import '../shared/ModalForms.scss';

/**
 * AddIngredientModal Component
 * Modal for adding manual ingredients to lista
 */
export default function AddIngredientModal({
	categories = [],
	selectedCategoryId = null,
	onClose,
	onSubmit,
	isLoading = false,
}) {
	const [formData, setFormData] = useState({
		cantidad: '',
		unidad_medida: '',
		nombre: '',
		categoria: selectedCategoryId || '',
	});

	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (selectedCategoryId) {
			setFormData((prev) => ({ ...prev, categoria: selectedCategoryId }));
		}
	}, [selectedCategoryId]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	const validate = () => {
		const newErrors = {};

		if (!formData.cantidad || formData.cantidad <= 0) {
			newErrors.cantidad = 'La cantidad es requerida y debe ser mayor a 0';
		}

		if (!formData.unidad_medida || formData.unidad_medida.trim() === '') {
			newErrors.unidad_medida = 'La unidad de medida es requerida';
		} else if (formData.unidad_medida.length > 50) {
			newErrors.unidad_medida =
				'La unidad de medida no puede exceder 50 caracteres';
		}

		if (!formData.nombre || formData.nombre.trim() === '') {
			newErrors.nombre = 'El nombre es requerido';
		} else if (formData.nombre.length > 50) {
			newErrors.nombre = 'El nombre no puede exceder 50 caracteres';
		}

		if (!formData.categoria) {
			newErrors.categoria = 'La categoría es requerida';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		if (onSubmit) {
			onSubmit(formData);
		}
	};

	return (
		<Modal
			isOpen={true}
			onClose={onClose}
			title='Agregar ingrediente'
			width={540}
		>
			<form onSubmit={handleSubmit}>
				<div className='row'>
					<div className='col12'>
						<label htmlFor='cantidad'>Cantidad</label>
						<input
							id='cantidad'
							type='number'
							step='0.01'
							name='cantidad'
							placeholder='3'
							value={formData.cantidad}
							onChange={handleChange}
							autoComplete='off'
							disabled={isLoading}
						/>
						{errors.cantidad && (
							<span className='error-message'>{errors.cantidad}</span>
						)}
					</div>
					<div className='col12'>
						<label htmlFor='unidad_medida'>Unidad de medida</label>
						<input
							id='unidad_medida'
							type='text'
							name='unidad_medida'
							placeholder='tazas'
							maxLength={50}
							value={formData.unidad_medida}
							onChange={handleChange}
							autoComplete='off'
							disabled={isLoading}
						/>
						{errors.unidad_medida && (
							<span className='error-message'>{errors.unidad_medida}</span>
						)}
					</div>
				</div>

				<label htmlFor='nombre'>Nombre del ingrediente</label>
				<input
					id='nombre'
					type='text'
					name='nombre'
					placeholder='Nombre del ingrediente'
					maxLength={50}
					value={formData.nombre}
					onChange={handleChange}
					autoComplete='off'
					disabled={isLoading}
				/>
				{errors.nombre && (
					<span className='error-message'>{errors.nombre}</span>
				)}

				<label htmlFor='categoria'>Categoría</label>
				<select
					id='categoria'
					name='categoria'
					value={formData.categoria}
					onChange={handleChange}
					disabled={isLoading}
				>
					<option value=''>Seleccionar categoría</option>
					{categories.map((cat) => (
						<option key={cat.id} value={cat.id}>
							{cat.nombre}
						</option>
					))}
				</select>
				{errors.categoria && (
					<span className='error-message'>{errors.categoria}</span>
				)}

				<input
					type='submit'
					value={isLoading ? 'Agregando...' : 'Agregar ingrediente'}
					disabled={isLoading}
				/>
			</form>
		</Modal>
	);
}

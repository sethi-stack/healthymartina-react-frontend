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
			dataModal='add-ingredient'
		>
			<form onSubmit={handleSubmit} className='hm-form'>
				<div className='row'>
					<div className='col12'>
						<div className='hm-form__group'>
							<label htmlFor='cantidad' className='hm-form__label'>Cantidad</label>
							<input
								id='cantidad'
								type='number'
								step='0.01'
								name='cantidad'
								className='hm-form__input'
								placeholder='3'
								value={formData.cantidad}
								onChange={handleChange}
								autoComplete='off'
								disabled={isLoading}
							/>
							{errors.cantidad && (
								<span className='hm-form__error'>{errors.cantidad}</span>
							)}
						</div>
					</div>
					<div className='col12'>
						<div className='hm-form__group'>
							<label htmlFor='unidad_medida' className='hm-form__label'>Unidad de medida</label>
							<input
								id='unidad_medida'
								type='text'
								name='unidad_medida'
								className='hm-form__input'
								placeholder='tazas'
								maxLength={50}
								value={formData.unidad_medida}
								onChange={handleChange}
								autoComplete='off'
								disabled={isLoading}
							/>
							{errors.unidad_medida && (
								<span className='hm-form__error'>{errors.unidad_medida}</span>
							)}
						</div>
					</div>
				</div>

				<div className='hm-form__group'>
					<label htmlFor='nombre' className='hm-form__label'>Nombre del ingrediente</label>
					<input
						id='nombre'
						type='text'
						name='nombre'
						className='hm-form__input'
						placeholder='Nombre del ingrediente'
						maxLength={50}
						value={formData.nombre}
						onChange={handleChange}
						autoComplete='off'
						disabled={isLoading}
					/>
					{errors.nombre && (
						<span className='hm-form__error'>{errors.nombre}</span>
					)}
				</div>

				<div className='hm-form__group'>
					<label htmlFor='categoria' className='hm-form__label'>Categoría</label>
					<select
						id='categoria'
						name='categoria'
						className='hm-form__select'
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
						<span className='hm-form__error'>{errors.categoria}</span>
					)}
				</div>

				<button
					type='submit'
					className='hm-btn hm-btn--outline hm-btn--block'
					disabled={isLoading}
				>
					{isLoading ? 'Agregando...' : 'Agregar ingrediente'}
				</button>
			</form>
		</Modal>
	);
}

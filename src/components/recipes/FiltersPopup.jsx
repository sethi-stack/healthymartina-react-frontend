import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaInfoCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import { getFilterMetadata } from '../../lib/api/recipes';
import { RangeSlider } from './RangeSlider';
import Modal from '../calendar/Modal';
import './FiltersPopup.scss';

/**
 * FiltersPopup Component
 * Reusable popup for filtering recipes with two tabs: Avanzado and Nutrición
 */
export function FiltersPopup({
	isOpen,
	onClose,
	onApplyFilters,
	initialFilters = {},
}) {
	const [activeTab, setActiveTab] = useState('avanzado'); // 'avanzado' or 'nutricion'
	const [filters, setFilters] = useState({
		tags: initialFilters.tags || [],
		ingrediente_incluir: initialFilters.ingrediente_incluir || [],
		ingrediente_excluir: initialFilters.ingrediente_excluir || [],
		num_ingredientes: initialFilters.num_ingredientes || { min: 0, max: 10 },
		num_tiempo: initialFilters.num_tiempo || { min: 0, max: 60 },
		calorias: initialFilters.calorias || { min: 0, max: 900 },
		nutrientes: initialFilters.nutrientes || {},
	});

	// Fetch filter metadata
	const { data: metadata, isLoading } = useQuery({
		queryKey: ['filter-metadata'],
		queryFn: getFilterMetadata,
		enabled: isOpen,
	});

	// Update filters when initialFilters change
	useEffect(() => {
		if (Object.keys(initialFilters).length > 0) {
			setFilters({
				tags: initialFilters.tags || [],
				ingrediente_incluir: initialFilters.ingrediente_incluir || [],
				ingrediente_excluir: initialFilters.ingrediente_excluir || [],
				num_ingredientes: initialFilters.num_ingredientes || {
					min: 0,
					max: 10,
				},
				num_tiempo: initialFilters.num_tiempo || { min: 0, max: 60 },
				calorias: initialFilters.calorias || { min: 0, max: 900 },
				nutrientes: initialFilters.nutrientes || {},
			});
		}
	}, [initialFilters]);

	const handleTagChange = (tagId) => {
		setFilters((prev) => ({
			...prev,
			tags: prev.tags.includes(tagId)
				? prev.tags.filter((id) => id !== tagId)
				: [...prev.tags, tagId],
		}));
	};

	const handleIngredientIncludeChange = (ingredientId) => {
		setFilters((prev) => ({
			...prev,
			ingrediente_incluir: prev.ingrediente_incluir.includes(ingredientId)
				? prev.ingrediente_incluir.filter((id) => id !== ingredientId)
				: [...prev.ingrediente_incluir, ingredientId],
		}));
	};

	const handleIngredientExcludeChange = (ingredientId) => {
		setFilters((prev) => ({
			...prev,
			ingrediente_excluir: prev.ingrediente_excluir.includes(ingredientId)
				? prev.ingrediente_excluir.filter((id) => id !== ingredientId)
				: [...prev.ingrediente_excluir, ingredientId],
		}));
	};

	const handleRangeChange = (key, min, max) => {
		setFilters((prev) => ({
			...prev,
			[key]: { min, max },
		}));
	};

	const handleNutrientChange = (fdcId, min, max) => {
		setFilters((prev) => ({
			...prev,
			nutrientes: {
				...prev.nutrientes,
				[fdcId]: { min, max },
			},
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Clean up empty filters before submitting
		const cleanedFilters = { ...filters };

		// Remove empty arrays
		if (cleanedFilters.tags.length === 0) delete cleanedFilters.tags;
		if (cleanedFilters.ingrediente_incluir.length === 0)
			delete cleanedFilters.ingrediente_incluir;
		if (cleanedFilters.ingrediente_excluir.length === 0)
			delete cleanedFilters.ingrediente_excluir;

		// Remove default ranges
		if (
			cleanedFilters.num_ingredientes.min === 0 &&
			cleanedFilters.num_ingredientes.max === 10
		) {
			delete cleanedFilters.num_ingredientes;
		}
		if (
			cleanedFilters.num_tiempo.min === 0 &&
			cleanedFilters.num_tiempo.max === 60
		) {
			delete cleanedFilters.num_tiempo;
		}
		if (
			cleanedFilters.calorias.min === 0 &&
			cleanedFilters.calorias.max === 900
		) {
			delete cleanedFilters.calorias;
		}

		// Remove empty nutrientes
		if (Object.keys(cleanedFilters.nutrientes).length === 0) {
			delete cleanedFilters.nutrientes;
		} else {
			// Remove nutrientes with default values
			Object.keys(cleanedFilters.nutrientes).forEach((fdcId) => {
				const nutrient = cleanedFilters.nutrientes[fdcId];
				const nutrientData = metadata?.nutrient_types
					?.flatMap((type) => type.nutrientes)
					?.find((n) => n.fdc_id === fdcId);

				if (nutrientData) {
					const baseMax = nutrientData.cien_porciento || 100;
					const factor = nutrientData.factor || 0;
					const maxValue = factor !== 0 ? baseMax * factor : baseMax;
					if (nutrient.min === 0 && nutrient.max === maxValue) {
						delete cleanedFilters.nutrientes[fdcId];
					}
				}
			});

			if (Object.keys(cleanedFilters.nutrientes).length === 0) {
				delete cleanedFilters.nutrientes;
			}
		}

		onApplyFilters(cleanedFilters);
		onClose();
	};

	const handleReset = () => {
		setFilters({
			tags: [],
			ingrediente_incluir: [],
			ingrediente_excluir: [],
			num_ingredientes: { min: 0, max: 10 },
			num_tiempo: { min: 0, max: 60 },
			calorias: { min: 0, max: 900 },
			nutrientes: {},
		});
		onApplyFilters({});
	};

	const defaults = metadata?.defaults || {};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			className='filtros'
			title='Filtros'
			closeOnOverlay={false}
			width={720}
		>
			<div className='indicadores'>
				<a
					className={`i-a ${activeTab === 'avanzado' ? 'active' : ''}`}
					href='#'
					onClick={(e) => {
						e.preventDefault();
						setActiveTab('avanzado');
					}}
				>
					Avanzado
				</a>
				<a
					className={`i-n ${activeTab === 'nutricion' ? 'active' : ''}`}
					href='#'
					onClick={(e) => {
						e.preventDefault();
						setActiveTab('nutricion');
					}}
				>
					Nutrición
				</a>
			</div>
			<form id='form-filters' onSubmit={handleSubmit}>
				{/* Avanzado Tab */}
				<div
					className={`slide-indicadores ${
						activeTab === 'avanzado' ? 'slide-active' : ''
					} s-a`}
				>
					{isLoading ? (
						<p>Cargando filtros...</p>
					) : (
						<>
							<p>
								Etiquetas
								<a
									style={{ position: 'relative' }}
									href='https://healthy-martina.helpscoutdocs.com/article/36-con-que-criterios-etiquetan-sus-recetas'
									target='_blank'
									rel='noopener noreferrer'
								>
									<FaInfoCircle />
								</a>
							</p>
							<Select
								id='filtros-tags'
								isMulti
								options={metadata?.tags?.map((tag) => ({
									value: tag.id,
									label: tag.nombre,
								}))}
								value={metadata?.tags
									?.filter((tag) => filters.tags.includes(tag.id))
									.map((tag) => ({ value: tag.id, label: tag.nombre }))}
								onChange={(selected) => {
									setFilters((prev) => ({
										...prev,
										tags: selected ? selected.map((item) => item.value) : [],
									}));
								}}
								placeholder='Seleccionar etiquetas...'
								className='filtros-select'
								classNamePrefix='filtros-select'
								isSearchable
								menuPortalTarget={document.body}
								styles={{
									menuPortal: (base) => ({ ...base, zIndex: 1000000 }),
								}}
							/>

							<p>Incluír ingredientes</p>
							<Select
								className='filtros-ingredientes'
								isMulti
								options={metadata?.ingredientes?.map((ingrediente) => ({
									value: ingrediente.id,
									label: ingrediente.nombre,
								}))}
								value={metadata?.ingredientes
									?.filter((ing) => filters.ingrediente_incluir.includes(ing.id))
									.map((ing) => ({ value: ing.id, label: ing.nombre }))}
								onChange={(selected) => {
									setFilters((prev) => ({
										...prev,
										ingrediente_incluir: selected
											? selected.map((item) => item.value)
											: [],
									}));
								}}
								placeholder='Seleccionar ingredientes...'
								className='filtros-select'
								classNamePrefix='filtros-select'
								isSearchable
								menuPortalTarget={document.body}
								styles={{
									menuPortal: (base) => ({ ...base, zIndex: 1000000 }),
								}}
							/>

							<p>Excluir ingredientes</p>
							<Select
								className='filtros-ingredientes'
								isMulti
								options={metadata?.ingredientes?.map((ingrediente) => ({
									value: ingrediente.id,
									label: ingrediente.nombre,
								}))}
								value={metadata?.ingredientes
									?.filter((ing) => filters.ingrediente_excluir.includes(ing.id))
									.map((ing) => ({ value: ing.id, label: ing.nombre }))}
								onChange={(selected) => {
									setFilters((prev) => ({
										...prev,
										ingrediente_excluir: selected
											? selected.map((item) => item.value)
											: [],
									}));
								}}
								placeholder='Seleccionar ingredientes...'
								className='filtros-select'
								classNamePrefix='filtros-select'
								isSearchable
								menuPortalTarget={document.body}
								styles={{
									menuPortal: (base) => ({ ...base, zIndex: 1000000 }),
								}}
							/>

							<div className='rango'>
								<div className='row-rango'>
									<RangeSlider
										min={0}
										max={10}
										valueMin={filters.num_ingredientes.min}
										valueMax={filters.num_ingredientes.max}
										onChange={(min, max) =>
											handleRangeChange('num_ingredientes', min, max)
										}
										label='Ingredientes'
									/>
								</div>
							</div>

							<div className='rango'>
								<RangeSlider
									min={0}
									max={60}
									valueMin={filters.num_tiempo.min}
									valueMax={filters.num_tiempo.max}
									onChange={(min, max) =>
										handleRangeChange('num_tiempo', min, max)
									}
									label='Minutos'
								/>
							</div>

							<input className='new_filter' type='submit' value='Guardar' />
							<a
								className='new'
								href='#'
								onClick={(e) => {
									e.preventDefault();
									handleReset();
								}}
							>
								Borrar
							</a>
						</>
					)}
				</div>

				{/* Nutrición Tab */}
				<div
					className={`slide-indicadores ${
						activeTab === 'nutricion' ? 'slide-active' : ''
					} s-n`}
				>
					{isLoading ? (
						<p>Cargando filtros...</p>
					) : (
						<>
							<RangeSlider
								min={0}
								max={900}
								valueMin={filters.calorias.min}
								valueMax={filters.calorias.max}
								onChange={(min, max) => handleRangeChange('calorias', min, max)}
								label='Calorias'
							/>

							{metadata?.nutrient_types?.map((nutrientType) => (
								<div key={nutrientType.id}>
									<h4 className='subtitle'>{nutrientType.name}</h4>
									{nutrientType.nutrientes
										?.filter((n) => n.mostrar === 1 && n.fdc_id !== '1008')
										.map((nutriente) => {
											// Calculate max value considering factor (like getCienPorciento method)
											// Handle null/undefined but preserve 0 values
											const baseMax =
												nutriente.cien_porciento != null
													? nutriente.cien_porciento
													: null;
											const factor = nutriente.factor ?? 0;

											// Calculate maxValue: if factor exists and is not 0, multiply; otherwise use baseMax
											let maxValue =
												factor != null && factor !== 0 && baseMax != null
													? baseMax * factor
													: baseMax;

											// If maxValue is 0, null, or undefined, use a default based on nutrient type
											// For macros and calories, use reasonable defaults
											if (maxValue == null || maxValue === 0) {
												// Default max values for common nutrients
												const defaultMaxes = {
													calories: 900,
													protein: 200, // grams
													fat: 100, // grams
													carbs: 300, // grams
												};
												// Try to infer from nutrient name or use generic default
												const nombreLower = (nutriente.nombre || '').toLowerCase();
												if (
													nombreLower.includes('calor') ||
													nombreLower.includes('energy')
												) {
													maxValue = defaultMaxes.calories;
												} else if (
													nombreLower.includes('prote') ||
													nombreLower.includes('protein')
												) {
													maxValue = defaultMaxes.protein;
												} else if (
													nombreLower.includes('grasa') ||
													nombreLower.includes('fat') ||
													nombreLower.includes('lípid')
												) {
													maxValue = defaultMaxes.fat;
												} else if (
													nombreLower.includes('carb') ||
													nombreLower.includes('hidrat')
												) {
													maxValue = defaultMaxes.carbs;
												} else {
													maxValue = 100; // Generic default
												}
											}

											// Get unidad_medida (like getUnidadMedida method)
											const unidadMedida =
												factor !== 0
													? nutriente.unidad_nueva ||
													  nutriente.unidad_medida ||
													  ''
													: nutriente.unidad_medida || '';

											const currentFilter =
												filters.nutrientes[nutriente.fdc_id] || {
													min: 0,
													max: maxValue,
												};

											return (
												<RangeSlider
													key={nutriente.fdc_id}
													min={0}
													max={maxValue}
													valueMin={currentFilter.min}
													valueMax={currentFilter.max}
													onChange={(min, max) =>
														handleNutrientChange(nutriente.fdc_id, min, max)
													}
													label={`${unidadMedida} ${nutriente.nombre}`}
													decimal={nutriente.decimal || 0}
												/>
											);
										})}
								</div>
							))}

							<input type='submit' value='Guardar' />
							<a
								className='new'
								href='#'
								onClick={(e) => {
									e.preventDefault();
									handleReset();
								}}
							>
								Borrar
							</a>
						</>
					)}
				</div>
			</form>
		</Modal>
	);
}

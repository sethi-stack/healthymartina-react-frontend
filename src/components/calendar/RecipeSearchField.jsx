import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRecipes } from '../../lib/api/recipes';

/**
 * Recipe Search Field Component
 * Provides live search with accent-insensitive filtering
 * Based on general.js lines 62-77
 */
export default function RecipeSearchField({ onSelect, exclude = [], placeholder = 'Buscar receta...' }) {
	const [query, setQuery] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef(null);

	// Fetch all recipes for search
	const { data: recipesData, isLoading } = useQuery({
		queryKey: ['recipes', 'calendar-search'],
		queryFn: () => getRecipes({ per_page: 1000 }),
		staleTime: 5 * 60 * 1000, // Cache for 5 minutes
	});

	// Normalize string for accent-insensitive search (from general.js line 70)
	const normalizeString = (str) => {
		return str
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '');
	};

	// Filter recipes based on search query
	const filteredRecipes = useMemo(() => {
		if (!recipesData?.data) return [];

		const recipes = recipesData.data.filter((recipe) => !exclude.includes(recipe.id));

		if (!query.trim()) return recipes;

		const normalizedQuery = normalizeString(query);
		return recipes.filter((recipe) => normalizeString(recipe.titulo).includes(normalizedQuery));
	}, [query, recipesData, exclude]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSelect = (recipe) => {
		onSelect(recipe);
		setQuery('');
		setIsOpen(false);
	};

	return (
		<div className='form-group' ref={containerRef}>
			<p>Buscar</p>
			<div className='sitem-search'>
				<div className='sitem-search-box'>
					<i className='fas fa-search'></i>
					<input
						type='text'
						className='sitem-search-input'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() => setIsOpen(true)}
						placeholder={placeholder}
					/>
				</div>
				{isOpen && (
					<div className='sitems-list' style={{ display: 'block' }}>
						{isLoading && <div className='sitem-info'>Cargando...</div>}
						{!isLoading && filteredRecipes.length === 0 && <div className='sitem-info'>No se encontraron recetas</div>}
						{!isLoading &&
							filteredRecipes.map((recipe) => (
								<div
									key={recipe.id}
									className='sitem-info'
									data-itemid={recipe.id}
									data-itemtitle={recipe.titulo}
									data-itemlink={`/receta/${recipe.slug}`}
									data-nombre={recipe.porcion_nombre}
									data-nombre_plural={recipe.porcion_nombre_plural}
									onClick={() => handleSelect(recipe)}
									style={{ cursor: 'pointer' }}
								>
									<div className='sitem-img'>
										<img src={recipe.imagen_pequena || recipe.imagen} alt={recipe.titulo} />
									</div>
									<div className='sitem-title'>{recipe.titulo}</div>
								</div>
							))}
					</div>
				)}
			</div>
		</div>
	);
}

import React, { useState, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getRecipes, getAdvancedFilteredRecipes } from '../lib/api/recipes';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { FiltersPopup } from '../components/recipes/FiltersPopup';
import { FilterIcon, ResetFilterIcon, BookmarkIcon } from '../components/icons';
import './Recetario.scss';

export function Recetario() {
	const [hasBookmarkFilter, setHasBookmarkFilter] = useState(false);
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const [appliedFilters, setAppliedFilters] = useState({});
	const hasActiveFilters = Object.keys(appliedFilters).length > 0;

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
		isLoading,
	} = useInfiniteQuery({
		queryKey: ['recipes', { hasBookmarkFilter, filters: appliedFilters }],
		queryFn: ({ pageParam = 1 }) => {
			// Use advanced filter if filters are applied, otherwise use regular getRecipes
			if (hasActiveFilters) {
				return getAdvancedFilteredRecipes(appliedFilters, pageParam, 27);
			}
			return getRecipes({ page: pageParam, bookmark: hasBookmarkFilter });
		},
		getNextPageParam: (lastPage) => {
			// Handle Laravel pagination structure (Resource or standard)
			const meta = lastPage.meta || lastPage;
			if (meta.current_page < meta.last_page) {
				return meta.current_page + 1;
			}
			return undefined;
		},
		initialPageParam: 1,
	});

	const observer = useRef();
	const lastRecipeElementRef = useCallback(
		(node) => {
			if (isFetchingNextPage) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			});
			if (node) observer.current.observe(node);
		},
		[isFetchingNextPage, hasNextPage, fetchNextPage]
	);

	const handleAddToCalendar = (recipe) => {
		console.log('Add to calendar:', recipe);
		// Implement popup logic later
	};

	const handleFilterClick = () => {
		setIsFiltersOpen(true);
	};

	const handleResetFilter = () => {
		setAppliedFilters({});
		setHasBookmarkFilter(false);
	};

	const handleApplyFilters = (filters) => {
		setAppliedFilters(filters);
	};

	const handleBookmarkFilter = () => {
		setHasBookmarkFilter(!hasBookmarkFilter);
	};

	const recipes = data?.pages.flatMap((page) => page.data) || [];
	const totalRecipes =
		data?.pages[0]?.meta?.total || data?.pages[0]?.total || 0;

	return (
		<div id='application'>
			<div id='menu-vue'>
				<div className='recetario-page general-container'>
					<div className='indicador'>
						<div className='left'>
							<h3>Recetario</h3>
						</div>
						<div className='right'>
							<h3>{isLoading ? '...' : totalRecipes} recetas</h3>
						</div>
					</div>

					<div className='options'>
						<div className='left'>
							<div className='button-options'>
								<button
									className={`btn-filtro ${hasActiveFilters ? 'active' : ''}`}
									onClick={handleFilterClick}
								>
									<FilterIcon />
									<p>Filtro</p>
								</button>
							</div>
							<div className='button-options reset-filter'>
								<button className='reset-filter' onClick={handleResetFilter}>
									<ResetFilterIcon />
								</button>
							</div>
							<div className='button-options'>
								<button className='save-mark' onClick={handleBookmarkFilter}>
									<BookmarkIcon />
									<p>Marcador</p>
								</button>
							</div>
						</div>
						<div className='right'></div>
					</div>

					<div className='scrolling-pagination'>
						<div className='sub-container'>
							{status === 'success' && recipes.length === 0 ? (
								<div className='noResults'>
									<h3>No existen resultados para esos filtros.</h3>
								</div>
							) : (
								recipes.map((recipe, index) => {
									if (recipes.length === index + 1) {
										return (
											<RecipeCard
												ref={lastRecipeElementRef}
												key={recipe.id}
												recipe={recipe}
												onAddToCalendar={handleAddToCalendar}
											/>
										);
									} else {
										return (
											<RecipeCard
												key={recipe.id}
												recipe={recipe}
												onAddToCalendar={handleAddToCalendar}
											/>
										);
									}
								})
							)}
							{(isLoading || isFetchingNextPage) && (
								<div
									style={{
										width: '100%',
										textAlign: 'center',
										padding: '20px',
									}}
								>
									<img src='/img/progress.gif' alt='Loading...' />
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{isFiltersOpen && (
				<FiltersPopup
					onClose={() => setIsFiltersOpen(false)}
					onApplyFilters={handleApplyFilters}
					initialFilters={appliedFilters}
				/>
			)}
		</div>
	);
}

export default Recetario;

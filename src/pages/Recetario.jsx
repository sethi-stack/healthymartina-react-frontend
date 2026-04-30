import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
	getRecipes,
	getAdvancedFilteredRecipes,
	toggleRecipeBookmark,
} from '../lib/api/recipes';
import { getCalendar, getCalendars } from '../lib/api/calendars';
import AddMealModal from '../components/calendar/AddMealModal';
import { useCalendarStore } from '../stores/calendarStore';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { FiltersPopup } from '../components/recipes/FiltersPopup';
import { FilterIcon, ResetFilterIcon, BookmarkIcon } from '../components/icons';
import './Recetario.scss';

export function Recetario() {
	const [searchParams, setSearchParams] = useSearchParams();
	const queryClient = useQueryClient();
	const [hasBookmarkFilter, setHasBookmarkFilter] = useState(false);
	const [bookmarkedRecipeIds, setBookmarkedRecipeIds] = useState(() => new Set());
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const [appliedFilters, setAppliedFilters] = useState({});
	const [showAddMealModal, setShowAddMealModal] = useState(false);
	const [selectedRecipeForCalendar, setSelectedRecipeForCalendar] = useState(null);
	const selectedCalendarIdFromStore = useCalendarStore(
		(state) => state.selectedCalendarId
	);
	const setSelectedCalendar = useCalendarStore((state) => state.setSelectedCalendar);
	const hasActiveFilters = Object.keys(appliedFilters).length > 0;

	const { data: calendarsData } = useQuery({
		queryKey: ['calendars'],
		queryFn: () => getCalendars(),
		staleTime: 5 * 60 * 1000,
	});

	const calendars = calendarsData?.data || [];
	const hasStoredCalendarInList = calendars.some(
		(calendar) => calendar.id === selectedCalendarIdFromStore
	);
	const activeCalendarId = hasStoredCalendarInList
		? selectedCalendarIdFromStore
		: calendars?.[0]?.id || null;

	useEffect(() => {
		if (!activeCalendarId) return;
		if (selectedCalendarIdFromStore !== activeCalendarId) {
			const activeCalendar = calendars.find((c) => c.id === activeCalendarId);
			setSelectedCalendar(activeCalendarId, activeCalendar?.title || '');
		}
	}, [
		activeCalendarId,
		selectedCalendarIdFromStore,
		calendars,
		setSelectedCalendar,
	]);

	const { data: activeCalendarData } = useQuery({
		queryKey: ['calendar', activeCalendarId],
		queryFn: () => getCalendar(activeCalendarId),
		enabled: !!activeCalendarId,
		staleTime: 60 * 1000,
	});

	useEffect(() => {
		const includeIngredients = searchParams
			.getAll('ingrediente_incluir[]')
			.map((value) => Number(value))
			.filter(Boolean);

		if (searchParams.get('reset') === '1') {
			setAppliedFilters({});
			setHasBookmarkFilter(false);
			return;
		}

		if (searchParams.get('filter') === 'true' && includeIngredients.length > 0) {
			setHasBookmarkFilter(false);
			setAppliedFilters((current) => {
				const next = {
					...current,
					ingrediente_incluir: includeIngredients,
				};

				return JSON.stringify(current.ingrediente_incluir) === JSON.stringify(next.ingrediente_incluir)
					? current
					: next;
			});
		}
	}, [searchParams]);

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
		if (!activeCalendarId) {
			alert('No hay calendarios disponibles. Crea uno primero.');
			return;
		}
		setSelectedRecipeForCalendar(recipe);
		setShowAddMealModal(true);
	};

	const handleFilterClick = () => {
		setIsFiltersOpen(true);
	};

	const handleResetFilter = () => {
		setSearchParams({});
		setAppliedFilters({});
		setHasBookmarkFilter(false);
	};

	const handleApplyFilters = (filters) => {
		setAppliedFilters(filters);
	};

	const handleBookmarkFilter = () => {
		setHasBookmarkFilter(!hasBookmarkFilter);
	};

	const toggleBookmarkMutation = useMutation({
		mutationFn: (recipeId) => toggleRecipeBookmark(recipeId),
		onSuccess: (data, recipeId) => {
			const isBookmarked = Boolean(data?.bookmarked);
			setBookmarkedRecipeIds((current) => {
				const next = new Set(current);
				if (isBookmarked) {
					next.add(recipeId);
				} else {
					next.delete(recipeId);
				}
				return next;
			});
			queryClient.invalidateQueries({ queryKey: ['recipes'] });
		},
	});

	const handleToggleRecipeBookmark = (recipeId) => {
		if (toggleBookmarkMutation.isPending) return;
		toggleBookmarkMutation.mutate(recipeId);
	};

	const recipes = data?.pages.flatMap((page) => page.data) || [];
	useEffect(() => {
		if (!hasBookmarkFilter || recipes.length === 0) return;
		setBookmarkedRecipeIds((current) => {
			const next = new Set(current);
			recipes.forEach((recipe) => {
				next.add(recipe.id);
			});
			return next;
		});
	}, [hasBookmarkFilter, recipes]);

	const totalRecipes =
		data?.pages[0]?.meta?.total || data?.pages[0]?.total || 0;
	const calendar = activeCalendarData?.data || activeCalendarData;

	const parseSchedule = (value) => {
		if (!value) return {};
		if (typeof value === 'string') {
			try {
				return JSON.parse(value);
			} catch (_e) {
				return {};
			}
		}
		return value;
	};

	const labels = parseSchedule(calendar?.labels);
	const mainSchedule = parseSchedule(calendar?.main_schedule);
	const sidesSchedule = parseSchedule(calendar?.sides_schedule);
	const dayLabels = labels.days || {
		day_1: 'Lunes',
		day_2: 'Martes',
		day_3: 'Miércoles',
		day_4: 'Jueves',
		day_5: 'Viernes',
		day_6: 'Sábado',
		day_7: 'Domingo',
	};
	const mealLabels = labels.meals || {
		meal_1: 'Desayuno',
		meal_2: 'Snack AM',
		meal_3: 'Almuerzo',
		meal_4: 'Snack PM',
		meal_5: 'Cena',
	};

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
												onToggleBookmark={() => handleToggleRecipeBookmark(recipe.id)}
												isBookmarked={
													hasBookmarkFilter || bookmarkedRecipeIds.has(recipe.id)
												}
											/>
										);
									} else {
										return (
											<RecipeCard
												key={recipe.id}
												recipe={recipe}
												onAddToCalendar={handleAddToCalendar}
												onToggleBookmark={() => handleToggleRecipeBookmark(recipe.id)}
												isBookmarked={
													hasBookmarkFilter || bookmarkedRecipeIds.has(recipe.id)
												}
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
			{showAddMealModal && selectedRecipeForCalendar && activeCalendarId && (
				<AddMealModal
					calendarId={activeCalendarId}
					dayNum={1}
					dayKey='day_1'
					mealNum={1}
					mealKey='meal_1'
					mealName={mealLabels.meal_1 || 'Desayuno'}
					mainSchedule={mainSchedule}
					sidesSchedule={sidesSchedule}
					dayLabels={dayLabels}
					mealLabels={mealLabels}
					initialRecipe={selectedRecipeForCalendar}
					onClose={() => {
						setShowAddMealModal(false);
						setSelectedRecipeForCalendar(null);
					}}
				/>
			)}
		</div>
	);
}

export default Recetario;

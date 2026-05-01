import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { FiBookmark } from 'react-icons/fi';
import { MdFilterAltOff } from 'react-icons/md';
import { LuFilter } from 'react-icons/lu';
import { getRecipes, getAdvancedFilteredRecipes } from '../lib/api/recipes';
import { getCalendar, getCalendars } from '../lib/api/calendars';
import AddMealModal from '../components/calendar/AddMealModal';
import { useCalendarStore } from '../stores/calendarStore';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { FiltersPopup } from '../components/recipes/FiltersPopup';
import { FilterBookmarksModal } from '../components/recipes/FilterBookmarksModal';
import { IconActionButton } from '../components/shared/IconActionButton';
import './Recetario.scss';

const FILTERS_QUERY_KEY = 'filters';
const FILTERS_STORAGE_KEY = 'recetario_applied_filters_v1';

const hasMeaningfulFilters = (filters = {}) => {
	if (!filters || typeof filters !== 'object') return false;
	return Object.keys(filters).some((key) => {
		const value = filters[key];
		if (Array.isArray(value)) return value.length > 0;
		if (value && typeof value === 'object') return Object.keys(value).length > 0;
		return Boolean(value);
	});
};

const parseFiltersFromSearchParams = (searchParams) => {
	const serializedFilters = searchParams.get(FILTERS_QUERY_KEY);
	if (serializedFilters) {
		try {
			const parsed = JSON.parse(serializedFilters);
			return parsed && typeof parsed === 'object' ? parsed : {};
		} catch (_error) {
			return {};
		}
	}

	// Legacy fallback support.
	const includeIngredients = searchParams
		.getAll('ingrediente_incluir[]')
		.map((value) => Number(value))
		.filter(Boolean);

	if (searchParams.get('filter') === 'true' && includeIngredients.length > 0) {
		return { ingrediente_incluir: includeIngredients };
	}

	return {};
};

const parseFiltersFromStorage = () => {
	if (typeof window === 'undefined') return {};
	const serializedFilters = window.localStorage.getItem(FILTERS_STORAGE_KEY);
	if (!serializedFilters) return {};
	try {
		const parsed = JSON.parse(serializedFilters);
		return parsed && typeof parsed === 'object' ? parsed : {};
	} catch (_error) {
		return {};
	}
};

export function Recetario() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [isBookmarksModalOpen, setIsBookmarksModalOpen] = useState(false);
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const [appliedFilters, setAppliedFilters] = useState({});
	const [isFilterApplied, setIsFilterApplied] = useState(false);
	const [showAddMealModal, setShowAddMealModal] = useState(false);
	const [selectedRecipeForCalendar, setSelectedRecipeForCalendar] = useState(null);
	const selectedCalendarIdFromStore = useCalendarStore(
		(state) => state.selectedCalendarId
	);
	const setSelectedCalendar = useCalendarStore((state) => state.setSelectedCalendar);
	const hasActiveFilters = isFilterApplied || hasMeaningfulFilters(appliedFilters);

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
		if (searchParams.get('reset') === '1') {
			setAppliedFilters({});
			setIsFilterApplied(false);
			if (typeof window !== 'undefined') {
				window.localStorage.removeItem(FILTERS_STORAGE_KEY);
			}
			return;
		}

		const filtersFromQuery = parseFiltersFromSearchParams(searchParams);
		const parsedFilters = hasMeaningfulFilters(filtersFromQuery)
			? filtersFromQuery
			: parseFiltersFromStorage();

		if (!hasMeaningfulFilters(filtersFromQuery) && hasMeaningfulFilters(parsedFilters)) {
			setSearchParams({ [FILTERS_QUERY_KEY]: JSON.stringify(parsedFilters) });
		}

		setAppliedFilters(parsedFilters);
		setIsFilterApplied(hasMeaningfulFilters(parsedFilters));
	}, [searchParams]);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
		isLoading,
	} = useInfiniteQuery({
		queryKey: ['recipes', { filters: appliedFilters }],
		queryFn: ({ pageParam = 1 }) => {
			// Use advanced filter if filters are applied, otherwise use regular getRecipes
			if (hasActiveFilters) {
				return getAdvancedFilteredRecipes(appliedFilters, pageParam, 27);
			}
			return getRecipes({ page: pageParam });
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
		setIsFilterApplied(false);
		if (typeof window !== 'undefined') {
			window.localStorage.removeItem(FILTERS_STORAGE_KEY);
		}
	};

	const handleApplyFilters = (filters) => {
		const hasFilters = hasMeaningfulFilters(filters);
		setAppliedFilters(filters);
		setIsFilterApplied(hasFilters);
		if (hasFilters) {
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
			}
			setSearchParams({ [FILTERS_QUERY_KEY]: JSON.stringify(filters) });
		} else {
			if (typeof window !== 'undefined') {
				window.localStorage.removeItem(FILTERS_STORAGE_KEY);
			}
			setSearchParams({});
		}
	};

	const handleOpenBookmarkModal = () => {
		setIsBookmarksModalOpen(true);
	};

	const recipes = data?.pages.flatMap((page) => page.data) || [];

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
								<IconActionButton
									icon={LuFilter}
									label='Filtro'
									isActive={hasActiveFilters}
									onClick={handleFilterClick}
									className='btn-filtro'
								/>
							</div>
							<div className='button-options reset-filter'>
								<IconActionButton
									icon={MdFilterAltOff}
									label='Sin filtros'
									iconOnly
									onClick={handleResetFilter}
									className='reset-filter'
									title='Quitar filtros'
								/>
							</div>
							<div className='button-options'>
								<IconActionButton
									icon={FiBookmark}
									label='Marcador'
									onClick={handleOpenBookmarkModal}
									className='save-mark'
								/>
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
									<img
										src='/img/iconos/recalentado.svg'
										className='hm-loading-spin'
										alt='Loading...'
									/>
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
			{isBookmarksModalOpen && (
				<FilterBookmarksModal
					onClose={() => setIsBookmarksModalOpen(false)}
					currentFilters={appliedFilters}
					onApplyBookmark={handleApplyFilters}
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

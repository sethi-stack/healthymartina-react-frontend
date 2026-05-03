import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LuCalendarDays, LuExternalLink } from 'react-icons/lu';
import { useSearchParams } from 'react-router-dom';
import { copyMealPlan, getMealPlans, getMealPlan } from '../lib/api/plans';
import { getCalendars, getCalendar } from '../lib/api/calendars';
import { useCalendarStore } from '../stores/calendarStore';
import AddMealModal from '../components/calendar/AddMealModal';
import { RecipeActionMenu } from '../components/shared/RecipeActionMenu';
import { IconActionButton } from '../components/shared/IconActionButton';
import CalendarGrid from '../components/calendar/CalendarGrid';
import CopyCalendarModal from '../components/calendar/CopyCalendarModal';
import './Planes.scss';

export default function Planes() {
	const { id } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const routePlanId = id ? Number(id) : null;
	const isCalendarView = searchParams.get('view') === 'calendar';
	const [selectedPlanId, setSelectedPlanId] = useState(routePlanId);
	const [showAddMealModal, setShowAddMealModal] = useState(false);
	const [showCopyPlanModal, setShowCopyPlanModal] = useState(false);
	const [selectedRecipeForCalendar, setSelectedRecipeForCalendar] = useState(null);

	const selectedCalendarIdFromStore = useCalendarStore(
		(state) => state.selectedCalendarId
	);
	const setSelectedCalendar = useCalendarStore((state) => state.setSelectedCalendar);

	const { data, isLoading, isError } = useQuery({
		queryKey: ['meal-plans'],
		queryFn: getMealPlans,
		staleTime: 5 * 60 * 1000,
	});

	const { data: calendarsData } = useQuery({
		queryKey: ['calendars'],
		queryFn: () => getCalendars({ per_page: 100 }),
		staleTime: 2 * 60 * 1000,
	});

	const plans = data?.plans || [];
	const calendars = calendarsData?.data || [];

	const effectiveSelectedPlanId = useMemo(() => {
		if (selectedPlanId) return selectedPlanId;
		return plans[0]?.id || null;
	}, [selectedPlanId, plans]);

	useEffect(() => {
		if (!routePlanId && plans[0]?.id) {
			setSelectedPlanId(plans[0].id);
		}
	}, [routePlanId, plans]);

	const { data: selectedPlanDetails, isFetching: isFetchingPlanDetails } = useQuery({
		queryKey: ['meal-plan', effectiveSelectedPlanId],
		queryFn: () => getMealPlan(effectiveSelectedPlanId),
		enabled: !!effectiveSelectedPlanId,
		staleTime: 60 * 1000,
	});

	const selectedPlan = selectedPlanDetails?.plan || null;
	const selectedPlanCalendar = selectedPlanDetails?.calendar || null;
	const selectedPlanRecipes = selectedPlanDetails?.recipes || [];

	const copyPlanMutation = useMutation({
		mutationFn: ({ planId, title }) =>
			copyMealPlan(planId, { calendar_title: title, calendar_scale: 1 }),
		onSuccess: (response) => {
			setShowCopyPlanModal(false);
			queryClient.invalidateQueries({ queryKey: ['calendars'] });
			const newCalendarId = response?.calendar?.id;
			if (newCalendarId) {
				navigate(`/calendario?id=${newCalendarId}`);
				return;
			}
			navigate('/calendario');
		},
	});

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
	}, [activeCalendarId, selectedCalendarIdFromStore, calendars, setSelectedCalendar]);

	const { data: activeCalendarData } = useQuery({
		queryKey: ['calendar', activeCalendarId],
		queryFn: () => getCalendar(activeCalendarId),
		enabled: !!activeCalendarId,
		staleTime: 60 * 1000,
	});

	const selectedCalendar = activeCalendarData?.data || activeCalendarData;

	const handleAddToCalendar = (recipe) => {
		if (!activeCalendarId) return;
		setSelectedRecipeForCalendar(recipe);
		setShowAddMealModal(true);
	};

	if (isLoading) {
		return <div className='planes-page'><div className='planes-page__state'>Cargando planes...</div></div>;
	}

	if (isError) {
		return <div className='planes-page'><div className='planes-page__state'>No se pudieron cargar los planes.</div></div>;
	}

	return (
		<div className='planes-page legacy-layout'>
			<div className='plans-left'>
				{plans.map((plan) => {
					const isSelected = effectiveSelectedPlanId === plan.id;
					return (
						<div
							key={plan.id}
							className={`plan-list-item ${isSelected ? 'is-selected' : ''}`}
							role='button'
							tabIndex={0}
							onClick={() => {
								setSelectedPlanId(plan.id);
								navigate(`/planes/${plan.id}`);
							}}
							onKeyDown={(event) => {
								if (event.key === 'Enter' || event.key === ' ') {
									event.preventDefault();
									setSelectedPlanId(plan.id);
									navigate(`/planes/${plan.id}`);
								}
							}}
						>
							<div className='plan-list-item__head'>
								<h4>{plan.nombre}</h4>
								<span>{plan.duracion ? `${plan.duracion} días` : ''}</span>
							</div>
							<div className='plan-list-item__actions'>
								<div className='button-options'>
									<IconActionButton
										icon={LuCalendarDays}
										label='Calendario'
										variant='default'
										onClick={(event) => {
											event.stopPropagation();
											setSelectedPlanId(plan.id);
											setSearchParams({ view: 'calendar' });
											navigate(`/planes/${plan.id}?view=calendar`);
										}}
									/>
								</div>
								<div className='button-options'>
									<IconActionButton
										icon={LuExternalLink}
										label='Manual'
										variant='default'
										disabled={!plan.guia}
										onClick={(event) => {
											event.stopPropagation();
											if (plan.guia) window.open(plan.guia, '_blank', 'noopener,noreferrer');
										}}
									/>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className='plans-right'>
				{isFetchingPlanDetails && <div className='planes-page__state'>Cargando detalle...</div>}
				{selectedPlan && (
					<>
						<div className='plan-detail'>
							<h1>{selectedPlan.nombre?.toUpperCase?.() || selectedPlan.nombre}</h1>
							<div
								className='plan-description'
								dangerouslySetInnerHTML={{ __html: selectedPlan.descripcion || '' }}
							/>
							{isCalendarView && selectedPlanCalendar && (
								<div className='plan-calendar-actions'>
									<button
										type='button'
										className='hm-btn hm-btn--outline'
										onClick={() => setShowCopyPlanModal(true)}
									>
										Copiar a mis calendarios
									</button>
								</div>
							)}
						</div>

						{isCalendarView && selectedPlanCalendar ? (
							<div className='plan-calendar-view'>
								<CalendarGrid
									calendar={selectedPlanCalendar}
									nutritionPlanId={selectedPlan?.id || null}
									readOnly
								/>
							</div>
						) : (
							<div className='plan-recipes'>
								{selectedPlanRecipes.map((recipe) => (
									<div key={recipe.id} className='plan-recipe-item'>
										<img
											src={recipe.imagen_principal || '/img/placeholder-receta.jpg'}
											alt={recipe.titulo}
										/>
										<div className='plan-recipe-item__content'>
											<h3>{recipe.titulo}</h3>
											<p>
												{recipe.ingredientes_count || 0} ingredientes
												{' | '}
												{recipe.tiempo || 0} minutos
											</p>
										</div>
										<div className='plan-recipe-item__menu'>
											<RecipeActionMenu
												triggerSize='sm'
												menuPosition='absolute'
												onAddToCalendar={() => handleAddToCalendar(recipe)}
												onViewRecipe={() => navigate(`/receta/${recipe.slug}`)}
											/>
										</div>
									</div>
								))}
							</div>
						)}
					</>
				)}
			</div>

			{showAddMealModal && selectedRecipeForCalendar && selectedCalendar && (
				<AddMealModal
					calendar={selectedCalendar}
					calendarId={activeCalendarId}
					recipe={selectedRecipeForCalendar}
					onClose={() => {
						setShowAddMealModal(false);
						setSelectedRecipeForCalendar(null);
					}}
					onSuccess={() => {
						setShowAddMealModal(false);
						setSelectedRecipeForCalendar(null);
						queryClient.invalidateQueries({ queryKey: ['calendar', activeCalendarId] });
					}}
				/>
			)}
			{showCopyPlanModal && selectedPlan && (
				<CopyCalendarModal
					calendar={{ title: selectedPlan.nombre }}
					onClose={() => setShowCopyPlanModal(false)}
					onSubmit={(title) =>
						copyPlanMutation.mutate({ planId: selectedPlan.id, title })
					}
					isLoading={copyPlanMutation.isPending}
				/>
			)}
		</div>
	);
}

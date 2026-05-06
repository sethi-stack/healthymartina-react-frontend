import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useCalendarStore } from '../stores/calendarStore';
import {
	getCalendars,
	getAllListaIngredients,
	getCategoryIngredients,
	toggleIngredientTaken,
	addListaIngredient,
	updateListaIngredient,
	deleteListaIngredient,
	sendListaEmail,
	exportListaPdf,
} from '../lib/api/calendars';
import ListaHeader from '../components/lista/ListaHeader';
import ListaOptions from '../components/lista/ListaOptions';
import ListaCategoryGrid from '../components/lista/ListaCategoryGrid';
import AddIngredientModal from '../components/lista/AddIngredientModal';
import EditIngredientModal from '../components/lista/EditIngredientModal';
import DeleteIngredientModal from '../components/lista/DeleteIngredientModal';
import CalendarSwitchModal from '../components/lista/CalendarSwitchModal';
import './Lista.scss';

// MOCK DATA for design verification
const USE_MOCK_DATA = false; // Set to false when API is working

const MOCK_CALENDARS = {
	data: [
		{
			id: 1,
			title: 'Mi Calendario de Enero',
			nombre: 'Mi Calendario de Enero',
		},
		{ id: 2, title: 'Plan Semanal', nombre: 'Plan Semanal' },
	],
};

const MOCK_LISTA_DATA = {
	data: {
		calendario: { id: 1, title: 'Mi Calendario de Enero' },
		categorias: [
			{ id: 1, nombre: 'Frutas y Verduras', sort: 1 },
			{ id: 2, nombre: 'Lácteos', sort: 2 },
			{ id: 3, nombre: 'Carnes y Pescados', sort: 3 },
			{ id: 4, nombre: 'Granos y Cereales', sort: 4 },
			{ id: 5, nombre: 'Especias y Condimentos', sort: 5 },
			{ id: 6, nombre: 'Otros', sort: 6 },
		],
		ingredients: {
			1: [
				{
					ingrediente_id: 101,
					ingrediente: 'Tomate',
					cantidad: 4,
					medida: 'unidades',
					categoria_id: 1,
					type: 'receta',
					day: 'day_1',
					meal: 'meal_1',
				},
				{
					ingrediente_id: 102,
					ingrediente: 'Lechuga',
					cantidad: 1,
					medida: 'pieza',
					categoria_id: 1,
					type: 'receta',
					day: 'day_2',
					meal: 'meal_1',
				},
				{
					ingrediente_id: 103,
					ingrediente: 'Cebolla',
					cantidad: 2,
					medida: 'piezas',
					categoria_id: 1,
					type: 'receta',
					day: 'day_1',
					meal: 'meal_2',
				},
			],
			2: [
				{
					ingrediente_id: 201,
					ingrediente: 'Leche',
					cantidad: 2,
					medida: 'litros',
					categoria_id: 2,
					type: 'receta',
					day: 'day_1',
					meal: 'meal_1',
				},
				{
					ingrediente_id: 202,
					ingrediente: 'Queso manchego',
					cantidad: 200,
					medida: 'gramos',
					categoria_id: 2,
					type: 'receta',
					day: 'day_3',
					meal: 'meal_1',
				},
				{
					id: 1,
					ingrediente_id: 1,
					nombre: 'Yogurt natural',
					cantidad: 6,
					unidad_medida: 'unidades',
					categoria_id: 2,
					type: 'manual',
				},
			],
			3: [
				{
					ingrediente_id: 301,
					ingrediente: 'Pechuga de pollo',
					cantidad: 500,
					medida: 'gramos',
					categoria_id: 3,
					type: 'receta',
					day: 'day_2',
					meal: 'meal_1',
				},
				{
					ingrediente_id: 302,
					ingrediente: 'Salmón',
					cantidad: 300,
					medida: 'gramos',
					categoria_id: 3,
					type: 'receta',
					day: 'day_4',
					meal: 'meal_1',
				},
			],
			4: [
				{
					ingrediente_id: 401,
					ingrediente: 'Arroz integral',
					cantidad: 2,
					medida: 'tazas',
					categoria_id: 4,
					type: 'receta',
					day: 'day_1',
					meal: 'meal_1',
				},
				{
					ingrediente_id: 402,
					ingrediente: 'Pasta',
					cantidad: 400,
					medida: 'gramos',
					categoria_id: 4,
					type: 'receta',
					day: 'day_3',
					meal: 'meal_1',
				},
			],
			5: [
				{
					ingrediente_id: 501,
					ingrediente: 'Sal',
					cantidad: 0,
					medida: 'al gusto',
					categoria_id: 5,
					type: 'receta',
					day: 'day_1',
					meal: 'meal_1',
				},
				{
					ingrediente_id: 502,
					ingrediente: 'Pimienta negra',
					cantidad: 0,
					medida: 'al gusto',
					categoria_id: 5,
					type: 'receta',
					day: 'day_1',
					meal: 'meal_1',
				},
			],
			6: [
				{
					ingrediente_id: 601,
					ingrediente: 'Aceite de oliva',
					cantidad: 3,
					medida: 'cucharadas',
					categoria_id: 6,
					type: 'receta',
					day: 'day_1',
					meal: 'meal_1',
				},
			],
		},
		taken_ingredientes: [
			{
				calendario_id: 1,
				categoria_id: 1,
				ingrediente_id: 101,
				ingrediente_type: 'receta',
			},
		],
		total_count: 17,
	},
};

/**
 * Lista Page - Grocery List
 * Displays aggregated ingredients from calendar recipes plus manual additions
 */
export default function Lista() {
	const [searchParams, setSearchParams] = useSearchParams();
	const queryClient = useQueryClient();

	// Get stored calendar ID from Zustand store
	const { selectedCalendarId: storedCalendarId, setSelectedCalendar } =
		useCalendarStore();

	const calendarId = searchParams.get('id');
	const [selectedCalendarId, setSelectedCalendarId] = useState(
		calendarId ? parseInt(calendarId) : storedCalendarId,
	);

	// Modal states
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showCalendarSwitch, setShowCalendarSwitch] = useState(false);
	const [selectedIngredient, setSelectedIngredient] = useState(null);
	const [selectedCategoryId, setSelectedCategoryId] = useState(null);
	const [listaExportProgress, setListaExportProgress] = useState({
		active: false,
		progress: 0,
		rendered: 0,
		total: 0,
	});
	const [categoryLoadingId, setCategoryLoadingId] = useState(null);

	// Fetch calendars list
	const {
		data: calendarsData,
		isLoading: calendarsLoading,
		isFetching: calendarsFetching,
		error: calendarsError,
	} = useQuery({
		queryKey: ['calendars'],
		queryFn: USE_MOCK_DATA
			? () => Promise.resolve(MOCK_CALENDARS)
			: () => getCalendars({ per_page: 100 }),
	});

	// Fetch lista data
	const {
		data: listaData,
		isLoading: listaLoading,
		isFetching: listaFetching,
		error: listaError,
	} = useQuery({
		queryKey: ['lista-all', selectedCalendarId],
		queryFn: USE_MOCK_DATA
			? () => Promise.resolve(MOCK_LISTA_DATA)
			: () => getAllListaIngredients(selectedCalendarId),
		enabled: !!selectedCalendarId,
	});

	// Auto-select calendar: URL param > stored selection > first calendar
	useEffect(() => {
		if (
			!selectedCalendarId &&
			calendarsData?.data?.length > 0 &&
			!calendarsLoading
		) {
			// Try to find stored calendar, otherwise use first
			const calendarToSelect =
				calendarsData.data.find((c) => c.id === storedCalendarId) ||
				calendarsData.data[0];
			setSelectedCalendar(calendarToSelect.id, calendarToSelect.title);
			setSelectedCalendarId(calendarToSelect.id);
			setSearchParams({ id: calendarToSelect.id });
		}
	}, [
		calendarsData,
		selectedCalendarId,
		calendarsLoading,
		setSearchParams,
		storedCalendarId,
		setSelectedCalendar,
	]);

	// Update URL when calendar changes
	useEffect(() => {
		if (selectedCalendarId) {
			setSearchParams({ id: selectedCalendarId });
		}
	}, [selectedCalendarId, setSearchParams]);

	// Toggle ingredient taken mutation
	const toggleMutation = useMutation({
		mutationFn: USE_MOCK_DATA
			? (data) =>
					Promise.resolve({
						success: true,
						message: 'Toggled (mock)',
						action: 'created',
						taken_ingredients: [],
					})
			: (data) => toggleIngredientTaken(selectedCalendarId, data),
		onMutate: async (variables) => {
			// Prevent refetch race and apply optimistic checkbox change immediately.
			await queryClient.cancelQueries({
				queryKey: ['lista-all', selectedCalendarId],
			});

			const previousListaData = queryClient.getQueryData([
				'lista-all',
				selectedCalendarId,
			]);

			queryClient.setQueryData(['lista-all', selectedCalendarId], (current) => {
				if (!current) return current;

				const base = current.data ? current.data : current;
				const taken =
					base.taken_ingredients || base.taken_ingredientes || [];

				const exists = taken.some(
					(item) =>
						Number(item.ingrediente_id) === Number(variables.ingredientId) &&
						Number(item.categoria_id) === Number(variables.categoryId) &&
						item.ingrediente_type === variables.type
				);

				const updatedTaken = exists
					? taken.filter(
							(item) =>
								!(
									Number(item.ingrediente_id) ===
										Number(variables.ingredientId) &&
									Number(item.categoria_id) ===
										Number(variables.categoryId) &&
									item.ingrediente_type === variables.type
								)
					  )
					: [
							...taken,
							{
								calendario_id: selectedCalendarId,
								categoria_id: variables.categoryId,
								ingrediente_id: variables.ingredientId,
								ingrediente_type: variables.type,
							},
					  ];

				const updatedBase = {
					...base,
					taken_ingredients: updatedTaken,
				};

				return current.data ? { ...current, data: updatedBase } : updatedBase;
			});

			return { previousListaData };
		},
		onSuccess: (response) => {
			// Keep cache aligned with backend authoritative taken list when provided.
			if (response?.taken_ingredients) {
				queryClient.setQueryData(['lista-all', selectedCalendarId], (current) => {
					if (!current) return current;
					const base = current.data ? current.data : current;
					const updatedBase = {
						...base,
						taken_ingredients: response.taken_ingredients,
					};
					return current.data ? { ...current, data: updatedBase } : updatedBase;
				});
			}
		},
		onError: (_error, _variables, context) => {
			// Rollback optimistic update on failure.
			if (context?.previousListaData) {
				queryClient.setQueryData(
					['lista-all', selectedCalendarId],
					context.previousListaData
				);
			}
		},
	});

	// Add ingredient mutation
	const addMutation = useMutation({
		mutationFn: USE_MOCK_DATA
			? (data) =>
					Promise.resolve({
						success: true,
						message: 'Added (mock)',
						data: { id: Date.now(), ...data },
					})
			: (data) => addListaIngredient(selectedCalendarId, data),
		onMutate: (variables) => {
			setCategoryLoadingId(Number(variables?.categoria));
		},
		onSuccess: async (_response, variables) => {
			await refreshCategorySlice(Number(variables?.categoria));
			setShowAddModal(false);
			setSelectedCategoryId(null);
		},
		onSettled: () => {
			setCategoryLoadingId(null);
		},
	});

	// Update ingredient mutation
	const updateMutation = useMutation({
		mutationFn: USE_MOCK_DATA
			? ({ id, data }) =>
					Promise.resolve({
						success: true,
						message: 'Updated (mock)',
					})
			: ({ id, data }) =>
					updateListaIngredient(id, {
						...data,
						calendarId: selectedCalendarId,
					}),
		onMutate: (variables) => {
			setCategoryLoadingId(Number(variables?.data?.categoria));
		},
		onSuccess: async (_response, variables) => {
			await refreshCategorySlice(Number(variables?.data?.categoria));
			setShowEditModal(false);
			setSelectedIngredient(null);
		},
		onSettled: () => {
			setCategoryLoadingId(null);
		},
	});

	// Delete ingredient mutation
	const deleteMutation = useMutation({
		mutationFn: USE_MOCK_DATA
			? ({ id }) =>
					Promise.resolve({
						success: true,
						message: 'Deleted (mock)',
					})
			: ({ id }) => deleteListaIngredient(selectedCalendarId, id),
		onMutate: (variables) => {
			setCategoryLoadingId(Number(variables?.categoryId));
		},
		onSuccess: async (_response, variables) => {
			await refreshCategorySlice(Number(variables?.categoryId));
			setShowDeleteModal(false);
			setSelectedIngredient(null);
		},
		onSettled: () => {
			setCategoryLoadingId(null);
		},
	});

	const refreshCategorySlice = async (categoryId) => {
		if (!selectedCalendarId || !categoryId || USE_MOCK_DATA) {
			queryClient.invalidateQueries({
				queryKey: ['lista-all', selectedCalendarId],
			});
			return;
		}

		const response = await getCategoryIngredients(selectedCalendarId, categoryId);
		const refreshedIngredients = response?.ingredients || [];
		const refreshedCustomItems = response?.custom_items || [];

		queryClient.setQueryData(['lista-all', selectedCalendarId], (current) => {
			if (!current) return current;

			const base = current.data ? current.data : current;
			const nextIngredients = { ...(base.ingredients || {}) };
			nextIngredients[String(categoryId)] = refreshedIngredients;

			const existingCustom = Array.isArray(base.custom_items)
				? base.custom_items
				: [];
			const customWithoutCategory = existingCustom.filter(
				(item) =>
					Number(item?.categoria_id ?? item?.categoria) !== Number(categoryId)
			);
			const normalizedRefreshedCustom = (refreshedCustomItems || []).map((item) => ({
				...item,
				type: 'manual',
			}));

			const updatedBase = {
				...base,
				ingredients: nextIngredients,
				custom_items: [...customWithoutCategory, ...normalizedRefreshedCustom],
			};

			return current.data ? { ...current, data: updatedBase } : updatedBase;
		});
	};

	// Email mutation
	const emailMutation = useMutation({
		mutationFn: USE_MOCK_DATA
			? (payload) =>
					Promise.resolve({
						success: true,
						message: 'Email sent (mock)',
					})
			: (payload) => sendListaEmail(selectedCalendarId, payload),
	});

	const handleToggleIngredient = (ingredientId, categoryId, type) => {
		if (toggleMutation.isPending) return;
		toggleMutation.mutate({
			ingredientId,
			categoryId,
			type,
		});
	};

	const handleAddIngredient = (data) => {
		addMutation.mutate(data);
	};

	const handleUpdateIngredient = (data) => {
		if (selectedIngredient) {
			updateMutation.mutate({ id: selectedIngredient.id, data });
		}
	};

	const handleDeleteIngredient = () => {
		if (selectedIngredient) {
			deleteMutation.mutate({
				id: selectedIngredient.id,
				categoryId: selectedIngredient.categoria || selectedIngredient.categoria_id,
			});
		}
	};

	const handleExportPdf = async () => {
		if (USE_MOCK_DATA) {
			alert('Exportar PDF (mock data - funcionalidad no disponible)');
			return;
		}

		try {
			setListaExportProgress({
				active: true,
				progress: 0,
				rendered: 0,
				total: 0,
			});
			const blob = await exportListaPdf(selectedCalendarId, {
				onProgress: (statusResponse) => {
					setListaExportProgress({
						active: true,
						progress: Number(statusResponse?.progress || 0),
						rendered: Number(statusResponse?.counters?.rendered_recipe_pages || 0),
						total: Number(statusResponse?.counters?.total_recipe_pages || 0),
					});
				},
			});
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `lista-${selectedCalendarId}.pdf`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
			setListaExportProgress({
				active: false,
				progress: 100,
				rendered: 0,
				total: 0,
			});
		} catch (error) {
			console.error('Error exporting PDF:', error);
			alert('Error al exportar PDF. Por favor, intenta de nuevo.');
			setListaExportProgress({
				active: false,
				progress: 0,
				rendered: 0,
				total: 0,
			});
		}
	};

	const handleSendEmail = async (email) => {
		const flatListaIngredients = Object.values(rawIngredients || {}).flat();
		try {
			await emailMutation.mutateAsync({
				email,
				listaIngredients: flatListaIngredients,
			});
		} catch (error) {
			console.error('Error sending email:', error);
			const backendMessage =
				error?.response?.data?.message ||
				error?.message ||
				'Error al enviar email. Por favor, intenta de nuevo.';
			alert(backendMessage);
		}
	};

	const handleSelectCalendar = (id) => {
		const calendar = calendars.find((c) => c.id === id);
		setSelectedCalendar(id, calendar?.title || '');
		setSelectedCalendarId(id);
		setShowCalendarSwitch(false);
	};

	const handleOpenAddModal = (categoryId) => {
		setSelectedCategoryId(categoryId);
		setShowAddModal(true);
	};

	const handleOpenEditModal = (ingredient) => {
		setSelectedIngredient(ingredient);
		setShowEditModal(true);
	};

	const handleOpenDeleteModal = (ingredient) => {
		setSelectedIngredient(ingredient);
		setShowDeleteModal(true);
	};

	if (calendarsLoading) {
		return (
			<div className='lista-loading'>
				<div className='loader'>
					<img src='/img/iconos/recalentado.svg' className='hm-loading-spin' alt='Loading' />
				</div>
			</div>
		);
	}

	if (calendarsError) {
		return (
			<div className='lista-error'>
				<p>Error al cargar calendarios. Por favor, intenta de nuevo.</p>
			</div>
		);
	}

	const calendars = calendarsData?.data || [];
	// Handle both mock data (has .data wrapper) and real API (no .data wrapper)
	const listaContent = listaData?.data || listaData || {};

	// Use calendar from calendars list, or fallback to calendar from lista response
	const currentCalendar =
		calendars.find((c) => c.id === selectedCalendarId) ||
		listaContent.calendar ||
		listaContent.calendario;

	// Handle both API field names: categories/categorias
	const categories = listaContent.categories || listaContent.categorias || [];
	const rawIngredients = listaContent.ingredients || {};
	const takenIngredients =
		listaContent.taken_ingredients || listaContent.taken_ingredientes || [];
	const customItems = listaContent.custom_items || [];

	// Scale an ingredient's cantidad by its servings/porcion ratio.
	// Subrecipe ingredients store the servings factor in get_servings and use
	// subrecipe.porcion as the base (the subrecipe's own default yield), not the
	// parent recipe's porcion. Regular ingredients use porcion directly.
	const computeScaledQty = (ing) => {
		const rawQty = parseFloat(ing.cantidad) || 0;
		// Subrecipe check must come BEFORE the getServings===1 guard:
		// when user selects the parent recipe's default servings, get_recipe_cantidad
		// equals exactly 1 (e.g. 1 tz), but we still need to divide by the
		// sub-recipe's own yield (e.g. 3 tz) to get the correct fraction.
		if (ing.subrecipe && typeof ing.subrecipe === 'object') {
			const getServings = parseFloat(ing.get_servings) || 0;
			const subPorcion = parseFloat(ing.subrecipe.porcion) || 1;
			return (rawQty * getServings) / subPorcion;
		}
		const getServings = parseFloat(ing.get_servings);
		if (!getServings || getServings === 1) {
			// No servings data — use raw quantity as-is (e.g. manual items)
			return rawQty;
		}
		const porcion = parseFloat(ing.porcion) || 1;
		return (rawQty * getServings) / porcion;
	};

	// Normalize and aggregate ingredients
	const ingredients = Object.keys(rawIngredients).reduce((acc, categoryId) => {
		const categoryIngredients = rawIngredients[categoryId] || [];

		// Group ingredients by their ID to aggregate quantities
		const ingredientMap = new Map();

		categoryIngredients.forEach((ing) => {
			const key = `${ing.ingrediente_id || ing.id}-${ing.ingrediente || ing.nombre}`;

			if (ingredientMap.has(key)) {
				// Aggregate quantities for repeated ingredients
				const existing = ingredientMap.get(key);
				const existingQty = parseFloat(existing.cantidad) || 0;
				const newQty = computeScaledQty(ing);
				existing.cantidad = existingQty + newQty;

				// Also aggregate from repeat array if it exists
				if (ing.repeat && ing.repeat.length > 0) {
					const repeatQty = ing.repeat.reduce(
						(sum, r) => sum + computeScaledQty(r),
						0,
					);
					existing.cantidad += repeatQty;
				}
			} else {
				// Add new ingredient with aggregated quantity from repeats
				let totalQty = computeScaledQty(ing);
				if (ing.repeat && ing.repeat.length > 0) {
					totalQty += ing.repeat.reduce(
						(sum, r) => sum + computeScaledQty(r),
						0,
					);
				}

				ingredientMap.set(key, {
					...ing,
					cantidad: totalQty,
					type: ing.type || 'receta', // Default to 'receta' if type is missing
				});
			}
		});

		acc[categoryId] = Array.from(ingredientMap.values());
		return acc;
	}, {});

	// Merge custom/manual items into category ingredient buckets so they render in-grid.
	customItems.forEach((item) => {
		const categoryId = String(item.categoria_id || item.categoria);
		if (!ingredients[categoryId]) {
			ingredients[categoryId] = [];
		}
		ingredients[categoryId].push({
			...item,
			id: item.id,
			ingrediente_id: item.id,
			ingrediente: item.nombre,
			type: 'manual',
		});
	});

	// Calculate total count if not provided
	const totalCount =
		listaContent.total_count ||
		Object.values(ingredients).reduce(
			(sum, catIngredients) => sum + catIngredients.length,
			0,
		);

	// Count unchecked ingredients
	const uncheckedCount = totalCount - takenIngredients.length;
	const isBusy =
		!calendarsLoading &&
		!listaLoading &&
		(calendarsFetching ||
		listaFetching ||
		emailMutation.isPending);
	const listaExportLabel = (() => {
		const percent = Math.max(0, Math.min(99, Number(listaExportProgress.progress || 0)));
		if (listaExportProgress.total > 0) {
			return `Exportando ${percent}% (${Math.min(
				listaExportProgress.rendered,
				listaExportProgress.total
			)}/${listaExportProgress.total} recetas)`;
		}
		return `Exportando ${percent}%`;
	})();

	return (
		<div className='general-container lista-json'>
			{isBusy && (
				<div className='page-loading-overlay'>
					<div className='loader'>
						<img src='/img/iconos/recalentado.svg' className='hm-loading-spin' alt='Loading' />
					</div>
				</div>
			)}
			{listaExportProgress.active && (
				<div className='page-loading-overlay'>
					<div className='loader'>
						<img src='/img/iconos/recalentado.svg' className='hm-loading-spin' alt='Loading' />
						<p>{listaExportLabel}</p>
					</div>
				</div>
			)}
			<div className='lista-calendar-inner'>
				<ListaHeader
					calendar={currentCalendar}
					ingredientCount={uncheckedCount}
				/>

				<ListaOptions
					onExportPdf={handleExportPdf}
					onSendEmail={handleSendEmail}
					onSwitchCalendar={() => setShowCalendarSwitch(true)}
					calendars={calendars}
					currentCalendarId={selectedCalendarId}
					isExporting={listaExportProgress.active}
					exportProgressLabel={listaExportLabel}
				/>

				{!currentCalendar ? (
					<div className='no-cal-sec flex-center flex-column'>
						<h3>¡No tienes ningún calendario! Crea uno.</h3>
					</div>
				) : listaLoading ? (
					<div className='lista-loading'>
						<div className='loader'>
							<img src='/img/iconos/recalentado.svg' className='hm-loading-spin' alt='Loading' />
						</div>
					</div>
				) : (
				<ListaCategoryGrid
					categories={categories}
					ingredients={ingredients}
					takenIngredients={takenIngredients}
					onToggleIngredient={handleToggleIngredient}
					onAddIngredient={handleOpenAddModal}
					onEditIngredient={handleOpenEditModal}
					onDeleteIngredient={handleOpenDeleteModal}
					loadingCategoryId={categoryLoadingId}
				/>
				)}
			</div>

			{/* Modals */}
			{showAddModal && (
				<AddIngredientModal
					categories={categories}
					selectedCategoryId={selectedCategoryId}
					onClose={() => {
						setShowAddModal(false);
						setSelectedCategoryId(null);
					}}
					onSubmit={handleAddIngredient}
					isLoading={addMutation.isPending}
				/>
			)}

			{showEditModal && selectedIngredient && (
				<EditIngredientModal
					categories={categories}
					ingredient={selectedIngredient}
					onClose={() => {
						setShowEditModal(false);
						setSelectedIngredient(null);
					}}
					onSubmit={handleUpdateIngredient}
					isLoading={updateMutation.isPending}
				/>
			)}

			{showDeleteModal && selectedIngredient && (
				<DeleteIngredientModal
					ingredient={selectedIngredient}
					onClose={() => {
						setShowDeleteModal(false);
						setSelectedIngredient(null);
					}}
					onConfirm={handleDeleteIngredient}
					isLoading={deleteMutation.isPending}
				/>
			)}

			{showCalendarSwitch && (
				<CalendarSwitchModal
					calendars={calendars}
					currentCalendarId={selectedCalendarId}
					onClose={() => setShowCalendarSwitch(false)}
					onSelectCalendar={handleSelectCalendar}
				/>
			)}
		</div>
	);
}

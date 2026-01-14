import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
	getCalendars,
	getAllListaIngredients,
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
const USE_MOCK_DATA = true; // Set to false when API is working

const MOCK_CALENDARS = {
	data: [
		{ id: 1, title: 'Mi Calendario de Enero', nombre: 'Mi Calendario de Enero' },
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

	const calendarId = searchParams.get('id');
	const [selectedCalendarId, setSelectedCalendarId] = useState(
		calendarId ? parseInt(calendarId) : null
	);

	// Modal states
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showCalendarSwitch, setShowCalendarSwitch] = useState(false);
	const [selectedIngredient, setSelectedIngredient] = useState(null);
	const [selectedCategoryId, setSelectedCategoryId] = useState(null);

	// Fetch calendars list
	const {
		data: calendarsData,
		isLoading: calendarsLoading,
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
		error: listaError,
	} = useQuery({
		queryKey: ['lista-all', selectedCalendarId],
		queryFn: USE_MOCK_DATA
			? () => Promise.resolve(MOCK_LISTA_DATA)
			: () => getAllListaIngredients(selectedCalendarId),
		enabled: !!selectedCalendarId,
	});

	// Auto-select first calendar if none selected
	useEffect(() => {
		if (
			!selectedCalendarId &&
			calendarsData?.data?.length > 0 &&
			!calendarsLoading
		) {
			const firstCalendar = calendarsData.data[0];
			setSelectedCalendarId(firstCalendar.id);
			setSearchParams({ id: firstCalendar.id });
		}
	}, [calendarsData, selectedCalendarId, calendarsLoading, setSearchParams]);

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
					})
			: (data) => toggleIngredientTaken(selectedCalendarId, data),
		onSuccess: () => {
			queryClient.invalidateQueries(['lista-all', selectedCalendarId]);
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
		onSuccess: () => {
			queryClient.invalidateQueries(['lista-all', selectedCalendarId]);
			setShowAddModal(false);
			setSelectedCategoryId(null);
			alert('Ingrediente agregado (mock data)');
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
			: ({ id, data }) => updateListaIngredient(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries(['lista-all', selectedCalendarId]);
			setShowEditModal(false);
			setSelectedIngredient(null);
			alert('Ingrediente actualizado (mock data)');
		},
	});

	// Delete ingredient mutation
	const deleteMutation = useMutation({
		mutationFn: USE_MOCK_DATA
			? (id) =>
					Promise.resolve({
						success: true,
						message: 'Deleted (mock)',
					})
			: (id) => deleteListaIngredient(id),
		onSuccess: () => {
			queryClient.invalidateQueries(['lista-all', selectedCalendarId]);
			setShowDeleteModal(false);
			setSelectedIngredient(null);
			alert('Ingrediente eliminado (mock data)');
		},
	});

	// Email mutation
	const emailMutation = useMutation({
		mutationFn: USE_MOCK_DATA
			? (email) =>
					Promise.resolve({
						success: true,
						message: 'Email sent (mock)',
					})
			: (email) => sendListaEmail(selectedCalendarId, email),
	});

	const handleToggleIngredient = (ingredientId, categoryId, type) => {
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
			deleteMutation.mutate(selectedIngredient.id);
		}
	};

	const handleExportPdf = async () => {
		if (USE_MOCK_DATA) {
			alert('Exportar PDF (mock data - funcionalidad no disponible)');
			return;
		}

		try {
			const blob = await exportListaPdf(selectedCalendarId);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `lista-${selectedCalendarId}.pdf`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (error) {
			console.error('Error exporting PDF:', error);
			alert('Error al exportar PDF. Por favor, intenta de nuevo.');
		}
	};

	const handleSendEmail = async (email) => {
		try {
			await emailMutation.mutateAsync(email);
			alert(
				USE_MOCK_DATA
					? 'Email enviado exitosamente (mock data)'
					: 'Email enviado exitosamente'
			);
		} catch (error) {
			console.error('Error sending email:', error);
			alert('Error al enviar email. Por favor, intenta de nuevo.');
		}
	};

	const handleSelectCalendar = (id) => {
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
					<img src='/img/progress.gif' alt='Loading' />
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
	const currentCalendar = calendars.find((c) => c.id === selectedCalendarId);
	const listaContent = listaData?.data || {};
	const categories = listaContent.categorias || [];
	const ingredients = listaContent.ingredients || {};
	const takenIngredients = listaContent.taken_ingredientes || [];
	const totalCount = listaContent.total_count || 0;

	// Count unchecked ingredients
	const uncheckedCount = totalCount - takenIngredients.length;

	return (
		<div className='general-container lista-json'>
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
				/>

				{!currentCalendar ? (
					<div className='no-cal-sec flex-center flex-column'>
						<h3>¡No tienes ningún calendario! Crea uno.</h3>
					</div>
				) : listaLoading ? (
					<div className='lista-loading'>
						<div className='loader'>
							<img src='/img/progress.gif' alt='Loading' />
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

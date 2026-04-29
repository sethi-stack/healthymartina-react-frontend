import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCalendarStore } from '../stores/calendarStore';
import {
	getCalendars,
	getCalendar,
	createCalendar,
	updateCalendar,
	deleteCalendar,
	copyCalendar,
} from '../lib/api/calendars';
import CalendarGrid from '../components/calendar/CalendarGrid';
import CalendarOptions from '../components/calendar/CalendarOptions';
import CreateCalendarModal from '../components/calendar/CreateCalendarModal';
import EditCalendarModal from '../components/calendar/EditCalendarModal';
import DeleteCalendarModal from '../components/calendar/DeleteCalendarModal';
import CopyCalendarModal from '../components/calendar/CopyCalendarModal';
import ExportCalendarModal from '../components/calendar/ExportCalendarModal';
import CalendarListaTab from '../components/calendar/CalendarListaTab';
import './Calendar.scss';

/**
 * Calendar Planner Page
 * Main page for managing meal calendars with drag-and-drop recipe assignment
 */
export default function Calendar() {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// Get calendar store to persist selection across pages
	const { setSelectedCalendar, clearSelectedCalendar } = useCalendarStore();

	const calendarId = searchParams.get('id');
	const [selectedCalendarId, setSelectedCalendarId] = useState(
		calendarId ? parseInt(calendarId) : null
	);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showCopyModal, setShowCopyModal] = useState(false);
	const [showExportModal, setShowExportModal] = useState(false);
	const [showListaTab, setShowListaTab] = useState(false);

	// Fetch calendars list
	const {
		data: calendarsData,
		isLoading: calendarsLoading,
		isFetching: calendarsFetching,
		error: calendarsError,
	} = useQuery({
		queryKey: ['calendars'],
		queryFn: () => getCalendars({ per_page: 100 }),
	});

	// Fetch selected calendar
	const {
		data: calendarData,
		isLoading: calendarLoading,
		isFetching: calendarFetching,
		error: calendarError,
	} = useQuery({
		queryKey: ['calendar', selectedCalendarId],
		queryFn: () => getCalendar(selectedCalendarId),
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

	// Keep global selected calendar store in sync with the currently active calendar.
	// This prevents add-to-calendar flows outside this page from using a stale calendar ID.
	useEffect(() => {
		if (!selectedCalendarId || !calendarsData?.data?.length) return;
		const activeCalendar = calendarsData.data.find(
			(c) => c.id === selectedCalendarId
		);
		if (activeCalendar) {
			setSelectedCalendar(activeCalendar.id, activeCalendar.title || '');
		}
	}, [selectedCalendarId, calendarsData, setSelectedCalendar]);

	// Create calendar mutation
	const createMutation = useMutation({
		mutationFn: (data) => createCalendar(data),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['calendars'] });
			const newCalendar = response.calendar;
			setSelectedCalendar(newCalendar.id, newCalendar.title);
			setSelectedCalendarId(newCalendar.id);
			setShowCreateModal(false);
		},
	});

	// Update calendar mutation
	const updateMutation = useMutation({
		mutationFn: ({ id, data }) => updateCalendar(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['calendars'] });
			queryClient.invalidateQueries({
				queryKey: ['calendar', selectedCalendarId],
			});
			setShowEditModal(false);
		},
	});

	// Delete calendar mutation
	const deleteMutation = useMutation({
		mutationFn: (id) => deleteCalendar(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['calendars'] });
			setShowDeleteModal(false);
			// Select first available calendar or clear selection
			if (calendarsData?.data?.length > 1) {
				const remainingCalendars = calendarsData.data.filter(
					(c) => c.id !== selectedCalendarId
				);
				if (remainingCalendars.length > 0) {
					const firstRemaining = remainingCalendars[0];
					setSelectedCalendar(firstRemaining.id, firstRemaining.title);
					setSelectedCalendarId(firstRemaining.id);
				}
			} else {
				clearSelectedCalendar();
				setSelectedCalendarId(null);
			}
		},
	});

	// Copy calendar mutation
	const copyMutation = useMutation({
		mutationFn: ({ id, title }) => copyCalendar(id, title),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['calendars'] });
			const copiedCalendar = response.calendar;
			setSelectedCalendar(copiedCalendar.id, copiedCalendar.title);
			setSelectedCalendarId(copiedCalendar.id);
			setShowCopyModal(false);
		},
	});

	const handleCreateCalendar = (title) => {
		createMutation.mutate({ title });
	};

	const handleUpdateCalendar = (title) => {
		if (selectedCalendarId) {
			updateMutation.mutate({ id: selectedCalendarId, data: { title } });
		}
	};

	const handleDeleteCalendar = () => {
		if (selectedCalendarId) {
			deleteMutation.mutate(selectedCalendarId);
		}
	};

	const handleCopyCalendar = (title) => {
		if (selectedCalendarId) {
			copyMutation.mutate({ id: selectedCalendarId, title });
		}
	};

	const handleSelectCalendar = (id) => {
		const calendar = calendars.find((c) => c.id === id);
		setSelectedCalendar(id, calendar?.title || '');
		setSelectedCalendarId(id);
	};

	if (calendarsLoading) {
		return (
			<div className='calendar-loading'>
				<div className='loader'>
					<img src='/img/progress.gif' alt='Loading' />
				</div>
			</div>
		);
	}

	const calendars = calendarsData?.data || [];
	const calendar = calendarData?.data || calendarData;
	const isBusy =
		!calendarsLoading &&
		!calendarLoading &&
		(calendarsFetching ||
		calendarFetching ||
		createMutation.isPending ||
		updateMutation.isPending ||
		deleteMutation.isPending ||
		copyMutation.isPending);

	return (
		<div className='general-container calendario-json'>
			{isBusy && (
				<div className='page-loading-overlay'>
					<div className='loader'>
						<img src='/img/progress.gif' alt='Loading' />
					</div>
				</div>
			)}
			<CalendarOptions
				calendar={calendar}
				calendars={calendars}
				selectedCalendarId={selectedCalendarId}
				onCreateClick={() => setShowCreateModal(true)}
				onCopyClick={() => setShowCopyModal(true)}
				onExportClick={() => setShowExportModal(true)}
				onEditClick={() => setShowEditModal(true)}
				onDeleteClick={() => setShowDeleteModal(true)}
				onSelectCalendar={handleSelectCalendar}
				onListaClick={() => setShowListaTab(true)}
			/>

			{!calendar ? (
				<div className='no-cal-sec flex-center flex-column'>
					<h3>¡No tienes ningún calendario! Crea uno.</h3>
					<div className='button-options btn-create-calendar'>
						<button onClick={() => setShowCreateModal(true)}>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 19.14 19.14'>
								<title>crear</title>
								<g id='Layer_2' data-name='Layer 2'>
									<g id='Contenido-Home'>
										<path
											className='cls-1'
											d='M19.14,11.39H11.39v7.75H7.7V11.39H0V7.7H7.7V0h3.69V7.7h7.75Z'
										/>
									</g>
								</g>
							</svg>
							<p>Crear</p>
						</button>
					</div>
				</div>
			) : (
				<>
					<div className='indicador border-top'>
						<div className='left'>
							<h3 id='calTitle'>{calendar.title}</h3>
						</div>
						<div className='right'>
							<p>
								<img src='/img/iconos/check-circulo.svg' alt='' />
								{calendar.created_at === calendar.updated_at
									? `Creado ${new Date(
											calendar.created_at
									  ).toLocaleDateString()}`
									: `Actualizada ${new Date(
											calendar.updated_at
									  ).toLocaleDateString()}`}
							</p>
						</div>
					</div>

					{calendarLoading ? (
						<div className='calendar-loading'>
							<div className='loader'>
								<img src='/img/progress-calendar.gif' alt='Loading' />
							</div>
						</div>
					) : (
						<>
							<CalendarGrid calendar={calendar} />
							{showListaTab && (
								<CalendarListaTab
									calendarId={selectedCalendarId}
									onClose={() => setShowListaTab(false)}
								/>
							)}
						</>
					)}
				</>
			)}

			{/* Modals */}
			{showCreateModal && (
				<CreateCalendarModal
					onClose={() => setShowCreateModal(false)}
					onSubmit={handleCreateCalendar}
					isLoading={createMutation.isPending}
				/>
			)}

			{showEditModal && calendar && (
				<EditCalendarModal
					calendar={calendar}
					onClose={() => setShowEditModal(false)}
					onSubmit={handleUpdateCalendar}
					isLoading={updateMutation.isPending}
				/>
			)}

			{showDeleteModal && calendar && (
				<DeleteCalendarModal
					calendar={calendar}
					onClose={() => setShowDeleteModal(false)}
					onConfirm={handleDeleteCalendar}
					isLoading={deleteMutation.isPending}
				/>
			)}

			{showCopyModal && calendar && (
				<CopyCalendarModal
					calendar={calendar}
					onClose={() => setShowCopyModal(false)}
					onSubmit={handleCopyCalendar}
					isLoading={copyMutation.isPending}
				/>
			)}

			{showExportModal && calendar && (
				<ExportCalendarModal
					calendar={calendar}
					onClose={() => setShowExportModal(false)}
				/>
			)}
		</div>
	);
}

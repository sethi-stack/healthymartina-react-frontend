import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendar } from '../../lib/api/calendars';
import { exportCalendarPdf, exportListaPdf } from '../../lib/api/calendars';
import CalendarListaTab from './CalendarListaTab';
import './ExportCalendarModal.scss';

/**
 * Export Calendar Modal
 * Handles calendar export with tabs for PDF export and Lista
 */
export default function ExportCalendarModal({ calendar, onClose }) {
	const [activeTab, setActiveTab] = useState('pdf');
	const [exportParams, setExportParams] = useState([1, 2]); // Default: calendar + lista
	const [isExporting, setIsExporting] = useState(false);

	// Fetch full calendar data for export
	const { data: calendarData } = useQuery({
		queryKey: ['calendar', calendar?.id],
		queryFn: () => getCalendar(calendar?.id),
		enabled: !!calendar?.id,
	});

	const handleExportParamToggle = (param) => {
		setExportParams((prev) => {
			if (prev.includes(param)) {
				return prev.filter((p) => p !== param);
			}
			return [...prev, param];
		});
	};

	const handleExportPdf = async () => {
		if (!calendar?.id) return;

		setIsExporting(true);
		try {
			const blob = await exportCalendarPdf({
				calendar: calendar.id,
				export_param: exportParams,
			});

			// Create download link
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `${calendar.title || calendar.nombre || 'calendario'}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			onClose();
		} catch (error) {
			console.error('Error exporting PDF:', error);
			alert('Error al exportar el calendario');
		} finally {
			setIsExporting(false);
		}
	};

	const handleExportListaPdf = async () => {
		if (!calendar?.id) return;

		setIsExporting(true);
		try {
			const blob = await exportListaPdf(calendar.id);

			// Create download link
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `lista-${calendar.title || calendar.nombre || 'calendario'}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			onClose();
		} catch (error) {
			console.error('Error exporting lista PDF:', error);
			alert('Error al exportar la lista');
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className='popup popupstyle1 exportar-calendar' onClick={onClose}>
			<div className='container-popup' onClick={(e) => e.stopPropagation()}>
				<button className='close' onClick={onClose}>
					<i className='fas fa-times'></i>
				</button>
				<h3>
					Exportar{' '}
					<span className='export-calendar-form'>
						{calendar?.title || calendar?.nombre}
					</span>
				</h3>

				<div className='tabs-container'>
					<div className='tabs typ2'>
						<a
							href='#tab-pdf'
							className={`tab-link ${activeTab === 'pdf' ? 'active' : ''}`}
							onClick={(e) => {
								e.preventDefault();
								setActiveTab('pdf');
							}}
						>
							<p>Descargar</p>
						</a>
						<a
							href='#tab-lista'
							className={`tab-link ${activeTab === 'lista' ? 'active' : ''}`}
							onClick={(e) => {
								e.preventDefault();
								setActiveTab('lista');
							}}
						>
							<p>Lista</p>
						</a>
					</div>

					<div className='tabs-content'>
						{activeTab === 'pdf' && (
							<div className='tab-pane active' id='tab-pdf'>
								<div className='export-options'>
									<p>Selecciona qué incluir en la exportación:</p>
									<div className='select-buttons'>
										<button
											className={`calendar-export-select ${
												exportParams.includes(1) ? 'button--active' : ''
											}`}
											onClick={() => handleExportParamToggle(1)}
										>
											<div className='button__content flex-column flex-center'>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													width='30'
													height='30'
													viewBox='0 0 30 30'
												>
													<path d='M15,0C6.716,0,0,6.716,0,15s6.716,15,15,15s15-6.716,15-15S23.284,0,15,0L15,0z'></path>
													<path d='M12.488,12.459h5.53c0.434,0,0.79-0.355,0.79-0.79v-0.791c0-0.434-0.356-0.79-0.79-0.79h-5.53 c-0.435,0-0.791,0.355-0.791,0.79v0.791C11.698,12.104,12.054,12.459,12.488,12.459z M10.118,9.299 c-0.435,0-0.791,0.355-0.791,0.79V20.36c0,0.435,0.356,0.79,0.791,0.79c0.434,0,0.79-0.355,0.79-0.79V10.089 C10.908,9.654,10.552,9.299,10.118,9.299z M21.179,14.039h-8.69c-0.435,0-0.791,0.356-0.791,0.79v0.79 c0,0.435,0.356,0.791,0.791,0.791h8.69c0.435,0,0.79-0.356,0.79-0.791v-0.79C21.969,14.395,21.613,14.039,21.179,14.039z M16.438,17.99h-3.95c-0.435,0-0.791,0.356-0.791,0.789v0.79c0,0.436,0.356,0.791,0.791,0.791h3.95c0.434,0,0.79-0.355,0.79-0.791 v-0.79C17.229,18.347,16.872,17.99,16.438,17.99z'></path>
												</svg>
												<span>Calendario</span>
											</div>
										</button>
										<button
											className={`calendar-export-select ${
												exportParams.includes(2) ? 'button--active' : ''
											}`}
											onClick={() => handleExportParamToggle(2)}
										>
											<div className='button__content flex-column flex-center'>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													width='30'
													height='30'
													viewBox='0 0 30 30'
												>
													<path d='M15,0C6.716,0,0,6.716,0,15s6.716,15,15,15s15-6.716,15-15S23.284,0,15,0L15,0z'></path>
													<path d='M9.626,17.688v1.793h1.791v-1.793H9.626z M8.729,15.896h3.583 c0.493,0,0.896,0.404,0.896,0.897v3.582c0,0.494-0.403,0.896-0.896,0.896H8.729c-0.492,0-0.896-0.402-0.896-0.896v-3.582 C7.834,16.3,8.237,15.896,8.729,15.896z'></path>
												</svg>
												<span>Lista</span>
											</div>
										</button>
									</div>
									<button
										className='export-btn'
										onClick={handleExportPdf}
										disabled={isExporting || exportParams.length === 0}
									>
										{isExporting ? 'Exportando...' : 'Exportar PDF'}
									</button>
								</div>
							</div>
						)}

						{activeTab === 'lista' && (
							<div className='tab-pane active' id='tab-lista'>
								<CalendarListaTab
									calendarId={calendar?.id}
									onClose={onClose}
									showExportButton={true}
									onExportPdf={handleExportListaPdf}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}


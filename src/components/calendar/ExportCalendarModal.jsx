import { useState } from 'react';
import { exportCalendarPdf, exportListaPdf } from '../../lib/api/calendars';
import CalendarListaTab from './CalendarListaTab';
import Modal from './Modal';
import './ExportCalendarModal.scss';

export default function ExportCalendarModal({ calendar, onClose }) {
	const [activeTab, setActiveTab] = useState('pdf');
	const [exportParams, setExportParams] = useState([1, 2]); // Default: calendar + lista
	const [isExporting, setIsExporting] = useState(false);
	const [exportError, setExportError] = useState(null);

	const handleExportParamToggle = (param) => {
		setExportParams((prev) =>
			prev.includes(param) ? prev.filter((p) => p !== param) : [...prev, param]
		);
	};

	const handleExportPdf = async () => {
		if (!calendar?.id) return;
		setIsExporting(true);
		setExportError(null);
		try {
			const blob = await exportCalendarPdf({
				calendar: calendar.id,
				export_param: exportParams,
			});
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `${calendar.title || 'calendario'}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
			onClose();
		} catch (error) {
			console.error('Error exporting PDF:', error);
			setExportError('Error al exportar el calendario. Intenta de nuevo.');
		} finally {
			setIsExporting(false);
		}
	};

	const handleExportListaPdf = async () => {
		if (!calendar?.id) return;
		setIsExporting(true);
		setExportError(null);
		try {
			const blob = await exportListaPdf(calendar.id);
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `lista-${calendar.title || 'calendario'}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
			onClose();
		} catch (error) {
			console.error('Error exporting lista PDF:', error);
			setExportError('Error al exportar la lista. Intenta de nuevo.');
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<Modal
			onClose={onClose}
			title={
				<>
					Exportar{' '}
					<span className='export-calendar-form'>{calendar?.title}</span>
				</>
			}
			className='popupstyle1 exportar-calendar'
			width={820}
			dataModal='export-calendar'
		>
			<div className='tabs-container'>
				<div className='tabs typ2 hm-tabs__nav'>
					<button
						type='button'
						className={`tab-link hm-tabs__tab ${activeTab === 'pdf' ? 'active hm-tabs__tab--active' : ''}`}
						onClick={() => setActiveTab('pdf')}
					>
						Descargar
					</button>
					<button
						type='button'
						className={`tab-link hm-tabs__tab ${activeTab === 'lista' ? 'active hm-tabs__tab--active' : ''}`}
						onClick={() => setActiveTab('lista')}
					>
						Lista
					</button>
				</div>

				<div className='tabs-content hm-tabs__content'>
					{activeTab === 'pdf' ? (
						<div className='tab-pane active hm-tabs__panel hm-tabs__panel--active' id='tab-pdf'>
							<div className='export-options'>
								<p>Selecciona qué incluir en la exportación:</p>

								<div className='select-buttons'>
									{/* Calendario */}
									<button
										type='button'
										className={`calendar-export-select hm-btn hm-btn--toggle ${
											exportParams.includes(1) ? 'button--active hm-btn--toggle-active' : ''
										}`}
										onClick={() => handleExportParamToggle(1)}
									>
										<div className='button__content flex-column flex-center'>
											<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'>
												<path d='M15,0C6.716,0,0,6.716,0,15s6.716,15,15,15s15-6.716,15-15S23.284,0,15,0L15,0z' />
												<path d='M12.488,12.459h5.53c0.434,0,0.79-0.355,0.79-0.79v-0.791c0-0.434-0.356-0.79-0.79-0.79h-5.53 c-0.435,0-0.791,0.355-0.791,0.79v0.791C11.698,12.104,12.054,12.459,12.488,12.459z M10.118,9.299 c-0.435,0-0.791,0.355-0.791,0.79V20.36c0,0.435,0.356,0.79,0.791,0.79c0.434,0,0.79-0.355,0.79-0.79V10.089 C10.908,9.654,10.552,9.299,10.118,9.299z M21.179,14.039h-8.69c-0.435,0-0.791,0.356-0.791,0.79v0.79 c0,0.435,0.356,0.791,0.791,0.791h8.69c0.435,0,0.79-0.356,0.79-0.791v-0.79C21.969,14.395,21.613,14.039,21.179,14.039z M16.438,17.99h-3.95c-0.435,0-0.791,0.356-0.791,0.789v0.79c0,0.436,0.356,0.791,0.791,0.791h3.95c0.434,0,0.79-0.355,0.79-0.791 v-0.79C17.229,18.347,16.872,17.99,16.438,17.99z' />
											</svg>
											<span>Calendario</span>
										</div>
									</button>

									{/* Lista */}
									<button
										type='button'
										className={`calendar-export-select hm-btn hm-btn--toggle ${
											exportParams.includes(2) ? 'button--active hm-btn--toggle-active' : ''
										}`}
										onClick={() => handleExportParamToggle(2)}
									>
										<div className='button__content flex-column flex-center'>
											<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'>
												<path d='M15,0C6.716,0,0,6.716,0,15s6.716,15,15,15s15-6.716,15-15S23.284,0,15,0L15,0z' />
												<path d='M9.626,17.688v1.793h1.791v-1.793H9.626z M8.729,15.896h3.583 c0.493,0,0.896,0.404,0.896,0.897v3.582c0,0.494-0.403,0.896-0.896,0.896H8.729c-0.492,0-0.896-0.402-0.896-0.896v-3.582 C7.834,16.3,8.237,15.896,8.729,15.896z M19.271,9.299H10.73c-0.494,0-0.897,0.403-0.897,0.896v3.583 c0,0.494,0.403,0.896,0.897,0.896h8.541c0.494,0,0.896-0.402,0.896-0.896V10.195C20.167,9.702,19.765,9.299,19.271,9.299z' />
											</svg>
											<span>Lista</span>
										</div>
									</button>

									{/* Nutrición */}
									<button
										type='button'
										className={`calendar-export-select hm-btn hm-btn--toggle ${
											exportParams.includes(4) ? 'button--active hm-btn--toggle-active' : ''
										}`}
										onClick={() => handleExportParamToggle(4)}
									>
										<div className='button__content flex-column flex-center'>
											<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'>
												<path d='M15,0C6.716,0,0,6.716,0,15s6.716,15,15,15s15-6.716,15-15S23.284,0,15,0L15,0z' />
												<path d='M20.5,9.5h-11c-0.828,0-1.5,0.672-1.5,1.5v8c0,0.828,0.672,1.5,1.5,1.5h11c0.828,0,1.5-0.672,1.5-1.5v-8 C22,10.172,21.328,9.5,20.5,9.5z M11,18v-2h1.5v2H11z M11,14.5v-2H12.5v2H11z M14,18v-2h1.5v2H14z M14,14.5v-2H15.5v2H14z M17,18v-2h1.5v2H17z M17,14.5v-2H18.5v2H17z' />
											</svg>
											<span>Nutrición</span>
										</div>
									</button>
								</div>

								{exportError && (
									<p className='export-error'>{exportError}</p>
								)}

								<button
									type='submit'
									className='export-btn hm-btn hm-btn--primary hm-btn--block'
									onClick={handleExportPdf}
									disabled={isExporting || exportParams.length === 0}
								>
									{isExporting ? 'Exportando...' : 'Exportar PDF'}
								</button>
							</div>
						</div>
					) : (
						<div className='tab-pane active hm-tabs__panel hm-tabs__panel--active' id='tab-lista'>
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
		</Modal>
	);
}

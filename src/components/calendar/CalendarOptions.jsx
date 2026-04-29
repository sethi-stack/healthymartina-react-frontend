import React, { useState } from 'react';
import { FaCopy, FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import './CalendarOptions.scss';

/**
 * Calendar Options Component
 * Displays action buttons and calendar selector
 */
export default function CalendarOptions({
	calendar,
	calendars = [],
	selectedCalendarId,
	onCreateClick,
	onCopyClick,
	onExportClick,
	onEditClick,
	onDeleteClick,
	onSelectCalendar,
	onListaClick,
}) {
	const [showMenu, setShowMenu] = useState(false);
	const [showCalendarSelector, setShowCalendarSelector] = useState(false);

	const hasCalendar = !!calendar;
	const canEdit = hasCalendar; // Add role check if needed

	return (
		<div className='calendar-options'>
			<div className='left'>
				{hasCalendar && canEdit && (
					<>
						<div className='button-options btn-create-calendar'>
							<button onClick={onCreateClick}>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 19.14 19.14'
								>
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

						<div
							className='button-options btn-copiar-calendar'
							data-calendar={calendar?.title}
						>
							<button onClick={onCopyClick}>
								<FaCopy />
								<p>Copiar</p>
							</button>
						</div>
					</>
				)}

				{hasCalendar && (
					<>
						<div className='button-options'>
							<a
								className='calendario-exportar1 export_pdf'
								data-page='calendario'
								href='#'
								data-id={calendar?.id}
								data-calendar={calendar?.title}
								onClick={(e) => {
									e.preventDefault();
									onExportClick();
							}}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 14.69 14.69'
								>
									<title>exportar</title>
									<g id='Layer_2' data-name='Layer 2'>
										<g id='Contenido-Home'>
											<path
												className='cls-1'
												d='M14.69,5.28V1.05a1,1,0,0,0-1-1H7.71A1.07,1.07,0,0,0,7,.31a1,1,0,0,0-.3.74,1.08,1.08,0,0,0,.3.74,1.07,1.07,0,0,0,.75.31h3.4L7.71,5.5A1.06,1.06,0,0,0,7.71,7,1,1,0,0,0,9.19,7l3.4-3.41V7a1.06,1.06,0,0,0,1.05,1,1.07,1.07,0,0,0,.75-.31,1,1,0,0,0,.3-.74V5.28Zm-1,4.17a1,1,0,0,0-1.05,1.05v2.09H2.1V2.1H4.2A1,1,0,0,0,4.2,0H1.05A1,1,0,0,0,0,1.05V13.64a1,1,0,0,0,1.05,1H13.64a1,1,0,0,0,1-1V10.5A1,1,0,0,0,13.64,9.45Z'
											/>
										</g>
									</g>
								</svg>
								<p>Exportar</p>
							</a>
						</div>

						<div className='button-hamburger calendario-menu-explore hm-menu'>
							<button
								className={`hm-menu__trigger ${showMenu ? 'hm-menu__trigger--active' : ''}`}
								onClick={() => setShowMenu(!showMenu)}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 25.04 14.89'
								>
									<title>Menu</title>
									<g id='Layer_2' data-name='Layer 2'>
										<g id='Contenido-Home'>
											<rect
												className='cls-1'
												width='25.04'
												height='2.14'
												rx='1.07'
											></rect>
											<rect
												className='cls-1'
												y='6.38'
												width='25.04'
												height='2.14'
												rx='1.07'
											></rect>
											<rect
												className='cls-1'
												y='12.75'
												width='25.04'
												height='2.14'
												rx='1.07'
											></rect>
										</g>
									</g>
								</svg>
							</button>
							<div className={`sub-menu hm-menu__dropdown ${showMenu ? 'hm-menu__dropdown--open' : ''}`}>
								<button
									className='hm-menu__item'
									onClick={(e) => {
										e.preventDefault();
										setShowMenu(false);
										onEditClick();
									}}
								>
									<FaEdit className='hm-menu__icon' />
									Editar nombre
								</button>
								<button
									className='hm-menu__item'
									onClick={(e) => {
										e.preventDefault();
										setShowMenu(false);
										onDeleteClick();
									}}
								>
									<FaTrashAlt className='hm-menu__icon' />
									Eliminar
								</button>
							</div>
						</div>
					</>
				)}
			</div>

			<div className='right'>
				<div className='button-options calendario-update-view'>
					<button onClick={() => setShowCalendarSelector(!showCalendarSelector)}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 23.05 23.05'
						>
							<title>calendarios</title>
							<g id='Layer_2' data-name='Layer 2'>
								<g id='Contenido-Home'>
									<path
										className='cls-1'
										d='M2.88,3.6V.72a.72.72,0,0,1,1.44,0V3.6a.72.72,0,0,1-1.44,0Zm12.25.72a.72.72,0,0,0,.72-.72V.72a.72.72,0,0,0-1.44,0V3.6A.72.72,0,0,0,15.13,4.32Zm7.92,13a5.77,5.77,0,1,1-5.76-5.77A5.76,5.76,0,0,1,23.05,17.29Zm-1.44,0a4.32,4.32,0,1,0-4.32,4.32A4.32,4.32,0,0,0,21.61,17.29ZM5.76,8.64H2.88v2.88H5.76ZM2.88,15.85H5.76V13H2.88ZM7.2,11.52h2.88V8.64H7.2Zm0,4.33h2.88V13H7.2ZM1.44,17.14V7.2H17.29v2.88h1.44V4.47a1.58,1.58,0,0,0-1.56-1.59h-.6V3.6a1.44,1.44,0,1,1-2.88,0V2.88H5V3.6a1.44,1.44,0,0,1-2.88,0V2.88h-.6A1.58,1.58,0,0,0,0,4.47V17.14a1.58,1.58,0,0,0,1.56,1.59h8.52V17.29H1.56A.14.14,0,0,1,1.44,17.14Zm13-5.62V8.64H11.52v2.88Zm5,5.77H17.29V15.13a.72.72,0,0,0-1.44,0V18a.72.72,0,0,0,.72.72h2.88a.72.72,0,1,0,0-1.44Z'
									/>
								</g>
							</g>
						</svg>
						<p>Calendarios</p>
					</button>
					{showCalendarSelector && (
						<div className='calendar-selector-popup'>
							<div className='calendar-selector-header'>
								<h4>Seleccionar Calendario</h4>
								<button
									className='close'
									onClick={() => setShowCalendarSelector(false)}
								>
									<FaTimes />
								</button>
							</div>
							<div className='calendar-selector-list'>
								{calendars.map((cal) => (
									<button
										key={cal.id}
										className={`calendar-item ${
											selectedCalendarId === cal.id ? 'active' : ''
										}`}
										onClick={() => {
											onSelectCalendar(cal.id);
											setShowCalendarSelector(false);
										}}
									>
										{cal.title}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

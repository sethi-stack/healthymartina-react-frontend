import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import './ListaOptions.scss';

/**
 * ListaOptions Component
 * Action buttons toolbar for export, email, and calendar switching
 */
export default function ListaOptions({
	onExportPdf,
	onSendEmail,
	onSwitchCalendar,
	calendars = [],
	currentCalendarId,
}) {
	const [showEmailInput, setShowEmailInput] = useState(false);
	const [emailAddress, setEmailAddress] = useState('');

	const handleExportClick = () => {
		if (onExportPdf) {
			onExportPdf();
		}
	};

	const handleEmailClick = () => {
		setShowEmailInput(!showEmailInput);
	};

	const handleSendEmail = (e) => {
		e.preventDefault();
		if (onSendEmail) {
			onSendEmail(emailAddress || undefined);
			setShowEmailInput(false);
			setEmailAddress('');
		}
	};

	const handleSwitchClick = () => {
		if (onSwitchCalendar) {
			onSwitchCalendar();
		}
	};

	const showListasButton = calendars.length > 1;

	return (
		<div className='options background-light-gray'>
			<div className='left'>
				<div className='button-options'>
					<button onClick={handleExportClick}>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14.69 14.69'>
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
					</button>
				</div>

				<div className='button-options send-copy-lista'>
					<button onClick={handleEmailClick}>
						<FaEnvelope style={{ fontSize: '20px', color: '#7a7a7a' }} />
						<p>Enviar por mail</p>
					</button>
				</div>

				{showEmailInput && (
					<div className='email-input-container'>
						<form onSubmit={handleSendEmail}>
							<input
								type='email'
								placeholder='Email (opcional)'
								value={emailAddress}
								onChange={(e) => setEmailAddress(e.target.value)}
								className='email-input'
							/>
							<button type='submit' className='send-btn'>
								Enviar
							</button>
							<button
								type='button'
								className='cancel-btn'
								onClick={() => {
									setShowEmailInput(false);
									setEmailAddress('');
								}}
							>
								Cancelar
							</button>
						</form>
					</div>
				)}
			</div>

			{showListasButton && (
				<div className='right'>
					<div className='button-options calendario-update-view'>
						<button onClick={handleSwitchClick}>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23.05 23.05'>
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
							<p>Listas</p>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './Modal.scss';

/**
 * Reusable modal wrapper used across calendar, filters, and other popups.
 * Provides overlay, fixed container width, bordered close button, and
 * optional overlay close behavior.
 */
export default function Modal({
	isOpen = true,
	onClose,
	title,
	children,
	className = '',
	width = 540,
	closeOnOverlay = true,
}) {
	if (!isOpen) return null;

	const normalizedWidth = typeof width === 'number' ? `${width}px` : width;
	const overlayHandler = closeOnOverlay ? onClose : undefined;

	return (
		<div className={`popup ${className}`.trim()} onClick={overlayHandler}>
			<div
				className='container-popup'
				onClick={(e) => e.stopPropagation()}
				style={{
					maxWidth: normalizedWidth,
					width: `min(92vw, ${normalizedWidth})`,
				}}
			>
				<button className='close' onClick={onClose} aria-label='Cerrar modal'>
					<FaTimes />
				</button>

				<div className='modal-content'>
					{title ? <h3>{title}</h3> : null}

					{children}
				</div>
			</div>
		</div>
	);
}

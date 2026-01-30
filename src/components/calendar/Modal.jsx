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
	dataModal = null,
}) {
	if (!isOpen) return null;

	const normalizedWidth = typeof width === 'number' ? `${width}px` : width;
	const overlayHandler = closeOnOverlay ? onClose : undefined;

	return (
		<div
			className={`popup ${className}`.trim()}
			onClick={overlayHandler}
			data-modal={dataModal}
		>
			<div
				className='container-popup hm-modal__container'
				onClick={(e) => e.stopPropagation()}
				style={{
					maxWidth: normalizedWidth,
					width: `min(92vw, ${normalizedWidth})`,
				}}
			>
				<button className='close hm-modal__close' onClick={onClose} aria-label='Cerrar modal'>
					<FaTimes />
				</button>

				<div className='modal-content hm-modal__body'>
					{title ? <h3 className='hm-modal__title'>{title}</h3> : null}

					{children}
				</div>
			</div>
		</div>
	);
}

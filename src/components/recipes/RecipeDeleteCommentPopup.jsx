import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * Recipe Delete Comment Popup Component
 * Confirmation popup for deleting a comment
 */
export function RecipeDeleteCommentPopup({ onConfirm, onClose }) {
	return (
		<div className='popup eliminar-comentario comment'>
			<div className='container-popup'>
				<button className='close' onClick={onClose}>
					<FaTimes />
				</button>
				<h3>Eliminar comentario</h3>
				<img src='/img/alert-icon.png' alt='Alerta' />
				<p>¿Estás seguro que deseas eliminar el comentario?</p>
				<a
					className='button delete-comment-popup'
					href='#'
					onClick={(e) => {
						e.preventDefault();
						onConfirm();
					}}
				>
					Eliminar comentario
				</a>
			</div>
		</div>
	);
}

import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * Recipe Comment Form Component
 * Handles adding new comments and replies with popup modals
 */
export function RecipeCommentForm({
	recipeId,
	onSubmit,
	onClose,
	isReply = false,
	replyTo = null,
}) {
	const [commentText, setCommentText] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (commentText.trim()) {
			onSubmit(commentText.trim());
			setCommentText('');
		}
	};

	return (
		<div
			className={`popup ${
				isReply ? 'responder-comentario' : 'escribir-comentario'
			} comment`}
		>
			<div className='container-popup'>
				<button className='close' onClick={onClose}>
					<FaTimes />
				</button>
				{isReply && replyTo ? (
					<h3 className='response-to'>Responder a {replyTo.name}</h3>
				) : (
					<h3>Comentario nuevo</h3>
				)}
				<form onSubmit={handleSubmit}>
					{isReply && <p className='label'>Respuesta</p>}
					<textarea
						className='comment'
						id={isReply ? 'content-response' : ''}
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						placeholder='Escribe tu comentario aquí...'
						rows={6}
					/>
					<input
						className='send-comment'
						type='submit'
						value={isReply ? 'Responder' : 'Agregar comentario'}
					/>
				</form>
			</div>
		</div>
	);
}

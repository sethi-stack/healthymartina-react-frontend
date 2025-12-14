import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * Recipe Comment Info Popup Component
 * Initial popup that shows info before opening the comment form
 */
export function RecipeCommentInfoPopup({
	onProceed,
	onClose,
	isReply = false,
	replyTo = null,
}) {
	return (
		<div
			className={`popup ${
				isReply ? 'agregar-respuesta' : 'agregar-comentario'
			} comment`}
		>
			<div className='container-popup'>
				<button className='close' onClick={onClose}>
					<FaTimes />
				</button>
				{isReply && replyTo ? (
					<>
						<h3 className='response-to'>Responder a {replyTo.name}</h3>
						<img src='/img/comentario.jpg' alt='Comentario' />
					</>
				) : (
					<>
						<h3>Comentario nuevo</h3>
						<img src='/img/comentario.jpg' alt='Comentario' />
					</>
				)}
				<p>
					Este comentario se compartirá con todos los miembros de Healthy
					Martina
				</p>
				<a
					className={`button ${isReply ? 'a-answ' : 'a-com'}`}
					href='#'
					onClick={(e) => {
						e.preventDefault();
						onProceed();
					}}
				>
					{isReply ? 'Agregar respuesta' : 'Agregar comentario'}
				</a>
				<a
					className='second'
					href='https://healthy-martina.helpscoutdocs.com/article/37-en-donde-encuentro-tips-consejos-o-variaciones-de-las-receta'
					target='_blank'
					rel='noopener noreferrer'
				>
					¿Buscas sugerencias y tips?
				</a>
			</div>
		</div>
	);
}

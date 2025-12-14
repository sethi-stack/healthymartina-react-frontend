import React, { useState } from 'react';

/**
 * Recipe Comments Component
 * Displays comments section for the recipe
 */
export function RecipeComments({ recipeId, comments: initialComments }) {
	const [comments, setComments] = useState(initialComments || []);
	const [showAddComment, setShowAddComment] = useState(false);

	const handleAddComment = () => {
		setShowAddComment(true);
		// TODO: Implement comment modal/popup
		console.log('Add comment for recipe:', recipeId);
	};

	return (
		<div className='comments-container'>
			<div className='top'>
				<h3>Comentarios</h3>
				<div className='right'>
					<p>{comments.length} Comentarios</p>
					<a
						className='add-new-comment'
						href='#'
						onClick={(e) => {
							e.preventDefault();
							handleAddComment();
						}}
					>
						Agregar comentario
					</a>
				</div>
			</div>
			<div id='recipe-data' data-recipe={recipeId}></div>
			<div className='comments'>
				{comments.map((comment) => (
					<div key={comment.id} className='comment'>
						<div className='comment-date'>
							<p>{comment.day}</p>
							<span>{comment.month}</span>
						</div>
						<div className='comment-content'>
							<div
								className='comment-img'
								style={{
									backgroundImage: `url(${comment.user?.image || ''})`,
								}}
							></div>
							<div className='comment-details'>
								<h3>
									{comment.user?.name} / <span>@{comment.user?.username}</span>
								</h3>
								<p>{comment.comment}</p>
							</div>
						</div>
						<div className='comment-menu'>
							<button>
								<span></span>
								<span></span>
								<span></span>
							</button>
							<div className='comment-nav'>
								<a className='make-response' href='#'>
									<i className='fas fa-reply'></i>Responder comentario
								</a>
								{/* TODO: Show delete only if comment is owned by current user */}
								<a className='delete-comment' href='#'>
									<i className='fas fa-trash'></i>Eliminar comentario
								</a>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

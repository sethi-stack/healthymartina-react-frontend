import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	getRecipeComments,
	addRecipeComment,
	deleteRecipeComment,
} from '../../lib/api/recipes';

/**
 * Recipe Comments Component
 * Displays comments section for the recipe
 */
export function RecipeComments({ recipeId, comments: initialComments }) {
	const queryClient = useQueryClient();
	const [showAddComment, setShowAddComment] = useState(false);

	// Fetch comments from API
	const {
		data: commentsData,
		isLoading: isLoadingComments,
		refetch: refetchComments,
	} = useQuery({
		queryKey: ['recipe-comments', recipeId],
		queryFn: () => getRecipeComments(recipeId),
		enabled: !!recipeId,
		staleTime: 2 * 60 * 1000, // 2 minutes
	});

	// Use API comments if available, otherwise fall back to initialComments
	const comments =
		commentsData?.data || commentsData?.comments || initialComments || [];

	const addCommentMutation = useMutation({
		mutationFn: ({ recipeId, comment }) => addRecipeComment(recipeId, comment),
		onSuccess: () => {
			// Refetch comments after adding
			refetchComments();
			setShowAddComment(false);
		},
	});

	const deleteCommentMutation = useMutation({
		mutationFn: (commentId) => deleteRecipeComment(commentId),
		onSuccess: () => {
			// Refetch comments after deleting
			refetchComments();
		},
	});

	const handleAddComment = () => {
		setShowAddComment(true);
		// TODO: Implement comment modal/popup
		console.log('Add comment for recipe:', recipeId);
	};

	const handleDeleteComment = async (commentId) => {
		if (window.confirm('¿Estás seguro que deseas eliminar este comentario?')) {
			try {
				await deleteCommentMutation.mutateAsync(commentId);
			} catch (error) {
				console.error('Error deleting comment:', error);
				alert('Error al eliminar el comentario. Por favor, intenta de nuevo.');
			}
		}
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
				{isLoadingComments ? (
					<div style={{ textAlign: 'center', padding: '20px' }}>
						<img src='/img/progress.gif' alt='Loading...' />
					</div>
				) : comments.length === 0 ? (
					<div
						style={{ textAlign: 'center', padding: '20px', color: '#7a7a7a' }}
					>
						<p>No hay comentarios aún. Sé el primero en comentar.</p>
					</div>
				) : (
					comments.map((comment) => {
						// Format date from API response (could be ISO string or formatted)
						const commentDate = comment.created_at
							? new Date(comment.created_at)
							: null;
						const day =
							comment.day || (commentDate ? commentDate.getDate() : '');
						const month =
							comment.month ||
							(commentDate
								? commentDate.toLocaleString('es-ES', { month: 'short' })
								: '');

						return (
							<div key={comment.id} className='comment'>
								<div className='comment-date'>
									<p>{day}</p>
									<span>{month}</span>
								</div>
								<div className='comment-content'>
									<div
										className='comment-img'
										style={{
											backgroundImage: `url(${
												comment.user?.image || comment.user?.photo || ''
											})`,
										}}
									></div>
									<div className='comment-details'>
										<h3>
											{comment.user?.name || comment.user?.nombre} /{' '}
											<span>
												@{comment.user?.username || comment.user?.usuario}
											</span>
										</h3>
										<p>{comment.comment || comment.comentario}</p>
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
										{/* Show delete only if comment is owned by current user */}
										{comment.is_owned_by_current_user !== false && (
											<a
												className='delete-comment'
												href='#'
												onClick={(e) => {
													e.preventDefault();
													handleDeleteComment(comment.id);
												}}
											>
												<i className='fas fa-trash'></i>Eliminar comentario
											</a>
										)}
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}

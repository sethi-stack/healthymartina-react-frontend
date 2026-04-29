import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaReply, FaTrash } from 'react-icons/fa';
import {
	getRecipeComments,
	addRecipeComment,
	deleteRecipeComment,
} from '../../lib/api/recipes';
import { RecipeCommentInfoPopup } from './RecipeCommentInfoPopup';
import { RecipeCommentForm } from './RecipeCommentForm';
import { RecipeDeleteCommentPopup } from './RecipeDeleteCommentPopup';

/**
 * Recipe Comments Component
 * Displays comments section for the recipe
 */
export function RecipeComments({ recipeId, comments: initialComments }) {
	const queryClient = useQueryClient();
	const [showInfoPopup, setShowInfoPopup] = useState(false);
	const [showCommentForm, setShowCommentForm] = useState(false);
	const [showDeletePopup, setShowDeletePopup] = useState(false);
	const [showReplyInfoPopup, setShowReplyInfoPopup] = useState(false);
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [replyTo, setReplyTo] = useState(null);
	const [commentToDelete, setCommentToDelete] = useState(null);
	const [openMenuId, setOpenMenuId] = useState(null);

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
			setShowCommentForm(false);
			setShowInfoPopup(false);
			setShowReplyForm(false);
			setShowReplyInfoPopup(false);
			setReplyTo(null);
		},
	});

	const deleteCommentMutation = useMutation({
		mutationFn: (commentId) => deleteRecipeComment(commentId),
		onSuccess: () => {
			// Refetch comments after deleting
			refetchComments();
			setShowDeletePopup(false);
			setCommentToDelete(null);
		},
	});

	const handleAddComment = () => {
		setShowInfoPopup(true);
	};

	const handleProceedToForm = () => {
		setShowInfoPopup(false);
		setShowCommentForm(true);
	};

	const handleSubmitComment = async (commentText) => {
		try {
			await addCommentMutation.mutateAsync({ recipeId, comment: commentText });
		} catch (error) {
			console.error('Error adding comment:', error);
			alert('Error al agregar el comentario. Por favor, intenta de nuevo.');
		}
	};

	const handleReply = (comment) => {
		setReplyTo({
			name: comment.user?.name || comment.user?.nombre,
			username: comment.user?.username || comment.user?.usuario,
			commentId: comment.id,
		});
		setShowReplyInfoPopup(true);
	};

	const handleProceedToReplyForm = () => {
		setShowReplyInfoPopup(false);
		setShowReplyForm(true);
	};

	const handleSubmitReply = async (replyText) => {
		try {
			// For now, replies are treated as regular comments
			// If backend supports parent_id, we can add it here
			await addCommentMutation.mutateAsync({ recipeId, comment: replyText });
		} catch (error) {
			console.error('Error adding reply:', error);
			alert('Error al agregar la respuesta. Por favor, intenta de nuevo.');
		}
	};

	const handleDeleteClick = (commentId) => {
		setCommentToDelete(commentId);
		setShowDeletePopup(true);
	};

	const handleConfirmDelete = async () => {
		if (commentToDelete) {
			try {
				await deleteCommentMutation.mutateAsync(commentToDelete);
			} catch (error) {
				console.error('Error deleting comment:', error);
				alert('Error al eliminar el comentario. Por favor, intenta de nuevo.');
			}
		}
	};

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (openMenuId && !event.target.closest('.comment-menu')) {
				setOpenMenuId(null);
			}
		};

		if (openMenuId) {
			document.addEventListener('click', handleClickOutside);
		}

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [openMenuId]);

	return (
		<div className='comments-container'>
			<div className='top'>
				<h3>Comentarios</h3>
				<div className='right'>
					<p>{comments.length} Comentarios</p>
					<button
						type='button'
						className='add-new-comment'
						onClick={(e) => {
							e.preventDefault();
							handleAddComment();
						}}
					>
						Agregar comentario
					</button>
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
								<div
									className={`comment-menu ${
										openMenuId === comment.id ? 'active' : ''
									}`}
								>
									<button
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											setOpenMenuId(
												openMenuId === comment.id ? null : comment.id
											);
										}}
									>
										<span></span>
										<span></span>
										<span></span>
									</button>
									<div className='comment-nav'>
										<a
											className='make-response'
											href='#'
											onClick={(e) => {
												e.preventDefault();
												setOpenMenuId(null);
												handleReply(comment);
											}}
										>
											<FaReply />
											Responder comentario
										</a>
										{/* Show delete only if comment is owned by current user */}
										{comment.is_owned_by_current_user !== false && (
											<a
												className='delete-comment'
												href='#'
												onClick={(e) => {
													e.preventDefault();
													setOpenMenuId(null);
													handleDeleteClick(comment.id);
												}}
											>
												<FaTrash />
												Eliminar comentario
											</a>
										)}
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>

			{/* Popups */}
			{showInfoPopup && (
				<RecipeCommentInfoPopup
					onProceed={handleProceedToForm}
					onClose={() => setShowInfoPopup(false)}
				/>
			)}

			{showCommentForm && (
				<RecipeCommentForm
					recipeId={recipeId}
					onSubmit={handleSubmitComment}
					onClose={() => setShowCommentForm(false)}
				/>
			)}

			{showReplyInfoPopup && replyTo && (
				<RecipeCommentInfoPopup
					onProceed={handleProceedToReplyForm}
					onClose={() => {
						setShowReplyInfoPopup(false);
						setReplyTo(null);
					}}
					isReply={true}
					replyTo={replyTo}
				/>
			)}

			{showReplyForm && replyTo && (
				<RecipeCommentForm
					recipeId={recipeId}
					onSubmit={handleSubmitReply}
					onClose={() => {
						setShowReplyForm(false);
						setReplyTo(null);
					}}
					isReply={true}
					replyTo={replyTo}
				/>
			)}

			{showDeletePopup && (
				<RecipeDeleteCommentPopup
					onConfirm={handleConfirmDelete}
					onClose={() => {
						setShowDeletePopup(false);
						setCommentToDelete(null);
					}}
				/>
			)}
		</div>
	);
}

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addRecipeReaction, removeRecipeReaction } from '../../lib/api/recipes';

/**
 * Recipe Reactions Component
 * Displays like/dislike buttons for the recipe
 */
export function RecipeReactions({ recipeId, reactions }) {
	const queryClient = useQueryClient();
	const [userReaction, setUserReaction] = useState(
		reactions?.userReaction !== undefined
			? reactions.userReaction
			: reactions?.is_like !== undefined
			? reactions.is_like
				? 1
				: 0
			: null
	);
	const [likes, setLikes] = useState(reactions?.likes || 0);
	const [dislikes, setDislikes] = useState(reactions?.dislikes || 0);

	const addReactionMutation = useMutation({
		mutationFn: ({ recipeId, isLike }) => addRecipeReaction(recipeId, isLike),
		onSuccess: () => {
			// Invalidate recipe query to refetch updated data
			queryClient.invalidateQueries({ queryKey: ['recipe'] });
		},
	});

	const removeReactionMutation = useMutation({
		mutationFn: (recipeId) => removeRecipeReaction(recipeId),
		onSuccess: () => {
			// Invalidate recipe query to refetch updated data
			queryClient.invalidateQueries({ queryKey: ['recipe'] });
		},
	});

	const handleReaction = async (reactionType) => {
		if (!recipeId) return;

		const isLike = reactionType === 1;

		if (userReaction === reactionType) {
			// Remove reaction
			try {
				await removeReactionMutation.mutateAsync(recipeId);
				setUserReaction(null);
				if (reactionType === 1) {
					setLikes((prev) => Math.max(0, prev - 1));
				} else {
					setDislikes((prev) => Math.max(0, prev - 1));
				}
			} catch (error) {
				console.error('Error removing reaction:', error);
			}
		} else {
			// Change or add reaction
			try {
				await addReactionMutation.mutateAsync({ recipeId, isLike });
				// Optimistically update UI
				if (userReaction === 1) {
					setLikes((prev) => Math.max(0, prev - 1));
				} else if (userReaction === 0) {
					setDislikes((prev) => Math.max(0, prev - 1));
				}

				setUserReaction(reactionType);
				if (reactionType === 1) {
					setLikes((prev) => prev + 1);
				} else {
					setDislikes((prev) => prev + 1);
				}
			} catch (error) {
				console.error('Error adding reaction:', error);
			}
		}
	};

	return (
		<div className='teGusto'>
			<h3>¿Te gustó la receta?</h3>
			<div className='iconContainer'>
				<a
					href='#'
					onClick={(e) => {
						e.preventDefault();
						handleReaction(1);
					}}
				>
					<i
						className='reaction fas fa-smile'
						style={{
							color: userReaction === 1 ? '#dcb244' : '',
						}}
					></i>
				</a>
				<a
					href='#'
					onClick={(e) => {
						e.preventDefault();
						handleReaction(0);
					}}
				>
					<i
						className='reaction fas fa-frown'
						style={{
							color: userReaction === 0 ? '#dcb244' : '',
						}}
					></i>
				</a>
			</div>
		</div>
	);
}

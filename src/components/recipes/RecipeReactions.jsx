import React, { useState } from 'react';

/**
 * Recipe Reactions Component
 * Displays like/dislike buttons for the recipe
 */
export function RecipeReactions({ recipeId, reactions }) {
	const [userReaction, setUserReaction] = useState(
		reactions?.userReaction || null
	);
	const [likes, setLikes] = useState(reactions?.likes || 0);
	const [dislikes, setDislikes] = useState(reactions?.dislikes || 0);

	const handleReaction = (reactionType) => {
		// TODO: Implement API call to save reaction
		console.log('Reaction:', recipeId, reactionType);

		if (userReaction === reactionType) {
			// Remove reaction
			setUserReaction(null);
			if (reactionType === 1) {
				setLikes((prev) => Math.max(0, prev - 1));
			} else {
				setDislikes((prev) => Math.max(0, prev - 1));
			}
		} else {
			// Change or add reaction
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

import React from 'react';

/**
 * Recipe Image Component
 * Displays recipe image with responsive behavior
 */
export function RecipeImage({ primaryImage, secondaryImage }) {
	// Get image base URL from environment variable
	const imageBaseUrl =
		import.meta.env.VITE_IMAGE_BASE_URL ||
		'https://storage.googleapis.com/hmartina.appspot.com/';

	// Construct full image URL
	const getImageUrl = (imagePath) => {
		if (!imagePath) return null;
		// If already a full URL, return as is
		if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
			return imagePath;
		}
		// Otherwise, prepend base URL
		const baseUrl = imageBaseUrl.endsWith('/')
			? imageBaseUrl
			: `${imageBaseUrl}/`;
		const path = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
		return `${baseUrl}${path}`;
	};

	const primaryUrl = getImageUrl(primaryImage);
	const secondaryUrl = secondaryImage ? getImageUrl(secondaryImage) : null;

	const imageUrl = secondaryUrl || primaryUrl;
	const hasSecondary = !!secondaryImage;

	return (
		<div
			className='imagen-receta'
			style={{
				backgroundImage: `url(${imageUrl})`,
			}}
			data-change={hasSecondary ? '1' : '0'}
			data-movil={primaryUrl ? `url(${primaryUrl})` : ''}
			data-desktop={secondaryUrl ? `url(${secondaryUrl})` : ''}
		/>
	);
}

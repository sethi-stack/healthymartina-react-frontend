import React, { forwardRef, useEffect, useRef } from 'react';
import {
	ClockIcon,
	CartIcon,
	RecetarioIcon,
	EllipsisVerticalIcon,
	CalendarMenuIcon,
} from '../icons';
import { Link } from 'react-router-dom';
import { RecipeActionMenu } from '../shared/RecipeActionMenu';

export const RecipeCard = forwardRef(
	(
		{
			recipe,
			onAddToCalendar,
			onClick,
			showMenu = true,
			variant = 'catalog',
			hideLink = false,
			hideMeta = false,
			customMenu = null,
			customClass = '',
			isLeftover = false,
			calendarServingCount = null,
			children,
		},
		ref
	) => {
		const [imageLoaded, setImageLoaded] = React.useState(false);

		const handleAddToCalendar = () => {
			if (onAddToCalendar) {
				onAddToCalendar(recipe);
			}
		};


		// Format title to be capitalized
		const formatTitle = (title) => {
			if (!title) return '';
			return title.toUpperCase();
		};

		const ingredientesCount = recipe.ingredientes_count || 0;
		const tiempo = recipe.tiempo || 0;

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

		const imageUrl = getImageUrl(recipe.imagen_principal || recipe.imagen);

		// Dynamic classes based on variant
		const isCalendar = variant === 'calendar';
		const baseClass = isCalendar ? 'hm-calendar__recipe' : 'hm-card';
		const innerClass = isCalendar ? '' : 'hm-card__inner';
		const imageClass = isCalendar ? 'calRecpImg hm-calendar__recipe-image' : 'hm-card__image';
		const titleContainerClass = isCalendar ? 'calRecpInfo hm-calendar__recipe-info' : 'hm-card__body';
		const titleClass = isCalendar ? 'calRecpName hm-calendar__recipe-name' : 'hm-card__title';

		const leftoverClass = isLeftover && isCalendar ? 'recipeLeftover hm-calendar__recipe--leftover' : (isLeftover ? 'hm-card--leftover' : '');

		const renderImage = () => (
			<div className={imageClass}>
				<div className={isCalendar ? 'recipe-image-background hm-card__image-placeholder' : 'hm-card__image-placeholder'}>
					<RecetarioIcon />
				</div>
				{imageUrl && (
					<img
						className={`${isCalendar ? 'lozad recipe-image-overlay' : ''} hm-card__image-overlay ${imageLoaded ? 'hm-card__image-overlay--loaded' : ''}`}
						loading='lazy'
						src={imageUrl}
						alt={recipe.titulo}
						onLoad={() => setImageLoaded(true)}
					/>
				)}
			</div>
		);

		const content = (
			<>
				{hideLink ? (
					renderImage()
				) : (
					<Link to={`/receta/${recipe.slug}`}>{renderImage()}</Link>
				)}
				<div className={titleContainerClass}>
					{isCalendar ? (
						<div className='row'>
							<div className={titleClass}>
								<p>{formatTitle(recipe.titulo)}</p>
							</div>
							{calendarServingCount ? (
								<div className='hm-calendar__recipe-serving-inline'>
									{calendarServingCount}
								</div>
							) : null}
							{customMenu}
						</div>
					) : (
						<h3 className={titleClass}>{formatTitle(recipe.titulo)}</h3>
					)}

					{/* Catalog variants only */}
					{!isCalendar && showMenu && !customMenu && (
						<RecipeActionMenu
							onAddToCalendar={handleAddToCalendar}
							menuPosition='absolute'
							customClasses='hm-card__actions'
						/>
					)}
					{!isCalendar && customMenu && customMenu}

					{!hideMeta && (
						<div className='hm-card__meta'>
							<span className='hm-card__meta-item'>
								<i className='hm-icon hm-icon--sm'>
									<CartIcon />
								</i>
								{ingredientesCount}{' '}
								{ingredientesCount === 1 ? 'ingrediente' : 'ingredientes'}
							</span>
							<span className='hm-card__meta-item'>
								<i className='hm-icon hm-icon--sm'>
									<ClockIcon />
								</i>
								{recipe.tiempo_elaboracion || tiempo} minutos
							</span>
						</div>
					)}
					{children}
				</div>
			</>
		);

		return (
			<div className={`${baseClass} ${leftoverClass} ${customClass}`.trim()} ref={ref} onClick={onClick}>
				{isCalendar ? content : <div className={innerClass}>{content}</div>}
			</div>
		);
	}
);

RecipeCard.displayName = 'RecipeCard';

import React, { forwardRef, useEffect, useRef } from 'react';
import {
	ClockIcon,
	CartIcon,
	CalendarioIcon,
	EllipsisVerticalIcon,
	CalendarMenuIcon,
} from '../icons';
import { Link } from 'react-router-dom';

export const RecipeCard = forwardRef(
	({ recipe, onAddToCalendar, showMenu = true }, ref) => {
		const [isMenuOpen, setIsMenuOpen] = React.useState(false);
		const [imageLoaded, setImageLoaded] = React.useState(false);
		const menuRef = useRef(null);

		// Close menu when clicking outside
		useEffect(() => {
			const handleClickOutside = (event) => {
				if (
					menuRef.current &&
					!menuRef.current.contains(event.target) &&
					isMenuOpen
				) {
					setIsMenuOpen(false);
				}
			};

			if (isMenuOpen) {
				document.addEventListener('mousedown', handleClickOutside);
			}

			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}, [isMenuOpen]);

		const toggleMenu = (e) => {
			e.preventDefault();
			e.stopPropagation();
			setIsMenuOpen(!isMenuOpen);
		};

		const handleAddToCalendar = (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (onAddToCalendar) {
				onAddToCalendar(recipe);
			}
			setIsMenuOpen(false);
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

		const imageUrl = getImageUrl(recipe.imagen_principal);

		return (
			<div className='col13 hm-card' ref={ref}>
				<div className='receta-membresia-inner hm-card__inner'>
					<Link to={`/receta/${recipe.slug}`}>
						<div className='imagen lozad recipe-image-container hm-card__image'>
							<div className='recipe-image-background hm-card__image-placeholder'>
								<CalendarioIcon />
							</div>
							{imageUrl && (
								<img
									className={`lozad recipe-image-overlay hm-card__image-overlay ${imageLoaded ? 'hm-card__image-overlay--loaded' : ''}`}
									loading='lazy'
									src={imageUrl}
									alt=''
									onLoad={() => setImageLoaded(true)}
								/>
							)}
						</div>
					</Link>
					<div className='info hm-card__body'>
						<div className='row'>
							<div className='name-recipe'>
								<h3 className='name hm-card__title'>{formatTitle(recipe.titulo)}</h3>
							</div>
							{showMenu && (
								<div className='button-hamburger hm-menu hm-menu--dots-only hm-card__actions' ref={menuRef}>
									<button
										onClick={toggleMenu}
										className={`hm-menu__trigger ${isMenuOpen ? 'hm-menu__trigger--active active' : ''}`}
									>
										<EllipsisVerticalIcon />
									</button>
									<div className={`sub-menu hm-menu__dropdown ${isMenuOpen ? 'hm-menu__dropdown--open' : ''}`}>
										<button
											type='button'
											className='RecpAddcal hm-menu__item'
											onClick={handleAddToCalendar}
										>
											<span className='hm-menu__icon'>
												<CalendarMenuIcon />
											</span>
											<span>Agregar a calendario</span>
										</button>
									</div>
								</div>
							)}
						</div>
						<div className='special-info hm-card__meta'>
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
								{tiempo} minutos
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

RecipeCard.displayName = 'RecipeCard';

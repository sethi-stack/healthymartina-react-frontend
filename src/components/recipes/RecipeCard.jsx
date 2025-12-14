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
			<div className='col13' ref={ref}>
				<div className='receta-membresia-inner'>
					<Link to={`/receta/${recipe.slug}`}>
						<div className='imagen lozad recipe-image-container'>
							<div className='recipe-image-background'>
								<CalendarioIcon />
							</div>
							{imageUrl && (
								<img
									className='lozad recipe-image-overlay'
									loading='lazy'
									src={imageUrl}
									alt=''
									style={{
										opacity: imageLoaded ? 1 : 0,
										transition: 'opacity 0.5s ease-in-out',
									}}
									onLoad={() => setImageLoaded(true)}
								/>
							)}
						</div>
					</Link>
					<div className='info'>
						<div className='row'>
							<div className='name-recipe'>
								<p className='name'>{formatTitle(recipe.titulo)}</p>
							</div>
							{showMenu && (
								<div className='button-hamburger' ref={menuRef}>
									<button
										onClick={toggleMenu}
										className={isMenuOpen ? 'active' : ''}
									>
										<EllipsisVerticalIcon />
									</button>
									<div
										className='sub-menu'
										style={{ display: isMenuOpen ? 'block' : 'none' }}
									>
										<button
											type='button'
											className='RecpAddcal'
											onClick={handleAddToCalendar}
										>
											<CalendarMenuIcon />
											<span>Agregar a calendario</span>
										</button>
									</div>
								</div>
							)}
						</div>
						<div className='special-info'>
							<span>
								<i>
									<CartIcon />
								</i>
								{ingredientesCount}{' '}
								{ingredientesCount === 1 ? 'ingrediente' : 'ingredientes'}
							</span>
							<span>
								<i>
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

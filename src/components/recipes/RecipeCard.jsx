import React, { forwardRef } from 'react';
import {
	ClockIcon,
	CartIcon,
	CalendarioIcon,
	EllipsisVerticalIcon,
} from '../icons';
import { Link } from 'react-router-dom';

export const RecipeCard = forwardRef(
	({ recipe, onAddToCalendar, showMenu = true }, ref) => {
		const [isMenuOpen, setIsMenuOpen] = React.useState(false);
		const [imageLoaded, setImageLoaded] = React.useState(false);

		const toggleMenu = (e) => {
			e.preventDefault();
			e.stopPropagation();
			setIsMenuOpen(!isMenuOpen);
		};

		return (
			<div className='col13' ref={ref}>
				<div className='receta-membresia-inner'>
					<Link to={`/receta/${recipe.slug}`}>
						<div className='imagen'>
							{recipe.imagen_principal && (
								<img
									loading='lazy'
									src={recipe.imagen_principal}
									alt={recipe.titulo}
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
							<Link className='name-recipe' to={`/receta/${recipe.slug}`}>
								<p className='name'>{recipe.titulo}</p>
							</Link>
							{showMenu && (
								<div className='button-hamburger'>
									<button onClick={toggleMenu}>
										<EllipsisVerticalIcon />
									</button>
									<div
										className='sub-menu'
										style={{ display: isMenuOpen ? 'block' : 'none' }}
									>
										<button
											className='RecpAddcal'
											onClick={(e) => {
												e.preventDefault();
												onAddToCalendar(recipe);
												setIsMenuOpen(false);
											}}
										>
											<div className='icon-svg'>
												<CalendarioIcon />
											</div>
											Agregar a calendario
										</button>
									</div>
								</div>
							)}
						</div>
						<div className='special-info'>
							<span>
								<i className='icon-wrapper'>
									<CartIcon />
								</i>
								{recipe.ingredientes_count}{' '}
								{recipe.ingredientes_count === 1
									? 'ingrediente'
									: 'ingredientes'}
							</span>
							<span>
								<i className='icon-wrapper'>
									<ClockIcon />
								</i>
								{recipe.tiempo} minutos
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

RecipeCard.displayName = 'RecipeCard';

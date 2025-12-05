import React, { useState } from 'react';
import {
	RecetarioIcon,
	CalendarioIcon,
	ListaIcon,
	PlanesIcon,
	SearchIcon,
} from '../icons';
import './AuthenticatedNav.css';

/**
 * Authenticated navigation component for logged-in users.
 * Based on resources/views/partials/nav-sub-menu.blade.php
 */
export function AuthenticatedNav({
	currentPath = '',
	permissions = {},
	onNavigate,
	onSearch,
	searchData = { recipes: [], ingredients: [], calendars: [] },
}) {
	const [searchOpen, setSearchOpen] = useState(false);

	const hasPermission = (permission) => {
		return permissions[permission] === true;
	};

	const isActive = (path) => {
		return currentPath.includes(path);
	};

	const handleNavClick = (path) => {
		if (onNavigate) {
			onNavigate(path);
		}
	};

	const toggleSearch = () => {
		setSearchOpen(!searchOpen);
	};

	return (
		<>
			<nav className='auth-nav'>
				<ul>
					{hasPermission('recetario_view') && (
						<li className={isActive('recetario') ? 'selected-actv-menu' : ''}>
							<button
								type='button'
								className='auth-nav__link'
								onClick={() => handleNavClick('/recetario')}
							>
								<RecetarioIcon />
								Recetario
							</button>
						</li>
					)}

					{hasPermission('calendario_view') && (
						<li className={isActive('calendario') ? 'selected-actv-menu' : ''}>
							<button
								type='button'
								className='auth-nav__link'
								onClick={() => handleNavClick('/calendario')}
							>
								<CalendarioIcon />
								Calendario
							</button>
						</li>
					)}

					{hasPermission('lista_view') && (
						<li className={isActive('listas') ? 'selected-actv-menu' : ''}>
							<button
								type='button'
								className='auth-nav__link'
								onClick={() => handleNavClick('/listas')}
							>
								<ListaIcon />
								Lista
							</button>
						</li>
					)}

					{hasPermission('planes_view') && (
						<li className={isActive('planes') ? 'selected-actv-menu' : ''}>
							<button
								type='button'
								className='auth-nav__link'
								onClick={() => handleNavClick('/planes')}
							>
								<PlanesIcon />
								Planes
							</button>
						</li>
					)}

					<li className='search'>
						<button
							type='button'
							className='auth-nav__link search'
							onClick={toggleSearch}
						>
							<SearchIcon />
							Buscador
						</button>
					</li>
				</ul>
			</nav>

			{/* Search Popup */}
			{searchOpen && (
				<div className='search-popup'>
					<div className='search-popup__container'>
						<button
							className='search-popup__close'
							onClick={() => setSearchOpen(false)}
						>
							<i className='fas fa-times'></i>
						</button>
						<h3 className='search-popup__title'>Buscador</h3>
						<form className='search-popup__form'>
							<div className='search-popup__select-container'>
								<select
									className='search-popup__select'
									multiple
									onChange={(e) => {
										const selectedOptions = Array.from(
											e.target.selectedOptions
										);
										if (onSearch) {
											onSearch(selectedOptions);
										}
									}}
								>
									{searchData.recipes?.map((recipe) => (
										<option
											key={`recipe-${recipe.slug}`}
											className='recipe-search'
											data-type='recipe'
											value={recipe.slug}
										>
											{recipe.titulo}
										</option>
									))}
									{searchData.ingredients?.map((ingredient) => (
										<option
											key={`ingredient-${ingredient.id}`}
											className='ingredient-search'
											data-type='ingredient'
											value={ingredient.id}
										>
											{ingredient.nombre}
										</option>
									))}
									{searchData.calendars?.map((calendar) => (
										<option
											key={`calendar-${calendar.id}`}
											className='calendar-search'
											data-type='calendar'
											value={calendar.id}
										>
											{calendar.title}
										</option>
									))}
								</select>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}

export default AuthenticatedNav;

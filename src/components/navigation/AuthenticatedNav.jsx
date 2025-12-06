import React, { useState } from 'react';
import {
	RecetarioIcon,
	CalendarioIcon,
	ListaIcon,
	PlanesIcon,
	SearchIcon,
} from '../icons';
import './AuthenticatedNav.scss';

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
		// For development/demo purposes, return true if permissions prop is empty or undefined
		if (!permissions || Object.keys(permissions).length === 0) return true;
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

	const toggleSearch = (e) => {
		e.preventDefault();
		setSearchOpen(!searchOpen);
		if (!searchOpen) {
			document.body.style.overflowY = 'hidden';
		} else {
			document.body.style.overflowY = 'auto';
		}
	};

	const handleCloseSearch = () => {
		setSearchOpen(false);
		document.body.style.overflowY = 'auto';
	};

	const handleSearchSelect = (e) => {
		const selectedOption = e.target.options[e.target.selectedIndex];
		const value = e.target.value;
		const type = selectedOption.getAttribute('data-type');
		const name = selectedOption.text;

		// Logic migrated from search.js
		if (name) {
			if (type === 'calendar') {
				if (onNavigate) onNavigate(`/calendario?id=${value}`);
			} else if (type === 'ingredient') {
				// Using URLSearchParams for cleaner query construction
				// var url = '/recetario?' + 'filter=true&ingrediente_incluir%5B%5D=' + value;
				const params = new URLSearchParams();
				params.append('filter', 'true');
				params.append('ingrediente_incluir[]', value);
				if (onNavigate) onNavigate(`/recetario?${params.toString()}`);
			} else {
				// Recipe
				if (onNavigate) onNavigate(`/receta/${value}`);
			}
			handleCloseSearch();
		}
	};

	return (
		<>
			<nav className='auth-nav'>
				<div className='auth-nav__inner'>
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
							<li
								className={isActive('calendario') ? 'selected-actv-menu' : ''}
							>
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
							</button>
						</li>
					</ul>
					{/* Added search icon link outside ul for mobile/responsive layout match if needed, 
                        based on blade template structure where it's duplicated */}
					<a
						className='search mobile-search-trigger'
						href='#'
						onClick={toggleSearch}
					>
						<SearchIcon />
					</a>
				</div>
			</nav>

			{/* Search Popup */}
			{searchOpen && (
				<div
					className='popup buscador search-popup-buscadr'
					style={{ display: 'flex' }}
				>
					<div className='container-popup'>
						<button className='close' onClick={handleCloseSearch}>
							<i className='fas fa-times'></i>
						</button>
						<h3 className='no-uppercase underline'>Buscador</h3>
						<form
							className='search-popup__form'
							onSubmit={(e) => e.preventDefault()}
						>
							<div
								className='slide-indicadores slide-active s-a bigdrop'
								id='bigdrop'
							>
								<select
									className='search-select search-popup__select'
									multiple={false} // Changed to false for single selection behavior like standard select
									onChange={handleSearchSelect}
									size={10} // Show multiple options
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

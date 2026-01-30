import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
	RecetarioIcon,
	CalendarioIcon,
	ListaIcon,
	PlanesIcon,
	SearchIcon,
} from '../icons';
import Modal from '../calendar/Modal';
import './AuthenticatedNav.scss';

/**
 * Authenticated navigation component for logged-in users.
 * Based on resources/views/partials/nav-sub-menu.blade.php
 */
export function AuthenticatedNav({
	permissions = {},
	onSearch,
	searchData = { recipes: [], ingredients: [], calendars: [] },
}) {
	const [searchOpen, setSearchOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	const hasPermission = (permission) => {
		// For development/demo purposes, return true if permissions prop is empty or undefined
		if (!permissions || Object.keys(permissions).length === 0) return true;
		return permissions[permission] === true;
	};

	const isActive = (path) => {
		return location.pathname.includes(path);
	};

	const toggleSearch = (e) => {
		e.preventDefault();
		setSearchOpen(!searchOpen);
	};

	const handleCloseSearch = () => {
		setSearchOpen(false);
	};

	const handleSearchSelect = (e) => {
		const selectedOption = e.target.options[e.target.selectedIndex];
		const value = e.target.value;
		const type = selectedOption.getAttribute('data-type');
		const name = selectedOption.text;

		// Logic migrated from search.js
		if (name) {
			if (type === 'calendar') {
				// Calendar route not yet implemented in React, use full page reload
				window.location.href = `/calendario?id=${value}`;
			} else if (type === 'ingredient') {
				// Use React Router for recetario route
				const params = new URLSearchParams();
				params.append('filter', 'true');
				params.append('ingrediente_incluir[]', value);
				navigate(`/recetario?${params.toString()}`);
				handleCloseSearch();
			} else {
				// Recipe route not yet implemented in React, use full page reload
				window.location.href = `/receta/${value}`;
			}
		}
	};

	return (
		<>
			<nav className='auth-nav'>
				<div className='auth-nav__inner'>
					<ul>
						{hasPermission('recetario_view') && (
							<li className={isActive('recetario') ? 'selected-actv-menu' : ''}>
								<Link to='/recetario' className='auth-nav__link'>
									<RecetarioIcon />
									Recetario
								</Link>
							</li>
						)}

						{hasPermission('calendario_view') && (
							<li
								className={isActive('calendario') ? 'selected-actv-menu' : ''}
							>
								<Link to='/calendario' className='auth-nav__link'>
									<CalendarioIcon />
									Calendario
								</Link>
							</li>
						)}

						{hasPermission('lista_view') && (
							<li className={isActive('listas') ? 'selected-actv-menu' : ''}>
								<Link to='/listas' className='auth-nav__link'>
									<ListaIcon />
									Lista
								</Link>
							</li>
						)}

						{hasPermission('planes_view') && (
							<li className={isActive('planes') ? 'selected-actv-menu' : ''}>
								<Link to='/planes' className='auth-nav__link'>
									<PlanesIcon />
									Planes
								</Link>
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
				<Modal
					onClose={handleCloseSearch}
					title='Buscador'
					className='buscador search-popup-buscadr'
					dataModal='search'
				>
					<form
						className='search-popup__form hm-form'
						onSubmit={(e) => e.preventDefault()}
					>
						<div
							className='slide-indicadores slide-active s-a bigdrop'
							id='bigdrop'
						>
							<select
								className='search-select search-popup__select'
								multiple={false}
								onChange={handleSearchSelect}
								size={10}
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
				</Modal>
			)}
		</>
	);
}

export default AuthenticatedNav;

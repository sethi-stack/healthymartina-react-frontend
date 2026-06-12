import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
	RecetarioIcon,
	CalendarioIcon,
	ListaIcon,
	PlanesIcon,
	CartIcon,
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
	searchData = { recipes: [], ingredients: [], calendars: [] },
}) {
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
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
		setSearchOpen((prev) => !prev);
		if (!searchOpen) {
			setSearchTerm('');
		}
	};

	const handleCloseSearch = () => {
		setSearchOpen(false);
		setSearchTerm('');
	};

	const normalizeSearchValue = (value) => {
		return String(value ?? '')
			.toLowerCase()
			.trim()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '');
	};

	const matchesSearch = (values) => {
		if (!searchTerm.trim()) return true;

		const normalizedSearchTerm = normalizeSearchValue(searchTerm);
		return values.some((value) =>
			normalizeSearchValue(value).includes(normalizedSearchTerm)
		);
	};

	const filteredRecipes = (searchData.recipes || []).filter((item) =>
		matchesSearch([
			item?.titulo,
			item?.title,
			item?.slug,
			item?.descripcion,
		])
	);
	const filteredIngredients = (searchData.ingredients || []).filter((item) =>
		matchesSearch([item?.nombre])
	);
	const filteredCalendars = (searchData.calendars || []).filter((item) =>
		matchesSearch([item?.title, item?.nombre])
	);

	const handleSearchResult = (type, item) => {
		if (!item) return;

		handleCloseSearch();

		if (type === 'calendar') {
			navigate(`/calendario?id=${item.id}`);
			return;
		}

		if (type === 'ingredient') {
			const params = new URLSearchParams();
			params.append('filter', 'true');
			params.append('ingrediente_incluir[]', item.id);
			navigate(`/recetario?${params.toString()}`);
			return;
		}

		navigate(`/receta/${item.slug}`);
	};

	const renderSearchItem = (type, item) => {
		const icon =
			type === 'recipe' ? (
				<RecetarioIcon />
			) : type === 'ingredient' ? (
				<CartIcon />
			) : (
				<CalendarioIcon />
			);

		const title =
			type === 'recipe'
				? item?.titulo
				: type === 'ingredient'
					? item?.nombre
					: item?.title;

		return (
			<button
				key={`${type}-${item.id}`}
				type='button'
				className='search-popup__result'
				onClick={() => handleSearchResult(type, item)}
			>
				<span className='search-popup__result-icon'>{icon}</span>
				<span className='search-popup__result-body'>
					<span className='search-popup__result-title'>{title}</span>
					<span className='search-popup__result-type'>
						{type === 'recipe' ? 'Receta' : type === 'ingredient' ? 'Ingrediente' : 'Calendario'}
					</span>
				</span>
			</button>
		);
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
					width={740}
				>
					<form className='search-popup__form hm-form' onSubmit={(e) => e.preventDefault()}>
						<div className='search-popup__field'>
							<input
								type='text'
								className='search-popup__input'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder='Busca recetas, ingredientes o calendarios'
								autoComplete='off'
							/>
						</div>

						<div className='search-popup__results'>
							{filteredRecipes.length === 0 &&
							filteredIngredients.length === 0 &&
							filteredCalendars.length === 0 ? (
								<p className='search-popup__empty'>
									No encontramos resultados para esa búsqueda.
								</p>
							) : (
								<>
									{filteredRecipes.length > 0 && (
										<section className='search-popup__group'>
											<h4 className='search-popup__group-title'>
												<RecetarioIcon />
												Recetas
											</h4>
											<div className='search-popup__group-list'>
												{filteredRecipes.map((item) => renderSearchItem('recipe', item))}
											</div>
										</section>
									)}

									{filteredIngredients.length > 0 && (
										<section className='search-popup__group'>
											<h4 className='search-popup__group-title'>
												<CartIcon />
												Ingredientes
											</h4>
											<div className='search-popup__group-list'>
												{filteredIngredients.map((item) =>
													renderSearchItem('ingredient', item)
												)}
											</div>
										</section>
									)}

									{filteredCalendars.length > 0 && (
										<section className='search-popup__group'>
											<h4 className='search-popup__group-title'>
												<CalendarioIcon />
												Calendarios
											</h4>
											<div className='search-popup__group-list'>
												{filteredCalendars.map((item) =>
													renderSearchItem('calendar', item)
												)}
											</div>
										</section>
									)}
								</>
							)}
						</div>
					</form>
				</Modal>
			)}
		</>
	);
}

export default AuthenticatedNav;

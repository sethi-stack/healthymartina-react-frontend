import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
	RecetarioIcon,
	CalendarioIcon,
	ListaIcon,
	PlanesIcon,
	SearchIcon,
} from '../icons';
import { imagePaths } from '../../utils/imagePaths';
import './MobileHamburgerMenu.scss';

/**
 * Mobile Hamburger Menu Component
 * Side navigation drawer for mobile devices
 */
export function MobileHamburgerMenu({
	isOpen,
	onClose,
	permissions = {},
	onSearch,
	searchData = { recipes: [], ingredients: [], calendars: [] },
}) {
	const location = useLocation();
	const navigate = useNavigate();

	// Prevent body scroll when menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	const hasPermission = (permission) => {
		if (!permissions || Object.keys(permissions).length === 0) return true;
		return permissions[permission] === true;
	};

	const isActive = (path) => {
		return location.pathname.includes(path);
	};

	const handleNavClick = () => {
		onClose();
	};

	const handleSearchClick = (e) => {
		e.preventDefault();
		onClose();
		// Trigger search popup from AuthenticatedNav
		setTimeout(() => {
			const searchButton = document.querySelector(
				'.mobile-search-trigger, .auth-nav__link.search'
			);
			if (searchButton) {
				searchButton.click();
			}
		}, 300);
	};

	const handleLogoClick = (e) => {
		e.preventDefault();
		navigate('/recetario');
		onClose();
	};

	return (
		<>
			{/* Overlay */}
			<div
				className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}
				onClick={onClose}
			/>

			{/* Menu Drawer */}
			<div className={`mobile-hamburger-menu ${isOpen ? 'open' : ''}`}>
				{/* Header */}
				<div className='mobile-menu-header'>
					<button
						className='mobile-menu-toggle'
						onClick={onClose}
						aria-label='Close menu'
					>
						<span></span>
						<span></span>
						<span></span>
					</button>
				</div>

				{/* Separator */}
				<div className='mobile-menu-separator'></div>

				{/* Menu Items */}
				<nav className='mobile-menu-nav'>
					{hasPermission('recetario_view') && (
						<Link
							to='/recetario'
							className={`mobile-menu-item ${
								isActive('recetario') ? 'active' : ''
							}`}
							onClick={handleNavClick}
						>
							<RecetarioIcon />
							<span>Recetario</span>
						</Link>
					)}

					{hasPermission('calendario_view') && (
						<Link
							to='/calendario'
							className={`mobile-menu-item ${
								isActive('calendario') ? 'active' : ''
							}`}
							onClick={handleNavClick}
						>
							<CalendarioIcon />
							<span>Calendario</span>
						</Link>
					)}

					{hasPermission('lista_view') && (
						<Link
							to='/listas'
							className={`mobile-menu-item ${
								isActive('listas') ? 'active' : ''
							}`}
							onClick={handleNavClick}
						>
							<ListaIcon />
							<span>Lista</span>
						</Link>
					)}

					{hasPermission('planes_view') && (
						<Link
							to='/planes'
							className={`mobile-menu-item ${
								isActive('planes') ? 'active' : ''
							}`}
							onClick={handleNavClick}
						>
							<PlanesIcon />
							<span>Planes</span>
						</Link>
					)}

					<button
						type='button'
						className='mobile-menu-item'
						onClick={handleSearchClick}
					>
						<SearchIcon />
						<span>Buscador</span>
					</button>
				</nav>
			</div>
		</>
	);
}

export default MobileHamburgerMenu;

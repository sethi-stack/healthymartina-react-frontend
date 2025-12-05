import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthenticatedNav } from '../components/navigation';
import { Footer } from '../components/Footer';
import './AuthenticatedLayout.css';

/**
 * Authenticated layout wrapper for logged-in pages.
 * Includes navigation and footer.
 * Layout autenticado para páginas de usuarios logueados.
 * Incluye navegación y pie de página.
 */
export function AuthenticatedLayout({
	children,
	user,
	permissions,
	searchData,
}) {
	const navigate = useNavigate();
	const location = useLocation();

	const handleNavigate = (path) => {
		navigate(path);
	};

	const handleSearch = (selectedOptions) => {
		// eslint-disable-next-line no-console
		console.log('Search selected:', selectedOptions);
	};

	// Default permissions if not provided
	const defaultPermissions = permissions || {
		recetario_view: true,
		calendario_view: true,
		lista_view: true,
		planes_view: true,
	};

	// Default search data if not provided
	const defaultSearchData = searchData || {
		recipes: [],
		ingredients: [],
		calendars: [],
	};

	return (
		<div className='authenticated-layout'>
			<AuthenticatedNav
				currentPath={location.pathname}
				permissions={defaultPermissions}
				onNavigate={handleNavigate}
				onSearch={handleSearch}
				searchData={defaultSearchData}
			/>
			<main className='authenticated-layout__content'>{children}</main>
			<Footer />
		</div>
	);
}

export default AuthenticatedLayout;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	AuthenticatedHeader,
	AuthenticatedNav,
} from '../components/navigation';
import { Footer } from '../components/Footer';
import './AuthenticatedLayout.scss';
import { useAuthStore } from '../stores/authStore';

/**
 * Authenticated layout wrapper for logged-in pages.
 * Includes navigation and footer.
 * Layout autenticado para páginas de usuarios logueados.
 * Incluye navegación y pie de página.
 */
export function AuthenticatedLayout({ children, permissions, searchData }) {
	const navigate = useNavigate();
	const location = useLocation();
	const user = useAuthStore((state) => state.user);
	const clearAuth = useAuthStore((state) => state.clearAuth);

	const handleNavigate = (path) => {
		if (!path) return;
		navigate(path);
	};

	const handleLogout = () => {
		clearAuth?.();
		localStorage.removeItem('auth_token');
		localStorage.removeItem('auth_user');
		localStorage.removeItem('firstVisit');
		navigate('/login');
	};

	const handleHelpClick = () => {
		// hooking Help beacon placeholder
		if (typeof window !== 'undefined') {
			console.info('Help widget triggered');
		}
	};

	const handleWizardClick = () => {
		if (typeof window !== 'undefined') {
			console.info('Wizard assistant triggered');
		}
	};

	const handleSearch = (selectedOptions) => {
		// eslint-disable-next-line no-console
		console.log('Search selected:', selectedOptions);
	};

	const defaultPermissions = permissions || {
		recetario_view: true,
		calendario_view: true,
		lista_view: true,
		planes_view: true,
	};

	const defaultSearchData = searchData || {
		recipes: [],
		ingredients: [],
		calendars: [],
	};

	return (
		<div className='authenticated-layout'>
			<AuthenticatedHeader
				user={user}
				onNavigate={handleNavigate}
				onHelpClick={handleHelpClick}
				onWizardClick={handleWizardClick}
				onLogout={handleLogout}
			/>
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

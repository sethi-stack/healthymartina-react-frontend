import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
	AuthenticatedHeader,
	AuthenticatedNav,
} from '../components/navigation';
import { Footer } from '../components/Footer';
import GlobalExportProgressBar from '../components/shared/GlobalExportProgressBar';
import { getRecipes } from '../lib/api/recipes';
import { getCalendars } from '../lib/api/calendars';
import { getIngredients } from '../lib/api/ingredients';
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
	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
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

	const normalizeCollection = (response) => {
		if (Array.isArray(response)) return response;
		if (Array.isArray(response?.data)) return response.data;
		if (Array.isArray(response?.data?.data)) return response.data.data;
		return [];
	};

	const hasMorePages = (response) => {
		if (response?.meta?.current_page && response?.meta?.last_page) {
			return response.meta.current_page < response.meta.last_page;
		}
		if (typeof response?.next_page_url !== 'undefined') {
			return Boolean(response.next_page_url);
		}
		if (response?.links && 'next' in response.links) {
			return Boolean(response.links.next);
		}
		return false;
	};

	const fetchAllPages = async (fetchPage, params = {}) => {
		const allItems = [];
		let page = 1;
		let keepGoing = true;
		let safetyCounter = 0;

		while (keepGoing && safetyCounter < 50) {
			const response = await fetchPage({
				...params,
				page,
				per_page: 500,
			});

			allItems.push(...normalizeCollection(response));
			keepGoing = hasMorePages(response);
			page += 1;
			safetyCounter += 1;
		}

		return allItems;
	};

	const recipesQuery = useQuery({
		queryKey: ['global-search-data', 'recipes'],
		queryFn: () =>
			fetchAllPages(getRecipes, { sort_by: 'titulo', sort_order: 'asc' }),
		enabled: isAuthenticated && !searchData,
		staleTime: 5 * 60 * 1000,
	});

	const ingredientsQuery = useQuery({
		queryKey: ['global-search-data', 'ingredients'],
		queryFn: () =>
			fetchAllPages(getIngredients, {
				sort_by: 'nombre',
				sort_order: 'asc',
			}),
		enabled: isAuthenticated && !searchData,
		staleTime: 5 * 60 * 1000,
	});

	const calendarsQuery = useQuery({
		queryKey: ['global-search-data', 'calendars'],
		queryFn: () =>
			fetchAllPages(getCalendars, { sort_by: 'title', sort_order: 'asc' }),
		enabled: isAuthenticated && !searchData,
		staleTime: 5 * 60 * 1000,
	});

	const defaultPermissions = permissions || {
		recetario_view: true,
		calendario_view: true,
		lista_view: true,
		planes_view: true,
	};

	const defaultSearchData = searchData || {
		recipes: recipesQuery.data || [],
		ingredients: ingredientsQuery.data || [],
		calendars: calendarsQuery.data || [],
	};

	return (
		<div className='authenticated-layout'>
			<AuthenticatedHeader
				user={user}
				onNavigate={handleNavigate}
				onHelpClick={handleHelpClick}
				onWizardClick={handleWizardClick}
				onLogout={handleLogout}
				permissions={defaultPermissions}
				onSearch={handleSearch}
				searchData={defaultSearchData}
			/>
			<AuthenticatedNav
				permissions={defaultPermissions}
				onSearch={handleSearch}
				searchData={defaultSearchData}
			/>
			<GlobalExportProgressBar />
			<main className='authenticated-layout__content'>{children}</main>
			<Footer />
		</div>
	);
}

export default AuthenticatedLayout;

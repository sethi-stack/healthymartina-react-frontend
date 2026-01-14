import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PublicLayout, AuthenticatedLayout } from './layouts';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Recetario } from './pages/Recetario';
import { RecipeDetail } from './pages/RecipeDetail';
import Calendar from './pages/Calendar';
import Lista from './pages/Lista';

// Create a client for React Query
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

/**
 * Root application component with routing.
 * Componente raíz de la aplicación con ruteo.
 */
export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Navigate to='/login' replace />} />

					{/* Public routes with PublicLayout */}
					<Route
						path='/login'
						element={
							<PublicLayout>
								<Login />
							</PublicLayout>
						}
					/>
					<Route
						path='/register'
						element={
							<PublicLayout>
								<Register />
							</PublicLayout>
						}
					/>
					<Route
						path='/forgot-password'
						element={
							<PublicLayout>
								<ForgotPassword />
							</PublicLayout>
						}
					/>

					{/* Authenticated routes with AuthenticatedLayout */}
					<Route
						path='/dashboard'
						element={
							<ProtectedRoute>
								<AuthenticatedLayout>
									<Dashboard />
								</AuthenticatedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/recetario'
						element={
							<ProtectedRoute>
								<AuthenticatedLayout>
									<Recetario />
								</AuthenticatedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/receta/:slug'
						element={
							<ProtectedRoute>
								<AuthenticatedLayout>
									<RecipeDetail />
								</AuthenticatedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/calendario'
						element={
							<ProtectedRoute>
								<AuthenticatedLayout>
									<Calendar />
								</AuthenticatedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/listas'
						element={
							<ProtectedRoute>
								<AuthenticatedLayout>
									<Lista />
								</AuthenticatedLayout>
							</ProtectedRoute>
						}
					/>

					{/* 404 fallback */}
					<Route path='*' element={<Navigate to='/login' replace />} />
				</Routes>
			</BrowserRouter>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;

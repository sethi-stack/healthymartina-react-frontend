import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout, AuthenticatedLayout } from './layouts';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';

/**
 * Root application component with routing.
 * Componente raíz de la aplicación con ruteo.
 */
export function App() {
	// TODO: Replace with actual authentication check
	// Por ahora, asumimos que el usuario no está autenticado
	const isAuthenticated = false;

	return (
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
						isAuthenticated ? (
							<AuthenticatedLayout>
								<Dashboard />
							</AuthenticatedLayout>
						) : (
							<Navigate to='/login' replace />
						)
					}
				/>

				{/* 404 fallback */}
				<Route path='*' element={<Navigate to='/login' replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

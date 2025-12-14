import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout, AuthenticatedLayout } from './layouts';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Recetario } from './pages/Recetario';

/**
 * Root application component with routing.
 * Componente raíz de la aplicación con ruteo.
 */
export function App() {
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

				{/* 404 fallback */}
				<Route path='*' element={<Navigate to='/login' replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

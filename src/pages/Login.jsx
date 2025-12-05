import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPage from '../components/AuthPage';

/**
 * Route-level login page (página de login a nivel de ruta).
 * Uses the shared `AuthPage` component with login tab active.
 */
export function Login() {
	const navigate = useNavigate();

	const handleLoginSubmit = (loginData) => {
		// TODO: wire this to your real API endpoint (conectar a tu API real)
		// For now we just log to the console.
		// Por ahora solo registramos en consola.
		// eslint-disable-next-line no-console
		console.log('Login submit', loginData);
	};

	const handleRegisterSubmit = (registerData) => {
		// TODO: wire this to your real API endpoint (conectar a tu API real)
		// eslint-disable-next-line no-console
		console.log('Register submit', registerData);
	};

	const handleForgotPasswordClick = () => {
		navigate('/forgot-password');
	};

	return (
		<AuthPage
			initialTab='login'
			onLoginSubmit={handleLoginSubmit}
			onRegisterSubmit={handleRegisterSubmit}
			onForgotPasswordClick={handleForgotPasswordClick}
		/>
	);
}

export default Login;

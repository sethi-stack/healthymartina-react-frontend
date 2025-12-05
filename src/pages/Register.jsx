import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPage from '../components/AuthPage';

/**
 * Route-level register page (página de registro a nivel de ruta).
 * Uses the shared `AuthPage` component with register tab active.
 */
export function Register() {
	const navigate = useNavigate();

	const handleLoginSubmit = (loginData) => {
		// TODO: wire this to your real API endpoint (conectar a tu API real)
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
			initialTab='register'
			onLoginSubmit={handleLoginSubmit}
			onRegisterSubmit={handleRegisterSubmit}
			onForgotPasswordClick={handleForgotPasswordClick}
		/>
	);
}

export default Register;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPage from '../components/AuthPage';
import { useLogin, useRegister } from '../hooks/useAuth';

/**
 * Route-level login page (página de login a nivel de ruta).
 * Uses the shared `AuthPage` component with login tab active.
 */
export function Login() {
	const navigate = useNavigate();
	const loginMutation = useLogin();
	const registerMutation = useRegister();
	const [loginError, setLoginError] = useState(null);
	const [registerError, setRegisterError] = useState(null);

	const handleLoginSubmit = async (loginData) => {
		setLoginError(null);
		try {
			await loginMutation.mutateAsync({
				email: loginData.email,
				password: loginData.password,
			});
		} catch (error) {
			// Handle validation errors from Laravel
			if (error.response?.status === 422) {
				const errors = error.response.data.errors;
				setLoginError(
					errors?.email?.[0] || errors?.password?.[0] || 'Invalid credentials'
				);
			} else if (error.isNetworkError) {
				setLoginError('Network error. Please check your connection.');
			} else {
				setLoginError(
					error.response?.data?.message || 'An error occurred during login'
				);
			}
		}
	};

	const handleRegisterSubmit = async (registerData) => {
		setRegisterError(null);
		try {
			await registerMutation.mutateAsync({
				name: registerData.name,
				last_name: registerData.lastName,
				email: registerData.email,
				password: registerData.password,
				password_confirmation: registerData.passwordConfirmation,
			});
		} catch (error) {
			// Handle validation errors from Laravel
			if (error.response?.status === 422) {
				const errors = error.response.data.errors;
				// Get first error message
				const firstError = Object.values(errors).flat()[0];
				setRegisterError(firstError || 'Validation error');
			} else if (error.isNetworkError) {
				setRegisterError('Network error. Please check your connection.');
			} else {
				setRegisterError(
					error.response?.data?.message ||
						'An error occurred during registration'
				);
			}
		}
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
			loginError={loginError}
			registerError={registerError}
			isLoading={loginMutation.isPending || registerMutation.isPending}
		/>
	);
}

export default Login;

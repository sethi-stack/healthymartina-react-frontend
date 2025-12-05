import React, { useState } from 'react';
import { colors } from '../theme';
import { PrimaryButton } from '../theme';
import { imagePaths } from '../utils/imagePaths';
import './AuthPage.css';

/**
 * Combined Login/Register page component with tab switching.
 * Componente combinado de Login/Registro con cambio de pestañas.
 */
export function AuthPage({
	onLoginSubmit,
	onRegisterSubmit,
	onForgotPasswordClick,
	initialTab = 'login', // 'login' | 'register'
}) {
	const [activeTab, setActiveTab] = useState(initialTab);

	// Login form state
	const [loginData, setLoginData] = useState({
		email: '',
		password: '',
		rememberMe: false,
	});

	// Register form state
	const [registerData, setRegisterData] = useState({
		nombre: '',
		apellidos: '',
		email: '',
		password: '',
		passwordConfirmation: '',
	});

	const handleLoginSubmit = (event) => {
		event.preventDefault();
		if (typeof onLoginSubmit === 'function') {
			onLoginSubmit(loginData);
		}
	};

	const handleRegisterSubmit = (event) => {
		event.preventDefault();
		if (typeof onRegisterSubmit === 'function') {
			onRegisterSubmit(registerData);
		}
	};

	const updateLoginData = (field, value) => {
		setLoginData((prev) => ({ ...prev, [field]: value }));
	};

	const updateRegisterData = (field, value) => {
		setRegisterData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className='auth-page'>
			<div className='auth-container'>
				{/* Tab Selector */}
				<div className='auth-selector'>
					<button
						type='button'
						className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
						onClick={() => setActiveTab('login')}
					>
						Log in
					</button>
					<button
						type='button'
						className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
						onClick={() => setActiveTab('register')}
					>
						Registrarse
					</button>
					<div className='auth-separator'></div>
				</div>

				{/* Forms Container */}
				<div className='auth-forms'>
					{activeTab === 'login' && (
						<form className='auth-form' onSubmit={handleLoginSubmit}>
							<label htmlFor='email'>Email</label>
							<input
								id='email'
								type='email'
								placeholder='EMAIL'
								value={loginData.email}
								onChange={(e) => updateLoginData('email', e.target.value)}
								required
							/>

							<label htmlFor='password'>Contraseña</label>
							<input
								id='password'
								type='password'
								placeholder='CONTRASEÑA'
								value={loginData.password}
								onChange={(e) => updateLoginData('password', e.target.value)}
								required
							/>

							<div className='auth-row'>
								<label className='checkbox-label' htmlFor='recordar-cuenta'>
									<input
										id='recordar-cuenta'
										type='checkbox'
										checked={loginData.rememberMe}
										onChange={(e) =>
											updateLoginData('rememberMe', e.target.checked)
										}
									/>
									Recordar cuenta
									<span className='checkmark'></span>
								</label>
								<button
									type='button'
									className='forgot-password-link'
									onClick={onForgotPasswordClick}
								>
									¿Olvidaste tu contraseña?
								</button>
							</div>

							<input
								type='submit'
								value='Iniciar Sesión'
								className='auth-submit'
							/>
						</form>
					)}

					{activeTab === 'register' && (
						<form className='auth-form' onSubmit={handleRegisterSubmit}>
							<div className='auth-row'>
								<div className='auth-col'>
									<label htmlFor='nombre'>Nombre</label>
									<input
										id='nombre'
										type='text'
										placeholder='NOMBRE'
										value={registerData.nombre}
										onChange={(e) =>
											updateRegisterData('nombre', e.target.value)
										}
										required
									/>
								</div>
								<div className='auth-col'>
									<label htmlFor='apellidos'>Apellidos</label>
									<input
										id='apellidos'
										type='text'
										placeholder='APELLIDOS'
										value={registerData.apellidos}
										onChange={(e) =>
											updateRegisterData('apellidos', e.target.value)
										}
										required
									/>
								</div>
							</div>

							<label htmlFor='new-email'>Email</label>
							<input
								id='new-email'
								type='email'
								placeholder='EMAIL'
								value={registerData.email}
								onChange={(e) => updateRegisterData('email', e.target.value)}
								required
							/>

							<label htmlFor='new-password'>Contraseña</label>
							<input
								id='new-password'
								type='password'
								placeholder='CONTRASEÑA'
								value={registerData.password}
								onChange={(e) => updateRegisterData('password', e.target.value)}
								required
							/>

							<label htmlFor='confirm-password'>Confirmar Contraseña</label>
							<input
								id='confirm-password'
								type='password'
								placeholder='CONFIRMAR CONTRASEÑA'
								value={registerData.passwordConfirmation}
								onChange={(e) =>
									updateRegisterData('passwordConfirmation', e.target.value)
								}
								required
							/>

							<input type='submit' value='¡Listo!' className='auth-submit' />
						</form>
					)}
				</div>
			</div>
		</div>
	);
}

export default AuthPage;

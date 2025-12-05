import React, { useState } from 'react';
import { colors } from '../theme';
import { PrimaryButton, BodyText, Heading2 } from '../theme';
import { imagePaths } from '../utils/imagePaths';

const LOGIN_BACKGROUND_URL = imagePaths.loginBackground;

/**
 * Login page component based on `resources/views/login.blade.php` and `_login.scss`.
 * Componente de login basado en `resources/views/login.blade.php` y `_login.scss`.
 *
 * This component focuses on layout and styles. Form submission / routing should be
 * handled by the parent via callbacks.
 * Este componente se centra en el layout y los estilos. El envío del formulario y
 * el enrutado deben manejarse desde el componente padre mediante callbacks.
 */
export function LoginPage({
	onSubmit, // (credentials) => void
	onRegisterClick, // () => void
	onForgotPasswordClick, // () => void
	registerLabel = 'Registrarse',
	forgotPasswordLabel = '¿Olvidaste tu contraseña?',
	title = 'Log in',
}) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();

		if (typeof onSubmit === 'function') {
			onSubmit({
				email,
				password,
				rememberMe,
			});
		}
	};

	return (
		<div
			id='login'
			style={{
				fontFamily:
					'"Gilroy", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
				color: colors.textDefault,
			}}
		>
			<div
				className='login-container'
				style={{
					width: '100%',
					backgroundImage: `url(${LOGIN_BACKGROUND_URL})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					padding: '2em 0',
					minHeight: '83vh',
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					alignContent: 'center',
				}}
			>
				<div
					className='login-selector'
					style={{
						backgroundColor: '#ffffff',
						width: '40%',
						margin: '0 30%',
						padding: '0 1em',
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'center',
					}}
				>
					<button
						type='button'
						className='login-selector-tab active'
						style={{
							width: '25%',
							padding: '1em 0 1.5em 0',
							textDecoration: 'none',
							color: '#606060',
							textTransform: 'uppercase',
							fontFamily: '"Gilroy-SemiBold"',
							textAlign: 'center',
							border: 'none',
							borderTop: `0.5em solid ${colors.primary}`,
							background: 'transparent',
							cursor: 'default',
						}}
					>
						{title}
					</button>

					<button
						type='button'
						className='login-selector-tab'
						onClick={onRegisterClick}
						style={{
							width: '25%',
							padding: '1em 0 1.5em 0',
							textDecoration: 'none',
							color: '#606060',
							textTransform: 'uppercase',
							fontFamily: '"Gilroy-SemiBold"',
							textAlign: 'center',
							border: 'none',
							borderTop: '0.5em solid #ffffff',
							background: 'transparent',
							cursor: 'pointer',
						}}
					>
						{registerLabel}
					</button>

					<div
						className='login-selector-separator'
						style={{
							width: '100%',
							margin: '0 auto',
							padding: '0 1em',
							backgroundColor: colors.gray,
							height: 1,
						}}
					/>
				</div>

				<div
					className='login-forms'
					style={{
						width: 'calc(40% + 2em)',
						margin: '0 auto',
					}}
				>
					<form
						onSubmit={handleSubmit}
						className='login-form'
						style={{
							width: 'calc(100% - 2em)',
							margin: '0 auto',
							padding: '1em 1em',
							backgroundColor: '#ffffff',
							borderBottomLeftRadius: 20,
							borderBottomRightRadius: 20,
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Heading2
							style={{
								width: '100%',
								marginBottom: '0.5em',
								fontSize: '1.4em',
								letterSpacing: 1,
							}}
						>
							{title}
						</Heading2>

						<label
							htmlFor='login-email'
							style={{
								fontFamily: '"Gilroy-SemiBold"',
								width: '100%',
								textTransform: 'uppercase',
								padding: '10px 0',
								display: 'block',
								fontSize: '0.8em',
							}}
						>
							Email
						</label>
						<input
							id='login-email'
							type='email'
							name='email'
							placeholder='EMAIL'
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							style={{
								width: '100%',
								border: `2px solid ${colors.gray}`,
								padding: 10,
								marginBottom: '1em',
								borderRadius: 12,
								fontFamily: '"Gilroy"',
								fontSize: '0.8em',
								outline: 'none',
							}}
						/>

						<label
							htmlFor='login-password'
							style={{
								fontFamily: '"Gilroy-SemiBold"',
								width: '100%',
								textTransform: 'uppercase',
								padding: '10px 0',
								display: 'block',
								fontSize: '0.8em',
							}}
						>
							Contraseña
						</label>
						<input
							id='login-password'
							type='password'
							name='password'
							placeholder='CONTRASEÑA'
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							style={{
								width: '100%',
								border: `2px solid ${colors.gray}`,
								padding: 10,
								marginBottom: '1em',
								borderRadius: 12,
								fontFamily: '"Gilroy"',
								fontSize: '0.8em',
								outline: 'none',
							}}
						/>

						<div
							className='login-row'
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								justifyContent: 'space-between',
								alignItems: 'center',
								width: '100%',
								marginBottom: '1em',
							}}
						>
							<label
								htmlFor='login-remember'
								style={{
									height: '1.5em',
									width: '50%',
									fontSize: '0.7em',
									textTransform: 'uppercase',
									display: 'flex',
									alignItems: 'center',
									cursor: 'pointer',
									position: 'relative',
									padding: 0,
									paddingLeft: '3em',
								}}
							>
								<input
									id='login-remember'
									type='checkbox'
									checked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
									style={{
										width: 0,
										position: 'absolute',
										opacity: 0,
										height: 0,
									}}
								/>
								<span
									className='login-checkmark'
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										height: '1.5em',
										width: '1.5em',
										borderRadius: 5,
										border: `1px solid ${colors.primary}`,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: rememberMe ? colors.primary : '#ffffff',
										color: '#ffffff',
										fontSize: '0.9em',
									}}
								>
									{rememberMe ? '✓' : ''}
								</span>
								Recordar cuenta
							</label>

							<button
								type='button'
								onClick={onForgotPasswordClick}
								style={{
									fontSize: '0.7em',
									textTransform: 'uppercase',
									textDecoration: 'none',
									color: '#606060',
									fontFamily: '"Gilroy-SemiBold"',
									background: 'transparent',
									border: 'none',
									cursor: 'pointer',
								}}
							>
								{forgotPasswordLabel}
							</button>
						</div>

						<PrimaryButton
							type='submit'
							isActive
							style={{
								width: '100%',
								textTransform: 'uppercase',
								marginTop: '0.5em',
								fontFamily: '"Gilroy-SemiBold"',
							}}
						>
							Iniciar Sesión
						</PrimaryButton>
					</form>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;

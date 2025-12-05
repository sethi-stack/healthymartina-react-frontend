import React from 'react';
import { BodyText, Heading2 } from '../theme';

/**
 * Placeholder forgot-password page.
 * Página de recuperación de contraseña (placeholder).
 */
export function ForgotPassword() {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				padding: '2rem',
				flex: 1,
			}}
		>
			<Heading2 style={{ marginBottom: '1rem' }}>Recuperar contraseña</Heading2>
			<BodyText>
				Aquí podrás solicitar un enlace para restablecer tu contraseña.
			</BodyText>
		</div>
	);
}

export default ForgotPassword;

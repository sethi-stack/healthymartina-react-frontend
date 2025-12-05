import React from 'react';
import { BodyText, Heading2 } from '../theme';

/**
 * Dashboard page for authenticated users.
 * Página de dashboard para usuarios autenticados.
 */
export function Dashboard() {
	return (
		<>
			<Heading2 style={{ marginBottom: '1rem' }}>Dashboard</Heading2>
			<BodyText>
				Bienvenido a tu dashboard. Aquí podrás acceder a todas las
				funcionalidades de Healthy Martina.
			</BodyText>
		</>
	);
}

export default Dashboard;

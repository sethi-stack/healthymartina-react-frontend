import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader } from '../components/navigation';
import { Footer } from '../components/Footer';
import './PublicLayout.css';

/**
 * Public layout wrapper for unauthenticated pages.
 * Includes header and footer.
 * Layout público para páginas no autenticadas.
 * Incluye encabezado y pie de página.
 */
export function PublicLayout({ children }) {
	const navigate = useNavigate();

	const handleLoginClick = () => {
		navigate('/login');
	};

	const handleRegisterClick = () => {
		navigate('/register');
	};

	return (
		<div className='public-layout'>
			<PublicHeader
				onLoginClick={handleLoginClick}
				onRegisterClick={handleRegisterClick}
			/>
			<main className='public-layout__content'>{children}</main>
			<Footer />
		</div>
	);
}

export default PublicLayout;

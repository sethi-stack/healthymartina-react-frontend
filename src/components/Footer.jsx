import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.scss';

/**
 * Footer component based on resources/views/partials/footer-app.blade.php
 * Componente de pie de página basado en resources/views/partials/footer-app.blade.php
 */
export function Footer() {
	const currentYear = new Date().getFullYear();
	const navigate = useNavigate();

	const handleHomeClick = (e) => {
		e.preventDefault();
		navigate('/recetario');
	};

	const handleTermsClick = (e) => {
		e.preventDefault();
		// Link to Laravel route for terms
		window.location.href = '/terminos-condiciones';
	};

	const handlePrivacyClick = (e) => {
		e.preventDefault();
		// Link to Laravel route for privacy
		window.location.href = '/aviso-de-privacidad';
	};

	return (
		<footer className='footer-app'>
			<div className='line'></div>
			<div className='left'>
				<a href='#' onClick={handleHomeClick}>
					Home
				</a>
				<a href='#' onClick={handleTermsClick}>
					Términos y condiciones
				</a>
				<a href='#' onClick={handlePrivacyClick}>
					Aviso de Privacidad
				</a>
			</div>
			<div className='right'>
				<p>Copyright © {currentYear} Healthy Martina</p>
				<p>All Right Reserved.</p>
			</div>
		</footer>
	);
}

export default Footer;

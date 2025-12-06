import React from 'react';
import './Footer.scss';

/**
 * Footer component based on resources/views/partials/footer.blade.php
 * Componente de pie de página basado en resources/views/partials/footer.blade.php
 */
export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='app-footer'>
			<div className='app-footer__content'>
				<p>Copyright © {currentYear} Healthy Martina- All Rights Reserved.</p>
			</div>
		</footer>
	);
}

export default Footer;

import React, { useState } from 'react';
import { imagePaths } from '../../utils/imagePaths';
import './PublicHeader.scss';

/**
 * Public header component for logged-out users.
 * Based on resources/views/partials/header.blade.php
 */
export function PublicHeader({
	onLoginClick,
	onRegisterClick,
	blogUrl = 'https://healthymartina.com/blog',
}) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	return (
		<>
			{/* Desktop Header */}
			<header className='public-header desktop'>
				<a className='public-header__logo' href='/'>
					<img src={imagePaths.logo} alt='Healthy Martina' />
				</a>
				<nav className='public-header__nav'>
					<ul>
						<li>
							<a href={blogUrl} target='_blank' rel='noopener noreferrer'>
								Blog
							</a>
						</li>
						<li>
							<button
								type='button'
								className='public-header__link'
								onClick={onLoginClick}
							>
								Log In
							</button>
						</li>
						<li>
							<button
								type='button'
								className='public-header__link public-header__link--register'
								onClick={onRegisterClick}
							>
								Registrate
							</button>
						</li>
					</ul>
				</nav>
			</header>

			{/* Mobile Header */}
			<header className='public-header movil'>
				<a href='/'>
					<img src={imagePaths.logo} alt='Healthy Martina' />
				</a>
				<div className='public-header__mobile-menu'>
					<button
						className='public-header__menu-button'
						type='button'
						onClick={toggleMobileMenu}
					>
						<div className='animated-icon'>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</button>
				</div>
				<div
					className={`public-header__collapse ${mobileMenuOpen ? 'open' : ''}`}
				>
					<ul>
						<li>
							<a href={blogUrl} target='_blank' rel='noopener noreferrer'>
								Blog
							</a>
						</li>
						<li>
							<button
								type='button'
								className='public-header__link'
								onClick={onLoginClick}
							>
								Log In
							</button>
						</li>
						<li>
							<button
								type='button'
								className='public-header__link public-header__link--register'
								onClick={onRegisterClick}
							>
								Registrate
							</button>
						</li>
					</ul>
				</div>
			</header>
		</>
	);
}

export default PublicHeader;

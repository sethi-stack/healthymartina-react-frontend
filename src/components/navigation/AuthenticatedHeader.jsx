import React, { useEffect, useRef, useState } from 'react';
import { imagePaths } from '../../utils/imagePaths';
import { MobileHamburgerMenu } from './MobileHamburgerMenu';
import './AuthenticatedHeader.scss';

const profileLinks = [
	{ label: 'Mi Perfil', path: '/perfil' },
	{ label: 'Cerrar Sesión', action: 'logout' },
];

export function AuthenticatedHeader({
	user,
	onNavigate,
	onHelpClick,
	onWizardClick,
	onLogout,
	permissions,
	onSearch,
	searchData,
}) {
	const [profileOpen, setProfileOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const headerRef = useRef(null);

	const userName = user?.name || 'Luciana';
	const userEmail = user?.email || 'hola@healthymartina.com';
	const avatar = user?.image || user?.bimage || '';
	const avatarFallback = userName
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0])
		.join('')
		.toUpperCase();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				profileOpen &&
				headerRef.current &&
				!headerRef.current.contains(event.target)
			) {
				setProfileOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [profileOpen]);

	const handleProfileToggle = () => {
		setProfileOpen((prev) => !prev);
	};

	const handleOptionSelect = (item) => {
		setProfileOpen(false);

		if (item.action === 'logout') {
			onLogout?.();
			return;
		}
		if (item.action === 'help') {
			onHelpClick?.();
			return;
		}
		if (item.action === 'wizard') {
			onWizardClick?.();
			return;
		}
		if (item.external && item.path) {
			window.open(item.path, '_blank', 'noreferrer');
			return;
		}
		if (item.path) {
			onNavigate?.(item.path);
		}
	};

	const handleLogoClick = (event) => {
		event.preventDefault();
		onNavigate?.('/recetario');
	};

	return (
		<div className='header-app-wrapper' ref={headerRef}>
			<div
				className={`header-app__overlay ${profileOpen ? 'visible' : ''}`}
				onClick={() => setProfileOpen(false)}
			/>
			<header className='header-app'>
				{/* Mobile Hamburger Button */}
				<button
					className='mobile-hamburger-button'
					onClick={() => setMobileMenuOpen(true)}
					aria-label='Open menu'
				>
					<span></span>
					<span></span>
					<span></span>
				</button>

				<a
					className='header-app__brand'
					href='/recetario'
					onClick={handleLogoClick}
				>
					<img
						src={imagePaths.logoSvg || imagePaths.logo}
						alt='Healthy Martina'
						className='header-app__logo'
					/>
				</a>

				<div className='header-app__profile'>
					<button
						type='button'
						className={`boton-menu ${profileOpen ? 'active' : ''}`}
						onClick={handleProfileToggle}
						aria-haspopup='true'
						aria-expanded={profileOpen}
					>
						<span className='perfil'>
							{avatar ? (
								<img src={avatar} alt={userName} />
							) : (
								<span className='perfil__fallback' aria-hidden='true'>
									{avatarFallback || 'HM'}
								</span>
							)}
						</span>
						<span className='hola-name'>
							¡Hola {userName}!
							<i
								className={`fas fa-caret-down header-app__caret ${
									profileOpen ? 'open' : ''
								}`}
								aria-hidden='true'
							/>
						</span>
					</button>
					<div className={`menu-collapse ${profileOpen ? 'open' : ''}`}>
						<div className='menu-collapse__avatar'>
							{avatar ? (
								<img src={avatar} alt={userName} />
							) : (
								<span className='menu-collapse__avatar-fallback' aria-hidden='true'>
									{avatarFallback || 'HM'}
								</span>
							)}
						</div>
						<p>{userName}</p>
						<span className='correo'>{userEmail}</span>
						<nav className='nav nav-precios-menu'>
							{profileLinks.map((item) => {
								const classes = ['nav-precios-link', item.className]
									.filter(Boolean)
									.join(' ');
								if (item.external) {
									return (
										<a
											key={item.label}
											href={item.path}
											className={classes}
											target='_blank'
											rel='noreferrer'
										>
											{item.label}
										</a>
									);
								}
								return (
									<button
										key={item.label}
										type='button'
										className={classes}
										id={item.id}
										onClick={() => handleOptionSelect(item)}
									>
										{item.label}
									</button>
								);
							})}
						</nav>
					</div>
				</div>
			</header>

			{/* Mobile Hamburger Menu */}
			<MobileHamburgerMenu
				isOpen={mobileMenuOpen}
				onClose={() => setMobileMenuOpen(false)}
				permissions={permissions}
				onSearch={onSearch}
				searchData={searchData}
			/>
		</div>
	);
}

export default AuthenticatedHeader;

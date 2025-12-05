import React from 'react';

export function PlanesIcon({ className = 'cls-1', ...props }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 31.57 25.04'
			{...props}
		>
			<title>icono05</title>
			<g id='Layer_2' data-name='Layer 2'>
				<g id='Contenido-Home'>
					<path
						className={className}
						d='M29.77,4.26H14.34L12.92,1.07A1.77,1.77,0,0,0,11.29,0h-10A1.32,1.32,0,0,0,0,1.32V7.87H31.57V6.05a1.8,1.8,0,0,0-1.8-1.79Z'
					></path>
					<path
						className={className}
						d='M25.65,17.2l-2.47-2.06L20.7,17.2V8.7H0V23.25A1.79,1.79,0,0,0,1.79,25h28a1.8,1.8,0,0,0,1.8-1.79V8.7H25.65v8.5Z'
					></path>
				</g>
			</g>
		</svg>
	);
}

export default PlanesIcon;

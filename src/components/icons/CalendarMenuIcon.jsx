import React from 'react';

/**
 * Calendar icon for menu items (smaller version used in dropdown menus)
 * Based on the SVG from recetario.blade.php line 174
 */
export const CalendarMenuIcon = ({ className = 'cls-1', ...props }) => (
	<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23.05 23.05' {...props}>
		<title>calendarios</title>
		<g id='Layer_2' data-name='Layer 2'>
			<g id='Contenido-Home'>
				<path
					className={className}
					d='M2.88,3.6V.72a.72.72,0,0,1,1.44,0V3.6a.72.72,0,0,1-1.44,0Zm12.25.72a.72.72,0,0,0,.72-.72V.72a.72.72,0,0,0-1.44,0V3.6A.72.72,0,0,0,15.13,4.32Zm7.92,13a5.77,5.77,0,1,1-5.76-5.77A5.76,5.76,0,0,1,23.05,17.29Zm-1.44,0a4.32,4.32,0,1,0-4.32,4.32A4.32,4.32,0,0,0,21.61,17.29ZM5.76,8.64H2.88v2.88H5.76ZM2.88,15.85H5.76V13H2.88ZM7.2,11.52h2.88V8.64H7.2Zm0,4.33h2.88V13H7.2ZM1.44,17.14V7.2H17.29v2.88h1.44V4.47a1.58,1.58,0,0,0-1.56-1.59h-.6V3.6a1.44,1.44,0,1,1-2.88,0V2.88H5V3.6a1.44,1.44,0,0,1-2.88,0V2.88h-.6A1.58,1.58,0,0,0,0,4.47V17.14a1.58,1.58,0,0,0,1.56,1.59h8.52V17.29H1.56A.14.14,0,0,1,1.44,17.14Zm13-5.62V8.64H11.52v2.88Zm5,5.77H17.29V15.13a.72.72,0,0,0-1.44,0V18a.72.72,0,0,0,.72.72h2.88a.72.72,0,1,0,0-1.44Z'
				></path>
			</g>
		</g>
	</svg>
);

export default CalendarMenuIcon;


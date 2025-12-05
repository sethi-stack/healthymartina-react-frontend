import React from 'react';

export function SearchIcon({ className = 'cls-2', ...props }) {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23.87 23.7' {...props}>
			<title>buscar</title>
			<g id='Layer_2' data-name='Layer 2'>
				<g id='Contenido-Home'>
					<path
						className={className}
						d='M23.16,19.52l-4.34-4.34a2.23,2.23,0,0,0-.24-.19A10,10,0,1,0,10,20a9.88,9.88,0,0,0,5.22-1.49c.05.06.1.13.16.19L19.68,23a2.46,2.46,0,1,0,3.48-3.47ZM10,15.77a5.8,5.8,0,1,1,5.8-5.8A5.8,5.8,0,0,1,10,15.77Z'
					></path>
				</g>
			</g>
		</svg>
	);
}

export default SearchIcon;

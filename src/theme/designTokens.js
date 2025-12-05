/**
 * Healthy Martina design tokens extracted from the legacy Laravel Sass.
 * Tokens de diseño de Healthy Martina extraídos del Sass legado de Laravel.
 *
 * These values mirror the colors, fonts and basic component styles used in
 * `resources/sass/_variables.scss`, `_init.scss`, `_buttons.scss`, `_tabs.scss`, etc.
 * Estos valores reflejan los colores, tipografías y estilos básicos de componentes
 * usados en `resources/sass/_variables.scss`, `_init.scss`, `_buttons.scss`, `_tabs.scss`, etc.
 */

/** Global color palette (paleta de colores global) */
export const colors = {
	// Brand / accent colors (colores de marca)
	primary: '#dcb244', // $individual
	professional: '#98bfbf', // $profesional
	greenDark: '#3d5652', // $verde

	// Grays (grises)
	grayLight: '#fafafa', // $gris
	gray: '#7a7a7a', // $gris-oscuro
	borderLight: '#ded7d7', // $border-line-lighter
	border: 'rgba(0, 0, 0, 0.25)', // $border

	// Bootstrap-style palette from `_variables.scss`
	blue: '#3490dc',
	indigo: '#6574cd',
	purple: '#9561e2',
	pink: '#f66d9b',
	red: '#e3342f',
	orange: '#f6993f',
	yellow: '#ffed4a',
	green: '#38c172',
	teal: '#4dc0b5',
	cyan: '#6cb2eb',

	// Text / background (texto / fondo)
	textDefault: '#606060',
	backgroundApp: '#f9f9f9',
};

/** Typography scales and font families (tipografía y familias de fuentes) */
export const typography = {
	fontFamilies: {
		body: '"Gilroy", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
		bodyMedium:
			'"Gilroy-Medium", "Gilroy", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
		bodySemiBold:
			'"Gilroy-SemiBold", "Gilroy", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
		heading:
			'"Gilroy-SemiBold", "Gilroy", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
		gotham:
			'"Gotham-Book", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
	},
	baseFontSize: 17, // px – from `_init.scss` (html, body { font-size: 17px; })
	heading: {
		h2: {
			fontSize: 2, // em
			letterSpacing: 2, // px
		},
	},
};

/** Radii, borders and spacing (bordes y espaciado) */
export const layout = {
	radiusSmall: 3,
	radiusMedium: 5,
	radiusLarge: 7,
	borderDefault: '1px solid #e7e7e7',
};

/**
 * Component-level tokens mirroring Laravel CSS.
 * Tokens a nivel de componente que imitan el CSS de Laravel.
 */
export const components = {
	buttonPrimary: {
		minWidth: 100,
		height: 32,
		borderRadius: 3,
		fontFamily: typography.fontFamilies.bodyMedium,
		fontSize: 16,
		backgroundColor: '#ffffff',
		textColor: colors.gray,
		borderColor: colors.gray,
		hover: {
			borderColor: colors.primary,
			textColor: colors.primary,
		},
		active: {
			backgroundColor: colors.primary,
			textColor: '#ffffff',
			borderColor: colors.primary,
		},
		disabled: {
			textColor: '#d3d3d3',
			borderColor: '#d3d3d3',
			cursor: 'not-allowed',
		},
	},
	tabs: {
		height: 40,
		borderColor: colors.gray,
		textColor: '#bababa',
		fontFamily: typography.fontFamilies.bodyMedium,
		active: {
			backgroundColor: colors.primary,
			textColor: '#ffffff',
		},
	},
};

/**
 * Main theme object – convenient single export.
 * Objeto de tema principal – exportación única conveniente.
 */
export const healthyMartinaTheme = {
	colors,
	typography,
	layout,
	components,
};

export default healthyMartinaTheme;

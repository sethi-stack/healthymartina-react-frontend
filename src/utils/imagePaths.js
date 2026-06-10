/**
 * Image path utilities for the React app.
 * Utilidades de rutas de imágenes para la aplicación React.
 *
 * All images are stored in `public/img/` and can be referenced using these paths.
 * Todas las imágenes se almacenan en `public/img/` y se pueden referenciar usando estas rutas.
 */

/**
 * Base path for all images (ruta base para todas las imágenes)
 */
const IMG_BASE = '/img';

/**
 * Image paths used throughout the application.
 * Rutas de imágenes usadas en toda la aplicación.
 */
export const imagePaths = {
	// Login & auth (login y autenticación)
	loginBackground: `${IMG_BASE}/contacto.jpg`,

	// Header & branding (encabezado y marca)
	logo: `${IMG_BASE}/healthy-martina.png`,
	logoSvg: `${IMG_BASE}/header-app/logo.svg`,
	logoPng: `${IMG_BASE}/header-app/logo.png`,
	logotipo: `${IMG_BASE}/header-app/logotipo.png`,
	homeHeader: `${IMG_BASE}/header-app/Home.jpg`,

	// Icons (iconos)
	icons: {
		buscar: `${IMG_BASE}/iconos/buscar.svg`,
		calendarios: `${IMG_BASE}/iconos/calendarios.svg`,
		carpeta: `${IMG_BASE}/iconos/carpeta.svg`,
		cart: `${IMG_BASE}/iconos/cart.svg`,
		checkCirculo: `${IMG_BASE}/iconos/check-circulo.svg`,
		copiar: `${IMG_BASE}/iconos/copiar.svg`,
		crearReceta: `${IMG_BASE}/iconos/crear-receta.svg`,
		crear: `${IMG_BASE}/iconos/crear.svg`,
		editarReceta: `${IMG_BASE}/iconos/editar-receta.svg`,
		editar: `${IMG_BASE}/iconos/editar.svg`,
		eliminar: `${IMG_BASE}/iconos/eliminar.svg`,
		exportar: `${IMG_BASE}/iconos/exportar.svg`,
		filtro: `${IMG_BASE}/iconos/filtro.svg`,
		guardar: `${IMG_BASE}/iconos/guardar.svg`,
		importarReceta: `${IMG_BASE}/iconos/importar-receta.svg`,
		ingredientes: `${IMG_BASE}/iconos/ingredientes.svg`,
		mail: `${IMG_BASE}/iconos/mail.svg`,
		mas: `${IMG_BASE}/iconos/mas.svg`,
		menuBar: `${IMG_BASE}/iconos/menu-bar.svg`,
		misRecetas: `${IMG_BASE}/iconos/mis-recetas.svg`,
		noFiltro: `${IMG_BASE}/iconos/no-filtro.svg`,
		recalentado: `${IMG_BASE}/iconos/recalentado.svg`,
		tiempo: `${IMG_BASE}/iconos/tiempo.svg`,
		verReceta: `${IMG_BASE}/iconos/ver-receta.svg`,
	},

	// Assist/wizard icons (iconos de asistente)
	assist: {
		bookmark: `${IMG_BASE}/assist/bookmark.png`,
		bookmarkActive: `${IMG_BASE}/assist/bookmark_active.png`,
		calendar: `${IMG_BASE}/assist/calendar.png`,
		calendarActive: `${IMG_BASE}/assist/calendar_active.png`,
		filter: `${IMG_BASE}/assist/filter.png`,
		filterActive: `${IMG_BASE}/assist/filter_active.png`,
		lista: `${IMG_BASE}/assist/lista.png`,
		listaActive: `${IMG_BASE}/assist/lista_active.png`,
		nextSteps: `${IMG_BASE}/assist/next_steps.png`,
		nextStepsActive: `${IMG_BASE}/assist/next_steps_active.png`,
		planes: `${IMG_BASE}/assist/planes.png`,
		planesActive: `${IMG_BASE}/assist/planes_active.png`,
		preferences: `${IMG_BASE}/assist/preferences.png`,
		preferencesActive: `${IMG_BASE}/assist/preferences_active.png`,
		profile: `${IMG_BASE}/assist/profile.png`,
		profileActive: `${IMG_BASE}/assist/profile_active.png`,
		video: `${IMG_BASE}/assist/video.png`,
		videoActive: `${IMG_BASE}/assist/video_active.png`,
	},

	// Common UI images (imágenes comunes de UI)
	alertIcon: `${IMG_BASE}/alert-icon.png`,
	comentario: `${IMG_BASE}/comentario.jpg`,

	// Favicons (iconos de favoritos)
	favicons: {
		base: `${IMG_BASE}/favicons`,
		manifest: `${IMG_BASE}/favicons/manifest.json`,
	},
};

/**
 * Helper function to get an image path.
 * Función auxiliar para obtener una ruta de imagen.
 *
 * @param {string} path - Image path key (clave de ruta de imagen)
 * @returns {string} Full image path (ruta completa de imagen)
 *
 * @example
 * getImagePath('loginBackground') // returns '/img/contacto.jpg'
 * getImagePath('icons.buscar') // returns '/img/iconos/buscar.svg'
 */
export function getImagePath(path) {
	const keys = path.split('.');
	let value = imagePaths;

	for (const key of keys) {
		if (value && typeof value === 'object' && key in value) {
			value = value[key];
		} else {
			console.warn(`Image path not found: ${path}`);
			return '';
		}
	}

	return typeof value === 'string' ? value : '';
}

export default imagePaths;

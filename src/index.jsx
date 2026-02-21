import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/scss/main.scss';
import { QueryProvider } from './providers/QueryProvider';

/**
 * Bootstraps the React application.
 * Punto de entrada de la aplicación React.
 *
 * In Laravel, ensure your Blade layout includes:
 * En Laravel, asegúrate de incluir en tu layout Blade:
 *
 * <div id="react-root"></div>
 * <script src="/path/to/your/bundled/react-front-app.js"></script>
 */
const container =
	document.getElementById('react-root') || document.getElementById('root');

if (container) {
	const root = createRoot(container);
	root.render(
		<QueryProvider>
			<App />
		</QueryProvider>
	);
}

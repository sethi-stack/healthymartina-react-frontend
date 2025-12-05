import React from 'react';
import { typography, colors } from '../designTokens';

/**
 * Body text component aligned with global typography settings.
 * Componente de texto de cuerpo alineado con la tipografía global.
 */
export function BodyText({
	children,
	as: Component = 'p',
	className = '',
	style = {},
}) {
	return (
		<Component
			className={className}
			style={{
				margin: 0,
				fontFamily: typography.fontFamilies.body,
				fontSize: `${typography.baseFontSize}px`,
				color: colors.textDefault,
				...style,
			}}
		>
			{children}
		</Component>
	);
}

/**
 * H2 heading styled close to `_init.scss` (h2).
 * Encabezado H2 con estilo similar a `_init.scss` (h2).
 */
export function Heading2({ children, className = '', style = {} }) {
	const h2 = typography.heading.h2;

	return (
		<h2
			className={className}
			style={{
				margin: 0,
				fontFamily: typography.fontFamilies.heading,
				fontWeight: 'normal',
				fontSize: `${h2.fontSize}em`,
				letterSpacing: `${h2.letterSpacing}px`,
				color: colors.textDefault,
				...style,
			}}
		>
			{children}
		</h2>
	);
}

export default {
	BodyText,
	Heading2,
};

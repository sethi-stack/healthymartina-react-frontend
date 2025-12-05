import React from 'react';
import { components } from '../designTokens';

/**
 * Primary button styled to match Laravel `.button-options` / `.button-select` buttons.
 * Botón primario con estilo similar a los botones de Laravel (`.button-options` / `.button-select`).
 */
export function PrimaryButton({
	children,
	isActive = false,
	isDisabled = false,
	className = '',
	style = {},
	...props
}) {
	const base = components.buttonPrimary;

	// Base inline styles derived from design tokens
	// Estilos base en línea derivados de los tokens de diseño
	const baseStyle = {
		minWidth: base.minWidth,
		height: base.height,
		borderRadius: base.borderRadius,
		fontFamily: base.fontFamily,
		fontSize: base.fontSize,
		backgroundColor: base.backgroundColor,
		color: base.textColor,
		border: `1px solid ${base.borderColor}`,
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center',
		cursor: isDisabled ? base.disabled.cursor : 'pointer',
		transition:
			'border-color 0.3s ease, color 0.3s ease, background-color 0.3s ease',
	};

	const activeStyle = isActive
		? {
				backgroundColor: base.active.backgroundColor,
				color: base.active.textColor,
				borderColor: base.active.borderColor,
		  }
		: null;

	const disabledStyle = isDisabled
		? {
				color: base.disabled.textColor,
				borderColor: base.disabled.borderColor,
		  }
		: null;

	return (
		<button
			type='button'
			{...props}
			className={className}
			disabled={isDisabled || props.disabled}
			style={{
				...baseStyle,
				...activeStyle,
				...disabledStyle,
				...style,
			}}
		>
			{children}
		</button>
	);
}

export default PrimaryButton;

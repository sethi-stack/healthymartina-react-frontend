import React from 'react';
import { colors, components as componentTokens } from '../designTokens';

/**
 * Tab navigation component styled to mirror `.tabs` and `.tabs.typ2` from Laravel.
 * Componente de pestañas con estilo similar a `.tabs` y `.tabs.typ2` de Laravel.
 */
export function Tabs({
	tabs,
	activeId,
	onTabChange,
	variant = 'default', // "default" (tabs) | "soft" (tabs.typ2)
	className = '',
	style = {},
}) {
	if (!tabs || tabs.length === 0) return null;

	const base = componentTokens.tabs;
	const isSoft = variant === 'soft';

	const containerStyle = {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: isSoft ? 'flex-start' : 'center',
		alignItems: 'center',
		borderBottom: isSoft ? '0' : `1px solid ${base.borderColor}`,
		backgroundColor: isSoft ? '#f6f6f6' : 'transparent',
		margin: isSoft ? '20px 0 0' : undefined,
		width: '100%',
		...style,
	};

	return (
		<nav className={className} style={containerStyle}>
			{tabs.map((tab) => {
				const isActive = tab.id === activeId;

				const tabStyle = {
					flex: isSoft ? '0 0 auto' : '0 0 25%',
					textAlign: 'center',
					textDecoration: 'none',
					textTransform: isSoft ? 'capitalize' : 'uppercase',
					padding: isSoft ? '5px 15px' : '10px 0',
					color: isSoft ? '#999999' : base.textColor,
					fontFamily: isSoft ? '"Gilroy", sans-serif' : base.fontFamily,
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: isSoft ? 0 : undefined,
					backgroundColor: isActive
						? isSoft
							? 'transparent'
							: base.active.backgroundColor
						: 'transparent',
					cursor: 'pointer',
				};

				const activeTextColor = isSoft ? colors.primary : base.active.textColor;

				return (
					<button
						key={tab.id}
						type='button'
						onClick={() => onTabChange && onTabChange(tab.id)}
						style={{
							...tabStyle,
							color: isActive ? activeTextColor : tabStyle.color,
							border: 'none',
							background: tabStyle.backgroundColor,
						}}
					>
						{tab.icon && (
							<span
								style={{
									display: 'inline-flex',
									marginRight: 10,
									fontSize: '1em',
								}}
							>
								{tab.icon}
							</span>
						)}
						<span style={{ margin: 0 }}>{tab.label}</span>
					</button>
				);
			})}
		</nav>
	);
}

export default Tabs;

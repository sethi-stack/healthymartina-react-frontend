import React from 'react';
import './IconActionButton.scss';

export function IconActionButton({
	icon: Icon,
	label,
	onClick,
	variant = 'default',
	isActive = false,
	iconOnly = false,
	className = '',
	title,
	...props
}) {
	const buttonClasses = [
		'hm-btn',
		isActive ? 'hm-btn--primary' : 'hm-btn--outline',
		'hm-icon-action-btn',
		`hm-icon-action-btn--${variant}`,
		isActive ? 'hm-icon-action-btn--active' : '',
		iconOnly ? 'hm-icon-action-btn--icon-only' : '',
		className,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<button
			type='button'
			className={buttonClasses}
			onClick={onClick}
			title={title || label}
			aria-label={label}
			{...props}
		>
			{Icon ? <Icon className='hm-icon-action-btn__icon' aria-hidden='true' /> : null}
			{!iconOnly ? <span>{label}</span> : null}
		</button>
	);
}

export default IconActionButton;

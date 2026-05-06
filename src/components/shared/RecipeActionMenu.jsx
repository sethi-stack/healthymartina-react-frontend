import React, { useState, useEffect, useRef } from 'react';
import { EllipsisVerticalIcon, CalendarMenuIcon } from '../icons';
import { FaEye, FaUndo, FaTrashAlt } from 'react-icons/fa';

export const RecipeActionMenu = ({
	onAddToCalendar,
	onViewRecipe,
	onToggleLeftover,
	onDeleteRecipe,
	isLeftover = false,
	menuPosition = 'relative', // Add position prop if we need to adjust for RecipeCard
	customClasses = '',
	triggerSize = 'md',
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const toggleMenu = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsOpen(!isOpen);
	};

	const handleAction = (e, action) => {
		e.preventDefault();
		e.stopPropagation();
		if (action) {
			action(e);
		}
		setIsOpen(false);
	};

	return (
		<div
			className={`${customClasses} hm-menu`.trim()}
			ref={menuRef}
			style={{ position: menuPosition, zIndex: isOpen ? 20 : 10 }}
		>
			<button
				type='button'
				onClick={toggleMenu}
				className={`hm-menu__trigger ${triggerSize === 'sm' ? 'hm-menu__trigger--sm' : ''} ${isOpen ? 'hm-menu__trigger--active active' : ''}`.trim()}
			>
				<EllipsisVerticalIcon />
			</button>
			<div
				className={`hm-menu__dropdown ${isOpen ? 'hm-menu__dropdown--open' : ''}`}
			>
				{onViewRecipe && (
					<button
						type='button'
						className='hm-menu__item'
						onClick={(e) => handleAction(e, onViewRecipe)}
					>
						<FaEye className='hm-menu__icon' />
						<span className='hm-menu__label'>Ver receta</span>
					</button>
				)}
				{onToggleLeftover && (
					<button
						type='button'
						className='hm-menu__item'
						onClick={(e) => handleAction(e, onToggleLeftover)}
					>
						<FaUndo className='hm-menu__icon' />
						<span className='hm-menu__label'>{isLeftover ? 'Quitar recalentado' : 'Recalentado'}</span>
					</button>
				)}
				{onDeleteRecipe && (
					<button
						type='button'
						className='hm-menu__item'
						onClick={(e) => handleAction(e, onDeleteRecipe)}
					>
						<FaTrashAlt className='hm-menu__icon' />
						<span className='hm-menu__label'>Eliminar</span>
					</button>
				)}
				{onAddToCalendar && (
					<button
						type='button'
						className='hm-menu__item'
						onClick={(e) => handleAction(e, onAddToCalendar)}
					>
						<span className='hm-menu__icon'>
							<CalendarMenuIcon />
						</span>
						<span className='hm-menu__label'>Agregar a calendario</span>
					</button>
				)}
			</div>
		</div>
	);
};

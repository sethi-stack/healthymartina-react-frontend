import React from 'react';
import Modal from './Modal';

export default function CalendarNutritionModal({ dayName, items, activeView, onClose }) {
	const formatAmount = (amount) => {
		if (amount > 0.01) return Number(amount).toFixed(2).replace('.', ',');
		return amount;
	};

	return (
		<Modal
			onClose={onClose}
			title={`Información nutricional - ${dayName}`}
			className='popupstyle1'
			dataModal='calendar-nutrition-details'
			width={640}
		>
			<div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
				{items?.length ? (
					items.map((item) => (
						<div
							key={item.id}
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								padding: '8px 0',
								borderBottom: '1px solid #efefef',
							}}
						>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<span
									style={{
										width: 8,
										height: 8,
										borderRadius: '50%',
										display: 'inline-block',
										backgroundColor: item.main_color || '#42bd41',
									}}
								/>
								<span>{item.nombre}</span>
							</div>
							<span>
								{activeView === 'statistics' || item.id === 94
									? `${formatAmount(item.cantidad)} ${item.unidad_medida}`
									: `${formatAmount(item.porcentaje)}%`}
							</span>
						</div>
					))
				) : (
					<p style={{ margin: 0 }}>No hay datos nutricionales para este día.</p>
				)}
			</div>
		</Modal>
	);
}

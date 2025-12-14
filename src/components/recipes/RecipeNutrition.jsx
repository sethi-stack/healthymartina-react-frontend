import React from 'react';

/**
 * Recipe Nutrition Component
 * Displays nutritional information per serving
 */
export function RecipeNutrition({ nutrientes }) {
	const formatNumber = (num) => {
		if (num > 0.01) {
			return Number(num).toFixed(2).replace('.', ',');
		}
		return Number(num).toFixed(3).replace('.', ',');
	};

	const formatPercentage = (percent) => {
		if (percent === '-') return '-';
		if (percent > 0.001) {
			return Number(percent).toFixed(1).replace('.', ',') + '%';
		}
		return percent + '%';
	};

	return (
		<div className='slide'>
			<h4>Cantidades por porción</h4>
			<div className='list'>
				{nutrientes?.info
					?.filter((nutriente) => nutriente.mostrar)
					.map((nutriente) => (
						<div key={nutriente.id} className='row'>
							<p className='name'>{nutriente.nombre}</p>
							<div className='barra'>
								<p className='cantidad'>
									{formatNumber(nutriente.cantidad)} {nutriente.unidad_medida}
								</p>
								{nutriente.porcentaje !== '-' && (
									<div className='bar'>
										<div
											className='bar-porcent'
											style={{
												backgroundColor: nutriente.color,
												width: `${Number(nutriente.porcentaje)}%`,
											}}
										></div>
									</div>
								)}
								{typeof nutriente.porcentaje === 'number' && (
									<p className='porcent'>
										{formatPercentage(nutriente.porcentaje)}
									</p>
								)}
							</div>
						</div>
					))}
			</div>
			<div className='valor-diario'>
				<p>% Valor diario = 2000 calorías</p>
			</div>
		</div>
	);
}

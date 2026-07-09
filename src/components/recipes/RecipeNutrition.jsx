import React from 'react';

/**
 * Recipe Nutrition Component
 * Displays nutritional information from the recipe data
 */
export function RecipeNutrition({ nutrientes, filterInfo = [] }) {
	const formatNumber = (num) => {
		if (num > 0.01) {
			return Number(num).toFixed(2);
		}
		return Number(num).toFixed(3);
	};

	const formatPercentage = (percent) => {
		if (percent === '-') return '-';
		if (percent > 0.001) {
			return Number(percent).toFixed(1) + '%';
		}
		return percent + '%';
	};

	// Ensure we have the correct structure
	const nutritionData =
		nutrientes?.info || (Array.isArray(nutrientes) ? nutrientes : []);

	if (!nutritionData || nutritionData.length === 0) {
		return (
			<div className='slide active'>
				<h4>Cantidades por porción</h4>
				<div className='list'>
					<p style={{ padding: '20px', color: '#7a7a7a' }}>
						No hay información nutricional disponible para esta receta.
					</p>
				</div>
			</div>
		);
	}

	const selectedNutrientIds = new Set(
		Array.isArray(filterInfo)
			? filterInfo.map(Number).filter((id) => Number.isFinite(id))
			: []
	);

	// Show only the nutrients selected in the user's preferences.
	const filteredNutrients = nutritionData.filter((nutriente) => {
		const nutrientId = Number(nutriente.id);
		if (!Number.isFinite(nutrientId)) {
			return false;
		}

		if (selectedNutrientIds.size > 0) {
			return selectedNutrientIds.has(nutrientId);
		}

		return true;
	});

	return (
		<div className='slide active'>
			<h4>Cantidades por porción</h4>
			<div className='list'>
				{filteredNutrients.map((nutriente) => (
					<div key={nutriente.id || nutriente.nombre} className='row'>
						<p className='name'>{nutriente.nombre}</p>
						<div className='barra'>
							<p className='cantidad'>
								{formatNumber(nutriente.cantidad)} {nutriente.unidad_medida}
							</p>
							{nutriente.porcentaje !== '-' &&
								nutriente.porcentaje !== null && (
									<div className='bar'>
										<div
											className='bar-porcent'
											style={{
												backgroundColor: nutriente.color || '#dcb244',
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
				<div className='valor-diario'>
					<hr />
					<p>% Valor diario = 2000 calorías</p>
				</div>
			</div>
		</div>
	);
}

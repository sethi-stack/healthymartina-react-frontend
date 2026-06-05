import React from 'react';

/**
 * Recipe Nutrition Component
 * Displays nutritional information per serving
 */
export function RecipeNutrition({ nutrientes, filterInfo = [] }) {
	// Predefined nutrient IDs to show (matching constants.php / DB ids)
	// Calorías (94), Carbohidratos (99), Proteína (96), Grasa total (97),
	// Colesterol (180), Calcio (102), Hierro (103), Potasio (106), Sodio (107)
	const RECIPE_NUTRIENT_IDS = [94, 99, 96, 97, 180, 102, 103, 106, 107];
	const DEFAULT_VISIBLE_NUTRIENT_IDS = [94, 99, 96, 97];

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

	// Filter nutrients: only show the predefined recipe-detail nutrients
	const allowedNutrientIds =
		Array.isArray(filterInfo) && filterInfo.length > 0
			? filterInfo.map(Number)
			: DEFAULT_VISIBLE_NUTRIENT_IDS;

	const filteredNutrients = nutritionData
		.filter((nutriente) => {
			return (
				nutriente.mostrar !== false &&
				RECIPE_NUTRIENT_IDS.includes(nutriente.id) &&
				allowedNutrientIds.includes(Number(nutriente.id))
			);
		})
		.sort((a, b) => {
			const orderMap = {
				94: 1,
				99: 2,
				96: 3,
				97: 4,
				180: 5,
				102: 6,
				103: 7,
				106: 8,
				107: 9,
			};
			return (orderMap[a.id] || 999) - (orderMap[b.id] || 999);
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

import React from 'react';

/**
 * Recipe Nutrition Component
 * Displays nutritional information per serving
 */
export function RecipeNutrition({ nutrientes, filterInfo = [] }) {
	// Predefined nutrient IDs to show (matching constants.php)
	// Calorías (94), Carbohidratos (99), Fibra (213), Proteína (96), Grasa total (97)
	const RECIPE_NUTRIENT_IDS = [94, 99, 213, 96, 97];

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

	// Filter nutrients: only show the predefined 5 nutrients
	// Order: Calorías (1), Carbohidratos (2), Fibra (3), Proteína (5), Grasa total (6)
	const filteredNutrients = nutritionData
		.filter((nutriente) => {
			// Only show nutrients with mostrar !== false AND in the predefined list
			return (
				nutriente.mostrar !== false &&
				RECIPE_NUTRIENT_IDS.includes(nutriente.id)
			);
		})
		.sort((a, b) => {
			// Sort by predefined order: Calorías, Carbohidratos, Fibra, Proteína, Grasa total
			const orderMap = { 94: 1, 99: 2, 213: 3, 96: 5, 97: 6 };
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

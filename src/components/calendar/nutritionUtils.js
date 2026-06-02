const MACRO_NUTRIENT_IDS = new Set([96, 97, 99]);
const PIE_VIEW_NUTRIENT_IDS = new Set([94, 96, 97, 99]);

const toNumberOrNull = (value) => {
	if (value === null || value === undefined || value === '') {
		return null;
	}

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
};

const normalizeNutritionItem = (item) => {
	if (Array.isArray(item)) {
		return {
			id: toNumberOrNull(item[0]),
			nombre: item[1] || '',
			unidad_medida: item[2] || '',
			cantidad: toNumberOrNull(item[3]) ?? 0,
			porcentaje: toNumberOrNull(item[4]),
			main_color: item[5] || '#42bd41',
		};
	}

	if (!item || typeof item !== 'object') {
		return null;
	}

	return {
		id: toNumberOrNull(item.id),
		nombre: item.nombre || item.name || '',
		unidad_medida: item.unidad_medida || item.unit || '',
		cantidad: toNumberOrNull(item.cantidad ?? item.amount) ?? 0,
		porcentaje: toNumberOrNull(item.porcentaje ?? item.percentage),
		main_color: item.main_color || item.color || '#42bd41',
	};
};

const normalizeNutritionCollection = (nutritionData) => {
	if (!nutritionData) return [];

	if (Array.isArray(nutritionData)) {
		return nutritionData.map(normalizeNutritionItem).filter(Boolean);
	}

	if (typeof nutritionData === 'object') {
		return Object.values(nutritionData).map(normalizeNutritionItem).filter(Boolean);
	}

	return [];
};

export const normalizeCalendarNutritionItems = (nutritionData) => {
	const items = normalizeNutritionCollection(nutritionData);

	if (!items.length) {
		return [];
	}

	const macroTotal = items.reduce((sum, item) => {
		if (!MACRO_NUTRIENT_IDS.has(item.id)) return sum;
		return sum + Math.max(0, Number(item.cantidad) || 0);
	}, 0);

	const normalizedItems = items.map((item) => {
		let porcentaje = item.porcentaje;

		if (item.id !== 94 && MACRO_NUTRIENT_IDS.has(item.id) && macroTotal > 0) {
			const amount = Math.max(0, Number(item.cantidad) || 0);
			const computedPercentage = (amount / macroTotal) * 100;
			if (porcentaje === null || (porcentaje === 0 && amount > 0)) {
				porcentaje = computedPercentage;
			}
		}

		return {
			...item,
			porcentaje,
		};
	});

	const hasMeaningfulData = normalizedItems.some((item) => {
		const amount = Math.abs(Number(item.cantidad) || 0);
		const percentage = Math.abs(Number(item.porcentaje) || 0);
		return amount > 0.001 || percentage > 0.001;
	});

	return hasMeaningfulData ? normalizedItems : [];
};

export const filterNutritionItemsForView = (items, activeView) => {
	if (activeView === 'statistics') {
		return items;
	}

	return items.filter((item) => PIE_VIEW_NUTRIENT_IDS.has(item.id));
};

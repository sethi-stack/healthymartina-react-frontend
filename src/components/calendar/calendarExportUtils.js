const RECIPE_ID_KEYS = [
	'id',
	'recipe_id',
	'receta_id',
	'recipeId',
	'recetaid',
];

const RECIPE_SLUG_KEYS = ['slug', 'sub-url', 'sub_url', 'url', 'href'];

function normalizeRecipeId(value) {
	const normalized = Number(value);
	return Number.isFinite(normalized) && normalized > 0 ? normalized : null;
}

function normalizeSlug(value) {
	if (typeof value !== 'string') {
		return '';
	}

	const trimmed = value.trim();
	if (!trimmed) {
		return '';
	}

	const routeMatch = trimmed.match(/\/receta\/([^/?#]+)/i);
	if (routeMatch?.[1]) {
		return routeMatch[1];
	}

	return trimmed;
}

function getRecipeIngredients(recipe) {
	const ingredients =
		recipe?.ingredientes ||
		recipe?.ingredients ||
		recipe?.receta?.ingredientes ||
		recipe?.data?.ingredientes;

	return Array.isArray(ingredients) ? ingredients : [];
}

function buildRecipeLookup(recipes = []) {
	const lookup = {
		byId: new Map(),
		bySlug: new Map(),
	};

	recipes.forEach((recipe) => {
		const id = normalizeRecipeId(recipe?.id);
		if (id) {
			lookup.byId.set(id, recipe);
		}

		const slug = normalizeSlug(recipe?.slug);
		if (slug) {
			lookup.bySlug.set(slug.toLowerCase(), recipe);
		}
	});

	return lookup;
}

function resolveRecipeReference(value, lookup) {
	const directId = normalizeRecipeId(value);
	if (directId) {
		return directId;
	}

	if (!value) {
		return null;
	}

	if (typeof value === 'string') {
		const slug = normalizeSlug(value).toLowerCase();
		if (!slug) {
			return null;
		}

		return normalizeRecipeId(lookup.bySlug.get(slug)?.id);
	}

	if (typeof value !== 'object') {
		return null;
	}

	for (const key of RECIPE_ID_KEYS) {
		const id = normalizeRecipeId(value[key]);
		if (id) {
			return id;
		}
	}

	for (const key of RECIPE_SLUG_KEYS) {
		const slug = normalizeSlug(value[key]).toLowerCase();
		if (!slug) {
			continue;
		}

		const matchedRecipe = lookup.bySlug.get(slug);
		const matchedId = normalizeRecipeId(matchedRecipe?.id);
		if (matchedId) {
			return matchedId;
		}
	}

	for (const key of ['recipe', 'receta', 'subrecipe']) {
		const nestedId = resolveRecipeReference(value[key], lookup);
		if (nestedId) {
			return nestedId;
		}
	}

	return null;
}

function collectDependencyIdsFromIngredient(ingredient, lookup, acc = new Set()) {
	if (!ingredient || typeof ingredient !== 'object') {
		return acc;
	}

	const subRecipeId = resolveRecipeReference(
		ingredient.subrecipe ??
			ingredient.sub_recipe ??
			ingredient.subRecipe ??
			ingredient['sub-url'] ??
			ingredient.sub_url ??
			ingredient.subUrl ??
			ingredient['subrecipe-url'] ??
			ingredient.subrecipe_url ??
			ingredient.subrecipeUrl,
		lookup,
	);
	if (subRecipeId) {
		acc.add(subRecipeId);
	}

	if (Array.isArray(ingredient.repeat)) {
		ingredient.repeat.forEach((repeatIngredient) => {
			collectDependencyIdsFromIngredient(repeatIngredient, lookup, acc);
		});
	}

	return acc;
}

function collectRecipeDependencies(recipe, lookup) {
	const dependencyIds = new Set();

	getRecipeIngredients(recipe).forEach((ingredient) => {
		collectDependencyIdsFromIngredient(ingredient, lookup, dependencyIds);
	});

	return dependencyIds;
}

export async function expandRecipeIdsForExport(
	initialRecipeIds,
	fetchRecipesByIds,
	allRecipes = [],
) {
	const lookup = buildRecipeLookup(allRecipes);
	const fetchedRecipes = new Map();
	const orderedRecipeIds = [];
	const visitedIds = new Set();
	let pendingIds = initialRecipeIds
		.map((recipeId) => normalizeRecipeId(recipeId))
		.filter(Boolean);

	while (pendingIds.length > 0) {
		const batchIds = pendingIds.filter((recipeId) => !visitedIds.has(recipeId));
		pendingIds = [];

		if (batchIds.length === 0) {
			continue;
		}

		batchIds.forEach((recipeId) => visitedIds.add(recipeId));

		const batchRecipes = await fetchRecipesByIds(batchIds);
		batchRecipes.forEach((recipe) => {
			const recipeId = normalizeRecipeId(recipe?.id);
			if (!recipeId) {
				return;
			}

			fetchedRecipes.set(recipeId, recipe);
			lookup.byId.set(recipeId, recipe);

			const slug = normalizeSlug(recipe?.slug);
			if (slug) {
				lookup.bySlug.set(slug.toLowerCase(), recipe);
			}
		});

		batchIds.forEach((recipeId) => {
			orderedRecipeIds.push(recipeId);

			const recipe = fetchedRecipes.get(recipeId);
			if (!recipe) {
				return;
			}

			const dependencyIds = collectRecipeDependencies(recipe, lookup);
			dependencyIds.forEach((dependencyId) => {
				if (!visitedIds.has(dependencyId)) {
					pendingIds.push(dependencyId);
				}
			});
		});
	}

	return orderedRecipeIds;
}

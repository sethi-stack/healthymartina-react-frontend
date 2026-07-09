import { expandRecipeIdsForExport } from '../../../components/calendar/calendarExportUtils';

describe('expandRecipeIdsForExport', () => {
	it('includes nested subrecipes and resolves slug-based references', async () => {
		const fetchRecipesByIds = jest.fn(async (recipeIds) => {
			const recipesById = {
				1: {
					id: 1,
					ingredientes: [
						{
							subrecipe: {
								receta_id: 2,
							},
						},
					],
				},
				2: {
					id: 2,
					ingredientes: [
						{
							subrecipe: '/receta/side-sauce',
						},
					],
				},
				3: {
					id: 3,
					ingredientes: [],
				},
			};

			return recipeIds.map((recipeId) => recipesById[recipeId]).filter(Boolean);
		});

		const expandedIds = await expandRecipeIdsForExport(
			[1],
			fetchRecipesByIds,
			[
				{
					id: 3,
					slug: 'side-sauce',
				},
			],
		);

		expect(expandedIds).toEqual([1, 2, 3]);
		expect(fetchRecipesByIds).toHaveBeenNthCalledWith(1, [1]);
		expect(fetchRecipesByIds).toHaveBeenNthCalledWith(2, [2]);
		expect(fetchRecipesByIds).toHaveBeenNthCalledWith(3, [3]);
	});

	it('resolves dependencies from sub-url fields', async () => {
		const fetchRecipesByIds = jest.fn(async (recipeIds) => {
			const recipesById = {
				1: {
					id: 1,
					ingredientes: [
						{
							'sub-url': 'http://127.0.0.1:8000/receta/side-sauce',
						},
					],
				},
				2: {
					id: 2,
					ingredientes: [],
				},
			};

			return recipeIds.map((recipeId) => recipesById[recipeId]).filter(Boolean);
		});

		const expandedIds = await expandRecipeIdsForExport(
			[1],
			fetchRecipesByIds,
			[
				{
					id: 2,
					slug: 'side-sauce',
				},
			],
		);

		expect(expandedIds).toEqual([1, 2]);
		expect(fetchRecipesByIds).toHaveBeenNthCalledWith(1, [1]);
		expect(fetchRecipesByIds).toHaveBeenNthCalledWith(2, [2]);
	});

	it('does not duplicate recipes that are already selected', async () => {
		const fetchRecipesByIds = jest.fn(async (recipeIds) =>
			recipeIds.map((recipeId) => ({
				id: recipeId,
				ingredientes: recipeId === 1 ? [{ subrecipe: { recipe_id: 2 } }] : [],
			})),
		);

		const expandedIds = await expandRecipeIdsForExport(
			[1, 2],
			fetchRecipesByIds,
		);

		expect(expandedIds).toEqual([1, 2]);
		expect(fetchRecipesByIds).toHaveBeenCalledTimes(1);
	});
});

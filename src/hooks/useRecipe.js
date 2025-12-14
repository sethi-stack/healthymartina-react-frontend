import { useQuery } from '@tanstack/react-query';
import { getRecipeBySlug } from '../lib/api/recipes';

/**
 * Hook to fetch a single recipe by slug
 * @param {string} slug - Recipe slug from URL
 * @returns {Object} React Query result with recipe data, loading, error states
 */
export function useRecipe(slug) {
	return useQuery({
		queryKey: ['recipe', slug],
		queryFn: () => getRecipeBySlug(slug),
		enabled: !!slug, // Only run query if slug exists
		staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
	});
}

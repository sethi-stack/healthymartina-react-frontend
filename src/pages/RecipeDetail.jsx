import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRecipe, getRecipeBySlug } from '../lib/api/recipes';
import { RecipeHeader } from '../components/recipes/RecipeHeader';
import { RecipeImage } from '../components/recipes/RecipeImage';
import { RecipeActions } from '../components/recipes/RecipeActions';
import { RecipeIngredients } from '../components/recipes/RecipeIngredients';
import { RecipeNutrition } from '../components/recipes/RecipeNutrition';
import { RecipeInstructions } from '../components/recipes/RecipeInstructions';
import { RecipeTips } from '../components/recipes/RecipeTips';
import { RecipeReactions } from '../components/recipes/RecipeReactions';
import { RecipeComments } from '../components/recipes/RecipeComments';
import './RecipeDetail.scss';

/**
 * Recipe Detail Page Component
 * Displays full recipe information with ingredients, instructions, nutrition, etc.
 */
export function RecipeDetail() {
	const { slug, id } = useParams();
	const recipeSlug = slug || null;
	const recipeId = id ? Number(id) : null;

	const slugQuery = useQuery({
		queryKey: ['recipe', 'slug', recipeSlug],
		queryFn: () => getRecipeBySlug(recipeSlug),
		enabled: !!recipeSlug,
		staleTime: 5 * 60 * 1000,
	});

	const idQuery = useQuery({
		queryKey: ['recipe', 'id', recipeId],
		queryFn: () => getRecipe(recipeId),
		enabled: !recipeSlug && !!recipeId,
		staleTime: 5 * 60 * 1000,
	});

	const recipeResponse = recipeSlug ? slugQuery.data : idQuery.data;
	const isLoading = recipeSlug ? slugQuery.isLoading : idQuery.isLoading;
	const isError = recipeSlug ? slugQuery.isError : idQuery.isError;
	const error = recipeSlug ? slugQuery.error : idQuery.error;

	const [activeLeftTab, setActiveLeftTab] = useState('ingredientes');
	const [activeRightTab, setActiveRightTab] = useState('instrucciones');

	// Loading state
	if (isLoading) {
		return (
			<div id='application' className='recipe'>
				<div id='menu-vue'>
					<div
						className='general-container'
						style={{ textAlign: 'center', padding: '50px' }}
					>
						<img src='/img/iconos/recalentado.svg' className='hm-loading-spin' alt='Loading...' />
						<p>Cargando receta...</p>
					</div>
				</div>
			</div>
		);
	}

	// Error state - redirect to recetario if 404, show error otherwise
	if (isError) {
		if (error?.response?.status === 404) {
			return <Navigate to='/recetario' replace />;
		}
		return (
			<div id='application' className='recipe'>
				<div id='menu-vue'>
					<div
						className='general-container'
						style={{ textAlign: 'center', padding: '50px' }}
					>
						<h3>Error al cargar la receta</h3>
						<p>
							{error?.message ||
								'No se pudo cargar la receta. Por favor, intenta de nuevo.'}
						</p>
					</div>
				</div>
			</div>
		);
	}

	// No recipe data
	if (!recipeResponse) {
		return <Navigate to='/recetario' replace />;
	}

	// Map API response to component structure
	// Handle different possible API response structures
	const recipe = recipeResponse.data || recipeResponse.receta || recipeResponse;

	const toArray = (value) => {
		if (Array.isArray(value)) return value;
		if (!value) return [];
		if (typeof value === 'string') {
			return value
				.split(/\r?\n/)
				.map((item) => item.trim())
				.filter(Boolean);
		}
		if (typeof value === 'object') {
			return Object.values(value).filter(Boolean);
		}
		return [];
	};

	const normalizedIngredients = toArray(
		recipe.ingredientes ||
			recipe.ingredients ||
			recipe.receta?.ingredientes ||
			recipe.data?.ingredientes ||
			recipe.getIngredientes?.()
	);

	const normalizedTips = toArray(
		recipe.tips ||
			recipe.receta?.tips ||
			recipe.data?.tips ||
			recipe.getTips?.()
	);
	const normalizedInstructions = toArray(
		recipe.instrucciones ||
			recipe.instructions ||
			recipe.receta?.instrucciones ||
			recipe.data?.instrucciones ||
			recipe.getInstrucciones?.()
	);

	// Ensure we have the required data structure
	const recipeData = {
		id: recipe.id,
		slug: recipe.slug,
		titulo: recipe.titulo || recipe.title,
		tiempo: recipe.tiempo || recipe.time || 0,
		tiempo_nota: recipe.tiempo_nota || recipe.time_note || '',
		ingredientes_count:
			recipe.ingredientes_count ||
			recipe.ingredients_count ||
			normalizedIngredients.length,
		imagen_principal:
			recipe.imagen_principal || recipe.main_image || recipe.image,
		imagen_secundaria: recipe.imagen_secundaria || recipe.secondary_image,
		porciones: recipe.porciones ||
			recipe.portions ||
			recipe.getPorciones?.() || {
				cantidad: 1,
				nombre: 'Porción',
				nombre_plural: 'Porciones',
				nombre_english: 'serving',
				tipo_medida_id: 1,
			},
		ingredientes: normalizedIngredients,
		instrucciones: normalizedInstructions,
		tips: normalizedTips,
		nutrientes: recipe.nutrientes || recipe.nutrition || { info: [] },
		filter_info: recipe.filter_info || [],
		comments: recipe.comments || [],
		reactions: recipe.reactions || {
			likes: 0,
			dislikes: 0,
			userReaction: null,
		},
	};

	return (
		<div id='application' className='recipe'>
			<div id='menu-vue'>
				<div className='general-container general-container-json'>
					<RecipeHeader
						title={recipeData.titulo}
						time={recipeData.tiempo}
						ingredientsCount={recipeData.ingredientes_count}
						timeNote={recipeData.tiempo_nota}
					/>

					<RecipeImage
						primaryImage={recipeData.imagen_principal}
						secondaryImage={recipeData.imagen_secundaria}
					/>

					<RecipeActions
						recipeId={recipeData.id}
						recipeTitle={recipeData.titulo}
					/>

					<div className='container-receta'>
						<div className='info-left'>
							<div className='indicadores'>
								<a
									href='#'
									className={activeLeftTab === 'ingredientes' ? 'active' : ''}
									onClick={(e) => {
										e.preventDefault();
										setActiveLeftTab('ingredientes');
									}}
								>
									Ingredientes
								</a>
								<a
									href='#'
									className={activeLeftTab === 'nutricion' ? 'active' : ''}
									onClick={(e) => {
										e.preventDefault();
										setActiveLeftTab('nutricion');
									}}
								>
									Información Nutricional
								</a>
							</div>
							<div className='recipe-options'>
								<div
									className={`mobile-section ${
										activeLeftTab === 'ingredientes' ? 'active' : ''
									}`}
								>
									<RecipeIngredients
										ingredients={recipeData.ingredientes}
										portions={recipeData.porciones}
									/>
								</div>
								<div
									className={`mobile-section ${
										activeLeftTab === 'nutricion' ? 'active' : ''
									}`}
								>
									<RecipeNutrition
										nutrientes={recipeData.nutrientes}
										filterInfo={recipeData.filter_info}
										key={`nutrition-${recipeData.id}`}
									/>
								</div>
							</div>
						</div>

						<div className='info-right'>
							<div className='indicadores'>
								<a
									href='#'
									className={activeRightTab === 'instrucciones' ? 'active' : ''}
									onClick={(e) => {
										e.preventDefault();
										setActiveRightTab('instrucciones');
									}}
								>
									Instrucciones
								</a>
								<a
									href='#'
									className={activeRightTab === 'tips' ? 'active' : ''}
									onClick={(e) => {
										e.preventDefault();
										setActiveRightTab('tips');
									}}
								>
									Tips
								</a>
							</div>
							<div className='recipe-options'>
								<div
									className={`mobile-section ${
										activeRightTab === 'instrucciones' ? 'active' : ''
									}`}
								>
									<RecipeInstructions
										instrucciones={recipeData.instrucciones}
									/>
								</div>
								<div
									className={`mobile-section ${
										activeRightTab === 'tips' ? 'active' : ''
									}`}
								>
									<RecipeTips
										tips={recipeData.tips}
										key={`tips-${recipeData.id}`}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<RecipeReactions
					recipeId={recipeData.id}
					reactions={recipeData.reactions}
				/>

				<RecipeComments
					recipeId={recipeData.id}
					comments={recipeData.comments}
				/>
			</div>
		</div>
	);
}

export default RecipeDetail;

import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useRecipe } from '../hooks/useRecipe';
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
	const { slug } = useParams();
	const { data: recipeResponse, isLoading, isError, error } = useRecipe(slug);

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
						<img src='/img/progress.gif' alt='Loading...' />
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

	// Ensure we have the required data structure
	const recipeData = {
		id: recipe.id,
		slug: recipe.slug,
		titulo: recipe.titulo || recipe.title,
		tiempo: recipe.tiempo || recipe.time || 0,
		ingredientes_count:
			recipe.ingredientes_count ||
			recipe.ingredients_count ||
			(recipe.ingredientes ? recipe.ingredientes.length : 0),
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
		ingredientes:
			recipe.ingredientes ||
			recipe.ingredients ||
			recipe.getIngredientes?.() ||
			[],
		instrucciones:
			recipe.instrucciones ||
			recipe.instructions ||
			recipe.getInstrucciones?.() ||
			[],
		tips: recipe.tips || recipe.getTips?.() || [],
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
							<div className='options'>
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
							<div className='options'>
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

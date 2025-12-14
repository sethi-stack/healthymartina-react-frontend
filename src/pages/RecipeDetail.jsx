import React, { useState } from 'react';
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
	// Hard-coded recipe data for initial design
	const recipe = {
		id: 1,
		slug: 'pollo-al-horno',
		titulo: 'Pollo al Horno con Hierbas',
		tiempo: 45,
		ingredientes_count: 8,
		imagen_principal: 'recipes/pollo-al-horno.jpg',
		imagen_secundaria: 'recipes/pollo-al-horno-hero.jpg',
		porciones: {
			cantidad: 4,
			nombre: 'Porción',
			nombre_plural: 'Porciones',
			nombre_english: 'serving',
			tipo_medida_id: 1,
		},
		ingredientes: [
			{
				ingrediente: 'Pollo entero',
				nombre_english: 'whole chicken',
				cantidad: 1,
				medida: 'pieza',
				medida_plural: 'piezas',
				medida_english: 'piece',
				tipo_medida_id: 4,
				nota: '',
				type: 'main',
				ingred_uid: 'ing-1',
			},
			{
				ingrediente: 'Aceite de oliva',
				nombre_english: 'olive oil',
				cantidad: 3,
				medida: 'cda',
				medida_plural: 'cdas',
				medida_english: 'tablespoon',
				tipo_medida_id: 1,
				nota: '',
				type: 'main',
				ingred_uid: 'ing-2',
			},
			{
				ingrediente: 'Ajo',
				nombre_english: 'garlic',
				cantidad: 4,
				medida: 'dientes',
				medida_plural: 'dientes',
				medida_english: 'clove',
				tipo_medida_id: 4,
				nota: '',
				type: 'main',
				ingred_uid: 'ing-3',
			},
			{
				ingrediente: 'Romero fresco',
				nombre_english: 'fresh rosemary',
				cantidad: 2,
				medida: 'ramitas',
				medida_plural: 'ramitas',
				medida_english: 'sprig',
				tipo_medida_id: 4,
				nota: '',
				type: 'main',
				ingred_uid: 'ing-4',
			},
			{
				ingrediente: 'Tomillo fresco',
				nombre_english: 'fresh thyme',
				cantidad: 3,
				medida: 'ramitas',
				medida_plural: 'ramitas',
				medida_english: 'sprig',
				tipo_medida_id: 4,
				nota: '',
				type: 'main',
				ingred_uid: 'ing-5',
			},
			{
				ingrediente: 'Sal',
				nombre_english: 'salt',
				cantidad: 1,
				medida: 'cdta',
				medida_plural: 'cdtas',
				medida_english: 'teaspoon',
				tipo_medida_id: 1,
				nota: 'al gusto',
				type: 'main',
				ingred_uid: 'ing-6',
			},
			{
				ingrediente: 'Pimienta negra',
				nombre_english: 'black pepper',
				cantidad: 0.5,
				medida: 'cdta',
				medida_plural: 'cdtas',
				medida_english: 'teaspoon',
				tipo_medida_id: 1,
				nota: '',
				type: 'main',
				ingred_uid: 'ing-7',
			},
			{
				ingrediente: 'Limón',
				nombre_english: 'lemon',
				cantidad: 1,
				medida: 'pieza',
				medida_plural: 'piezas',
				medida_english: 'piece',
				tipo_medida_id: 4,
				nota: '',
				type: 'main',
				ingred_uid: 'ing-8',
			},
		],
		instrucciones: [
			'Precalentar el horno a 200°C (400°F).',
			'Lavar y secar el pollo completamente. Retirar las vísceras si las tiene.',
			'En un mortero, machacar el ajo con un poco de sal hasta formar una pasta.',
			'Mezclar el ajo machacado con el aceite de oliva, romero y tomillo picados.',
			'Frotar la mezcla de hierbas sobre toda la superficie del pollo, incluyendo debajo de la piel.',
			'Salpimentar el pollo por dentro y por fuera.',
			'Colocar el pollo en una bandeja para horno con el pecho hacia arriba.',
			'Hornear durante 45-50 minutos o hasta que la temperatura interna alcance 75°C (165°F).',
			'Dejar reposar 10 minutos antes de cortar.',
			'Servir con rodajas de limón.',
		],
		tips: [
			'Para un pollo más jugoso, déjalo marinar con las hierbas durante 2-4 horas antes de hornear.',
			'Si la piel se está dorando demasiado rápido, cubre el pollo con papel aluminio y retíralo los últimos 10 minutos.',
			'Puedes agregar verduras como papas, zanahorias o cebollas alrededor del pollo para una comida completa.',
			'El tiempo de cocción puede variar según el tamaño del pollo. Usa un termómetro de cocina para verificar.',
			'Para un sabor más intenso, puedes agregar mantequilla derretida a la mezcla de hierbas.',
			'Si prefieres un pollo más crujiente, aumenta la temperatura a 220°C los últimos 10 minutos.',
		],
		nutrientes: {
			info: [
				{
					id: 1,
					nombre: 'Calorías',
					cantidad: 250,
					unidad_medida: 'kcal',
					porcentaje: 12.5,
					color: '#dcb244',
					mostrar: true,
				},
				{
					id: 2,
					nombre: 'Proteína',
					cantidad: 30,
					unidad_medida: 'g',
					porcentaje: 60,
					color: '#98bfbf',
					mostrar: true,
				},
				{
					id: 3,
					nombre: 'Grasa',
					cantidad: 12,
					unidad_medida: 'g',
					porcentaje: 18,
					color: '#eed9a6',
					mostrar: true,
				},
				{
					id: 4,
					nombre: 'Carbohidratos',
					cantidad: 2,
					unidad_medida: 'g',
					porcentaje: 1,
					color: '#7a7a7a',
					mostrar: true,
				},
			],
		},
		comments: [
			{
				id: 1,
				user: {
					name: 'María González',
					username: 'maria_g',
					image: 'users/maria.jpg',
				},
				comment: '¡Excelente receta! El pollo quedó muy jugoso y sabroso.',
				day: '15',
				month: 'Mar',
			},
			{
				id: 2,
				user: {
					name: 'Carlos Rodríguez',
					username: 'carlos_r',
					image: 'users/carlos.jpg',
				},
				comment:
					'La seguí al pie de la letra y quedó perfecto. Gracias por compartirla.',
				day: '12',
				month: 'Mar',
			},
		],
		reactions: {
			likes: 45,
			dislikes: 2,
			userReaction: 1, // 1 = like, 0 = dislike, null = no reaction
		},
	};

	const [activeLeftTab, setActiveLeftTab] = useState('ingredientes');
	const [activeRightTab, setActiveRightTab] = useState('instrucciones');

	return (
		<div id='application' className='recipe'>
			<div id='menu-vue'>
				<div className='general-container general-container-json'>
					<RecipeHeader
						title={recipe.titulo}
						time={recipe.tiempo}
						ingredientsCount={recipe.ingredientes_count}
					/>

					<RecipeImage
						primaryImage={recipe.imagen_principal}
						secondaryImage={recipe.imagen_secundaria}
					/>

					<RecipeActions recipeId={recipe.id} recipeTitle={recipe.titulo} />

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
								{activeLeftTab === 'ingredientes' && (
									<RecipeIngredients
										ingredients={recipe.ingredientes}
										portions={recipe.porciones}
									/>
								)}
								{activeLeftTab === 'nutricion' && (
									<RecipeNutrition nutrientes={recipe.nutrientes} />
								)}
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
								{activeRightTab === 'instrucciones' && (
									<RecipeInstructions instrucciones={recipe.instrucciones} />
								)}
								{activeRightTab === 'tips' && <RecipeTips tips={recipe.tips} />}
							</div>
						</div>
					</div>
				</div>

				<RecipeReactions recipeId={recipe.id} reactions={recipe.reactions} />

				<RecipeComments recipeId={recipe.id} comments={recipe.comments} />
			</div>
		</div>
	);
}

export default RecipeDetail;

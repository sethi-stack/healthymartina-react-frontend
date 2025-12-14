import React, { useState, useEffect } from 'react';
import { usePortionConverter } from '../../hooks/usePortionConverter';

/**
 * Recipe Ingredients Component
 * Displays ingredients list with portion slider for quantity conversion
 */
export function RecipeIngredients({ ingredients, portions }) {
	const basePortion = portions?.cantidad || 1;
	const [currentPortion, setCurrentPortion] = useState(basePortion);

	const { convertQuantity, setPortion } = usePortionConverter({
		unitMeasure: 'metric', // TODO: Get from user preferences
		defaultPortion: basePortion,
	});

	// Sync hook's currentPortion with component state whenever it changes
	useEffect(() => {
		setPortion(currentPortion);
	}, [currentPortion, setPortion]);

	const handlePortionChange = (e) => {
		const newPortion = parseInt(e.target.value);
		setCurrentPortion(newPortion);
	};

	// Format portion display - show whole numbers only (always integer)
	const formatPortionDisplay = (portion) => {
		return Math.round(portion).toString();
	};

	const minPortion = 1;
	const maxPortion = 27;

	// Helper to render ingredient name (handles HTML links)
	const renderIngredientName = (ingrediente) => {
		const name = ingrediente.ingrediente || '';
		// Check if it contains HTML (link)
		if (name.includes('<a') || name.includes('href=')) {
			return <span dangerouslySetInnerHTML={{ __html: name }} />;
		}
		return name;
	};

	return (
		<div className='slide active'>
			<form className='rango porcionRango'>
				<p className='porcion-cantidad porcionNumero'>
					{formatPortionDisplay(currentPortion)}
				</p>
				<span
					className={`porcionTexto ${
						portions?.tipo_medida_id === 1 ? 'receta-porcion' : ''
					}`}
					data-medida_english={portions?.nombre_english}
					data-tipo_medida_id={portions?.tipo_medida_id}
					data-nombre={portions?.nombre}
					data-nombre_plural={portions?.nombre_plural}
				>
					{currentPortion === 1
						? portions?.nombre || 'Porción'
						: portions?.nombre_plural || 'Porciones'}
				</span>
				<input
					className='e-range'
					type='range'
					name='porciones'
					min={minPortion}
					max={maxPortion}
					value={currentPortion}
					step='1'
					onChange={handlePortionChange}
				/>
			</form>
			<div className='datos' id='datosIngrediente'>
				<div className='header-ingredientes'>
					<a href='#'>
						<i className='fas fa-info-circle'></i>
						<p>Equivalencia</p>
						<div id='equivalences'>
							<p>Información sobre equivalencias de unidades</p>
						</div>
					</a>
				</div>
				{ingredients?.map((ingrediente, index) => {
					// Convert quantity based on current portion
					const converted = convertQuantity({
						quantity: ingrediente.cantidad,
						basePortion: basePortion,
						measurementTypeId: ingrediente.tipo_medida_id,
						unitEnglish: ingrediente.medida_english,
						unit: ingrediente.medida,
						unitPlural: ingrediente.medida_plural,
					});

					// For converted quantities, use the text which includes both quantity and unit
					// The convertPortionQuantity function returns {text, servingValue}
					// where text already includes the unit (e.g., "2 tzs" or "1/2 cda")
					// Note: text may contain HTML like "<span class='smallFraction'>2/3</span> tzs"
					const displayText =
						ingrediente.tipo_medida_id === 4
							? ingrediente.medida
							: converted?.text ||
							  `${ingrediente.cantidad} ${ingrediente.medida}`;

					// Check if displayText contains HTML tags
					const hasHTML =
						displayText &&
						(displayText.includes('<') || displayText.includes('</'));

					return (
						<div
							key={ingrediente.ingred_uid || index}
							className={`ingrediente ${ingrediente.type || ''}`}
						>
							<p
								className='nombre'
								data-nombre_english={ingrediente.nombre_english}
								data-action={ingrediente['sub-url'] || '#'}
							>
								{renderIngredientName(ingrediente)}
							</p>
							{ingrediente.nota && ingrediente.nota !== '' && (
								<p className='notaTiempo'>{ingrediente.nota}</p>
							)}
							<p
								className='cantidad'
								data-ingred_uid={ingrediente.ingred_uid}
								data-cantidad={ingrediente.cantidad}
								data-medida={ingrediente.medida}
								data-medida_plural={ingrediente.medida_plural}
								data-medida_english={ingrediente.medida_english}
								data-tipo_medida_id={ingrediente.tipo_medida_id}
								data-porcion={basePortion}
							>
								{hasHTML ? (
									<span dangerouslySetInnerHTML={{ __html: displayText }} />
								) : (
									displayText
								)}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}

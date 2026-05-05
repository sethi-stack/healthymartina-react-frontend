import React from 'react';
import { useExportProgressStore } from '../../stores/exportProgressStore';
import './GlobalExportProgressBar.scss';

export default function GlobalExportProgressBar() {
	const {
		active,
		progress,
		message,
		error,
		stageSequence,
		recipesTotal,
		reset,
	} = useExportProgressStore();

	if (!active) return null;

	const percent = Math.max(0, Math.min(100, Number(progress || 0)));
	const sequenceText =
		Array.isArray(stageSequence) && stageSequence.length > 0
			? stageSequence
					.map((s) =>
						({
							export_started: 'Inicio',
							collecting_files: 'Archivos',
							calendar: 'Calendario',
							lista: 'Lista',
							nutrition: 'Información nutricional',
							recipe_added: recipesTotal > 0 ? `Recetas (${recipesTotal})` : 'Recetas',
							recipes: recipesTotal > 0 ? `Recetas (${recipesTotal})` : 'Recetas',
							stitching_pdf: 'Finalizando',
							completed: 'Listo',
						}[s] || s)
					)
					.join(' → ')
			: '';

	return (
		<div className={`global-export-bar ${error ? 'is-error' : ''}`} role='status' aria-live='polite'>
			<div className='global-export-bar__left'>
				<div className='global-export-bar__title'>{error || message || 'Exportando...'}</div>
				{sequenceText ? (
					<div className='global-export-bar__subtitle'>{sequenceText}</div>
				) : null}
			</div>
			<div className='global-export-bar__right'>
				<button type='button' className='global-export-bar__close' onClick={reset}>
					×
				</button>
			</div>
			<div className='global-export-bar__track'>
				<div className='global-export-bar__fill' style={{ width: `${percent}%` }} />
			</div>
		</div>
	);
}

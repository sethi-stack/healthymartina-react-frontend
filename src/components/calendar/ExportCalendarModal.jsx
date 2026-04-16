import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	exportCalendarPdf,
	exportListaPdf,
	sendCalendarPdfEmail,
} from '../../lib/api/calendars';
import { getRecipes } from '../../lib/api/recipes';
import CalendarListaTab from './CalendarListaTab';
import Modal from './Modal';
import './ExportCalendarModal.scss';

function extractCalendarRecipeIds(calendar) {
	const mainSchedule = calendar?.main_schedule || {};
	const sidesSchedule = calendar?.sides_schedule || {};
	const orderedIds = [];
	const seen = new Set();

	Object.keys(mainSchedule).forEach((dayKey) => {
		const dayMeals = mainSchedule[dayKey] || {};
		Object.keys(dayMeals).forEach((mealKey) => {
			const mainId = dayMeals[mealKey];
			const sideId = sidesSchedule?.[dayKey]?.[mealKey];

			if (mainId && !seen.has(Number(mainId))) {
				seen.add(Number(mainId));
				orderedIds.push(Number(mainId));
			}

			if (sideId && !seen.has(Number(sideId))) {
				seen.add(Number(sideId));
				orderedIds.push(Number(sideId));
			}
		});
	});

	return orderedIds;
}

export default function ExportCalendarModal({ calendar, onClose }) {
	const [activeTab, setActiveTab] = useState('download');
	const [exportParams, setExportParams] = useState([1, 2]); // Default: calendar + lista
	const [pdfTemplate] = useState('bold');
	const [includeRecipePages, setIncludeRecipePages] = useState(true);
	const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);
	const [heroRecipeId, setHeroRecipeId] = useState('');
	const [recipientEmail, setRecipientEmail] = useState('');
	const [isExporting, setIsExporting] = useState(false);
	const [exportError, setExportError] = useState(null);
	const [hasInitializedRecipeSelection, setHasInitializedRecipeSelection] =
		useState(false);
	const exportButtonClass = 'export-btn hm-btn hm-btn--primary hm-btn--block';

	const { data: recipeSearchData } = useQuery({
		queryKey: ['calendar-export-recipes', calendar?.id],
		queryFn: () => getRecipes({ per_page: 1000 }),
		enabled: !!calendar?.id,
		staleTime: 5 * 60 * 1000,
	});

	const calendarRecipeIds = useMemo(
		() => extractCalendarRecipeIds(calendar),
		[calendar],
	);

	const recipeOptions = useMemo(() => {
		const allRecipes = recipeSearchData?.data || [];
		if (!calendarRecipeIds.length) return [];
		const calendarIdSet = new Set(calendarRecipeIds);
		return allRecipes.filter((recipe) => calendarIdSet.has(Number(recipe.id)));
	}, [recipeSearchData, calendarRecipeIds]);

	const selectedRecipeOptions = useMemo(() => {
		const selectedSet = new Set(selectedRecipeIds.map(Number));
		return recipeOptions.filter((recipe) => selectedSet.has(Number(recipe.id)));
	}, [recipeOptions, selectedRecipeIds]);

	useEffect(() => {
		setIncludeRecipePages(true);
		setSelectedRecipeIds([]);
		setHeroRecipeId('');
		setRecipientEmail('');
		setHasInitializedRecipeSelection(false);
	}, [calendar?.id]);

	useEffect(() => {
		if (!hasInitializedRecipeSelection && calendarRecipeIds.length > 0) {
			setSelectedRecipeIds(calendarRecipeIds);
			setHasInitializedRecipeSelection(true);
		}
	}, [calendarRecipeIds, hasInitializedRecipeSelection]);

	const handleExportParamToggle = (param) => {
		setExportParams((prev) =>
			prev.includes(param) ? prev.filter((p) => p !== param) : [...prev, param],
		);
	};

	const handleRecipeToggle = (recipeId) => {
		setSelectedRecipeIds((prev) =>
			prev.includes(recipeId)
				? prev.filter((id) => id !== recipeId)
				: [...prev, recipeId],
		);
	};

	const getExportPayload = () => ({
		calendar: calendar.id,
		export_param: exportParams,
		template: pdfTemplate,
		hero_recipe_id: heroRecipeId ? Number(heroRecipeId) : undefined,
		selected_recipes: includeRecipePages ? selectedRecipeIds : [],
	});

	const handleExportPdf = async () => {
		if (!calendar?.id) return;
		setIsExporting(true);
		setExportError(null);
		try {
			const blob = await exportCalendarPdf(getExportPayload());
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `${calendar.title || 'calendario'}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
			onClose();
		} catch (error) {
			console.error('Error exporting PDF:', error);
			setExportError('Error al exportar el calendario. Intenta de nuevo.');
		} finally {
			setIsExporting(false);
		}
	};

	const handleSendEmail = async (event) => {
		event.preventDefault();
		if (!calendar?.id) return;
		setIsExporting(true);
		setExportError(null);
		try {
			await sendCalendarPdfEmail({
				...getExportPayload(),
				recipient_email_address: recipientEmail || undefined,
			});
			onClose();
		} catch (error) {
			console.error('Error sending calendar PDF email:', error);
			setExportError(
				error?.response?.data?.message ||
					'Error al enviar el PDF por correo. Intenta de nuevo.',
			);
		} finally {
			setIsExporting(false);
		}
	};

	const handleExportListaPdf = async () => {
		if (!calendar?.id) return;
		setIsExporting(true);
		setExportError(null);
		try {
			const blob = await exportListaPdf(calendar.id);
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `lista-${calendar.title || 'calendario'}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
			onClose();
		} catch (error) {
			console.error('Error exporting lista PDF:', error);
			setExportError('Error al exportar la lista. Intenta de nuevo.');
		} finally {
			setIsExporting(false);
		}
	};

	const renderRecipeSelectors = () => (
		<div className='recipe-selector'>
			<div className='recipe-selector__header'>
				<div className='toggle-row'>
					<input
						type='checkbox'
						checked={includeRecipePages}
						onChange={(e) => setIncludeRecipePages(e.target.checked)}
						aria-label='Incluir recetas seleccionadas'
					/>
					<span>Incluir recetas seleccionadas</span>
				</div>
				<p className='template-helper recipe-selector__helper'>
					Se añaden como páginas individuales después de la portada hero.
				</p>
			</div>

			{includeRecipePages && (
				<>
					<div className='recipe-selector__hero'>
						<label className='field-label' htmlFor='heroRecipe'>
							Portada hero
						</label>
						<select
							id='heroRecipe'
							className='recipe-selector__select'
							value={heroRecipeId}
							onChange={(e) => setHeroRecipeId(e.target.value)}
						>
							<option value=''>Sin portada hero</option>
							{recipeOptions.map((recipe) => (
								<option key={recipe.id} value={recipe.id}>
									{recipe.titulo}
								</option>
							))}
						</select>
					</div>

					<div className='recipe-selector__toolbar'>
						<button
							type='button'
							className='recipe-selector__link'
							onClick={() =>
								setSelectedRecipeIds(recipeOptions.map((recipe) => recipe.id))
							}
						>
							Seleccionar todas
						</button>
						<button
							type='button'
							className='recipe-selector__link'
							onClick={() => setSelectedRecipeIds([])}
						>
							No incluir ninguna
						</button>
					</div>

					<div className='recipe-selector__list'>
						{recipeOptions.length === 0 ? (
							<p className='recipe-selector__empty'>
								No hay recetas disponibles en este calendario.
							</p>
						) : (
							recipeOptions.map((recipe) => (
								<label key={recipe.id} className='recipe-selector__item'>
									<input
										type='checkbox'
										checked={selectedRecipeIds.includes(Number(recipe.id))}
										onChange={() => handleRecipeToggle(Number(recipe.id))}
									/>
									<span>{recipe.titulo}</span>
								</label>
							))
						)}
					</div>

					{selectedRecipeOptions.length > 0 && (
						<div className='recipe-selector__summary'>
							{selectedRecipeOptions.length}{' '}
							{selectedRecipeOptions.length === 1
								? 'receta seleccionada'
								: 'recetas seleccionadas'}
						</div>
					)}
				</>
			)}
		</div>
	);

	const renderExportSettings = () => (
		<div className='export-options'>
			<p className='template-helper'>
				Bold usa el estilo legado más marcado y mantiene calendario, lista,
				recetas y nutrición.
			</p>

			<p className='export-options__label'>
				Selecciona qué incluir en la exportación:
			</p>

			<div className='select-buttons'>
				<button
					type='button'
					className={`calendar-export-select hm-btn hm-btn--toggle ${
						exportParams.includes(1)
							? 'button--active hm-btn--toggle-active'
							: ''
					}`}
					onClick={() => handleExportParamToggle(1)}
				>
					<div className='button__content flex-column flex-center'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='30'
							height='30'
							viewBox='0 0 30 30'
						>
							<path d='M15,0C6.716,0,0,6.716,0,15s6.716,15,15,15s15-6.716,15-15S23.284,0,15,0L15,0z' />
							<path d='M12.488,12.459h5.53c0.434,0,0.79-0.355,0.79-0.79v-0.791c0-0.434-0.356-0.79-0.79-0.79h-5.53 c-0.435,0-0.791,0.355-0.791,0.79v0.791C11.698,12.104,12.054,12.459,12.488,12.459z M10.118,9.299 c-0.435,0-0.791,0.355-0.791,0.79V20.36c0,0.435,0.356,0.79,0.791,0.79c0.434,0,0.79-0.355,0.79-0.79V10.089 C10.908,9.654,10.552,9.299,10.118,9.299z M21.179,14.039h-8.69c-0.435,0-0.791,0.356-0.791,0.79v0.79 c0,0.435,0.356,0.791,0.791,0.791h8.69c0.435,0,0.79-0.356,0.79-0.791v-0.79C21.969,14.395,21.613,14.039,21.179,14.039z M16.438,17.99h-3.95c-0.435,0-0.791,0.356-0.791,0.789v0.79c0,0.436,0.356,0.791,0.791,0.791h3.95c0.434,0,0.79-0.355,0.79-0.791 v-0.79C17.229,18.347,16.872,17.99,16.438,17.99z' />
						</svg>
						<span>Calendario</span>
					</div>
				</button>

				<button
					type='button'
					className={`calendar-export-select hm-btn hm-btn--toggle ${
						exportParams.includes(2)
							? 'button--active hm-btn--toggle-active'
							: ''
					}`}
					onClick={() => handleExportParamToggle(2)}
				>
					<div className='button__content flex-column flex-center'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='30'
							height='30'
							viewBox='0 0 30 30'
						>
							<path d='M15,0C6.716,0,0,6.716,0,15s6.716,15,15,15s15-6.716,15-15S23.284,0,15,0L15,0z' />
							<path d='M9.626,17.688v1.793h1.791v-1.793H9.626z M8.729,15.896h3.583 c0.493,0,0.896,0.404,0.896,0.897v3.582c0,0.494-0.403,0.896-0.896,0.896H8.729c-0.492,0-0.896-0.402-0.896-0.896v-3.582 C7.834,16.3,8.237,15.896,8.729,15.896z M19.271,9.299H10.73c-0.494,0-0.897,0.403-0.897,0.896v3.583 c0,0.494,0.403,0.896,0.897,0.896h8.541c0.494,0,0.896-0.402,0.896-0.896V10.195C20.167,9.702,19.765,9.299,19.271,9.299z' />
						</svg>
						<span>Lista</span>
					</div>
				</button>

				<button
					type='button'
					className={`calendar-export-select hm-btn hm-btn--toggle ${
						exportParams.includes(4)
							? 'button--active hm-btn--toggle-active'
							: ''
					}`}
					onClick={() => handleExportParamToggle(4)}
				>
					<div className='button__content flex-column flex-center'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='30'
							height='30'
							viewBox='0 0 30 30'
						>
							<path d='M15,0C6.716,0,0,6.716,0,15s6.716,15,15,15s15-6.716,15-15S23.284,0,15,0L15,0z' />
							<path d='M20.5,9.5h-11c-0.828,0-1.5,0.672-1.5,1.5v8c0,0.828,0.672,1.5,1.5,1.5h11c0.828,0,1.5-0.672,1.5-1.5v-8 C22,10.172,21.328,9.5,20.5,9.5z M11,18v-2h1.5v2H11z M11,14.5v-2H12.5v2H11z M14,18v-2h1.5v2H14z M14,14.5v-2H15.5v2H14z M17,18v-2h1.5v2H17z M17,14.5v-2H18.5v2H17z' />
						</svg>
						<span>Nutrición</span>
					</div>
				</button>
			</div>

			{includeRecipePages && renderRecipeSelectors()}
		</div>
	);

	const renderDownloadTab = () => (
		<div
			className='tab-pane active hm-tabs__panel hm-tabs__panel--active'
			id='tab-pdf'
		>
			{renderExportSettings()}
			{exportError && <p className='export-error'>{exportError}</p>}
			<button
				type='submit'
				className={exportButtonClass}
				onClick={handleExportPdf}
				disabled={isExporting || exportParams.length === 0}
			>
				{isExporting ? 'Exportando...' : 'Exportar PDF'}
			</button>
		</div>
	);

	const renderEmailTab = () => (
		<div
			className='tab-pane active hm-tabs__panel hm-tabs__panel--active'
			id='tab-email'
		>
			{renderExportSettings()}
			<form className='email-export-form' onSubmit={handleSendEmail}>
				<div className='email-export-form__field'>
					<label className='field-label' htmlFor='recipientEmail'>
						Correo electrónico
					</label>
					<input
						id='recipientEmail'
						type='email'
						className='email-export-form__input'
						placeholder='email@ejemplo.com'
						value={recipientEmail}
						onChange={(e) => setRecipientEmail(e.target.value)}
					/>
				</div>

				{exportError && <p className='export-error'>{exportError}</p>}

				<button
					type='button'
					className={exportButtonClass}
					onClick={handleSendEmail}
					disabled={isExporting || exportParams.length === 0}
				>
					{isExporting ? 'Enviando...' : 'Enviar por correo'}
				</button>
			</form>
		</div>
	);

	return (
		<Modal
			onClose={onClose}
			title={
				<>
					Exportar{' '}
					<span className='export-calendar-form'>{calendar?.title}</span>
				</>
			}
			className='popupstyle1 exportar-calendar'
			width={920}
			dataModal='export-calendar'
		>
			<div className='tabs-container'>
				<div className='tabs typ2 hm-tabs__nav'>
					<button
						type='button'
						className={`tab-link hm-tabs__tab ${activeTab === 'download' ? 'active hm-tabs__tab--active' : ''}`}
						onClick={() => setActiveTab('download')}
					>
						Descargar
					</button>
					<button
						type='button'
						className={`tab-link hm-tabs__tab ${activeTab === 'email' ? 'active hm-tabs__tab--active' : ''}`}
						onClick={() => setActiveTab('email')}
					>
						Correo electrónico
					</button>
					<button
						type='button'
						className={`tab-link hm-tabs__tab ${activeTab === 'lista' ? 'active hm-tabs__tab--active' : ''}`}
						onClick={() => setActiveTab('lista')}
					>
						Lista
					</button>
				</div>

				<div className='tabs-content hm-tabs__content'>
					{activeTab === 'download' && renderDownloadTab()}
					{activeTab === 'email' && renderEmailTab()}
					{activeTab === 'lista' && (
						<div
							className='tab-pane active hm-tabs__panel hm-tabs__panel--active'
							id='tab-lista'
						>
							<CalendarListaTab
								calendarId={calendar?.id}
								onClose={onClose}
								showExportButton={true}
								onExportPdf={handleExportListaPdf}
							/>
						</div>
					)}
				</div>
			</div>
		</Modal>
	);
}

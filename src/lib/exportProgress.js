export const EXPORT_PROGRESS_FLOW = {
	CALENDAR_DOWNLOAD: 'calendar_download',
	CALENDAR_EMAIL: 'calendar_email',
	LISTA_DOWNLOAD: 'lista_download',
};

export const LEGACY_EXPORT_MESSAGES = {
	DOWNLOAD_STARTED: 'La exportación ha comenzado....',
	EMAIL_STARTED: 'El envío de correo ha comenzado...',
	PROFESSIONAL_STARTED: 'La exportación ha comenzado, por favor se paciente.',
	COLLECTING_FILES: 'Estamos juntando tus archivos',
	STITCHING_PDF: 'Por favor se paciente',
	DOWNLOAD_SUCCESS: 'Exportación exitosa',
	PROFESSIONAL_SUCCESS: 'La exportación a concluido con éxito',
	EMAIL_SUCCESS: 'Se envío por mail exitosamente',
	PROFESSIONAL_EMAIL_SUCCESS: '¡El envío de correo ha concluido con éxito!',
	LARGE_PDF_ERROR:
		'Este documento excede el límite de peso. para exportarlo completo haz clic en el botón de imprimir sin imágenes.',
	GENERIC_ERROR: 'Ocurrió algún error',
	INVALID_EMAIL: 'Su correo eléctronico no es valido....',
};

export function getExportStartMessage(flow) {
	switch (flow) {
		case EXPORT_PROGRESS_FLOW.CALENDAR_EMAIL:
			return LEGACY_EXPORT_MESSAGES.EMAIL_STARTED;
		case EXPORT_PROGRESS_FLOW.CALENDAR_DOWNLOAD:
			return LEGACY_EXPORT_MESSAGES.PROFESSIONAL_STARTED;
		default:
			return LEGACY_EXPORT_MESSAGES.DOWNLOAD_STARTED;
	}
}

export function getExportSuccessMessage(flow) {
	switch (flow) {
		case EXPORT_PROGRESS_FLOW.CALENDAR_EMAIL:
			return LEGACY_EXPORT_MESSAGES.PROFESSIONAL_EMAIL_SUCCESS;
		case EXPORT_PROGRESS_FLOW.CALENDAR_DOWNLOAD:
			return LEGACY_EXPORT_MESSAGES.PROFESSIONAL_SUCCESS;
		default:
			return LEGACY_EXPORT_MESSAGES.DOWNLOAD_SUCCESS;
	}
}

export function createInitialExportProgress(flow) {
	return {
		progress: 0,
		stage: 'queued',
		stageSequence: [],
		stageHistory: [],
		recipesDone: 0,
		recipesTotal: 0,
		message: getExportStartMessage(flow),
	};
}

function getLegacyErrorMessageFromValue(value) {
	if (typeof value !== 'string') return '';
	if (value === LEGACY_EXPORT_MESSAGES.LARGE_PDF_ERROR) {
		return LEGACY_EXPORT_MESSAGES.LARGE_PDF_ERROR;
	}
	if (value === LEGACY_EXPORT_MESSAGES.INVALID_EMAIL) {
		return LEGACY_EXPORT_MESSAGES.INVALID_EMAIL;
	}
	return '';
}

export function buildExportMessageFromStatus(statusResponse, state, flow) {
	const backendMessage =
		statusResponse?.message || statusResponse?.stage?.message || '';
	if (backendMessage) {
		return backendMessage;
	}

	switch (state?.stage) {
		case 'completed':
			return getExportSuccessMessage(flow);
		case 'collecting_files':
		case 'lista':
		case 'nutrition':
			return LEGACY_EXPORT_MESSAGES.COLLECTING_FILES;
		case 'recipe_added': {
			const total = Math.max(0, Number(state?.recipesTotal || 0));
			if (total <= 0) return LEGACY_EXPORT_MESSAGES.COLLECTING_FILES;
			const processed = Math.max(1, Math.min(total, Number(state?.recipesDone || 0)));
			return `Se agregaron ${processed} recetas...`;
		}
		case 'stitching_pdf':
			return LEGACY_EXPORT_MESSAGES.STITCHING_PDF;
		case 'failed':
			return (
				getLegacyErrorMessageFromValue(statusResponse?.error_message) ||
				LEGACY_EXPORT_MESSAGES.GENERIC_ERROR
			);
		case 'invalid_email':
			return LEGACY_EXPORT_MESSAGES.INVALID_EMAIL;
		case 'export_started':
		case 'queued':
		default:
			return getExportStartMessage(flow);
	}
}

export function normalizeExportStatus(statusResponse, flow) {
	const next = {
		progress: Number(statusResponse?.progress || 0),
		stage: statusResponse?.stage?.current || statusResponse?.status || 'processing',
		stageSequence: Array.isArray(statusResponse?.stage?.sequence)
			? statusResponse.stage.sequence
			: [],
		stageHistory: Array.isArray(statusResponse?.stage?.history)
			? statusResponse.stage.history
			: [],
		recipesDone: Number(
			statusResponse?.counters?.recipes_processed ||
				statusResponse?.counters?.rendered_recipe_pages ||
				0
		),
		recipesTotal: Number(statusResponse?.counters?.total_recipe_pages || 0),
	};

	return {
		...next,
		message: buildExportMessageFromStatus(statusResponse, next, flow),
	};
}

export async function readExportErrorMessage(error) {
	if (Number(error?.response?.status) === 422) {
		return LEGACY_EXPORT_MESSAGES.INVALID_EMAIL;
	}

	const blob = error?.response?.data;
	if (!(blob instanceof Blob)) {
		const responseMessage = error?.response?.data?.message;
		if (
			typeof responseMessage === 'string' &&
			responseMessage.toLowerCase().includes('correo')
		) {
			return LEGACY_EXPORT_MESSAGES.INVALID_EMAIL;
		}

		return (
			getLegacyErrorMessageFromValue(responseMessage) ||
			getLegacyErrorMessageFromValue(error?.message) ||
			LEGACY_EXPORT_MESSAGES.GENERIC_ERROR
		);
	}

	try {
		const text = await blob.text();
		if (!text) return LEGACY_EXPORT_MESSAGES.GENERIC_ERROR;
		const exactMessage = getLegacyErrorMessageFromValue(text);
		if (exactMessage) return exactMessage;

		const parsed = JSON.parse(text);
		return (
			getLegacyErrorMessageFromValue(parsed?.message) ||
			LEGACY_EXPORT_MESSAGES.GENERIC_ERROR
		);
	} catch (_error) {
		return LEGACY_EXPORT_MESSAGES.GENERIC_ERROR;
	}
}

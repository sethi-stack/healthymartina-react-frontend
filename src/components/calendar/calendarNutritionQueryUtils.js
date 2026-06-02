export const invalidateCalendarNutritionQueries = (queryClient, calendarId) => {
	const summaryPromise = queryClient.invalidateQueries({
		queryKey: ['calendar-nutrition', calendarId],
		refetchType: 'all',
	});
	const detailsPromise = queryClient.invalidateQueries({
		queryKey: ['calendar-nutrition-details', calendarId],
		refetchType: 'all',
	});

	return Promise.all([summaryPromise, detailsPromise]);
};

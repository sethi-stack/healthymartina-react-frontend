import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Modal from '../calendar/Modal';
import {
	deleteFilterBookmark,
	getFilterBookmarks,
	saveFilterBookmark,
} from '../../lib/api/recipes';
import './FilterBookmarksModal.scss';

const hasMeaningfulFilters = (filters = {}) => Object.keys(filters).length > 0;
const normalizeBookmarkFilters = (rawFilters) => {
	if (!rawFilters) return {};
	if (typeof rawFilters === 'string') {
		try {
			return JSON.parse(rawFilters);
		} catch (_error) {
			return {};
		}
	}
	return typeof rawFilters === 'object' ? rawFilters : {};
};

export function FilterBookmarksModal({ onClose, currentFilters = {}, onApplyBookmark }) {
	const queryClient = useQueryClient();
	const [bookmarkName, setBookmarkName] = useState('');
	const [error, setError] = useState('');

	const { data, isLoading } = useQuery({
		queryKey: ['filter-bookmarks'],
		queryFn: getFilterBookmarks,
	});

	const saveMutation = useMutation({
		mutationFn: saveFilterBookmark,
		onSuccess: () => {
			setBookmarkName('');
			setError('');
			queryClient.invalidateQueries({ queryKey: ['filter-bookmarks'] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteFilterBookmark,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['filter-bookmarks'] });
		},
	});

	const bookmarks = data?.data || [];

	const handleSave = (e) => {
		e.preventDefault();
		const trimmedName = bookmarkName.trim();

		if (!trimmedName) {
			setError('Escribe un nombre para el marcador.');
			return;
		}

		if (!hasMeaningfulFilters(currentFilters)) {
			setError('Aplica filtros antes de guardar un marcador.');
			return;
		}

		saveMutation.mutate({
			name: trimmedName,
			filters: currentFilters,
		});
	};

	const handleApply = (bookmark) => {
		onApplyBookmark(normalizeBookmarkFilters(bookmark.filters), {
			source: 'bookmark',
			bookmark: {
				id: bookmark.id,
				name: bookmark.name,
			},
		});
		onClose();
	};

	return (
		<Modal
			onClose={onClose}
			className='filter-bookmarks'
			title='Marcadores'
			closeOnOverlay={false}
			width={700}
			dataModal='filter-bookmarks'
		>
			<div className='filter-bookmarks__content'>
				<div className='filter-bookmarks__list'>
					<h4>Marcadores guardados</h4>
					{isLoading ? (
						<p>Cargando marcadores...</p>
					) : bookmarks.length === 0 ? (
						<p>No tienes marcadores guardados todavía.</p>
					) : (
						<ul>
							{bookmarks.map((bookmark) => (
								<li key={bookmark.id}>
									<span>{bookmark.name}</span>
									<div className='filter-bookmarks__actions'>
										<button
											type='button'
											className='apply'
											onClick={() => handleApply(bookmark)}
										>
											Usar
										</button>
										<button
											type='button'
											className='delete'
											onClick={() => deleteMutation.mutate(bookmark.id)}
											disabled={deleteMutation.isPending}
										>
											Eliminar
										</button>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>

				<form className='filter-bookmarks__save' onSubmit={handleSave}>
					<label htmlFor='bookmark-name'>Guardar filtro actual</label>
					<input
						id='bookmark-name'
						type='text'
						placeholder='Ej. Alto en proteína'
						value={bookmarkName}
						onChange={(e) => {
							setBookmarkName(e.target.value);
							if (error) setError('');
						}}
					/>
					<div className='filter-bookmarks__save-actions'>
						<button type='submit' disabled={saveMutation.isPending}>
							Guardar
						</button>
					</div>
					{error && <p className='filter-bookmarks__error'>{error}</p>}
				</form>
			</div>
		</Modal>
	);
}

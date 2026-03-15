import React, { useState, useRef, useEffect } from 'react';
import { Tabs, PrimaryButton } from '../theme';
import {
	useProfile,
	useUpdateProfile,
	useUpdatePassword,
	useUploadPhoto,
	useDeletePhoto,
	useUploadBusinessPhoto,
	useDeleteBusinessPhoto,
	usePreferences,
	useUpdatePreferences,
} from '../hooks/useProfile';
import './Perfil.scss';

const PROFESSION_OPTIONS = [
	'Health Coach',
	'Nutrición Holística',
	'Médico funcional',
	'Médico naturista',
	'Entrenador personal',
	'Dietista registrado',
	'Other',
];

const PROFILE_TABS = [
	{ id: 'perfil', label: 'Mi Perfil' },
	{ id: 'empresa', label: 'Mi Empresa' },
	{ id: 'preferencias', label: 'Preferencias' },
];

// ─── Mi Perfil Tab ───────────────────────────────────────────────────────────

function MiPerfilTab({ profile }) {
	const updateProfile = useUpdateProfile();
	const updatePassword = useUpdatePassword();
	const uploadPhoto = useUploadPhoto();
	const deletePhoto = useDeletePhoto();
	const fileInputRef = useRef(null);

	const [form, setForm] = useState({
		name: profile?.name || '',
		last_name: profile?.last_name || '',
		username: profile?.username || '',
		email: profile?.email || '',
	});
	const [passwordForm, setPasswordForm] = useState({
		current_password: '',
		password: '',
		password_confirmation: '',
	});
	const [profileSuccess, setProfileSuccess] = useState('');
	const [passwordSuccess, setPasswordSuccess] = useState('');

	// Sync form when profile loads
	useEffect(() => {
		if (profile) {
			setForm({
				name: profile.name || '',
				last_name: profile.last_name || '',
				username: profile.username || '',
				email: profile.email || '',
			});
		}
	}, [profile]);

	const handleProfileSubmit = (e) => {
		e.preventDefault();
		setProfileSuccess('');
		updateProfile.mutate(form, {
			onSuccess: () => setProfileSuccess('Perfil actualizado correctamente.'),
		});
	};

	const handlePasswordSubmit = (e) => {
		e.preventDefault();
		setPasswordSuccess('');
		updatePassword.mutate(passwordForm, {
			onSuccess: () => {
				setPasswordSuccess('Contraseña actualizada correctamente.');
				setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
			},
		});
	};

	const handlePhotoChange = (e) => {
		const file = e.target.files?.[0];
		if (file) uploadPhoto.mutate(file);
	};

	const handleDeletePhoto = () => {
		if (window.confirm('¿Eliminar foto de perfil?')) {
			deletePhoto.mutate();
		}
	};

	const profileErrors = updateProfile.error?.response?.data?.errors || {};
	const passwordErrors = updatePassword.error?.response?.data?.errors || {};

	return (
		<div className='perfil-tab'>
			{/* Avatar */}
			<div className='perfil-avatar-section'>
				<div className='perfil-avatar'>
					{profile?.image ? (
						<img src={profile.image} alt='Foto de perfil' />
					) : (
						<div className='perfil-avatar__placeholder'>
							<i className='fas fa-user' />
						</div>
					)}
				</div>
				<div className='perfil-avatar-actions'>
					<input
						ref={fileInputRef}
						type='file'
						accept='image/*'
						style={{ display: 'none' }}
						onChange={handlePhotoChange}
					/>
					<button
						type='button'
						className='perfil-btn perfil-btn--outline'
						onClick={() => fileInputRef.current?.click()}
						disabled={uploadPhoto.isPending}
					>
						{uploadPhoto.isPending ? 'Subiendo...' : 'Cambiar foto'}
					</button>
					{profile?.image && (
						<button
							type='button'
							className='perfil-btn perfil-btn--text'
							onClick={handleDeletePhoto}
							disabled={deletePhoto.isPending}
						>
							Eliminar
						</button>
					)}
				</div>
			</div>

			{/* Personal Info Form */}
			<form className='perfil-form' onSubmit={handleProfileSubmit}>
				<h3 className='perfil-section-title'>Información personal</h3>
				<div className='perfil-form__row'>
					<div className='perfil-form__field'>
						<label>Nombre</label>
						<input
							type='text'
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
						/>
						{profileErrors.name && <span className='perfil-error'>{profileErrors.name[0]}</span>}
					</div>
					<div className='perfil-form__field'>
						<label>Apellido</label>
						<input
							type='text'
							value={form.last_name}
							onChange={(e) => setForm({ ...form, last_name: e.target.value })}
						/>
						{profileErrors.last_name && <span className='perfil-error'>{profileErrors.last_name[0]}</span>}
					</div>
				</div>
				<div className='perfil-form__row'>
					<div className='perfil-form__field'>
						<label>Nombre de usuario</label>
						<input
							type='text'
							value={form.username}
							onChange={(e) => setForm({ ...form, username: e.target.value })}
						/>
						{profileErrors.username && <span className='perfil-error'>{profileErrors.username[0]}</span>}
					</div>
					<div className='perfil-form__field'>
						<label>Correo electrónico</label>
						<input
							type='email'
							value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
						/>
						{profileErrors.email && <span className='perfil-error'>{profileErrors.email[0]}</span>}
					</div>
				</div>
				{profileSuccess && <p className='perfil-success'>{profileSuccess}</p>}
				{updateProfile.error && !Object.keys(profileErrors).length && (
					<p className='perfil-error'>{updateProfile.error?.response?.data?.message || 'Error al guardar.'}</p>
				)}
				<div className='perfil-form__actions'>
					<PrimaryButton
						type='submit'
						isActive
						disabled={updateProfile.isPending}
					>
						{updateProfile.isPending ? 'Guardando...' : 'Guardar cambios'}
					</PrimaryButton>
				</div>
			</form>

			{/* Password Form */}
			<form className='perfil-form perfil-form--password' onSubmit={handlePasswordSubmit}>
				<h3 className='perfil-section-title'>Cambiar contraseña</h3>
				<div className='perfil-form__field'>
					<label>Contraseña actual</label>
					<input
						type='password'
						value={passwordForm.current_password}
						onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
					/>
					{passwordErrors.current_password && (
						<span className='perfil-error'>{passwordErrors.current_password[0]}</span>
					)}
				</div>
				<div className='perfil-form__row'>
					<div className='perfil-form__field'>
						<label>Nueva contraseña</label>
						<input
							type='password'
							value={passwordForm.password}
							onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
						/>
						{passwordErrors.password && <span className='perfil-error'>{passwordErrors.password[0]}</span>}
					</div>
					<div className='perfil-form__field'>
						<label>Confirmar nueva contraseña</label>
						<input
							type='password'
							value={passwordForm.password_confirmation}
							onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
						/>
					</div>
				</div>
				{passwordSuccess && <p className='perfil-success'>{passwordSuccess}</p>}
				{updatePassword.error && !Object.keys(passwordErrors).length && (
					<p className='perfil-error'>{updatePassword.error?.response?.data?.message || 'Error al cambiar contraseña.'}</p>
				)}
				<div className='perfil-form__actions'>
					<PrimaryButton
						type='submit'
						isActive
						disabled={updatePassword.isPending}
					>
						{updatePassword.isPending ? 'Guardando...' : 'Cambiar contraseña'}
					</PrimaryButton>
				</div>
			</form>
		</div>
	);
}

// ─── Mi Empresa Tab ───────────────────────────────────────────────────────────

function MiEmpresaTab({ profile }) {
	const updateProfile = useUpdateProfile();
	const uploadBusinessPhoto = useUploadBusinessPhoto();
	const deleteBusinessPhoto = useDeleteBusinessPhoto();
	const fileInputRef = useRef(null);

	const [form, setForm] = useState({
		bname: profile?.bname || '',
		profession: profile?.profession || '',
		bemail: profile?.bemail || '',
		website: profile?.website || '',
		color: profile?.color || '#dcb244',
	});
	const [success, setSuccess] = useState('');

	useEffect(() => {
		if (profile) {
			setForm({
				bname: profile.bname || '',
				profession: profile.profession || '',
				bemail: profile.bemail || '',
				website: profile.website || '',
				color: profile.color || '#dcb244',
			});
		}
	}, [profile]);

	const handleSubmit = (e) => {
		e.preventDefault();
		setSuccess('');
		updateProfile.mutate(form, {
			onSuccess: () => setSuccess('Información de empresa actualizada.'),
		});
	};

	const handleLogoChange = (e) => {
		const file = e.target.files?.[0];
		if (file) uploadBusinessPhoto.mutate(file);
	};

	const handleDeleteLogo = () => {
		if (window.confirm('¿Eliminar logo de empresa?')) {
			deleteBusinessPhoto.mutate();
		}
	};

	const errors = updateProfile.error?.response?.data?.errors || {};

	return (
		<div className='perfil-tab'>
			{/* Business Logo */}
			<div className='perfil-avatar-section'>
				<div className='perfil-avatar perfil-avatar--business'>
					{profile?.bimage ? (
						<img src={profile.bimage} alt='Logo de empresa' />
					) : (
						<div className='perfil-avatar__placeholder'>
							<i className='fas fa-building' />
						</div>
					)}
				</div>
				<div className='perfil-avatar-actions'>
					<input
						ref={fileInputRef}
						type='file'
						accept='image/*'
						style={{ display: 'none' }}
						onChange={handleLogoChange}
					/>
					<button
						type='button'
						className='perfil-btn perfil-btn--outline'
						onClick={() => fileInputRef.current?.click()}
						disabled={uploadBusinessPhoto.isPending}
					>
						{uploadBusinessPhoto.isPending ? 'Subiendo...' : 'Cambiar logo'}
					</button>
					{profile?.bimage && (
						<button
							type='button'
							className='perfil-btn perfil-btn--text'
							onClick={handleDeleteLogo}
							disabled={deleteBusinessPhoto.isPending}
						>
							Eliminar
						</button>
					)}
				</div>
			</div>

			{/* Business Info Form */}
			<form className='perfil-form' onSubmit={handleSubmit}>
				<h3 className='perfil-section-title'>Información de empresa</h3>
				<div className='perfil-form__row'>
					<div className='perfil-form__field'>
						<label>Nombre de empresa</label>
						<input
							type='text'
							value={form.bname}
							onChange={(e) => setForm({ ...form, bname: e.target.value })}
						/>
						{errors.bname && <span className='perfil-error'>{errors.bname[0]}</span>}
					</div>
					<div className='perfil-form__field'>
						<label>Profesión</label>
						<select
							value={form.profession}
							onChange={(e) => setForm({ ...form, profession: e.target.value })}
						>
							<option value=''>Seleccionar...</option>
							{PROFESSION_OPTIONS.map((opt) => (
								<option key={opt} value={opt}>{opt}</option>
							))}
						</select>
						{errors.profession && <span className='perfil-error'>{errors.profession[0]}</span>}
					</div>
				</div>
				<div className='perfil-form__row'>
					<div className='perfil-form__field'>
						<label>Correo de empresa</label>
						<input
							type='email'
							value={form.bemail}
							onChange={(e) => setForm({ ...form, bemail: e.target.value })}
						/>
						{errors.bemail && <span className='perfil-error'>{errors.bemail[0]}</span>}
					</div>
					<div className='perfil-form__field'>
						<label>Sitio web</label>
						<input
							type='url'
							placeholder='https://...'
							value={form.website}
							onChange={(e) => setForm({ ...form, website: e.target.value })}
						/>
						{errors.website && <span className='perfil-error'>{errors.website[0]}</span>}
					</div>
				</div>
				<div className='perfil-form__field perfil-form__field--color'>
					<label>Color de marca</label>
					<div className='perfil-color-picker'>
						<input
							type='color'
							value={form.color}
							onChange={(e) => setForm({ ...form, color: e.target.value })}
						/>
						<span className='perfil-color-value'>{form.color}</span>
					</div>
				</div>
				{success && <p className='perfil-success'>{success}</p>}
				{updateProfile.error && !Object.keys(errors).length && (
					<p className='perfil-error'>{updateProfile.error?.response?.data?.message || 'Error al guardar.'}</p>
				)}
				<div className='perfil-form__actions'>
					<PrimaryButton
						type='submit'
						isActive
						disabled={updateProfile.isPending}
					>
						{updateProfile.isPending ? 'Guardando...' : 'Guardar cambios'}
					</PrimaryButton>
				</div>
			</form>
		</div>
	);
}

// ─── Preferencias Tab ─────────────────────────────────────────────────────────

function PreferenciasTab() {
	const { data: prefs, isLoading } = usePreferences();
	const updatePreferences = useUpdatePreferences();

	const [form, setForm] = useState({
		unit_measure: 'metric',
		theme: 'light',
		weekly_reminders: false,
		new_updates: false,
		mentions: false,
	});
	const [success, setSuccess] = useState('');

	useEffect(() => {
		if (prefs) {
			setForm({
				unit_measure: prefs.unit_measure || 'metric',
				theme: prefs.theme || 'light',
				weekly_reminders: !!prefs.weekly_reminders,
				new_updates: !!prefs.new_updates,
				mentions: !!prefs.mentions,
			});
		}
	}, [prefs]);

	const handleSubmit = (e) => {
		e.preventDefault();
		setSuccess('');
		updatePreferences.mutate(form, {
			onSuccess: () => setSuccess('Preferencias guardadas correctamente.'),
		});
	};

	if (isLoading) {
		return <div className='perfil-loading'>Cargando preferencias...</div>;
	}

	return (
		<div className='perfil-tab'>
			<form className='perfil-form' onSubmit={handleSubmit}>
				{/* Unit Measure */}
				<div className='perfil-pref-section'>
					<h3 className='perfil-section-title'>Unidad de medida</h3>
					<div className='perfil-radio-group'>
						<label className='perfil-radio'>
							<input
								type='radio'
								name='unit_measure'
								value='metric'
								checked={form.unit_measure === 'metric'}
								onChange={() => setForm({ ...form, unit_measure: 'metric' })}
							/>
							<span>Métrico (kg, cm)</span>
						</label>
						<label className='perfil-radio'>
							<input
								type='radio'
								name='unit_measure'
								value='us'
								checked={form.unit_measure === 'us'}
								onChange={() => setForm({ ...form, unit_measure: 'us' })}
							/>
							<span>Imperial (lb, in)</span>
						</label>
					</div>
				</div>

				{/* Theme */}
				<div className='perfil-pref-section'>
					<h3 className='perfil-section-title'>Tema</h3>
					<div className='perfil-radio-group'>
						<label className='perfil-radio'>
							<input
								type='radio'
								name='theme'
								value='light'
								checked={form.theme === 'light'}
								onChange={() => setForm({ ...form, theme: 'light' })}
							/>
							<span>Claro</span>
						</label>
						<label className='perfil-radio'>
							<input
								type='radio'
								name='theme'
								value='dark'
								checked={form.theme === 'dark'}
								onChange={() => setForm({ ...form, theme: 'dark' })}
							/>
							<span>Oscuro</span>
						</label>
					</div>
				</div>

				{/* Notification Preferences */}
				<div className='perfil-pref-section'>
					<h3 className='perfil-section-title'>Notificaciones</h3>
					<div className='perfil-checkbox-group'>
						<label className='perfil-checkbox'>
							<input
								type='checkbox'
								checked={form.weekly_reminders}
								onChange={(e) => setForm({ ...form, weekly_reminders: e.target.checked })}
							/>
							<span>Recordatorios semanales</span>
						</label>
						<label className='perfil-checkbox'>
							<input
								type='checkbox'
								checked={form.new_updates}
								onChange={(e) => setForm({ ...form, new_updates: e.target.checked })}
							/>
							<span>Novedades y actualizaciones</span>
						</label>
						<label className='perfil-checkbox'>
							<input
								type='checkbox'
								checked={form.mentions}
								onChange={(e) => setForm({ ...form, mentions: e.target.checked })}
							/>
							<span>Menciones</span>
						</label>
					</div>
				</div>

				{success && <p className='perfil-success'>{success}</p>}
				{updatePreferences.error && (
					<p className='perfil-error'>{updatePreferences.error?.response?.data?.message || 'Error al guardar.'}</p>
				)}
				<div className='perfil-form__actions'>
					<PrimaryButton
						type='submit'
						isActive
						disabled={updatePreferences.isPending}
					>
						{updatePreferences.isPending ? 'Guardando...' : 'Guardar preferencias'}
					</PrimaryButton>
				</div>
			</form>
		</div>
	);
}

// ─── Main Perfil Page ─────────────────────────────────────────────────────────

export function Perfil() {
	const [activeTab, setActiveTab] = useState('perfil');
	const { data: profile, isLoading } = useProfile();

	if (isLoading) {
		return <div className='perfil-loading'>Cargando perfil...</div>;
	}

	return (
		<div className='perfil-page'>
			<h1 className='perfil-page__title'>Mi Perfil</h1>

			<div className='perfil-page__card'>
				<Tabs
					tabs={PROFILE_TABS}
					activeId={activeTab}
					onTabChange={setActiveTab}
				/>

				<div className='perfil-page__content'>
					{activeTab === 'perfil' && <MiPerfilTab profile={profile} />}
					{activeTab === 'empresa' && <MiEmpresaTab profile={profile} />}
					{activeTab === 'preferencias' && <PreferenciasTab />}
				</div>
			</div>
		</div>
	);
}

export default Perfil;

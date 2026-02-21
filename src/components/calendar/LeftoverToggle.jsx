import React from 'react';

/**
 * Leftover Toggle Component
 * Toggle switch for marking recipes as "Recalentado" (reheated/leftover)
 * Based on calendario-planificador.blade.php lines 492-498
 */
export default function LeftoverToggle({ checked, onChange }) {
	return (
		<span className='leftover-field'>
			<label className='switch'>
				<input type='checkbox' name='leftover' className='recpleftover' checked={checked} onChange={(e) => onChange(e.target.checked)} value='1' />
				<span className='slider round'></span>
			</label>
			Recalentado
		</span>
	);
}

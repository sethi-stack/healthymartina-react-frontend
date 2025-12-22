import React, { useState, useEffect, useRef } from 'react';
import './RangeSlider.scss';

/**
 * RangeSlider Component
 * Dual-handle range slider for min/max filtering
 */
export function RangeSlider({
	min = 0,
	max = 100,
	valueMin,
	valueMax,
	onChange,
	label = '',
	decimal = 0,
}) {
	const [minValue, setMinValue] = useState(valueMin || min);
	const [maxValue, setMaxValue] = useState(valueMax || max);
	const wrapRef = useRef(null);

	useEffect(() => {
		setMinValue(valueMin || min);
		setMaxValue(valueMax || max);
	}, [valueMin, valueMax, min, max]);

	useEffect(() => {
		if (wrapRef.current) {
			// Set actual values (not percentages) - CSS will calculate percentages
			wrapRef.current.style.setProperty('--a', minValue);
			wrapRef.current.style.setProperty('--b', maxValue);
			wrapRef.current.style.setProperty('--min', min);
			wrapRef.current.style.setProperty('--max', max);
		}
	}, [minValue, maxValue, min, max]);

	const handleMinChange = (e) => {
		const newMin = parseFloat(e.target.value);
		if (newMin <= maxValue) {
			setMinValue(newMin);
			onChange(newMin, maxValue);
		}
	};

	const handleMaxChange = (e) => {
		const newMax = parseFloat(e.target.value);
		if (newMax >= minValue) {
			setMaxValue(newMax);
			onChange(minValue, newMax);
		}
	};

	const formatValue = (value) => {
		if (decimal > 0) {
			return value.toFixed(decimal);
		}
		return Math.round(value);
	};

	return (
		<div
			className='wrap'
			role='group'
			aria-labelledby='multi-lbl'
			ref={wrapRef}
		>
			<label className='sr-only' htmlFor='range-min'>
				Value A:
			</label>
			<input
				id='range-min'
				name='range-min'
				data-target='a'
				type='range'
				min={min}
				max={max}
				value={minValue}
				onChange={handleMinChange}
				step={decimal > 0 ? Math.pow(10, -decimal) : 1}
			/>
			<output htmlFor={` ${label}`} style={{ '--c': minValue }}></output>
			<label className='sr-only' htmlFor='range-max'>
				Value B:
			</label>
			<input
				id='range-max'
				name='range-max'
				data-target='b'
				type='range'
				min={min}
				max={max}
				value={maxValue}
				onChange={handleMaxChange}
				step={decimal > 0 ? Math.pow(10, -decimal) : 1}
			/>
			<output
				className='label-plus'
				htmlFor={`+ ${label}`}
				style={{ '--c': maxValue }}
			></output>
		</div>
	);
}

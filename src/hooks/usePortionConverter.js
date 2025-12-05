/**
 * React Hook for Portion Conversion
 *
 * Provides a React hook for converting ingredient quantities based on portion changes.
 * This hook encapsulates the unit conversion logic and provides a clean API for
 * React components.
 *
 * @module hooks/usePortionConverter
 */

import { useState, useMemo, useCallback } from "react";
import {
    convertPortionQuantity,
    numFraction,
} from "../utils/unit-conversion/unitConversionUtils";

/**
 * Custom hook for portion-based quantity conversion
 * Hook personalizado para conversión de cantidad basada en porciones
 *
 * @param {Object} options - Hook options (opciones del hook)
 * @param {string} options.unitMeasure - User's preferred unit system ('metric' or 'imperial')
 *                                        (sistema de unidades preferido del usuario: 'metric' o 'imperial')
 * @param {number} options.defaultPortion - Default portion multiplier (usually 1)
 *                                          (multiplicador de porción por defecto, generalmente 1)
 * @returns {Object} Hook return object with conversion functions and state
 *                   (objeto de retorno del hook con funciones de conversión y estado)
 *
 * @example
 * const { convertQuantity, formatPortion, currentPortion, setPortion } = usePortionConverter({
 *   unitMeasure: 'metric',
 *   defaultPortion: 1
 * });
 *
 * // Convert an ingredient quantity
 * // Convertir una cantidad de ingrediente
 * const converted = convertQuantity({
 *   quantity: 2, // cantidad
 *   measurementTypeId: 1, // tipo_medida_id
 *   unitEnglish: 'cup', // medida_english
 *   unit: 'tz', // medida
 *   unitPlural: 'tzs', // medida_plural
 *   basePortion: 1 // porcionBase
 * });
 */
export function usePortionConverter({
    unitMeasure = "metric",
    defaultPortion = 1,
} = {}) {
    const [currentPortion, setCurrentPortion] = useState(defaultPortion);

    /**
     * Converts an ingredient quantity based on current portion
     * Convierte una cantidad de ingrediente basada en la porción actual
     *
     * @param {Object} ingredient - Ingredient data (datos del ingrediente)
     * @param {number} ingredient.quantity - Base quantity (cantidad base)
     * @param {number} ingredient.basePortion - Base portion (porción base)
     * @param {number} ingredient.measurementTypeId - Measurement type ID (tipo_medida_id)
     * @param {string} ingredient.unitEnglish - Unit name (English) (medida_english)
     * @param {string} ingredient.unit - Unit abbreviation (medida)
     * @param {string} ingredient.unitPlural - Plural unit abbreviation (medida_plural)
     * @returns {Object} Converted quantity with text and value
     *                   (cantidad convertida con texto y valor)
     */
    const convertQuantity = useCallback(
        (ingredient) => {
            if (!ingredient) return null;

            return convertPortionQuantity({
                quantity: ingredient.quantity || ingredient.cantidad || 0, // cantidad
                currentPortion: currentPortion, // porcionActual
                basePortion:
                    ingredient.basePortion || ingredient.porcionBase || 1, // porcionBase
                measurementTypeId:
                    ingredient.measurementTypeId || ingredient.tipo_medida_id, // tipo_medida_id
                unitEnglish:
                    ingredient.unitEnglish || ingredient.medida_english, // medida_english
                unit: ingredient.unit || ingredient.medida, // medida
                unitPlural: ingredient.unitPlural || ingredient.medida_plural, // medida_plural
                unitMeasure,
            });
        },
        [currentPortion, unitMeasure]
    );

    /**
     * Formats a portion value for display in the portion slider
     * Formatea un valor de porción para mostrar en el control deslizante de porciones
     *
     * @param {number} measurementTypeId - Measurement type ID (tipo_medida_id)
     * @param {string} unitEnglish - Unit name (English) (medida_english)
     * @returns {string} Formatted portion string (cadena de porción formateada)
     */
    const formatPortion = useCallback(
        (measurementTypeId, unitEnglish) => {
            return numFraction(currentPortion, measurementTypeId, unitEnglish);
        },
        [currentPortion]
    );

    /**
     * Updates the current portion multiplier
     *
     * @param {number} newPortion - New portion value
     */
    const updatePortion = useCallback((newPortion) => {
        setCurrentPortion(newPortion);
    }, []);

    /**
     * Resets portion to default
     */
    const resetPortion = useCallback(() => {
        setCurrentPortion(defaultPortion);
    }, [defaultPortion]);

    return {
        currentPortion,
        setPortion: updatePortion,
        resetPortion,
        convertQuantity,
        formatPortion,
    };
}

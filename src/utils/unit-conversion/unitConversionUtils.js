/**
 * Unit Conversion Utilities
 *
 * Handles conversion between different measurement units (volume, weight, count)
 * and automatic unit switching based on quantity thresholds.
 *
 * This module is critical for:
 * - Portion slider functionality (adjusting ingredient quantities)
 * - Automatic unit switching (e.g., tsp → tbsp → cup)
 * - Metric/Imperial system conversions
 * - Display formatting with fractions
 *
 * @module utils/unit-conversion/unitConversionUtils
 */

import {
    getNearestFraction,
    getNearestPieceFraction,
    getStringFractionValue,
} from "../fractions/fractionUtils";
import Unitz from "unitz";

/**
 * Measurement type IDs
 * @constant {Object}
 */
export const MEASUREMENT_TYPES = {
    VOLUME: 1, // tsp, tbsp, cup, etc.
    WEIGHT: 2, // g, kg, oz, lb
    VOLUME_ALT: 3, // Alternative volume measurements
    COUNT: 4, // Pieces, items
    PIECE: 5, // Pieces with fractions
};

/**
 * Unit conversion thresholds for automatic switching
 * @constant {Object}
 */
const UNIT_THRESHOLDS = {
    TSP_TO_TBSP: 3, // Switch from tsp to tbsp at 3 tsp
    TBSP_TO_CUP: 4, // Switch from tbsp to cup at 4 tbsp
    GRAM_TO_KG: 1000, // Switch from g to kg at 1000g
    OZ_TO_LB: 16, // Switch from oz to lb at 16 oz
};

/**
 * Checks if two units are in the same convertible category.
 *
 * Used to determine if unit conversion is possible between main recipe
 * and sub-recipe ingredients.
 *
 * @param {number} itemUnit - Measurement type ID of the main ingredient
 * @param {number} subRecipeUnit - Measurement type ID of the sub-recipe
 * @returns {boolean} True if units can be converted between each other
 *
 * @example
 * isUnitsInConvertible(3, 5) // Returns: true (both are convertible types)
 * isUnitsInConvertible(1, 2) // Returns: false (volume vs weight)
 */
export function isUnitsInConvertible(itemUnit, subRecipeUnit) {
    return (
        itemUnit === 3 ||
        itemUnit === 5 ||
        subRecipeUnit === 3 ||
        subRecipeUnit === 5
    );
}

/**
 * Checks if two units are different.
 *
 * @param {string} unit1 - First unit (English name)
 * @param {string} unit2 - Second unit (English name)
 * @returns {boolean} True if units are different
 */
export function isUnitsDifferent(unit1, unit2) {
    return unit1 !== unit2;
}

/**
 * Checks if main recipe and sub-recipe units are different.
 *
 * @param {string} mainRecipeUnit - Main recipe unit
 * @param {string} subRecipeUnit - Sub-recipe unit
 * @returns {boolean} True if units are different
 */
export function isMainRecipeAndSubRecipeUnitDifferent(
    mainRecipeUnit,
    subRecipeUnit
) {
    return mainRecipeUnit !== subRecipeUnit;
}

/**
 * Checks if repeat item units are different from main item.
 *
 * @param {string} itemUnit - Main item unit
 * @param {string} repeatItemUnit - Repeat item unit
 * @returns {boolean} True if units are different
 */
export function isRepeatItemUnitsDifferent(itemUnit, repeatItemUnit) {
    return itemUnit !== repeatItemUnit;
}

/**
 * Converts equivalence grams to match the target unit.
 * Convierte la equivalencia en gramos para que coincida con la unidad objetivo.
 *
 * Used when converting between weight units that have different base equivalences.
 * Usado al convertir entre unidades de peso que tienen diferentes equivalencias base.
 *
 * @param {number} gramsEquivalence - Grams equivalence value (equivalencia_gramos)
 * @param {string} gramsEquivalenceUnit - Unit of the equivalence (unidad de equivalencia_gramos)
 * @param {string} targetUnitEnglish - Target unit (English name) (medida_english)
 * @returns {number} Adjusted equivalence value (valor de equivalencia ajustado)
 */
export function isEquivalenciaGramUnitDifferent(
    gramsEquivalence,
    gramsEquivalenceUnit,
    targetUnitEnglish
) {
    if (gramsEquivalenceUnit !== targetUnitEnglish) {
        if (targetUnitEnglish === "tablespoon") {
            gramsEquivalence = gramsEquivalence / 16;
        } else if (targetUnitEnglish === "teaspoon") {
            gramsEquivalence = gramsEquivalence / 48;
        }
    }
    return gramsEquivalence;
}

/**
 * Converts a portion-based quantity and formats it for display.
 * Convierte una cantidad basada en porciones y la formatea para mostrar.
 *
 * This is the core function for the portion slider feature. It:
 * Esta es la función principal para la funcionalidad del control deslizante de porciones. Hace:
 * 1. Calculates the new quantity based on portion multiplier
 *    1. Calcula la nueva cantidad basada en el multiplicador de porción
 * 2. Converts units automatically when thresholds are reached
 *    2. Convierte unidades automáticamente cuando se alcanzan los umbrales
 * 3. Formats the result with appropriate fractions
 *    3. Formatea el resultado con fracciones apropiadas
 *
 * @param {Object} params - Conversion parameters (parámetros de conversión)
 * @param {number} params.quantity - Base quantity (cantidad base)
 * @param {number} params.currentPortion - Current portion multiplier (porción actual)
 * @param {number} params.basePortion - Base portion (usually 1) (porción base, generalmente 1)
 * @param {number} params.measurementTypeId - Measurement type ID (tipo_medida_id)
 * @param {string} params.unitEnglish - Unit name in English (medida_english)
 * @param {string} params.unit - Unit abbreviation (Spanish) (medida)
 * @param {string} params.unitPlural - Plural unit abbreviation (medida_plural)
 * @param {string} params.unitMeasure - User's preferred unit system ('metric' or 'imperial')
 * @returns {Object} Formatted quantity with text and serving value
 *                   {text: string, servingValue: number} - Cantidad formateada con texto y valor de porción
 *
 * @example
 * convertPortionQuantity({
 *   quantity: 2,
 *   currentPortion: 1.5,
 *   basePortion: 1,
 *   measurementTypeId: 1, // volume
 *   unitEnglish: 'tsp',
 *   unit: 'cdta',
 *   unitPlural: 'cdtas',
 *   unitMeasure: 'metric'
 * })
 * // Returns: { text: "1 cda", servingValue: 1 }
 */
export function convertPortionQuantity({
    quantity, // cantidad
    currentPortion, // porcionActual
    basePortion, // porcionBase
    measurementTypeId, // tipo_medida_id
    unitEnglish, // medida_english
    unit, // medida
    unitPlural, // medida_plural
    unitMeasure = "metric",
}) {
    let text = unit; // texto = medida
    let servingValue = quantity; // serving_value = cantidad

    // Calculate new quantity based on portion
    // Calcular nueva cantidad basada en porción
    const newQuantity = (currentPortion * quantity) / basePortion;

    // Handle different measurement types
    // Manejar diferentes tipos de medida
    if (measurementTypeId === MEASUREMENT_TYPES.PIECE) {
        // Piece/count measurements (medidas de piezas/conteo)
        servingValue = newQuantity;
        const fraction = getNearestPieceFraction(newQuantity);
        text = getStringFractionValue(fraction);
        text += newQuantity > 1 ? ` ${unitPlural}` : ` ${unit}`;
    } else if (measurementTypeId === MEASUREMENT_TYPES.WEIGHT) {
        // Weight measurements (g, kg, oz, lb) (medidas de peso)
        const parsedQuantity = Unitz.parse(newQuantity + " " + unitEnglish);

        if (unitMeasure === "metric") {
            if (parsedQuantity.convert("gram") < UNIT_THRESHOLDS.GRAM_TO_KG) {
                // Use grams (usar gramos)
                const converted = parsedQuantity.convert("gram"); // convertido
                servingValue = converted;
                const rounded = Math.round(converted);
                text = `${rounded} g`;
            } else {
                // Use kilograms (usar kilogramos)
                const converted = parsedQuantity.convert(
                    "kilo",
                    true,
                    false,
                    16,
                    [2, 3, 4, 8, 16],
                    true
                );
                servingValue = converted.value;
                const fraction = getNearestFraction(converted.value);
                text = getStringFractionValue(fraction);
                text += converted.value > 1 ? " kg" : " kg";
            }
        } else {
            // Imperial system (sistema imperial)
            if (parsedQuantity.convert("oz") < UNIT_THRESHOLDS.OZ_TO_LB) {
                // Use ounces (usar onzas)
                const converted = parsedQuantity.convert(
                    "oz",
                    true,
                    false,
                    16,
                    [2, 3, 4, 8, 16],
                    true
                );
                const fraction = getNearestFraction(converted.value);
                servingValue = converted.value;
                text = getStringFractionValue(fraction);
                text += converted.value > 1 ? " ozs" : " oz";
            } else {
                // Use pounds (usar libras)
                const converted = parsedQuantity.convert(
                    "lb",
                    true,
                    false,
                    16,
                    [2, 3, 4, 8, 16],
                    true
                );
                servingValue = converted.value;
                const fraction = getNearestFraction(converted.value);
                text = getStringFractionValue(fraction);
                text += converted.value > 1 ? " lbs" : " lb";
            }
        }
    } else if (measurementTypeId === MEASUREMENT_TYPES.VOLUME_ALT) {
        // Alternative volume measurements (medidas de volumen alternativas)
        servingValue = newQuantity;
        const fraction = getNearestFraction(newQuantity);
        text = getStringFractionValue(fraction);
        text += newQuantity > 1 ? ` ${unitPlural}` : ` ${unit}`;
    } else if (measurementTypeId === MEASUREMENT_TYPES.VOLUME) {
        // Volume measurements (tsp, tbsp, cup) (medidas de volumen)
        const parsedQuantity = Unitz.parse(newQuantity + " " + unitEnglish);

        if (parsedQuantity.convert("tsp") < UNIT_THRESHOLDS.TSP_TO_TBSP) {
            // Use teaspoons (usar cucharaditas)
            const converted = parsedQuantity.convert(
                "tsp",
                true,
                false,
                16,
                [2, 3, 4, 8, 16],
                true
            );
            const fraction = getNearestFraction(converted.value, "tsp");
            text = getStringFractionValue(fraction);
            text += converted.value > 1 ? " cdtas" : " cdta";
        } else if (
            parsedQuantity.convert("tsp") >= UNIT_THRESHOLDS.TSP_TO_TBSP &&
            parsedQuantity.convert("tbsp") < UNIT_THRESHOLDS.TBSP_TO_CUP
        ) {
            // Use tablespoons (usar cucharadas)
            const converted = parsedQuantity.convert(
                "tbsp",
                true,
                false,
                16,
                [2, 3, 4, 8, 16],
                true
            );
            const fraction = getNearestFraction(converted.value);
            text = getStringFractionValue(fraction);
            text += converted.value > 1 ? " cdas" : " cda";
        } else {
            // Use cups (usar tazas)
            const converted = parsedQuantity.convert(
                "cup",
                true,
                false,
                16,
                [2, 3, 4, 8, 16],
                true
            );
            const fraction = getNearestFraction(converted.value);
            text = getStringFractionValue(fraction);
            text += converted.value > 1 ? " tzs" : " tz";
        }
    }

    return { text, servingValue };
}

/**
 * Converts a portion value to a formatted fraction string for the portion slider.
 * Convierte un valor de porción a una cadena de fracción formateada para el control deslizante de porciones.
 *
 * Used specifically for displaying the portion slider value (e.g., "1 Taza", "1 1/2 Tazas").
 * Usado específicamente para mostrar el valor del control deslizante de porciones (ej: "1 Taza", "1 1/2 Tazas").
 *
 * @param {number} value - Portion value (valor de porción)
 * @param {number} measurementTypeId - Measurement type ID (tipo_medida_id)
 * @param {string} unitEnglish - Unit name in English (medida_english)
 * @returns {string} Formatted portion string (cadena de porción formateada)
 *
 * @example
 * numFraction(1.5, 1, 'cup')
 * // Returns: "1 <span class='smallFraction'>1/2</span> Taza"
 */
export function numFraction(value, measurementTypeId, unitEnglish) {
    let quantity = value; // cantidad
    let text = ""; // texto

    if (measurementTypeId === MEASUREMENT_TYPES.VOLUME) {
        quantity = Unitz.parse(quantity + " " + unitEnglish);

        if (quantity.convert("tsp") < UNIT_THRESHOLDS.TSP_TO_TBSP) {
            const converted = quantity.convert(
                // convertido
                "tsp",
                true,
                false,
                16,
                [2, 3, 4, 8, 16],
                true
            );
            const fraction = getNearestFraction(converted.value, "tsp");
            text = getStringFractionValue(fraction);
            text = converted.value > 1 ? text + " cdtas" : text + " cdta";
        } else if (
            quantity.convert("tsp") >= UNIT_THRESHOLDS.TSP_TO_TBSP &&
            quantity.convert("tbsp") < UNIT_THRESHOLDS.TBSP_TO_CUP
        ) {
            const converted = quantity.convert(
                "tbsp",
                true,
                false,
                16,
                [2, 3, 4, 8, 16],
                true
            );
            const fraction = getNearestFraction(converted.value);
            text = getStringFractionValue(fraction);
            text += converted.value > 1 ? " cdas" : " cda";
        } else {
            const converted = quantity.convert(
                "cup",
                true,
                false,
                16,
                [2, 3, 4, 8, 16],
                true
            );
            const fraction = getNearestFraction(converted.value);
            text = getStringFractionValue(fraction);
            text += converted.value > 1 ? " Tazas" : " Taza";
        }
    } else if (measurementTypeId === MEASUREMENT_TYPES.PIECE) {
        const fraction = getNearestPieceFraction(quantity);
        text = getStringFractionValue(fraction);
    } else {
        const fraction = getNearestFraction(quantity);
        text = getStringFractionValue(fraction);
    }

    return text;
}

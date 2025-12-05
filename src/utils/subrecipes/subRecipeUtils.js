/**
 * Sub-Recipe Utilities
 *
 * Handles processing of ingredients that are themselves recipes (sub-recipes).
 * This is a critical feature where recipes can contain other recipes as ingredients,
 * requiring recursive calculation of quantities and unit conversions.
 *
 * @module utils/subrecipes/subRecipeUtils
 */

import {
    isUnitsInConvertible,
    isUnitsDifferent,
    isMainRecipeAndSubRecipeUnitDifferent,
    isEquivalenciaGramUnitDifferent,
} from "../unit-conversion/unitConversionUtils";
import Unitz from "unitz";

/**
 * Normalizes units when a sub-recipe has different units than expected.
 * Normaliza unidades cuando una sub-receta tiene unidades diferentes a las esperadas.
 *
 * This function handles the complex case where a sub-recipe ingredient needs
 * Esta función maneja el caso complejo donde un ingrediente de sub-receta necesita
 * to be converted to match the main recipe's unit system.
 * ser convertido para que coincida con el sistema de unidades de la receta principal.
 *
 * @param {Object} item - Ingredient item with sub-recipe data (item de ingrediente con datos de sub-receta)
 * @param {Object} item.subrecipe - Sub-recipe data (datos de sub-receta)
 * @param {string} item.subrecipe.cantidad - Sub-recipe quantity (cantidad de sub-receta)
 * @param {string} item.subrecipe.medida_english - Sub-recipe unit (English) (unidad de sub-receta en inglés)
 * @param {string} item.subrecipe.nombre_english - Sub-recipe base unit name (nombre de unidad base de sub-receta)
 * @param {number} item.get_servings - Current servings multiplier (multiplicador de porciones actual)
 * @param {number} item.porcion - Base portion (porción base)
 * @param {number} item.subrecipe.porcion - Sub-recipe base portion (porción base de sub-receta)
 * @param {number} item.categoria_id - Category ID (6 = special category) (ID de categoría, 6 = categoría especial)
 * @returns {Object} Normalized ingredient item (item de ingrediente normalizado)
 */
export function normalizeUnits(item) {
    const unit1 = Unitz.parse(
        item.subrecipe.cantidad + " " + item.subrecipe.medida_english
    );
    const servings = unit1.convert(item.subrecipe.nombre_english); // get_servings

    if (!servings) {
        // Cannot convert directly - calculate servings manually
        // No se puede convertir directamente - calcular porciones manualmente
        const calculatedServings =
            (item.subrecipe.cantidad * item.get_servings) / item.porcion;
        item.porcion = item.subrecipe.porcion;
        return item;
    } else {
        // Can convert - update portion to match sub-recipe
        // Se puede convertir - actualizar porción para que coincida con sub-receta
        if (item.categoria_id === 6) {
            // Special handling for category 6 (manejo especial para categoría 6)
        }
        item.porcion = item.subrecipe.porcion;
        return item;
    }
}

/**
 * Processes a sub-recipe ingredient item.
 * Procesa un item de ingrediente que es una sub-receta.
 *
 * This is the main function for handling sub-recipes. It determines:
 * Esta es la función principal para manejar sub-recetas. Determina:
 * - If unit conversion is needed (si se necesita conversión de unidades)
 * - How to normalize quantities (cómo normalizar cantidades)
 * - Whether to use direct calculation or unit conversion (si usar cálculo directo o conversión de unidades)
 *
 * @param {Object} item - Ingredient item that may be a sub-recipe (item de ingrediente que puede ser una sub-receta)
 * @param {Object} item.subrecipe - Sub-recipe data (empty string if not a sub-recipe) (datos de sub-receta, string vacío si no es sub-receta)
 * @param {number} item.tipo_medida_id - Measurement type ID (ID de tipo de medida)
 * @param {number} item.subrecipe.tipo_medida_id - Sub-recipe measurement type ID (ID de tipo de medida de sub-receta)
 * @param {string} item.medida_english - Main item unit (English) (unidad del item principal en inglés)
 * @param {string} item.subrecipe.medida_english - Sub-recipe unit (English) (unidad de sub-receta en inglés)
 * @param {string} item.subrecipe.nombre_english - Sub-recipe base unit name (nombre de unidad base de sub-receta)
 * @param {number} item.cantidad - Main item quantity (cantidad del item principal)
 * @param {number} item.get_servings - Current servings (porciones actuales)
 * @param {number} item.porcion - Base portion (porción base)
 * @param {number} item.subrecipe.porcion - Sub-recipe base portion (porción base de sub-receta)
 * @param {number} item.categoria_id - Category ID (ID de categoría)
 * @returns {Object} Processed ingredient item (item de ingrediente procesado)
 *
 * @example
 * const item = {
 *   cantidad: 2,
 *   medida_english: 'cup',
 *   subrecipe: {
 *     cantidad: 1,
 *     medida_english: 'tbsp',
 *     nombre_english: 'tablespoon',
 *     porcion: 1,
 *     tipo_medida_id: 1
 *   },
 *   tipo_medida_id: 1,
 *   get_servings: 2,
 *   porcion: 1,
 *   categoria_id: 1
 * };
 * subRecipeItem(item)
 * // Returns processed item with normalized quantities
 */
export function subRecipeItem(item) {
    // Check if this is actually a sub-recipe
    // Verificar si esto es realmente una sub-receta
    if (!item.subrecipe || item.subrecipe === "") {
        return item;
    }

    // For convertible unit types (3, 5)
    // Para tipos de unidades convertibles (3, 5)
    if (
        isUnitsInConvertible(item.tipo_medida_id, item.subrecipe.tipo_medida_id)
    ) {
        if (
            isUnitsDifferent(
                item.subrecipe.medida_english,
                item.subrecipe.nombre_english
            )
        ) {
            // Sub-recipe unit differs from its base unit - normalize
            // La unidad de sub-receta difiere de su unidad base - normalizar
            return normalizeUnits(item);
        } else {
            // Units match - calculate servings directly
            // Las unidades coinciden - calcular porciones directamente
            const servings =
                (item.subrecipe.cantidad * item.get_servings) / item.porcion;
            item.porcion = item.subrecipe.porcion;
            return item;
        }
    }
    // Main recipe and sub-recipe units are different
    // Las unidades de la receta principal y la sub-receta son diferentes
    else if (
        isMainRecipeAndSubRecipeUnitDifferent(
            item.subrecipe.medida_english,
            item.medida_english
        )
    ) {
        if (item.categoria_id === 6) {
            // Special handling for category 6 (manejo especial para categoría 6)
        }
        return normalizeUnits(item);
    }
    // Units are compatible
    // Las unidades son compatibles
    else {
        if (
            isUnitsDifferent(
                item.subrecipe.medida_english,
                item.subrecipe.nombre_english
            )
        ) {
            // Sub-recipe unit differs - normalize
            // La unidad de sub-receta difiere - normalizar
            return normalizeUnits(item);
        } else {
            // Direct calculation
            // Cálculo directo
            item.cantidad =
                (item.cantidad * item.get_servings) / item.subrecipe.porcion;
            item.get_servings = 1;
            item.porcion = 1;
            return item;
        }
    }
}

/**
 * Processes a repeat item (ingredient that appears multiple times).
 * Procesa un item repetido (ingrediente que aparece múltiples veces).
 *
 * Handles the case where the same ingredient appears in multiple recipes
 * Maneja el caso donde el mismo ingrediente aparece en múltiples recetas
 * or multiple times in the same recipe, requiring aggregation.
 * o múltiples veces en la misma receta, requiriendo agregación.
 *
 * @param {Object} item - Main ingredient item (item de ingrediente principal)
 * @param {Array} item.repeat - Array of repeat occurrences (arreglo de ocurrencias repetidas)
 * @param {string} item.medida_english - Main item unit (unidad del item principal)
 * @param {number} item.cantidad - Main item quantity (cantidad del item principal)
 * @param {number} item.get_servings - Current servings (porciones actuales)
 * @param {number} item.porcion - Base portion (porción base)
 * @param {number} item.equivalencia_gramos - Grams equivalence (equivalencia en gramos)
 * @param {string} item.equivalencia_gramos_unit - Equivalence unit (unidad de equivalencia)
 * @param {number} item.tipo_medida_id - Measurement type ID (ID de tipo de medida)
 * @returns {Object} Aggregated ingredient item (item de ingrediente agregado)
 *
 * @example
 * const item = {
 *   cantidad: 1,
 *   medida_english: 'cup',
 *   get_servings: 2,
 *   porcion: 1,
 *   repeat: [
 *     { cantidad: 0.5, medida_english: 'cup', get_servings: 1, porcion: 1 }
 *   ]
 * };
 * repeatItem(item)
 * // Returns item with aggregated quantities
 */
export function repeatItem(item) {
    if (!item.repeat || item.repeat.length === 0) {
        return item;
    }

    let clonedItem = Object.assign({}, item);

    item.repeat.forEach((subItem) => {
        // Process sub-recipe if present
        // Procesar sub-receta si está presente
        if (subItem.subrecipe && subItem.subrecipe !== "") {
            subItem = subRecipeItem(subItem);
        }

        // Check if units are compatible
        // Verificar si las unidades son compatibles
        if (
            !isRepeatItemUnitsDifferent(
                subItem.medida_english,
                item.medida_english
            )
        ) {
            // Units match - simple addition
            // Las unidades coinciden - suma simple
            item.cantidad = (item.get_servings * item.cantidad) / item.porcion;
            subItem.cantidad =
                (subItem.get_servings * subItem.cantidad) / subItem.porcion;
            item.cantidad += subItem.cantidad;
            item.get_servings = 1;
            item.porcion = 1;
        } else {
            // Units differ - need conversion
            // Las unidades difieren - se necesita conversión
            subItem.cantidad =
                (subItem.get_servings * subItem.cantidad) / subItem.porcion;
            const subItemUnit = Unitz.parse(
                // unit2
                subItem.cantidad + " " + subItem.medida_english
            );
            const convertedSubItemUnit = subItemUnit.convert(
                item.medida_english
            ); // unit_convert2
            let itemQuantity = clonedItem.cantidad; // itemQty

            if (!convertedSubItemUnit) {
                // Cannot convert - fall back to grams
                // No se puede convertir - recurrir a gramos
                if (subItem.tipo_medida_id === 4) {
                    // Count type - set to 0 (tipo de conteo - establecer a 0)
                    subItem.cantidad = 0;
                } else {
                    // Convert both to grams
                    // Convertir ambos a gramos
                    if (item.medida !== "g") {
                        item.equivalencia_gramos =
                            isEquivalenciaGramUnitDifferent(
                                item.equivalencia_gramos,
                                item.equivalencia_gramos_unit,
                                item.medida_english
                            );
                        item.medida = "g";
                        item.medida_plural = "g";
                        item.medida_english = "gram";
                        item.tipo_medida_id = 2;
                        item.cantidad =
                            parseFloat(item.equivalencia_gramos) *
                            item.cantidad;
                    }
                    if (subItem.medida !== "g") {
                        subItem.equivalencia_gramos =
                            isEquivalenciaGramUnitDifferent(
                                subItem.equivalencia_gramos,
                                subItem.equivalencia_gramos_unit,
                                subItem.medida_english
                            );
                        subItem.medida = "g";
                        subItem.medida_plural = "g";
                        subItem.medida_english = "gram";
                        subItem.tipo_medida_id = 2;
                        subItem.cantidad =
                            parseFloat(subItem.equivalencia_gramos) *
                            subItem.cantidad;
                    }
                }
                item.cantidad =
                    (item.get_servings * item.cantidad) / item.porcion;
                item.cantidad = item.cantidad + subItem.cantidad;
            } else {
                // Can convert - use converted value
                // Se puede convertir - usar valor convertido
                itemQuantity =
                    (item.get_servings * item.cantidad) / item.porcion;
                const subItemQuantity = convertedSubItemUnit; // subItemQty
                item.cantidad = subItemQuantity + itemQuantity;
            }
            item.get_servings = 1;
            item.porcion = 1;
        }
    });

    return item;
}

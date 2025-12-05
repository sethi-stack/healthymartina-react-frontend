/**
 * List Processing Service
 *
 * Handles processing of ingredient lists for shopping lists and calendars.
 * This service processes raw ingredient data from the API and prepares it
 * for display, including sub-recipe handling and quantity calculations.
 *
 * @module services/list-processing/listProcessingService
 */

import {
    subRecipeItem,
    repeatItem,
} from "../../utils/subrecipes/subRecipeUtils";
import { roundOffItem } from "../../utils/fractions/fractionUtils";

/**
 * Processes a single category's ingredient list data.
 * Procesa los datos de la lista de ingredientes de una sola categoría.
 *
 * This function handles:
 * Esta función maneja:
 * - Sub-recipe processing (procesamiento de sub-recetas)
 * - Repeat item aggregation (agregación de items repetidos)
 * - Quantity rounding (redondeo de cantidades)
 *
 * @param {Object} data - API response data (datos de respuesta de la API)
 * @param {Array} data.ingredients - Array of ingredient items (arreglo de items de ingredientes)
 * @param {string} data.modal_html - HTML for ingredient modals (HTML para modales de ingredientes)
 * @param {string} data.lista_html - HTML for list display (HTML para mostrar la lista)
 * @param {number} categoryId - Category ID (categoria_id)
 * @returns {Object} Processed data with ingredients, modal_html, and lista_html
 *                   (datos procesados con ingredientes, modal_html y lista_html)
 *
 * @example
 * const data = {
 *   ingredients: [
 *     { ingrediente_id: 1, cantidad: 2, subrecipe: '' },
 *     { ingrediente_id: 2, cantidad: 1, subrecipe: { cantidad: 0.5, ... } }
 *   ],
 *   modal_html: '<div>...</div>',
 *   lista_html: '<div>...</div>'
 * };
 * processListaData(data, 1)
 * // Returns processed ingredients array
 */
export function processListaData(data, categoryId) {
    const processedIngredients = []; // ingredients_data

    if (data.ingredients && Array.isArray(data.ingredients)) {
        data.ingredients.forEach((item) => {
            // Process sub-recipe if present
            // Procesar sub-receta si está presente
            if (item.subrecipe && item.subrecipe !== "") {
                item = subRecipeItem(item);
            }

            // Process repeat items if present
            // Procesar items repetidos si están presentes
            if (item.repeat && item.repeat.length > 0) {
                item = repeatItem(item);
            }

            // Optional: Round off quantity
            // Opcional: Redondear cantidad
            // const roundedQuantity = roundOffItem(item.cantidad);
            // item.cantidad = roundedQuantity;

            processedIngredients.push(item);
        });
    }

    return {
        ingredients: processedIngredients,
        modal_html: data.modal_html || "",
        lista_html: data.lista_html || "",
    };
}

/**
 * Processes all ingredients for calendar export.
 * Procesa todos los ingredientes para exportación de calendario.
 *
 * Similar to processListaData but handles multiple categories at once.
 * Similar a processListaData pero maneja múltiples categorías a la vez.
 *
 * @param {Array} ingredients - Array of ingredient items (arreglo de items de ingredientes)
 * @param {number} categoryId - Category ID (index) (categoria_id, índice)
 * @returns {Array} Processed ingredients array (arreglo de ingredientes procesados)
 */
export function processAllListaData(ingredients, categoryId) {
    const processedIngredients = []; // ingredients_data

    if (Array.isArray(ingredients)) {
        ingredients.forEach((item) => {
            // Process sub-recipe if present
            // Procesar sub-receta si está presente
            if (item.subrecipe && item.subrecipe !== "") {
                item = subRecipeItem(item);
            }

            // Process repeat items if present
            // Procesar items repetidos si están presentes
            if (item.repeat && item.repeat.length > 0) {
                item = repeatItem(item);
            }

            processedIngredients.push(item);
        });
    }

    return processedIngredients;
}

/**
 * Formats ingredient data for HTML display.
 * Formatea datos de ingredientes para mostrar en HTML.
 *
 * This function generates the HTML structure for displaying ingredients
 * Esta función genera la estructura HTML para mostrar ingredientes
 * in the shopping list. In React, this would typically be replaced with
 * en la lista de compras. En React, esto típicamente sería reemplazado con
 * JSX components, but this function is kept for reference and migration.
 * componentes JSX, pero esta función se mantiene como referencia y para migración.
 *
 * @param {Array} processedIngredients - Processed ingredients array (ingredients_data - arreglo de ingredientes procesados)
 * @param {number} categoryId - Category ID (categoria_id)
 * @param {boolean} modal - Whether to include modal HTML (si incluir HTML de modal)
 * @returns {string} HTML string for ingredient list (cadena HTML para lista de ingredientes)
 *
 * @deprecated This function is jQuery/DOM-based and should be replaced
 * with React components. Kept for reference during migration.
 */
export function lista_ingredients_html(
    processedIngredients,
    categoryId,
    modal = true
) {
    if (!processedIngredients || processedIngredients.length === 0) {
        return "<span>No hay artículos</span>";
    }

    let html = `<div class="list-inner" id="lista_cat_${categoryId}">`;
    const recipe = "'receta'"; // receta

    processedIngredients.forEach((ingredient, i) => {
        const ingredientData = `data-ingredient='[${JSON.stringify(ingredient)}]'`; // data_ingre

        html += `<div class="ingrediente_data_inner">
                    <label class="ingredient ingrediente ${
                        ingredient.subrecipe?.ingred_uid || ""
                    }">
                    <input onchange="updateLista(${
                        ingredient.ingrediente_id
                    },${categoryId},${recipe});" 
                        disabled="" type="checkbox" name="listas" 
                        data-ingrtype="receta" 
                        data-gram="${ingredient.equivalencia_gramos || 0}" 
                        data-cat="${categoryId}" 
                        value="${ingredient.ingrediente_id}">
                    <span class="checkbox"></span>
                    <p class="cantidad" 
                        data-ingred_uid="${ingredient.ingred_uid || ""}"
                        data-cantidad="${ingredient.cantidad}" 
                        data-type="lista" 
                        data-medida="${ingredient.medida || ""}" 
                        data-medida_plural="${ingredient.medida_plural || ""}"
                        data-medida_english="${
                            ingredient.medida_english || ""
                        }" 
                        data-tipo_medida_id="${ingredient.tipo_medida_id || ""}"
                        data-porcion="${ingredient.porcion || 1}" 
                        data-acporcion="${ingredient.get_servings || 1}">`;

        if (ingredient.tipo_medida_id === 4) {
            // Count type - show unit only
            html += `<span class="value">${ingredient.medida || ""}</span>`;
        } else {
            // Show quantity
            html += `<span class="value">${ingredient.cantidad}</span>`;
        }

        html += `</p></label>
                <span class="ingrediente_title" ${ingredientData}>${
            ingredient.ingrediente || ""
        }</span>
                </div>`;

        if (modal) {
            // Generate modal HTML (deprecated - use React components)
            // Generar HTML de modal (deprecado - usar componentes React)
            const modalHtml = `<p class="cantidad"` // model_html 
                data-ingred_uid="${ingredient.ingred_uid || ""}" 
                data-cantidad="${ingredient.cantidad}" 
                data-type="lista" 
                data-medida="${ingredient.medida || ""}"
                data-medida_plural="${ingredient.medida_plural || ""}" 
                data-medida_english="${ingredient.medida_english || ""}" 
                data-tipo_medida_id="${ingredient.tipo_medida_id || ""}" 
                data-porcion="${ingredient.porcion || 1}" 
                data-acporcion="${ingredient.get_servings || 1}">`;
            // Modal HTML generation would continue here...
        }
    });

    html += "</div>";
    return html;
}

/**
 * Updates ingredient checkboxes based on taken items.
 * Actualiza las casillas de ingredientes basándose en items tomados.
 *
 * In React, this would be handled by component state management.
 * En React, esto sería manejado por el manejo de estado del componente.
 *
 * @param {Array} takenItemsList - Array of taken ingredient items (lista_json - arreglo de items de ingredientes tomados)
 * @returns {Object} Mapping of checked ingredients (mapeo de ingredientes marcados)
 *
 * @deprecated This function is jQuery/DOM-based and should be replaced
 * with React state management.
 */
export function updateIngrediente(takenItemsList) {
    const checkedItems = {};

    if (Array.isArray(takenItemsList)) {
        takenItemsList.forEach((item) => {
            const key = `${item.ingrediente_type}_${item.categoria_id}_${item.ingrediente_id}`;
            checkedItems[key] = true;
        });
    }

    return checkedItems;
}

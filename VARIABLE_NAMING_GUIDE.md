# Variable Naming Guide - English with Spanish Comments

This document explains the variable naming convention used throughout the refactored codebase.

## Naming Convention

All **variable names** and **function parameters** are in **English**, with **Spanish translations** provided in comments.

## Variable Name Mappings

### Common Variables

| English Variable       | Spanish Original           | Spanish Translation    | Usage                       |
| ---------------------- | -------------------------- | ---------------------- | --------------------------- |
| `quantity`             | `cantidad`                 | cantidad               | Ingredient quantity         |
| `unit`                 | `medida`                   | medida                 | Unit abbreviation           |
| `unitEnglish`          | `medida_english`           | medida en inglés       | Unit name in English        |
| `unitPlural`           | `medida_plural`            | medida plural          | Plural unit abbreviation    |
| `portion`              | `porcion`                  | porción                | Base portion                |
| `currentPortion`       | `porcionActual`            | porción actual         | Current portion multiplier  |
| `basePortion`          | `porcionBase`              | porción base           | Base portion (usually 1)    |
| `measurementTypeId`    | `tipo_medida_id`           | tipo de medida ID      | Measurement type ID         |
| `categoryId`           | `categoria_id`             | categoría ID           | Category ID                 |
| `ingredientId`         | `ingrediente_id`           | ingrediente ID         | Ingredient ID               |
| `ingredient`           | `ingrediente`              | ingrediente            | Ingredient name             |
| `text`                 | `texto`                    | texto                  | Formatted text for display  |
| `servingValue`         | `serving_value`            | valor de porción       | Calculated serving value    |
| `integer`              | `entero`                   | entero                 | Integer part of number      |
| `decimal`              | `decimal`                  | decimal                | Decimal part of number      |
| `nearest`              | `cercano`                  | cercano                | Nearest value               |
| `nearestFraction`      | `fraccion_cercana`         | fracción cercana       | Nearest fraction            |
| `difference`           | `diferencia`               | diferencia             | Difference value            |
| `converted`            | `convertido`               | convertido             | Converted value             |
| `gramsEquivalence`     | `equivalencia_gramos`      | equivalencia en gramos | Grams equivalence           |
| `gramsEquivalenceUnit` | `equivalencia_gramos_unit` | unidad de equivalencia | Equivalence unit            |
| `baseUnitName`         | `nombre_english`           | nombre en inglés       | Base unit name              |
| `servings`             | `get_servings`             | porciones              | Current servings            |
| `processedIngredients` | `ingredients_data`         | datos de ingredientes  | Processed ingredients array |
| `takenItemsList`       | `lista_json`               | lista JSON             | Array of taken items        |

### Function Parameters

All function parameters follow the same convention:

```javascript
/**
 * @param {number} quantity - Base quantity (cantidad base)
 * @param {number} currentPortion - Current portion multiplier (porción actual)
 * @param {string} unitEnglish - Unit name in English (medida_english)
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
    // Function body
}
```

## API Data Compatibility

**Important**: The API still returns data with Spanish property names (e.g., `cantidad`, `medida_english`, `porcion`). The code handles both:

1. **English properties** (preferred for new code)
2. **Spanish properties** (for API compatibility)

Example in `usePortionConverter`:

```javascript
return convertPortionQuantity({
    quantity: ingredient.quantity || ingredient.cantidad || 0, // Supports both
    unitEnglish: ingredient.unitEnglish || ingredient.medida_english, // Supports both
    // ... etc
});
```

## Comment Format

All comments follow this format:

```javascript
// English comment
// Comentario en español

// Variable name (Spanish original)
let quantity = 0; // cantidad
```

## Benefits

1. **Readability**: English variable names are more universally understood
2. **Maintainability**: Consistent naming convention across codebase
3. **Documentation**: Spanish comments help Spanish-speaking developers
4. **API Compatibility**: Code handles both English and Spanish property names
5. **Migration Path**: Easy to transition from Spanish to English gradually

## Migration Strategy

When migrating from the old codebase:

1. Use English variable names in new code
2. Add Spanish comments for clarity
3. Support both English and Spanish property names from API
4. Gradually migrate API responses to English property names
5. Update comments as needed

## Examples

### Before (Original lista-dj.js)

```javascript
function updatePortions() {
    var cantidad = 2;
    var porcionActual = 1.5;
    var medida_english = "cup";
    var texto = "1 tz";
}
```

### After (Refactored)

```javascript
/**
 * Updates portions for ingredients
 * Actualiza porciones para ingredientes
 */
function updatePortions() {
    let quantity = 2; // cantidad
    let currentPortion = 1.5; // porcionActual
    let unitEnglish = "cup"; // medida_english
    let text = "1 tz"; // texto
}
```

## Function Return Values

All functions return objects with English property names:

```javascript
// Returns: { text: string, servingValue: number }
// Retorna: { text: string, servingValue: number }
return {
    text, // texto
    servingValue, // serving_value
};
```

## Testing

When writing tests, use English variable names:

```javascript
test("should convert quantities", () => {
    const result = convertPortionQuantity({
        quantity: 2, // cantidad
        currentPortion: 1.5, // porcionActual
        // ...
    });

    expect(result.text).toBe("1 tz"); // texto
    expect(result.servingValue).toBe(1.5); // serving_value
});
```



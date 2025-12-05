# React Front App - Refactored from lista-dj.js

This directory contains the refactored, modular JavaScript code extracted from the original `lista-dj.js` file. The code has been restructured into ES6 modules with proper documentation, unit tests, and React hooks.

## 📁 Directory Structure

```
react-front-app/
├── src/
│   ├── utils/
│   │   ├── fractions/          # Fraction calculation utilities
│   │   │   ├── fractionUtils.js
│   │   │   └── index.js
│   │   ├── unit-conversion/   # Unit conversion utilities
│   │   │   ├── unitConversionUtils.js
│   │   │   └── index.js
│   │   └── subrecipes/        # Sub-recipe handling utilities
│   │       ├── subRecipeUtils.js
│   │       └── index.js
│   ├── services/
│   │   └── list-processing/   # List processing services
│   │       └── listProcessingService.js
│   ├── hooks/
│   │   └── usePortionConverter.js  # React hook for portion conversion
│   └── __tests__/
│       ├── utils/
│       │   ├── fractions/
│       │   │   └── fractionUtils.test.js
│       │   └── unit-conversion/
│       │       └── unitConversionUtils.test.js
│       └── services/
└── README.md
```

## 🎯 Modules Overview

### 1. Fraction Utilities (`utils/fractions/`)

Handles fraction calculations and conversions for ingredient quantities.

**Key Functions:**

-   `getNearestFraction(value, tsp)` - Converts decimal to nearest fraction
-   `getNearestPieceFraction(value)` - Converts piece quantities to fractions
-   `getStringFractionValue(value)` - Formats fraction for display
-   `roundOffItem(cantidad)` - Rounds quantities appropriately

**Usage:**

```javascript
import { getNearestFraction, getStringFractionValue } from "./utils/fractions";

const fraction = getNearestFraction(0.75);
// Returns: { int: 0, fraction: Fraction('3/4') }

const display = getStringFractionValue(fraction);
// Returns: "3/4"
```

### 2. Unit Conversion Utilities (`utils/unit-conversion/`)

Handles conversion between measurement units and automatic unit switching.

**Key Functions:**

-   `convertPortionQuantity(params)` - Converts quantity based on portion multiplier
-   `numFraction(value, tipo_id, medida_english)` - Formats portion value
-   `isUnitsInConvertible(itemUnit, subRecipeUnit)` - Checks unit compatibility

**Usage:**

```javascript
import {
    convertPortionQuantity,
    MEASUREMENT_TYPES,
} from "./utils/unit-conversion";

const converted = convertPortionQuantity({
    cantidad: 2,
    porcionActual: 1.5,
    porcionBase: 1,
    tipo_medida_id: MEASUREMENT_TYPES.VOLUME,
    medida_english: "cup",
    medida: "tz",
    medida_plural: "tzs",
    unitMeasure: "metric",
});
// Returns: { texto: "3 tzs", serving_value: 3 }
```

### 3. Sub-Recipe Utilities (`utils/subrecipes/`)

Handles processing of ingredients that are themselves recipes.

**Key Functions:**

-   `subRecipeItem(item)` - Processes a sub-recipe ingredient
-   `normalizeUnits(item)` - Normalizes units for sub-recipes
-   `repeatItem(item)` - Aggregates repeat ingredient occurrences

**Usage:**

```javascript
import { subRecipeItem, repeatItem } from "./utils/subrecipes";

const processed = subRecipeItem({
    cantidad: 2,
    subrecipe: {
        cantidad: 1,
        medida_english: "tbsp",
        porcion: 1,
    },
    // ... other properties
});
```

### 4. List Processing Service (`services/list-processing/`)

Processes ingredient lists for shopping lists and calendars.

**Key Functions:**

-   `processListaData(data, categario_id)` - Processes category ingredient list
-   `processAllListaData(ingredients, categario_id)` - Processes all ingredients
-   `updateIngrediente(lista_json)` - Updates checked ingredients

### 5. React Hooks (`hooks/`)

**usePortionConverter** - Hook for portion-based quantity conversion

**Usage:**

```javascript
import { usePortionConverter } from "./hooks/usePortionConverter";

function IngredientList({ ingredients }) {
    const { convertQuantity, currentPortion, setPortion } = usePortionConverter(
        {
            unitMeasure: "metric",
            defaultPortion: 1,
        }
    );

    return (
        <div>
            <input
                type="range"
                value={currentPortion}
                onChange={(e) => setPortion(parseFloat(e.target.value))}
            />
            {ingredients.map((ing) => {
                const converted = convertQuantity(ing);
                return <div key={ing.id}>{converted.texto}</div>;
            })}
        </div>
    );
}
```

## 🧪 Testing

Run unit tests to ensure functionality matches the original `lista-dj.js`:

```bash
npm test
# or
yarn test
```

Tests are located in `src/__tests__/` and cover:

-   Fraction calculations
-   Unit conversions
-   Sub-recipe processing
-   Edge cases and rounding

## 🔄 Migration from lista-dj.js

### Key Differences

1. **No jQuery Dependencies**: All DOM manipulation has been removed. Use React components instead.

2. **Modular Structure**: Code is split into logical modules instead of one large file.

3. **Type Safety**: JSDoc comments provide type information (consider adding TypeScript later).

4. **Testable**: All functions are pure and easily testable.

5. **React Hooks**: Provides React hooks for easy integration.

### Migration Checklist

-   [x] Extract fraction utilities
-   [x] Extract unit conversion utilities
-   [x] Extract sub-recipe handling
-   [x] Extract list processing logic
-   [ ] Create React components for ingredient display
-   [ ] Create React components for portion slider
-   [ ] Integrate with API endpoints
-   [ ] Add TypeScript types (optional)
-   [ ] Performance optimization

## 📝 Dependencies

Required npm packages:

```json
{
    "dependencies": {
        "fractional": "^0.2.0",
        "unitz": "^1.0.0"
    },
    "devDependencies": {
        "@testing-library/react": "^13.0.0",
        "jest": "^29.0.0"
    }
}
```

## 🔍 Function Comparison

| Original Function (lista-dj.js) | New Module                                       | Status                   |
| ------------------------------- | ------------------------------------------------ | ------------------------ |
| `getNearestFraction()`          | `utils/fractions/getNearestFraction()`           | ✅ Refactored            |
| `getNearestPieceFraction()`     | `utils/fractions/getNearestPieceFraction()`      | ✅ Refactored            |
| `getStringFractionValue()`      | `utils/fractions/getStringFractionValue()`       | ✅ Refactored            |
| `updatePortions()`              | `utils/unit-conversion/convertPortionQuantity()` | ✅ Refactored            |
| `numFraction()`                 | `utils/unit-conversion/numFraction()`            | ✅ Refactored            |
| `subRecipeItem()`               | `utils/subrecipes/subRecipeItem()`               | ✅ Refactored            |
| `normalizeUnits()`              | `utils/subrecipes/normalizeUnits()`              | ✅ Refactored            |
| `repeatItem()`                  | `utils/subrecipes/repeatItem()`                  | ✅ Refactored            |
| `processListaData()`            | `services/list-processing/processListaData()`    | ✅ Refactored            |
| `getListaIngredients()`         | API call + `processListaData()`                  | ⚠️ Needs React component |
| `lista_ingredients_html()`      | React components                                 | ⚠️ Needs React component |

## 🚀 Next Steps

1. **Create React Components**:

    - `IngredientList` - Display ingredients with quantities
    - `PortionSlider` - Slider for adjusting portions
    - `IngredientItem` - Individual ingredient display

2. **API Integration**:

    - Replace jQuery AJAX calls with `fetch` or `axios`
    - Create API service layer

3. **State Management**:

    - Consider Redux/Zustand for complex state
    - Or use React Context for simpler cases

4. **TypeScript Migration** (Optional):
    - Add TypeScript for better type safety
    - Generate types from JSDoc comments

## 📚 Documentation

Each module includes comprehensive JSDoc comments explaining:

-   Function purpose
-   Parameters and return types
-   Usage examples
-   Edge cases

## ⚠️ Important Notes

1. **Unitz Library**: The code uses the `Unitz` library for unit conversions. Ensure it's properly imported.

2. **Fraction Library**: Uses the `Fraction` library (from `fractional` package) for fraction calculations.

3. **Unit System**: The code supports both metric and imperial systems based on user preference.

4. **Backward Compatibility**: All functions maintain the same logic as the original to ensure no breaking changes.

## 🤝 Contributing

When adding new features or modifying existing code:

1. Update JSDoc comments
2. Add unit tests
3. Update this README
4. Ensure backward compatibility with original behavior

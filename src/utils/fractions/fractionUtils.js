/**
 * Fraction Utilities
 *
 * Handles fraction calculations and conversions for ingredient quantities.
 * These utilities are used throughout the application to display fractional values
 * (e.g., 1/2 cup, 3/4 tsp) in a user-friendly format.
 *
 * @module utils/fractions/fractionUtils
 */

/**
 * Simple Fraction implementation
 * Implementación simple de Fraction
 *
 * This replaces the fractional library which has compatibility issues.
 * Esto reemplaza la librería fractional que tiene problemas de compatibilidad.
 */
class Fraction {
    constructor(numerator, denominator = 1) {
        if (typeof numerator === "string") {
            // Handle string input like "1/2" or "3/4"
            // Manejar entrada de cadena como "1/2" o "3/4"
            if (numerator === "0" || numerator === 0) {
                this.numerator = 0;
                this.denominator = 1;
            } else {
                const parts = numerator.split("/");
                this.numerator = parseInt(parts[0]) || 0;
                this.denominator = parseInt(parts[1]) || 1;
            }
        } else {
            // Handle numeric input
            // Manejar entrada numérica
            this.numerator = numerator || 0;
            this.denominator = denominator || 1;
        }
    }

    toString() {
        if (this.numerator === 0) return "0";
        if (this.denominator === 1) return this.numerator.toString();
        return `${this.numerator}/${this.denominator}`;
    }
}

/**
 * Fraction object structure
 * @typedef {Object} FractionObject
 * @property {number} int - Integer part of the value
 * @property {Fraction} fraction - Fractional part (using Fraction library)
 */

/**
 * Supported fraction values for volume measurements
 * @constant {Object}
 */
const VOLUME_FRACTIONS = {
    "1/8": 1 / 8,
    "1/4": 1 / 4,
    "1/3": 1 / 3,
    "1/2": 1 / 2,
    "2/3": 2 / 3,
    "3/4": 3 / 4,
    "1/16": 1 / 16,
    1: 1,
};

/**
 * Supported fraction values for volume measurements (including 1/32 for teaspoons)
 * @constant {Object}
 */
const VOLUME_FRACTIONS_WITH_32 = {
    ...VOLUME_FRACTIONS,
    "1/32": 1 / 32,
};

/**
 * Supported fraction values for piece/count measurements
 * @constant {Object}
 */
const PIECE_FRACTIONS = {
    "1/8": 1 / 8,
    "1/4": 1 / 4,
    "1/3": 1 / 3,
    "1/2": 1 / 2,
    "2/3": 2 / 3,
    "3/4": 3 / 4,
    "1/16": 1 / 16,
    1: 1,
};

/**
 * Finds the nearest fraction to a decimal value from a given set of fractions.
 *
 * This function is used to convert decimal quantities (e.g., 0.75) to the nearest
 * common fraction (e.g., 3/4) for display purposes.
 *
 * @param {Object} fractions - Object mapping fraction strings to their decimal values
 * @param {number} value - The decimal value to convert
 * @returns {FractionObject} Object with integer and fraction parts
 *
 * @example
 * const fractions = { '1/2': 0.5, '1/3': 0.333, '2/3': 0.666 };
 * const result = getNearestFractionBase(fractions, 0.7);
 * // Returns: { int: 0, fraction: Fraction('2/3') }
 */
export function getNearestFractionBase(fractions, value) {
    // entero = integer part, decimal = decimal part
    let integer = Math.trunc(value); // entero
    let decimal = value % 1; // decimal
    let nearest = 0; // cercano
    let nearestFraction = "0"; // fracción cercana
    let difference = 10000; // diferencia

    if (decimal > 0) {
        for (let fraction in fractions) {
            if (fractions[fraction] === decimal) {
                // Exact match
                const fractionReturn = new Fraction(fraction);
                return {
                    int: integer,
                    fraction: fractionReturn,
                };
            } else {
                // Find closest match
                const diff = Math.abs(fractions[fraction] - decimal);
                if (diff < difference) {
                    nearest = fractions[fraction];
                    nearestFraction = fraction;
                    difference = diff;
                }
            }
        }
    }

    // Handle case where fraction rounds to 1
    if (nearestFraction === "1") {
        return {
            int: integer + 1,
            fraction: new Fraction(0),
        };
    }

    return {
        int: integer,
        fraction: new Fraction(nearestFraction),
    };
}

/**
 * Gets the nearest fraction for volume measurements (tsp, tbsp, cup).
 *
 * Used when converting ingredient quantities to display-friendly fractions.
 * Supports additional 1/32 fraction for teaspoon measurements.
 *
 * @param {number} value - The decimal value to convert
 * @param {string} tsp - If 'tsp', includes 1/32 in available fractions
 * @returns {FractionObject} Object with integer and fraction parts
 *
 * @example
 * getNearestFraction(0.75) // Returns: { int: 0, fraction: Fraction('3/4') }
 * getNearestFraction(0.03125, 'tsp') // Returns: { int: 0, fraction: Fraction('1/32') }
 */
export function getNearestFraction(value, tsp = "") {
    const fractions = tsp !== "" ? VOLUME_FRACTIONS_WITH_32 : VOLUME_FRACTIONS;
    return getNearestFractionBase(fractions, value);
}

/**
 * Gets the nearest fraction for piece/count measurements.
 *
 * Used for ingredients measured by count (e.g., "2 eggs", "1/2 apple").
 *
 * @param {number} value - The decimal value to convert
 * @returns {FractionObject} Object with integer and fraction parts
 *
 * @example
 * getNearestPieceFraction(0.5) // Returns: { int: 0, fraction: Fraction('1/2') }
 * getNearestPieceFraction(2.75) // Returns: { int: 2, fraction: Fraction('3/4') }
 */
export function getNearestPieceFraction(value) {
    return getNearestFractionBase(PIECE_FRACTIONS, value);
}

/**
 * Converts a fraction object to a displayable string.
 *
 * Formats fractions for display in the UI, handling edge cases like:
 * - Whole numbers (no fraction)
 * - Fractions only (no integer)
 * - Mixed numbers (integer + fraction)
 *
 * @param {FractionObject} value - Fraction object with int and fraction properties
 * @returns {string} Formatted string for display
 *
 * @example
 * getStringFractionValue({ int: 0, fraction: Fraction('1/2') })
 * // Returns: "1/2"
 *
 * getStringFractionValue({ int: 2, fraction: Fraction('3/4') })
 * // Returns: "2 <span class='smallFraction'>3/4</span>"
 *
 * getStringFractionValue({ int: 3, fraction: Fraction(0) })
 * // Returns: "3"
 */
export function getStringFractionValue(value) {
    if (value.fraction == 0) {
        return value.int.toString();
    } else if (value.int == 0) {
        return value.fraction.toString();
    } else {
        return `${
            value.int
        } <span class='smallFraction'>${value.fraction.toString()}</span>`;
    }
}

/**
 * Rounds a value to the nearest appropriate fraction based on decimal precision.
 * Redondea un valor a la fracción más cercana basada en la precisión decimal.
 *
 * Used to clean up decimal values before fraction conversion.
 * Usado para limpiar valores decimales antes de la conversión a fracción.
 *
 * @param {number} quantity - The quantity to round (cantidad)
 * @returns {number} Rounded quantity (cantidad redondeada)
 *
 * @example
 * roundOffItem(1.45) // Returns: 1.5
 * roundOffItem(1.85) // Returns: 2
 */
export function roundOffItem(quantity) {
    const quantityStr = quantity.toFixed(2);
    const decimal = quantityStr.split(".")[1];
    const main = quantityStr.split(".")[0];

    if (decimal > 40 && decimal <= 50) {
        quantity = Math.round(parseFloat(main)) + 0.5;
    } else if (decimal > 80 && decimal <= 99) {
        quantity = Math.round(parseFloat(quantityStr));
    } else {
        // Return as number if no rounding needed
        // Retornar como número si no se necesita redondeo
        quantity = parseFloat(quantityStr);
    }

    return quantity;
}

/**
 * Rounds a value with special handling for values close to whole numbers.
 *
 * Similar to roundOffItem but with different rounding logic for calendar/list calculations.
 *
 * @param {number} value - The value to round
 * @returns {string} Rounded value as fixed decimal string
 *
 * @example
 * RoundFixed(2.87) // Returns: "3.00"
 * RoundFixed(2.15) // Returns: "2.15"
 */
export function RoundFixed(value) {
    // entero = integer part, decimal = decimal part
    let integer = Math.trunc(value); // entero
    let decimal = value % 1; // decimal

    if (decimal > 0) {
        decimal = parseFloat(decimal).toFixed(2);
        decimal = decimal.toString().split(".")[1];
        if (decimal > 85 && decimal <= 99) {
            value = Math.round(value);
        }
    }

    return parseFloat(value).toFixed(2);
}

/**
 * Unit Tests for Fraction Utilities
 *
 * Tests all fraction calculation and formatting functions to ensure
 * they match the original lista-dj.js behavior.
 *
 * @module __tests__/utils/fractions/fractionUtils.test
 */

import {
    getNearestFractionBase,
    getNearestFraction,
    getNearestPieceFraction,
    getStringFractionValue,
    roundOffItem,
    RoundFixed,
} from "../../../utils/fractions/fractionUtils";

// Mock Fraction library (you'll need to install the actual library)
// For testing, we'll create a simple mock
class MockFraction {
    constructor(value) {
        if (typeof value === "string") {
            const parts = value.split("/");
            this.numerator = parseInt(parts[0]);
            this.denominator = parseInt(parts[1]) || 1;
        } else {
            this.numerator = value;
            this.denominator = 1;
        }
    }

    toString() {
        if (this.denominator === 1) {
            return this.numerator.toString();
        }
        return `${this.numerator}/${this.denominator}`;
    }
}

// Set global Fraction for tests
global.Fraction = MockFraction;

describe("Fraction Utilities", () => {
    describe("getNearestFractionBase", () => {
        test("should find exact match for decimal value", () => {
            const fractions = {
                "1/2": 0.5,
                "1/3": 0.333,
                "2/3": 0.666,
            };
            const result = getNearestFractionBase(fractions, 0.5);
            expect(result.int).toBe(0);
            expect(result.fraction.toString()).toBe("1/2");
        });

        test("should find closest match for decimal value", () => {
            const fractions = {
                "1/2": 0.5,
                "1/3": 0.333,
                "2/3": 0.666,
            };
            const result = getNearestFractionBase(fractions, 0.7);
            expect(result.int).toBe(0);
            expect(result.fraction.toString()).toBe("2/3");
        });

        test("should handle whole numbers", () => {
            const fractions = {
                "1/2": 0.5,
                1: 1,
            };
            const result = getNearestFractionBase(fractions, 2.0);
            expect(result.int).toBe(2);
            expect(result.fraction.toString()).toBe("0");
        });

        test("should handle values that round to 1", () => {
            const fractions = {
                "1/2": 0.5,
                1: 1,
            };
            const result = getNearestFractionBase(fractions, 0.99);
            expect(result.int).toBe(1);
            expect(result.fraction.toString()).toBe("0");
        });
    });

    describe("getNearestFraction", () => {
        test("should convert 0.75 to 3/4", () => {
            const result = getNearestFraction(0.75);
            expect(result.fraction.toString()).toBe("3/4");
        });

        test("should convert 0.5 to 1/2", () => {
            const result = getNearestFraction(0.5);
            expect(result.fraction.toString()).toBe("1/2");
        });

        test("should include 1/32 when tsp parameter is provided", () => {
            const result = getNearestFraction(0.03125, "tsp");
            expect(result.fraction.toString()).toBe("1/32");
        });
    });

    describe("getNearestPieceFraction", () => {
        test("should convert 0.5 to 1/2 for pieces", () => {
            const result = getNearestPieceFraction(0.5);
            expect(result.fraction.toString()).toBe("1/2");
        });

        test("should handle 2.75 as 2 3/4", () => {
            const result = getNearestPieceFraction(2.75);
            expect(result.int).toBe(2);
            expect(result.fraction.toString()).toBe("3/4");
        });
    });

    describe("getStringFractionValue", () => {
        test("should return integer only when fraction is 0", () => {
            const value = { int: 3, fraction: new MockFraction(0) };
            expect(getStringFractionValue(value)).toBe("3");
        });

        test("should return fraction only when int is 0", () => {
            const value = { int: 0, fraction: new MockFraction("1/2") };
            expect(getStringFractionValue(value)).toBe("1/2");
        });

        test("should return mixed number with HTML span", () => {
            const value = { int: 2, fraction: new MockFraction("3/4") };
            const result = getStringFractionValue(value);
            expect(result).toContain("2");
            expect(result).toContain("3/4");
            expect(result).toContain("class='smallFraction'");
        });
    });

    describe("roundOffItem", () => {
        test("should round 1.45 to 1.5", () => {
            const result = roundOffItem(1.45);
            expect(result).toBe(1.5);
        });

        test("should round 1.85 to 2", () => {
            const result = roundOffItem(1.85);
            expect(result).toBe(2);
        });

        test("should not round 1.25", () => {
            const result = roundOffItem(1.25);
            expect(parseFloat(result.toFixed(2))).toBe(1.25);
        });
    });

    describe("RoundFixed", () => {
        test("should round 2.87 to 3.00", () => {
            const result = RoundFixed(2.87);
            expect(result).toBe("3.00");
        });

        test("should keep 2.15 as 2.15", () => {
            const result = RoundFixed(2.15);
            expect(result).toBe("2.15");
        });

        test("should handle whole numbers", () => {
            const result = RoundFixed(5.0);
            expect(result).toBe("5.00");
        });
    });
});



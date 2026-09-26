export const DEFAULT_ARRAY = [38, 24, 82, 17, 56, 45, 93, 12, 67, 31];

/**
 * Generate an array of random integers between min and max
 */
export function generateRandomArray(size: number = 10, min: number = 10, max: number = 99): number[] {
  const result: number[] = [];
  for (let i = 0; i < size; i++) {
    result.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return result;
}

/**
 * Shuffle an existing array using Fisher-Yates algorithm
 */
export function shuffleArray(arr: number[]): number[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a nearly sorted array with a couple of swapped pairs
 */
export function generateNearlySortedArray(size: number = 10): number[] {
  // Start with sorted numbers spaced out
  const step = Math.floor(80 / size);
  const arr = Array.from({ length: size }, (_, i) => 10 + i * step);

  // Swap 1 or 2 adjacent pairs
  const swaps = Math.max(1, Math.floor(size / 5));
  for (let s = 0; s < swaps; s++) {
    const idx = Math.floor(Math.random() * (size - 1));
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
  }

  return arr;
}

/**
 * Reverse an array
 */
export function reverseArray(arr: number[]): number[] {
  return [...arr].reverse();
}

/**
 * Check if an array is sorted in ascending order (monotonic non-decreasing)
 */
export function isSortedAscending(arr: number[]): boolean {
  if (arr.length <= 1) return true;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
}

/**
 * Generate a sorted array of numbers for Binary Search
 */
export function generateSortedArray(size: number = 8, min: number = 5, max: number = 95): number[] {
  const step = Math.max(3, Math.floor((max - min) / size));
  const arr: number[] = [];
  let current = min + Math.floor(Math.random() * 4);
  for (let i = 0; i < size; i++) {
    arr.push(current);
    current += Math.floor(Math.random() * step) + 2;
  }
  return arr;
}

export interface ParseResult {
  success: boolean;
  array: number[];
  error?: string;
  warning?: string;
}

/**
 * Parse and validate user entered array string.
 * Supports comma, space, semicolon, tab or newline separated numbers.
 */
export function parseAndValidateArrayInput(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: false,
      array: [],
      error: 'Please enter at least 2 numbers.',
    };
  }

  // Split by comma, space, semicolon, tab, newline
  const tokens = trimmed.split(/[\s,;]+/).filter((t) => t.length > 0);

  if (tokens.length < 2) {
    return {
      success: false,
      array: [],
      error: 'Array must contain at least 2 numbers to visualize sorting.',
    };
  }

  if (tokens.length > 30) {
    return {
      success: false,
      array: [],
      error: `Maximum supported array size is 30 elements for clean visual readability (received ${tokens.length}).`,
    };
  }

  const parsedNumbers: number[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const num = Number(token);

    if (isNaN(num)) {
      return {
        success: false,
        array: [],
        error: `Invalid number token "${token}" at position ${i + 1}.`,
      };
    }

    if (!Number.isInteger(num)) {
      return {
        success: false,
        array: [],
        error: `Decimals are not recommended for sorting bar heights ("${token}" at position ${i + 1}). Please use whole integers.`,
      };
    }

    if (num < 0) {
      return {
        success: false,
        array: [],
        error: `Negative numbers are not supported in bar visualizer ("${token}"). Please use positive integers between 1 and 999.`,
      };
    }

    if (num > 999) {
      return {
        success: false,
        array: [],
        error: `Number ${num} is too large. Maximum supported value is 999.`,
      };
    }

    parsedNumbers.push(num);
  }

  // Check for duplicates warning (valid but nice to note)
  const uniqueCount = new Set(parsedNumbers).size;
  let warning: string | undefined;
  if (uniqueCount < parsedNumbers.length) {
    warning = 'Array contains duplicate values. Bubble Sort is stable and will preserve relative order.';
  }

  return {
    success: true,
    array: parsedNumbers,
    warning,
  };
}

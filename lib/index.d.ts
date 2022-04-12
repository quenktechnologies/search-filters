/**
 * sanitize removes problematic tokens from a string so that it's usable as the
 * value of a filter.
 *
 * Operators are removed as well as brackets and parenthesis. That means no
 * list support here.
 */
export declare const sanitize: (str: string) => string;

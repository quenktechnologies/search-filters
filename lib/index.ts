const restricted = /or|and|in|["():\[\],>=?|]/gi;

/**
 * sanitize removes problematic tokens from a string so that it's usable as the
 * value of a filter.
 *
 * Operators are removed as well as brackets and parenthesis. That means no
 * list support here.
 */
export const sanitize = (str: string) => str.replace(restricted, () => '');

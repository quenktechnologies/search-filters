import { Policies } from './policy';
import { TermConstructors } from '../term';
/**
 * Options used during the compilation process.
 */
export interface Options {
    /**
     * maxFilters allowed to specified in the source.
     */
    maxFilters: number;
}
/**
 * Context represents the context the compilation
 * takes place in.
 *
 * It specifies the options and functions required to complete
 * the transformation process.
 */
export interface Context<F> {
    /**
     * options for compilation.
     */
    options: Options;
    /**
     * terms map of constructors.
     */
    terms: TermConstructors<F>;
    /**
     * policies that are applied during the construction of terms.
     */
    policies: Policies<F>;
}

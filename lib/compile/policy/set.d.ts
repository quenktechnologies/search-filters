import { Maybe } from '@quenk/noni/lib/data/maybe';
import { PolicyPointer, Policy } from './';
/**
 * PolicyRef is either a raw Policy definition or a pointer to one.
 */
export declare type PolicyRef<T> = Policy<T> | PolicyPointer;
/**
 * PolicySet is a map of PolicyRefs where the key is a field name and
 * the value the Policy to be applied.
 *
 * A PolicySet is therefore used to describe what fields are to allowed
 * for filtering and their valid operators/values.
 */
export interface PolicySet<T> {
    [key: string]: PolicyRef<T>;
}
/**
 * resolve a PolicyRef against a PolicySet.
 *
 * If the ref is a PolicyPointer it will be recursively resolved until a
 * match is found. If the ref is a Policy it is simply returned.
 */
export declare const resolve: <T>(set: PolicySet<T>, ref: PolicyRef<T>) => Maybe<Policy<T>>;
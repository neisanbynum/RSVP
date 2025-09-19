import type { SvelteHTMLElements } from 'svelte/elements';


export type HTMLProperties<T extends keyof SvelteHTMLElements> = SvelteHTMLElements[T];
export type Component<T extends keyof SvelteHTMLElements, P extends Record<string, any> = {}> = Prettier<
    HTMLProperties<T> & P
    >;

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

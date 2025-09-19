import type { RemoteCommand, RemoteQueryFunction } from '@sveltejs/kit';
import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import * as z from 'zod/v4';

export type FormValidationAction = 'onchange' | 'onblur' | 'onsubmit' | 'none';

export type useFormParameters<T extends z.ZodObject, R> = {
	schema: T;
	initial: z.core.input<T>;
	validation?: FormValidationAction;
	remotefunction:
		| RemoteQueryFunction<z.infer<T>, R>
		| RemoteCommand<z.infer<T>, Promise<R>>;
	onsuccess?: (args: R) => void | Promise<void>;
	onerror?: (error: any) => void | Promise<void>;
	debug?: boolean;
};

export type FormElement = HTMLInputElement | HTMLButtonElement;

export type FormSubmitEvent = SubmitEvent & {
	currentTarget: EventTarget & HTMLFormElement;
};

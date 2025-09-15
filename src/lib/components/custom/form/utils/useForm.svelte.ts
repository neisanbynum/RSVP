import { isHttpError, type RemoteCommand, type RemoteQueryFunction } from '@sveltejs/kit';
import { setContext, getContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import z, { unknown } from 'zod/v4';
import type {
	FormElement,
	FormSubmitEvent,
	FormValidationAction,
	useFormParameters
} from '../$types';
import type { ChangeEventHandler, FocusEventHandler } from 'svelte/elements';
import { toast } from 'svelte-sonner';
import type { Attachment } from 'svelte/attachments';

class FormManager<T extends z.ZodObject, R> {
	private schema: T;
	private initial: z.infer<T>;
	private validation: FormValidationAction;
	private remotefunction:
		| RemoteQueryFunction<z.core.output<T>, Promise<R>>
		| RemoteCommand<z.infer<T>, Promise<R>>;
	private onsuccess?: (arg: R) => void | Promise<void>;
	private onerror?: (message: string) => void | Promise<void>;
	private debug: boolean;

	values = new SvelteMap();
	errors = new SvelteMap();
	loading: boolean = false;

	constructor(params: useFormParameters<T, R>) {
		this.schema = params.schema;
		this.initial = params.initial;
		this.validation = params.validation ?? 'onblur';
		this.remotefunction = params.remotefunction;
		this.onsuccess = params.onsuccess;
		this.onerror = params.onerror;
		this.debug = params.debug ?? false;

		Object.entries(params.initial).forEach(([k, v]) => this.values.set(k, v));
	}

	async validateForm() {
		const validate = await this.schema.safeParseAsync(Object.fromEntries(this.values));
		if (!validate.success) {
			z.treeifyError(validate.error, (issue) => this.errors.set(issue.path[0], issue.message));
			return;
		}

		return validate.data;
	}

	validateField = (key: keyof z.infer<T>) => () => {
		if (!this.values.has(key) || !this.values.get(key)) return;

		const validate = this.schema.partial().safeParse(Object.fromEntries(this.values));
		if (!validate.success) {
			z.treeifyError(validate.error, (issue) => {
				const path = issue.path[0];
				if (path === key) this.errors.set(path, issue.message);
			});
		}
	};

	validate = (name: keyof z.infer<T>) => {
		const parse = this.schema.partial().safeParse(Object.fromEntries(this.values));
		if (!parse.success && !!this.values.get(name)) {
			z.treeifyError(parse.error, (issue) => {
				if (issue.path[0] === name) this.errors.set(name, issue.message);
			});
		}
	};

	onfocus = (name: keyof z.infer<T>) => {
		this.errors.delete(name);
	};

	onvaluechange = <V = any>(name: keyof z.infer<T>, value: V) => {
		if (this.errors.has(name)) this.errors.delete(name);

		this.values.set(name, value);
		if (this.validation === 'onchange') this.validate(name);
	};

	onblur = (name: keyof z.infer<T>) => {
		if (this.validation === 'onblur' && !!this.values.get(name)) this.validate(name);
		if (this.debug) console.log({ [name]: this.values.get(name) });
	};

	manageinput(name: keyof z.infer<T>): Attachment<HTMLInputElement> {
		const controller = new AbortController();
		const { signal } = controller;


		return (node) => {
			if (!this.values.get(name)) {
				if (this.debug) console.log(`initializing ${name.toString()}`)
				this.values.set(name, node.value ?? this.initial[name]);
				this.validate(name);
			};

			node.addEventListener('focus', () => this.onfocus(name), { signal });
			node.addEventListener('input', () => this.onvaluechange(name, node.value), { signal });
			node.addEventListener('blur', () => this.onblur(name), { signal });

			return () => controller.abort();
		};
	}

	onchange =
		(key: keyof z.infer<T>): ChangeEventHandler<FormElement> =>
		(e) => {
			this.errors.delete(key);
			this.values.set(key, e.currentTarget.value);
			if (this.validation === 'onchange') this.validateField(key)();
		};

	onsubmit = async (e: FormSubmitEvent) => {
		e.preventDefault();
		this.loading = true;

		const parse = await this.schema.safeParseAsync(Object.fromEntries(this.values));
		if (!parse.success) {
			z.treeifyError(parse.error, (issue) => this.errors.set(issue.path[0], issue.message));
			this.loading = false;
			return;
		}

		if (this.debug) console.log(parse.data)

		try {
			const response = await this.remotefunction(parse.data);
			if (this.debug) console.log(response);

			this.loading = false;

			this.onsuccess?.(response);
		} catch (error: any) {
			const message = isHttpError(error) ? error.body.message : error.message;
			if (this.debug) console.log({ error, message });

			this.onerror ? this.onerror(message) : toast.error(message);
		}
	};
}

const FormContextKey = 'form.context';

export function useForm<T extends z.ZodObject, R>(params: useFormParameters<T, R>) {
	return setContext(FormContextKey, new FormManager(params));
}

export function useFormContext<T extends z.ZodObject, R>() {
	return getContext<FormManager<T, R>>(FormContextKey);
}

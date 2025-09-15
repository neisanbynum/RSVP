<script module lang="ts">
	import type { Component } from '$lib/components/$types';

	export type FormErrorProperties = Component<'p', { name: string }>;
</script>

<script lang="ts">
	import { useFormContext } from '../utils/useForm.svelte';
	import { cn } from '$lib/utils/shadcn';

	let { name, class: classname, ...rest }: FormErrorProperties = $props();

	const form = useFormContext();
</script>

<p
	{...rest}
	id="{name}-form-error"
	data-slot="form-error"
	hidden={!form.errors.has(name)}
	class={cn('pl-1 text-xs font-semibold text-destructive', classname)}
>
	{form.errors.get(name)}
</p>

<script module lang="ts">
	import type { Component } from '$lib/components/$types';

	export type FormDescriptionProperties = Component<'p', { name: string; text?: string }>;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/shadcn';

	let { name, class: classname, text, ...rest }: FormDescriptionProperties = $props();
</script>

<p
	{...rest}
	id="{name}-form-description"
	data-slot="form-description"
	hidden={!text}
	class={cn('pl-1 text-xs', classname)}
>
	{text}
</p>

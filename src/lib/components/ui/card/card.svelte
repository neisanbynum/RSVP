<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils/shadcn/index.js';

	export type CardProps = WithElementRef<HTMLAttributes<HTMLDivElement>>;

	let { ref = $bindable(null), class: className, children, ...rest }: CardProps = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	class={cn(
		'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>

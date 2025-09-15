<script module lang="ts">
	import type { Prettier } from '$lib/utils/$type';
	import { cn } from '$lib/utils/shadcn';
	import type { HTMLProperties } from '../../$types';

	export type HREFProperties = Prettier<
		Omit<HTMLProperties<'a'>, 'children'> & {
			label?: string;
		}
	>;
</script>

<script lang="ts">
	let { label, class: classname, ...rest }: HREFProperties = $props();
</script>

<a
	{...rest}
	class={cn('w-fit cursor-pointer text-sm hover:font-semibold hover:underline', classname)}
	>{label}</a
>

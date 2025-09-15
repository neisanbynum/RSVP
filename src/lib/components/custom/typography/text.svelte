<script lang="ts" module>
	import { goto } from '$app/navigation';
	import type { Prettier } from '$lib/utils/$type';

	export type TextProperties = Prettier<
		Omit<HTMLProperties<'p'>, 'children'> & {
			text?: string;
			wrap?: boolean;
			href?: string | { path: string; external?: boolean };
		}
	>;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import type { HTMLProperties } from '../../$types';

	let { text, class: classname, wrap = false, href, ...rest }: TextProperties = $props();

	const navigate = () => {
		if (!href) return;
		if (typeof href === 'string' || !href.external) {
			goto(typeof href === 'string' ? href : href.path);
		} 
	};
</script>

<p {...rest} class={cn('text-base font-normal', wrap && 'text-wrap', classname)} onclick={navigate}>
	{text}
</p>

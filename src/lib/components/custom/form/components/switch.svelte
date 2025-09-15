<script module lang="ts">
	import type { Prettier } from '$lib/utils/$type';
	import { Switch, type SwitchProps } from '$lib/components/ui/switch';

	type LabelSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
	export type FormSwitchProperties = Prettier<
		SwitchProps & {
			containerclass?: string;
			tooltipclass?: string;
			label?: string;
			labelsize?: LabelSize;
			desc?: string;
			name: string;
		}
	>;
</script>

<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { useFormContext } from '../utils/useForm.svelte';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils/shadcn';

	let {
		name,
		desc,
		class: classname,
		containerclass,
		tooltipclass,
		label,
		labelsize = 'base',
		...rest
	}: FormSwitchProperties = $props();
	let id = $props.id();

	let textsize = $derived(`text-${labelsize}`);

	const form = useFormContext();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<div
					class={cn(
						'pointer-events-none flex w-fit min-w-fit items-center space-x-1',
						containerclass
					)}
				>
					<Switch
						{...rest}
						{...props}
						{id}
						{name}
						class={cn('pointer-events-auto cursor-pointer', classname)}
						aria-describedby="{name}-form-description"
						value={form.values.get(name)}
						onCheckedChange={(checked) => form.onvaluechange(name, checked)}
						onblur={() => form.onblur(name)}
						onfocus={() => form.onfocus(name)}
					/>
					<Label for={id} class={cn('flex min-w-fit', textsize)}>{label}</Label>
				</div>
			{/snippet}
		</Tooltip.Trigger>
		{#if desc}
			<Tooltip.Content class={cn('pointer-events-none', tooltipclass)}>
				<p class="text-xs" id={`${name}-form-description`}>{desc}</p>
			</Tooltip.Content>
		{/if}
	</Tooltip.Root>
</Tooltip.Provider>

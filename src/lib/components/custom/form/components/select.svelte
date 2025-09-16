<script module lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils/shadcn';
	import type { ClassValue } from 'svelte/elements';

	export type SelectItem = Record<'label' | 'value', string>;
	export type SelectItems = Array<SelectItem>;

	export type SelectGroup = {
		label: string;
		items: SelectItems;
	};
	export type SelectGroups = Array<SelectGroup>;

	export function isSelectGroup(list: SelectItems | SelectGroups): list is SelectGroups {
		return 'items' in list[0];
	}

	export type FormSelectProperties = {
		name: string;
		label?: string;
		desc?: string;
		options: SelectItems | SelectGroups;
		class?: ClassValue;
		disabled?: boolean;
		disablegroup?: (group: SelectGroup) => boolean;
		disableoption?: (option: SelectItem) => boolean;
	};
</script>

<script lang="ts">
	import { useFormContext } from '../utils/useForm.svelte';
	import * as Select from '$lib/components/ui/select';

	let {
		name,
		label,
		desc,
		class: classname,
		options,
		disabled,
		disablegroup,
		disableoption,
		...rest
	}: FormSelectProperties = $props();

	let form = useFormContext();

	let value = $derived.by(() => {
		let selected = form.values.get(name);
		if (!selected) return;
		return selected as string;
	});
</script>

{#snippet items(items: SelectItems, disable: boolean = false)}
	{#each items as item}
		{@const matches = disable ?? (disableoption ? disableoption(item) : false)}
		<Select.Item value={item.value} disabled={matches}>{item.label}</Select.Item>
	{/each}
{/snippet}

{#snippet groups(groups: SelectGroups)}
	{#each groups as group}
		{@const matches = disablegroup ? disablegroup(group) : false}
		<Select.Group>
			<Select.Label>{group.label}</Select.Label>
			{@render items(group.items, matches)}
		</Select.Group>
	{/each}
{/snippet}

<div class={cn('relative flex w-48 flex-col items-start justify-center gap-1', classname)}>
	<Label class="pl-1" for={name}>{label}</Label>
	<Select.Root
		type="single"
		{name}
		{value}
		onValueChange={(selected) => form.onvaluechange(name, selected)}
	>
		<Select.Trigger class="flex w-full">{form.values.get(name)}</Select.Trigger>
		<Select.Content>
			{#if isSelectGroup(options)}
				{@render groups(options)}
			{:else}
				{@render items(options)}
			{/if}
		</Select.Content>
	</Select.Root>
</div>

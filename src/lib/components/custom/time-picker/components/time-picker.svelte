<script lang="ts">
	import { type TimePickerProperties } from '../types';
	import * as Select from '$lib/components/ui/select';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils/shadcn';
	import { buttonVariants } from '$lib/components/ui/button';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import type { ClassValue } from 'svelte/elements';

	let {
		class: classname,
		value = $bindable(),
		onValueChange,
		open = $bindable(false),
		onOpenChange
	}: TimePickerProperties = $props();

	type SelectorProps = {
		name: 'hour' | 'minute' | 'meridian';
		class?: ClassValue;
		options: Array<{ label: string; value: string }>;
	};

	let segments = $state<Record<SelectorProps['name'], string>>({
		hour: '',
		minute: '',
		meridian: ''
	});

	let time = $derived.by(() => {
		if (!segments.hour || !segments.minute || !segments.meridian) return;

		let hour =
			segments.hour.length < 2
				? Number(segments.hour) < 10
					? `0${segments.hour}`
					: segments.hour
				: segments.hour;
		let minute =
			segments.minute.length < 2
				? Number(segments.minute) < 10
					? `0${segments.minute}`
					: segments.minute
				: segments.minute;
		return `${hour}:${minute} ${segments.meridian}`;
	});

	$effect(() => {
		if (onValueChange) onValueChange(value);
	});

	$effect(() => {
		value = time;
	});
</script>

{#snippet selector({ name, class: classname, options }: SelectorProps)}
	<Select.Root type="single" value={segments[name]} onValueChange={(val) => (segments[name] = val)}>
		<Select.Trigger
			class={cn('flex h-full w-full justify-end', segments[name] && 'justify-between', classname)}
		>
			{segments[name]}
		</Select.Trigger>
		<Select.Content class="max-h-98">
			{#each options as { label, value }}
				<Select.Item {value}>{label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
{/snippet}

<Popover.Root bind:open {onOpenChange}>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: 'outline',
				class: 'h-10 w-full justify-start text-left font-normal'
			}),
			!value && 'text-muted-foreground', classname
		)}
	>
		<ClockIcon />
		{value}
	</Popover.Trigger>
	<Popover.Content class="flex w-fit gap-3 p-4">
		<div class="flex h-fit w-40 items-center justify-center gap-1">
			{@render selector({
				name: 'hour',
				options: Array.from({ length: 12 }, (_, i) => {
					let a = i + 1
					let hour = a < 10 ? `0${a}` : String(a);
					return { label: hour, value: hour };
				}),
				class: 'w-full flex'
			})}
			<p class="text-base font-semibold">:</p>
			{@render selector({
				name: 'minute',
				options: Array.from({ length: 60 }, (_, i) => {
					let min = i < 10 ? `0${i}` : String(i);
					return { label: min, value: min };
				}),
				class: 'w-full flex'
			})}
		</div>
		{@render selector({
			name: 'meridian',
			options: ['AM', 'PM'].map((m) => ({ label: m, value: m })),
			class: 'flex w-20'
		})}
	</Popover.Content>
</Popover.Root>

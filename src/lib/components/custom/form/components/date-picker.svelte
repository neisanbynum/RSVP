<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import {
		CalendarDate,
		CalendarDateTime,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		ZonedDateTime
	} from '@internationalized/date';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils/shadcn';
	import { useFormContext } from '../utils/useForm.svelte';
	import type { ClassValue } from 'svelte/elements';
	import { Label } from '$lib/components/ui/label';
	import Error from './error.svelte';
	import type { DateMatcher } from 'bits-ui';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	export type FormDatePickerProperties = {
		minValue?: DateValue;
		maxValue?: DateValue;
		isDateDisabled?: DateMatcher;
		isDateUnavailable?: DateMatcher;
		fixedWeeks?: boolean;
		numberOfMonths?: number;
		locale?: string;
		name: string;
		label?: string;
		desc?: string;
		class?: ClassValue;
	};

	let {
		name,
		label,
		desc,
		class: classname,
		numberOfMonths = 1,
		fixedWeeks = true,
		...rest
	}: FormDatePickerProperties = $props();
	let id = $props.id();

	const form = useFormContext();

	const display = $derived.by(() => {
		const value = form.values.get(name);
		if (!value) return desc ?? 'Pick a date';

		if (value instanceof Date) return df.format(value);

		if (
			value instanceof CalendarDate ||
			value instanceof CalendarDateTime ||
			value instanceof ZonedDateTime
		) {
			return df.format(value.toDate(getLocalTimeZone()));
		}

		return desc ?? 'Pick a date';
	});

	const value = $derived.by(() => {
		let date = form.values.get(name);
		if (!date) return;

		if (date instanceof Date) {
			return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
		}

		if (
			date instanceof CalendarDate ||
			date instanceof CalendarDateTime ||
			date instanceof ZonedDateTime
		) {
			return date;
		}

		return;
	});

	let open = $state<boolean>(false);
</script>

<div class={cn('relative flex w-48 flex-col items-start justify-center gap-1', classname)}>
	<Label class="pl-1" for={id}>{label}</Label>
	<Popover.Root bind:open>
		<Popover.Trigger
			class={cn(
				buttonVariants({
					variant: 'outline',
					class: 'w-full h-10 justify-start text-left font-normal'
				}),
				!form.values.get(name) && 'text-muted-foreground'
			)}
		>
			<CalendarIcon />
			{display}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0">
			<Calendar
				{...rest}
				type="single"
				{value}
				{numberOfMonths}
				{fixedWeeks}
				onValueChange={(date) => {
					if (date) {
						form.onvaluechange(name, date.toDate(getLocalTimeZone()));
						open = false;
						form.onblur(name);
					}
				}}
			/>
		</Popover.Content>
	</Popover.Root>
	<Error {name} />
</div>

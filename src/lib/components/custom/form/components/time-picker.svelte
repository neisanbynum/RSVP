<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils/shadcn';
	import Error from '../../form/components/error.svelte';
	import Description from '../../form/components/description.svelte';
	import { useFormContext } from '../utils/useForm.svelte';
	import { TimePicker, type TimePickerProperties } from '../../time-picker';
	import type { Prettier } from '@neisanworks/neisandb';

	export type FormTimePickerProperties = Prettier<
		Pick<TimePickerProperties, 'class'> & {
			name: string;
			label?: string;
			desc?: string;
		}
	>;

	let { name, label, desc, class: classname }: FormTimePickerProperties = $props();
	let id = $props.id();

	let form = useFormContext();

	let value = $derived.by(() => {
		const time = form.values.get(name);
		if (!time || typeof time !== 'string') return;

		return time;
	});
</script>

<div class={cn('relative flex w-48 flex-col items-start justify-center gap-1', classname)}>
	<Label class="pl-1" for={id}>{label}</Label>
	<TimePicker {value} onValueChange={(val) => form.onvaluechange(name, val)} />
	<Description text={desc} />
	<Error {name} />
</div>
